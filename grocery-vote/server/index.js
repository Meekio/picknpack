import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'votes.json');

app.use(express.json());

// Initialize votes file if missing
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ votes: [], suggestions: [] }, null, 2));
}

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// POST /api/vote
app.post('/api/vote', (req, res) => {
  const { selectedItems, fruitSuggestion, vegetableSuggestion } = req.body;

  if (!Array.isArray(selectedItems)) {
    return res.status(400).json({ error: 'selectedItems must be an array' });
  }

  const data = readData();

  // Tally votes
  selectedItems.forEach(({ id, category }) => {
    const existing = data.votes.find((v) => v.id === id);
    if (existing) {
      existing.count += 1;
    } else {
      data.votes.push({ id, category, count: 1 });
    }
  });

  // Store suggestions
  if (fruitSuggestion?.trim()) {
    data.suggestions.push({
      type: 'fruit',
      text: fruitSuggestion.trim(),
      timestamp: new Date().toISOString(),
    });
  }
  if (vegetableSuggestion?.trim()) {
    data.suggestions.push({
      type: 'vegetable',
      text: vegetableSuggestion.trim(),
      timestamp: new Date().toISOString(),
    });
  }

  writeData(data);
  console.log(`✅ Vote recorded — ${selectedItems.length} items, fruit: "${fruitSuggestion}", veg: "${vegetableSuggestion}"`);
  res.json({ success: true, message: 'Vote recorded!' });
});

// GET /api/results  (bonus: see vote counts)
app.get('/api/results', (req, res) => {
  res.json(readData());
});

app.listen(PORT, () => {
  console.log(`🥦 Pick N Pack backend running at http://localhost:${PORT}`);
});
