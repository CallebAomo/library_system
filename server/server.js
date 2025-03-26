const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET); // Log the secret

const db = require("./config/db");
const circulationRoutes = require("./routes/circulationRoutes");
const studentRoutes = require("./routes/studentRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const finesRoutes = require("./routes/fines"); // Import fines routes
const renewRoutes = require("./routes/RenewRoutes");
const circulationReports = require("./routes/CirculationReports");


const app = express();
app.use(express.json());
app.use(cors({
    origin: "*", // Allows all devices (for now, update later for security)
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Library Management System Backend Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/circulation", circulationRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/fines", finesRoutes); // ✅ Added Fines API Route
app.use("/api/renew", renewRoutes);
app.use("/api/reports", circulationReports);



// ✅ Token Verification Route
app.post("/api/auth/verify-token", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ valid: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, message: "Invalid or expired token" });
        }
        res.json({ valid: true, user: decoded });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
