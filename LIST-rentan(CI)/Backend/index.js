const cors = require('cors');
const dotenv = require('dotenv');
const db = require("./config/db");
const express = require('express');
const path = require('path');

dotenv.config();
const app = express();
const port = process.env.PORT;

db.connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

// Routes
const readRoute = require("./routes/ReadRoute");
const toDoRoute = require("./routes/ToDoRoute");
const trackRoute = require("./routes/TrackRoute");
const userRoute = require("./routes/UserRoute");

app.use("/reads", readRoute);
app.use("/todos", toDoRoute);
app.use("/tracks", trackRoute);
app.use("/users", userRoute);

// Route untuk mengunduh log.txt
app.get("/download-log", (req, res) => {
    const filePath = path.join(__dirname, './log.txt'); // Lokasi file log.txt
    res.download(filePath, 'log.txt', (err) => {
        if (err) {
            console.error("Error downloading the file:", err);
            res.status(500).send("Failed to download the file.");
        }
    });
});

// Logging
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on PORT ${port}`);
});