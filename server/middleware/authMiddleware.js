const jwt = require("jsonwebtoken");

const authenticateLibrarianOrSuperAdmin = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        console.log("🛑 Received Authorization Header:", authHeader);

        if (!authHeader) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        console.log("🔹 Extracted Token:", token);

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("❌ JWT Verification Error:", err);
                return res.status(401).json({ message: "Invalid or expired token." });
            }

            console.log("✅ Decoded Token:", decoded);

            // ✅ Normalize role check (case-insensitive comparison)
            const userRole = decoded.role.toLowerCase();
            if (userRole !== "librarian" && userRole !== "super_admin") {
                return res.status(403).json({ message: "Access denied. Only Librarians or Super Admins can perform this action." });
            }

            req.user = decoded; // Attach user data from token
            next();
        });
    } catch (err) {
        console.error("⚠️ Unexpected Error:", err);
        return res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = { authenticateLibrarianOrSuperAdmin };
