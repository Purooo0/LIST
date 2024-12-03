const cors = require('cors');
const dotenv = require('dotenv');
const db = require("./config/db");
const express = require('express');

// Load environment variables from .env file
dotenv.config();
const app = express();

// Setup PORT from environment variable or fallback to 3000
const port = process.env.PORT || 5000; 

// Connect to the database
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

// Logging
app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});