const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../db/charity_events.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
    console.log(`Connected to database at: ${dbPath}`);
});

db.serialize(() => {
    // 1. Create categories table
    db.run(`
        CREATE TABLE IF NOT EXISTS categories (
            category_id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_name TEXT NOT NULL
        )
    `);

    // 2. Create events table
    db.run(`
        CREATE TABLE IF NOT EXISTS events (
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category_id INTEGER NOT NULL,
            location TEXT NOT NULL,
            date TEXT NOT NULL,
            image_url TEXT,
            FOREIGN KEY (category_id) REFERENCES categories(category_id)
        )
    `);

    // 3. Create registrations table for event bookings
    db.run(`
        CREATE TABLE IF NOT EXISTS registrations (
            registration_id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            quantity INTEGER NOT NULL DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events(event_id)
        )
    `);

    // Reset tables for clean initialization
    db.run('DELETE FROM categories');
    db.run('DELETE FROM events');

    // Seed categories
    const insertCategory = db.prepare('INSERT INTO categories (category_id, category_name) VALUES (?, ?)');
    insertCategory.run(1, 'Family & Kids Run');
    insertCategory.run(2, '10K & Challenge Run');
    insertCategory.run(3, 'Night & Glow Run');
    insertCategory.run(4, 'Trail & Park Run');
    insertCategory.finalize();

    // Seed initial events with verified high-res Asian runner photos
    const insertEvent = db.prepare(`
        INSERT INTO events (title, category_id, location, date, image_url)
        VALUES (?, ?, ?, ?, ?)
    `);

    const initialEvents = [
        [
            'West Lake 5K Family Fun Run',
            1,
            'Hangzhou (West Lake)',
            '2026-10-14',
            'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=800&q=80'
        ],
        [
            'Dongqian Lake Sunset 10K Run',
            2,
            'Ningbo (Dongqian Lake)',
            '2026-10-27',
            'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
        ],
        [
            'Shaoxing Ancient Town Night Glow Run',
            3,
            'Shaoxing (Yuecheng)',
            '2026-11-04',
            'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=800&q=80'
        ],
        [
            'Taihu Lake Eco Scenic Run',
            4,
            'Huzhou (Taihu Lake)',
            '2026-11-19',
            'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80'
        ],
        [
            'Jiaxing South Lake Heritage Dash',
            1,
            'Jiaxing (South Lake)',
            '2026-11-30',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'
        ],
        [
            'Oujiang River Midnight Challenge',
            3,
            'Wenzhou (Oujiang)',
            '2026-12-09',
            'https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=800&q=80'
        ]
    ];

    initialEvents.forEach(evt => {
        insertEvent.run(evt[0], evt[1], evt[2], evt[3], evt[4]);
    });

    insertEvent.finalize(() => {
        console.log('Database successfully initialized with registrations table and event seeds.');
        db.close();
    });
});