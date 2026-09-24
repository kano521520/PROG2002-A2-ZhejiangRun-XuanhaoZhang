const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// SQLite database connection targeting db/charity_events.db
const dbPath = path.resolve(__dirname, '../db/charity_events.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err.message);
    else console.log(`Connected to SQLite database at: ${dbPath}`);
});

/**
 * REST Endpoint: GET /api/categories
 * Retrieves all event categories.
 */
app.get('/api/categories', (req, res) => {
    const sql = 'SELECT * FROM categories ORDER BY category_id ASC';
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/**
 * REST Endpoint: GET /api/events
 * Retrieves all events joined with category names.
 */
app.get('/api/events', (req, res) => {
    const sql = `
        SELECT e.event_id, e.title, e.location, e.date, e.image_url, c.category_name 
        FROM events e
        JOIN categories c ON e.category_id = c.category_id
        ORDER BY e.date DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/**
 * REST Endpoint: GET /api/events/search
 * Filters event collections by query parameters.
 */
app.get('/api/events/search', (req, res) => {
    const { category_id, location, date } = req.query;
    let sql = `
        SELECT e.event_id, e.title, e.location, e.date, e.image_url, c.category_name 
        FROM events e
        JOIN categories c ON e.category_id = c.category_id
        WHERE 1=1
    `;
    const params = [];

    if (category_id) {
        sql += ' AND e.category_id = ?';
        params.push(category_id);
    }
    if (location) {
        sql += ' AND LOWER(e.location) LIKE ?';
        params.push(`%${location.toLowerCase()}%`);
    }
    if (date) {
        sql += ' AND e.date = ?';
        params.push(date);
    }

    sql += ' ORDER BY e.date DESC';

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/**
 * REST Endpoint: GET /api/events/:id
 * Retrieves detailed entity attributes for a single event by ID.
 */
app.get('/api/events/:id', (req, res) => {
    const eventId = req.params.id;
    const sql = `
        SELECT e.event_id, e.title, e.location, e.date, e.image_url, e.category_id, c.category_name 
        FROM events e
        JOIN categories c ON e.category_id = c.category_id
        WHERE e.event_id = ?
    `;

    db.get(sql, [eventId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Event record not found.' });
        res.json(row);
    });
});

/**
 * REST Endpoint: POST /api/events
 * Inserts a new charity event record into database.
 */
app.post('/api/events', (req, res) => {
    const { title, category_id, location, date, image_url } = req.body;

    if (!title || !category_id || !location) {
        return res.status(400).json({ error: 'Missing mandatory fields.' });
    }

    const sql = `
        INSERT INTO events (title, category_id, location, date, image_url)
        VALUES (?, ?, ?, ?, ?)
    `;
    const params = [title, category_id, location, date, image_url || null];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: 'Event entity successfully created.',
            event_id: this.lastID 
        });
    });
});

app.listen(PORT, () => {
    console.log(`API Service running on http://localhost:${PORT}`);
});