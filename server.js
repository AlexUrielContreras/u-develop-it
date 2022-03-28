const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const inputCheck = require('./utils/inputCheck')

// Establish connection to the mysql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Iwillliveinnyc2024',
        database: 'election'
    },
    console.log('Connected to the election database.')
)

app.get('/api/candidates', (req, res) => {
    const sql = 'SELECT * FROM candidates'
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message});
            return
        }
        res.json({ 
            message: 'success',
            data: rows
        })
    });
});

// GET a single candidate
app.get('/api/candidates/:id', (req, res) => {
    const sql = 'SELECT * FROM candidates WHERE id = ?';
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return
        }
        res.json({
            message: 'success',
            data: row
        })
    })
})

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            })
        }
    })
})

// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected')
    if (errors) {
        res.status(400).json({ error: errors });
        return
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                 VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }
    res.json({
        message: 'success',
        data: body
    });
});
})

// Default response for any other request (NOT FOUND)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});