const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbPath = path.resolve(__dirname, '../db/charity_events.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log(`Connected to SQLite database at: ${dbPath}`);
    }
});

// GET /api/categories - Fetch all categories
app.get('/api/categories', (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET /api/events - Fetch all events or filtered events
app.get('/api/events', (req, res) => {
    const { category_id, location } = req.query;
    let sql = `
        SELECT e.*, c.category_name 
        FROM events e 
        LEFT JOIN categories c ON e.category_id = c.category_id
        WHERE 1=1
    `;
    const params = [];

    if (category_id) {
        sql += ' AND e.category_id = ?';
        params.push(category_id);
    }

    if (location) {
        sql += ' AND e.location LIKE ?';
        params.push(`%${location}%`);
    }

    sql += ' ORDER BY e.date ASC';

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET /api/events/:id - Fetch single event by ID
app.get('/api/events/:id', (req, res) => {
    const eventId = req.params.id;
    const sql = `
        SELECT e.*, c.category_name 
        FROM events e 
        LEFT JOIN categories c ON e.category_id = c.category_id
        WHERE e.event_id = ?
    `;

    db.get(sql, [eventId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.json(row);
    });
});

// POST /api/events - Create a new event
app.post('/api/events', (req, res) => {
    const { title, category_id, location, date, image_url } = req.body;

    if (!title || !category_id || !location || !date) {
        return res.status(400).json({ error: 'Missing required event fields.' });
    }

    const sql = `
        INSERT INTO events (title, category_id, location, date, image_url)
        VALUES (?, ?, ?, ?, ?)
    `;
    const params = [title, category_id, location, date, image_url || ''];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'Event created successfully',
            event_id: this.lastID
        });
    });
});

// POST /api/registrations - Register for an event
app.post('/api/registrations', (req, res) => {
    const { event_id, full_name, email, phone, quantity } = req.body;

    if (!event_id || !full_name || !email) {
        return res.status(400).json({
            error: 'Missing required fields: event_id, full_name, and email are required.'
        });
    }

    const qty = parseInt(quantity, 10) || 1;

    db.get('SELECT event_id, title FROM events WHERE event_id = ?', [event_id], (err, event) => {
        if (err) {
            return res.status(500).json({ error: 'Database error while checking event existence.' });
        }
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        const stmt = db.prepare(`
            INSERT INTO registrations (event_id, full_name, email, phone, quantity)
            VALUES (?, ?, ?, ?, ?)
        `);

        stmt.run([event_id, full_name, email, phone || '', qty], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to record registration in database.' });
            }

            res.status(201).json({
                message: 'Registration successful!',
                registration_id: this.lastID,
                event_title: event.title
            });
        });
        stmt.finalize();
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});