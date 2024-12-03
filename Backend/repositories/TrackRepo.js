const { pool } = require('../config/db');

async function addTrack(req, res) {
    const { name, days, date } = req.body;

    const query = `
        INSERT INTO tracks (name, days, date)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [name, days, date];

    try {
        const result = await pool.query(query, values);
        res.status(201).json({ message: "New habit tracker successfully added", data: result.rows[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getAllTracks(req, res) {
    const query = `SELECT * FROM tracks;`;

    try {
        const result = await pool.query(query);
        res.status(200).json({ message: "The entire habit tracker list was successfully obtained", data: result.rows });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function updateTrack(req, res) {
    const trackerId = req.params.id;
    const { name, days, date } = req.body;

    const query = `
        UPDATE tracks
        SET name = $1, days = $2, date = $3
        WHERE id = $4
        RETURNING *;
    `;
    const values = [name, days, date, trackerId];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Habit tracker not found" });
        }
        res.status(200).json({ message: "Habit tracker updated successfully", data: result.rows[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteTrack(req, res) {
    const trackerId = req.params.id;

    const query = `DELETE FROM tracks WHERE id = $1 RETURNING *;`;
    const values = [trackerId];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Habit tracker not found" });
        }
        res.status(200).json({ message: "Habit tracker deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getTrackSummary(req, res) {
    const query = `
        SELECT 
            id, 
            name,
            (SELECT COUNT(*)
             FROM jsonb_each_text(days) 
             WHERE value = 'true') AS checked_count
        FROM tracks;
    `;

    try {
        const result = await pool.query(query);
        res.status(200).json({ message: "Habit tracker summary successfully obtained", data: result.rows });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    addTrack,
    getAllTracks,
    updateTrack,
    deleteTrack,
    getTrackSummary,
};