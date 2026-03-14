const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection with Aiven SSL requirements
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 18844,
    ssl: {
        rejectUnauthorized: false 
    }
});

db.connect((err) => {
    if (err) {
        console.error('Aiven connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');

    // Auto-create table
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS moods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mood_text TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    db.query(createTableQuery, (err) => {
        if (err) console.log("Table check error:", err);
        else console.log("Table 'moods' is confirmed and ready!");
    });
});

// API Route
app.post('/mood', (req, res) => {
    const { mood } = req.body;
    const aiResponse = `I hear that you are feeling ${mood}. Thanks for sharing with me!`;
    
    const query = "INSERT INTO moods (mood_text, response) VALUES (?, ?)";
    db.query(query, [mood, aiResponse], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database insertion failed" });
        }
        res.json({ message: aiResponse });
    });
});

const PORT = process.env.PORT || 10000; // Render uses 10000 by default
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});