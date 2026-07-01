require("dotenv").config();
const express = require("express");
const cors = require("cors");

const driveRoutes = require("./routes/driveRoutes");
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES CONNECTED HERE
app.use("/api/drives", driveRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/interviews", interviewRoutes);

// TEST ROUTE
app.get("/api", (req, res) => {
    res.send("Backend is running");
});

const PORT = 5000;

require("./cron/reminderCron");
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});