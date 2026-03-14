const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// This uses environment variables which we will set up in the next step
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Test DB Connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// API Route for Mood Submission
app.post('/mood', (req, res) => {
    const { mood } = req.body;
    
    // Simple "AI" logic for the lab
    const aiResponse = `I hear that you are feeling ${mood}. Thanks for sharing!`;
    
    const query = "INSERT INTO moods (mood_text, response) VALUES (?, ?)";
    db.query(query, [mood, aiResponse], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database insertion failed" });
        }
        res.json({ message: aiResponse });
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});