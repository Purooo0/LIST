const { pool } = require('../config/db');

async function registerAccount(req, res) {
    const { username, email, password } = req.body;

    try {
        // Check for existing username or email
        const checkQuery = `
            SELECT * FROM users WHERE username = $1 OR email = $2;
        `;
        const checkResult = await pool.query(checkQuery, [username, email]);

        if (checkResult.rows.length > 0) {
            const existingUser = checkResult.rows[0];
            if (existingUser.username === username) {
                return res.status(409).json({ message: "Username already exists" });
            }
            if (existingUser.email === email) {
                return res.status(409).json({ message: "E-mail already exists" });
            }
        }

        // Insert new user
        const insertQuery = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await pool.query(insertQuery, [username, email, password]);
        res.status(200).json({ message: "Create Account Success", account: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function loginAccount(req, res) {
    const { username, password } = req.body;

    try {
        const query = `
            SELECT * FROM users WHERE username = $1 AND password = $2;
        `;
        const result = await pool.query(query, [username, password]);

        if (result.rows.length > 0) {
            res.status(200).json({ message: "Login Success", account: result.rows[0] });
        } else {
            res.status(404).json({ message: "Account not found! Make sure your username and password are correct!" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAccount(req, res) {
    const { username } = req.params;

    try {
        const query = `
            SELECT * FROM users WHERE username = $1;
        `;
        const result = await pool.query(query, [username]);

        if (result.rows.length > 0) {
            res.status(200).json({ message: "Get Account Success", account: result.rows[0] });
        } else {
            res.status(404).json({ message: "Get Account Failed!" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function changePassword(req, res) {
    const { username, email, newPassword } = req.body;

    try {
        let userQuery = `
            SELECT * FROM users WHERE username = $1 OR email = $2;
        `;
        const userResult = await pool.query(userQuery, [username || null, email || null]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "Account not found!" });
        }

        const updateQuery = `
            UPDATE users
            SET password = $1
            WHERE id = $2
            RETURNING *;
        `;
        const updatedUser = await pool.query(updateQuery, [newPassword, userResult.rows[0].id]);

        res.status(200).json({ message: "Change Password Success", account: updatedUser.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    registerAccount,
    loginAccount,
    getAccount,
    changePassword
};