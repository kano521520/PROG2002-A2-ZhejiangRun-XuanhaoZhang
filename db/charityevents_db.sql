CREATE DATABASE IF NOT EXISTS charityevents_db;
USE charityevents_db;

DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    summary_description VARCHAR(255) NOT NULL,
    full_description TEXT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    goal_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('upcoming', 'past', 'suspended') NOT NULL DEFAULT 'upcoming',
    image_url VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

INSERT INTO categories (category_id, category_name) VALUES
(1, 'Family & Kids Run'),
(2, '10K & Challenge Run'),
(3, 'Night & Glow Run'),
(4, 'Trail & Park Run');

INSERT INTO events 
(event_id, title, summary_description, full_description, date, time, location, category_id, goal_amount, current_amount, ticket_price, status, image_url) 
VALUES
(1, 
 'West Lake 5K Family Fun Run', 
 'A 5K family charity run around scenic West Lake to raise funds for rural sports facilities.', 
 'Join us around the scenic West Lake for a delightful 5-kilometer family charity run! All proceeds from ticket sales will directly support underprivileged rural primary schools in Zhejiang to build sports facilities and purchase physical education equipment. Enjoy fun interactive cheer stations along the historic Su Causeway while running for a great cause.', 
 '2026-10-15', '08:30 AM', 'Hangzhou (West Lake)', 1, 10000.00, 6200.00, 25.00, 'upcoming', 'https://images.unsplash.com/photo-1530549387789-4c1017266635'),

(2, 
 'Dongqian Lake Sunset 10K Run', 
 'Evening 10K challenge around Dongqian Lake benefiting East China Sea marine conservation.', 
 'Experience the breathtaking sunset over Ningbo famous Dongqian Lake in this evening 10K challenge. Designed for both casual joggers and experienced runners, this event raises funds for coastal wetland conservation and water pollution protection along the East China Sea. Every kilometer you run helps safeguard local marine ecosystems.', 
 '2026-10-28', '05:00 PM', 'Ningbo (Dongqian Lake)', 2, 25000.00, 18000.00, 40.00, 'upcoming', 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3'),

(3, 
 'Shaoxing Ancient Town Night Glow Run', 
 'Vibrant glow-in-the-dark night run through historic Shaoxing water town canals.', 
 'Light up the historic water town of Shaoxing in this vibrant glow-in-the-dark night run! Participants will receive LED glow apparel, headbands, and neon body paint. Run through ancient stone bridges and illuminated canals to raise money and awareness for rural youth art and music education programs across Shaoxing.', 
 '2026-11-05', '07:00 PM', 'Shaoxing (Yuecheng)', 3, 15000.00, 8500.00, 30.00, 'upcoming', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963'),

(4, 
 'Taihu Lake Eco Scenic Run', 
 '15K eco trail run along southern Taihu Lake supporting biodiversity preservation.', 
 'Run along the pristine southern shores of Taihu Lake in Huzhou to champion a zero-carbon lifestyle! This 15K trail run takes you through scenic lakeside parks and bamboo forests. Funds raised will go directly to biodiversity preservation and migratory bird habitat protection around the Taihu basin.', 
 '2026-11-20', '09:00 AM', 'Huzhou (Taihu Lake)', 4, 30000.00, 12000.00, 50.00, 'upcoming', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8'),

(5, 
 'Jiaxing South Lake Heritage Dash', 
 'Free community charity walk supporting senior care and healthcare services.', 
 'A free community charity walk and dash designed for families, seniors, and kids around Jiaxing South Lake. Bring your family to enjoy a crisp morning walk while supporting local senior community care services and healthcare support for low-income families.', 
 '2026-12-01', '09:30 AM', 'Jiaxing (South Lake)', 1, 5000.00, 2800.00, 0.00, 'upcoming', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211'),

(6, 
 'Oujiang River Midnight Challenge', 
 'Late-night 10K riverfront challenge raising emergency medical funds for mountain villages.', 
 'A late-night 10K urban run along the spectacular illuminated Oujiang River promenade in Wenzhou. Challenge your personal best while raising critical funds for emergency medical transportation supplies in remote mountain villages of southern Zhejiang.', 
 '2026-12-10', '10:00 PM', 'Wenzhou (Oujiang)', 3, 20000.00, 4500.00, 35.00, 'upcoming', 'https://images.unsplash.com/photo-1502904550040-7534597429ae'),

(7, 
 '2025 Qiandao Lake Half Marathon', 
 '[PAST] Completed 2025 half marathon that successfully raised $50,000 for clean water.', 
 '[PAST EVENT] Our flagship 2025 half marathon around Qiandao Lake was a historic success, bringing together over 1,500 runners and raising $50,000 for clean water protection initiatives. Thank you to all participants, volunteers, and sponsors for making this event possible!', 
 '2025-09-10', '08:00 AM', 'Hangzhou (Qiandao Lake)', 2, 50000.00, 50000.00, 60.00, 'past', 'https://images.unsplash.com/photo-1486218119243-13883505764c'),

(8, 
 'Unregistered Highway Express Run', 
 '[SUSPENDED] Unauthorized marathon event suspended due to safety hazards.', 
 '[SUSPENDED] Unauthorized marathon event planned on active public expressways without municipal traffic control permits. Suspended by platform management due to severe safety hazards and policy non-compliance.', 
 '2026-10-01', '06:00 AM', 'Hangzhou Expressway', 2, 10000.00, 0.00, 100.00, 'suspended', 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38');