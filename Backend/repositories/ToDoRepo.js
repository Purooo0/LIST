const { pool } = require('../config/db');

async function addToDo(req, res) {
    const { title, description, status, due } = req.body;

    const query = `
        INSERT INTO lists (title, description, status, due)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [title, description, status, due];

    try {
        const result = await pool.query(query, values);
        res.status(201).json({ message: "New list successfully added", data: result.rows[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getAllToDos(req, res) {
    const query = `SELECT * FROM lists;`;

    try {
        const result = await pool.query(query);
        res.status(200).json({ message: "The entire list was successfully obtained", data: result.rows });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function updateToDo(req, res) {
    const listId = req.params.id;
    const { title, description, status, due } = req.body;

    const query = `
        UPDATE lists
        SET title = $1, description = $2, status = $3, due = $4
        WHERE id = $5
        RETURNING *;
    `;
    const values = [title, description, status, due, listId];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "List not found" });
        }
        res.status(200).json({ message: "List updated successfully", data: result.rows[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteToDo(req, res) {
    const listId = req.params.id;

    const query = `DELETE FROM lists WHERE id = $1 RETURNING *;`;
    const values = [listId];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "List not found" });
        }
        res.status(200).json({ message: "List deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    addToDo,
    getAllToDos,
    updateToDo,
    deleteToDo
}