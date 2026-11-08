require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { protect } = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to EventSphere Backend!");
});

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/registrations", require("./routes/registrationRoutes"));

// Protected test route
app.get("/api/protected-test", protect, (req, res) => {
    res.json({
        message: "You accessed a protected route!",
        user: req.user
    });
});

// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch(error => {
        console.log("MongoDB Error:", error.message);
    });