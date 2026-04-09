const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Serve static files (IMPORTANT)
app.use(express.static(path.join(__dirname, "client/public")));
app.use(express.static(path.join(__dirname, "views")));


// Routes (API)
const studentRoutes = require("./routes/studentRoutes");
app.use("/students", studentRoutes);

const roomRoutes = require("./routes/roomRoutes");
app.use("/rooms", roomRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/dashboard", dashboardRoutes);

const feeRoutes = require("./routes/feeRoutes");
app.use("/fees", feeRoutes);

// ✅ Home route (index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

// Optional routes for buttons
app.get("/admin/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views/admin-login.html"));
});

app.get("/student/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views/student-login.html"));
});

/// Admin Pages
app.get("/admin/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "views/admin-dashboard.html"));
});

app.get("/admin/students", (req, res) => {
    res.sendFile(path.join(__dirname, "views/admin-students.html"));
});

app.get("/admin/rooms", (req, res) => {
    res.sendFile(path.join(__dirname, "views/admin-rooms.html"));
});

app.get("/admin/fees", (req, res) => {
    res.sendFile(path.join(__dirname, "views/admin-fees.html"));
});

app.get("/student/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "views/student-dashboard.html"));
});

app.get("/student/room", (req, res) => {
    res.sendFile(path.join(__dirname, "views/student-room.html"));
});

app.get("/student/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "views/student-profile.html"));
});

app.get("/student/fees", (req, res) => {
    res.sendFile(path.join(__dirname, "views/student-fees.html"));
});

// Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000 🚀");
});
