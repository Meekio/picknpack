-- seed.sql
-- Populates the products table
-- Safe to re-run

CREATE TABLE IF NOT EXISTS products (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    category VARCHAR(30) NOT NULL,
    image    TEXT,
    votes    INTEGER DEFAULT 0
);

-- ============================================================
-- FRUITS
-- ============================================================

INSERT INTO products (id, name, category, image, votes) VALUES
(1,'Apple','fruit','https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=200&h=200&fit=crop&auto=format',0),
(2,'Banana','fruit','https://images.pexels.com/photos/30873714/pexels-photo-30873714.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(3,'Mango','fruit','https://images.unsplash.com/photo-1669207334420-66d0e3450283?w=200&h=200&fit=crop&auto=format',0),
(4,'Orange','fruit','https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop&auto=format',0),
(5,'Sweet Lime','fruit','https://plus.unsplash.com/premium_photo-1664391947940-d7ddacad129d?w=200&h=200&fit=crop&auto=format',0),
(6,'Pomegranate','fruit','https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=200&h=200&fit=crop&auto=format',0),
(7,'Papaya','fruit','https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=200&h=200&fit=crop&auto=format',0),
(8,'Watermelon','fruit','https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop&auto=format',0),
(9,'Pineapple','fruit','https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200&h=200&fit=crop&auto=format',0),
(10,'Guava','fruit','https://images.unsplash.com/photo-1706734745352-c1de3bdc78e0?w=200&h=200&fit=crop&auto=format',0),
(11,'Green Grapes','fruit','https://images.unsplash.com/photo-1625499940894-8796928bf9c4?w=200&h=200&fit=crop&auto=format',0),
(12,'Black Grapes','fruit','https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?w=200&h=200&fit=crop&auto=format',0),
(13,'Sapota','fruit','https://images.pexels.com/photos/3942502/pexels-photo-3942502.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(15,'Jackfruit','fruit','https://images.unsplash.com/photo-1651565919334-bf81165cd0a3?w=200&h=200&fit=crop&auto=format',0),
(16,'Coconut','fruit','https://images.unsplash.com/photo-1660642670524-5ccd63ac1adf?w=200&h=200&fit=crop&auto=format',0),
(17,'Lemon','fruit','https://images.pexels.com/photos/36094857/pexels-photo-36094857.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(18,'Strawberry','fruit','https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop&auto=format',0),
(19,'Kiwi','fruit','https://images.unsplash.com/photo-1585059895524-72359e06133a?w=200&h=200&fit=crop&auto=format',0),
(20,'Dragon Fruit','fruit','https://images.unsplash.com/photo-1527325678964-54921661f888?w=200&h=200&fit=crop&auto=format',0),
(75,'Muskmelon','fruit','https://images.pexels.com/photos/26950731/pexels-photo-26950731.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(77,'Avocado','fruit','https://images.unsplash.com/photo-1671624749229-7d37826013b5?w=200&h=200&fit=crop&auto=format',0)

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VEGETABLES
-- ============================================================

INSERT INTO products (id, name, category, image, votes) VALUES
(21,'Onion','vegetable','https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&h=200&fit=crop&auto=format',0),
(22,'Tomato','vegetable','https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200&h=200&fit=crop&auto=format',0),
(23,'Potato','vegetable','https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop&auto=format',0),
(24,'Brinjal','vegetable','https://images.unsplash.com/photo-1605197378540-10ebaf6999e5?w=200&h=200&fit=crop&auto=format',0),
(25,'Ladies Finger','vegetable','https://images.unsplash.com/photo-1664289242854-e99d345cfa92?w=200&h=200&fit=crop&auto=format',0),
(26,'Carrot','vegetable','https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop&auto=format',0),
(27,'Beetroot','vegetable','https://images.unsplash.com/photo-1667980970854-a74254e41521?w=200&h=200&fit=crop&auto=format',0),
(28,'Radish','vegetable','https://images.pexels.com/photos/8827293/pexels-photo-8827293.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(29,'Cabbage','vegetable','https://images.unsplash.com/photo-1652860213441-6622f9fec77f?w=200&h=200&fit=crop&auto=format',0),
(30,'Cauliflower','vegetable','https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=200&h=200&fit=crop&auto=format',0),
(31,'Green Chilli','vegetable','https://images.unsplash.com/photo-1524593410820-38510f580a77?w=200&h=200&fit=crop&auto=format',0),
(32,'Capsicum (Green, Red, Yellow)','vegetable','https://images.unsplash.com/photo-1592548868664-f8b4e4b1cfb7?w=200&h=200&fit=crop&auto=format',0),
(33,'Garlic','vegetable','https://plus.unsplash.com/premium_photo-1666270423754-5b66a5184cc3?w=200&h=200&fit=crop&auto=format',0),
(34,'Ginger','vegetable','https://images.pexels.com/photos/33930747/pexels-photo-33930747.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(35,'Bottle Gourd','vegetable','https://images.pexels.com/photos/17050967/pexels-photo-17050967.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(36,'Ridge Gourd','vegetable','https://images.pexels.com/photos/33778443/pexels-photo-33778443.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(38,'Bitter Gourd','vegetable','https://images.unsplash.com/photo-1739903760973-4731a8e79a03?w=200&h=200&fit=crop&auto=format',0),
(39,'Pumpkin','vegetable','https://images.unsplash.com/photo-1509622905150-fa66d3906e09?w=200&h=200&fit=crop&auto=format',0),
(40,'Drumstick','vegetable','https://images.pexels.com/photos/20466259/pexels-photo-20466259.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(41,'Raw Banana','vegetable','https://images.pexels.com/photos/34778810/pexels-photo-34778810.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(42,'Sweet Potato','vegetable','https://images.pexels.com/photos/30893354/pexels-photo-30893354.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(43,'Mushroom','vegetable','https://images.unsplash.com/photo-1552825898-07e419204683?w=200&h=200&fit=crop&auto=format',0),
(44,'Corn','vegetable','https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&h=200&fit=crop&auto=format',0),
(45,'Cucumber','vegetable','https://images.pexels.com/photos/5006635/pexels-photo-5006635.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(46,'Gooseberry','vegetable','https://images.unsplash.com/photo-1676043966983-f5bd22435e64?w=200&h=200&fit=crop&auto=format',0),
(47,'Green Beans','vegetable','https://images.pexels.com/photos/30893268/pexels-photo-30893268.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(48,'Double Beans','vegetable','https://images.pexels.com/photos/33211278/pexels-photo-33211278.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(49,'Chayote Squash (Chow Chow)','vegetable','https://images.pexels.com/photos/36939001/pexels-photo-36939001.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(50,'Ash Gourd (White Pumpkin)','vegetable','https://images.unsplash.com/photo-1695555801863-8b1a577d5124?w=200&h=200&fit=crop&auto=format',0),
(51,'Banana Flower','vegetable','https://images.pexels.com/photos/11521850/pexels-photo-11521850.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(52,'Green Mango','vegetable','https://images.unsplash.com/photo-1680008702821-e1b598db30f3?w=200&h=200&fit=crop&auto=format',0),
(53,'Small Onion (Shallots)','vegetable','https://images.pexels.com/photos/12353768/pexels-photo-12353768.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(54,'Spring Onion','vegetable','https://images.unsplash.com/photo-1602769515559-e15133a7e992?w=200&h=200&fit=crop&auto=format',0),
(55,'Broccoli','vegetable','https://images.unsplash.com/photo-1614336215203-05a588f74627?w=200&h=200&fit=crop&auto=format',0),
(56,'Baby Potato','vegetable','https://images.pexels.com/photos/33351055/pexels-photo-33351055.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(57,'Banana Stem','vegetable','https://images.pexels.com/photos/28214204/pexels-photo-28214204.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(58,'Taro Root','vegetable','https://images.pexels.com/photos/7543152/pexels-photo-7543152.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(59,'Yam','vegetable','https://images.unsplash.com/photo-1665913478570-f9511a93a6a5?w=200&h=200&fit=crop&auto=format',0),
(60,'Peas','vegetable','https://plus.unsplash.com/premium_photo-1663844169236-ff32474d1dc8?w=200&h=200&fit=crop&auto=format',0),
(61,'Tapioca','vegetable','https://images.unsplash.com/photo-1757283961570-682154747d9c?w=200&h=200&fit=crop&auto=format',0),
(76,'Snake Gourd','vegetable','https://images.pexels.com/photos/33211277/pexels-photo-33211277.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(78,'Zucchini','vegetable','https://images.unsplash.com/photo-1580294672675-91afc00ee7b3?w=200&h=200&fit=crop&auto=format',0)

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- GREENS
-- ============================================================

INSERT INTO products (id, name, category, image, votes) VALUES
(62,'Spinach (Keerai)','green','https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop&auto=format',0),
(68,'Drumstick leaves (Murungai Keerai)','green','https://images.unsplash.com/photo-1595118612285-a12a837ed80f?w=200&h=200&fit=crop&auto=format',0),
(71,'Coriander','green','https://images.unsplash.com/photo-1535189487909-a262ad10c165?w=200&h=200&fit=crop&auto=format',0),
(72,'Mint','green','https://images.pexels.com/photos/12717629/pexels-photo-12717629.jpeg?w=200&h=200&fit=crop&auto=compress',0),
(73,'Curry Leaves','green','https://images.unsplash.com/photo-1758649094570-9dc3b30ce80d?w=200&h=200&fit=crop&auto=format',0)

ON CONFLICT (id) DO NOTHING;