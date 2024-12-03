const { pool } = require('../config/db');

async function addRead(req, res) {
    const { title, author, publisher, status, score } = req.body;

    const query = `
        INSERT INTO reads (title, author, publisher, status, score)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [title, author, publisher, status, score];

    try {
        const result = await pool.query(query, values);
        res.status(201).json({ message: "New reading list successfully added", data: result.rows[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getAllReads(req, res) {
    const query = `SELECT * FROM reads;`;

    try {
        const result = await pool.query(query);
        res.status(200).json({ message: "The entire reading list was successfully obtained", data: result.rows });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function updateRead(req, res) {
    const readingListId = req.params.id;
    const { title, author, publisher, status, score } = req.body;

    const query = `
        UPDATE reads
        SET title = $1, author = $2, publisher = $3, status = $4, score = $5
        WHERE id = $6
        RETURNING *;
    `;
    const values = [title, author, publisher, status, score, readingListId];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Reading list not found" });
        }
        res.status(200).json({ message: "Reading list updated successfully", data: result.rows[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteRead(req, res) {
    const readingListId = req.params.id;

    const query = `DELETE FROM reads WHERE id = $1 RETURNING *;`;
    const values = [readingListId];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Reading list not found" });
        }
        res.status(200).json({ message: "Reading list deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    addRead,
    getAllReads,
    updateRead,
    deleteRead,
};