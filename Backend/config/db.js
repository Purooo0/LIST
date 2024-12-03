const { Pool } = require('pg');  
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Function to connect to the DB
const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Database connected');
    } catch (err) {
        console.error('Error connecting to the database', err);
    }
};

// Export the function to connect to DB
module.exports = { pool, connectDB };