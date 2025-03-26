const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const router = express.Router();

// ✅ Super Admin Login (Generates Access & Refresh Tokens)
router.post("/super-admin-login", async (req, res) => {
    console.log("🔹 Login Attempt:", req.body); // Log received data

    const { email, password } = req.body;
    if (!email || !password) {
        console.log("❌ Missing Credentials");
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const [results] = await db.query("SELECT * FROM super_admins WHERE email = ?", [email]);
        console.log("🔍 DB Query Results:", results); // Log database query results

        if (results.length === 0) {
            console.log("❌ No user found for email:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const superAdmin = results[0];
        console.log("🔐 Stored Hashed Password:", superAdmin.password);

        const isMatch = await bcrypt.compare(password, superAdmin.password);
        console.log("✅ Password Match Result:", isMatch);

        if (!isMatch) {
            console.log("❌ Password Mismatch");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // If everything is correct, generate tokens
        const accessToken = jwt.sign(
            { id: superAdmin.id, role: "super_admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("🔑 Access Token Generated:", accessToken);

        res.json({
            message: "Login successful",
            accessToken,
            user_id: superAdmin.id,
            role: "super_admin",
        });
    } catch (error) {
        console.error("❌ Database Error:", error);
        res.status(500).json({ message: "Database error", error });
    }
});


// ✅ Refresh Token API (Generates a New Access Token)
router.post("/refresh-token", async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: "Refresh token is required" });
    }

    try {
        // ✅ Verify if refresh token exists in the database
        const [results] = await db.query("SELECT * FROM refresh_tokens WHERE token = ?", [token]);

        if (results.length === 0) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }

            // ✅ Generate new access token
            const newAccessToken = jwt.sign(
                { id: user.id, role: user.role }, // ✅ Ensure role is included
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            

            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error("Refresh Token Error:", error);
        return res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Logout API (Deletes Refresh Token from Database)
router.post("/logout", async (req, res) => {
    const { token } = req.body;

    try {
        await db.query("DELETE FROM refresh_tokens WHERE token = ?", [token]);
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
