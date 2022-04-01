const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/parties', (req, res) => {
    const sql = 'SELECT * FROM parties';

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        })
    })
});
// Get a party by the id
router.get('/parties/:id', (req, res) => {
    const sql = 'SELECT * FROM parties WHERE id = ?';
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: error.message })
            return; 
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});
// Delete a party column
router.delete('/parties/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: error.message })
        } else if (!results.affectedRows) {
            res.json({ message: 'Party Not Found'})
        } else {
            res.json({
                message: 'deleted', 
                changes: results.affectedRows,
                id: req.params.id
            })
        }
    })
})

module.exports = router;