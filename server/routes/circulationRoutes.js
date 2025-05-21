const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware"); // Use authenticateUser
const router = express.Router();
const db = require("../config/db");
const { getBorrowedBooks, checkInBook } = require("../controllers/circulationController");

// Debug the import
console.log("Imported from circulationController:", { getBorrowedBooks, checkInBook });

// Fetch Borrowed Books (any authenticated user)
router.get("/borrowed-books", authenticateUser, getBorrowedBooks);

// Check Out a Book (any authenticated user)
router.post("/checkout", authenticateUser, async (req, res) => {
    try {
        console.log("🔹 Received Checkout Request:", req.body);

        const { isbn, reg_number, due_date } = req.body;
        const user_id = req.user.id; // From JWT token

        if (!isbn || !reg_number || !due_date) {
            return res.status(400).json({ message: "All fields are required." });
        }

        console.log("🔍 Checking book availability...");

        // Check if book exists and is available
        const [bookRows] = await db.query("SELECT available_copies FROM books WHERE isbn = ?", [isbn]);
        if (!bookRows || bookRows.length === 0 || bookRows[0].available_copies <= 0) {
            return res.status(400).json({ message: "Book is not available." });
        }

        console.log("✅ Book is available.");

        // Check if student exists
        const [studentRows] = await db.query("SELECT reg_number FROM students WHERE reg_number = ?", [reg_number]);
        if (!studentRows || studentRows.length === 0) {
            return res.status(404).json({ message: "Student not found." });
        }

        console.log("✅ Student found. Proceeding with checkout...");

        // Use user_id as librarian_id (since any authenticated user can check out)
        const librarian_id = user_id;

        // Insert into borrowed_books
        await db.query(
            `INSERT INTO borrowed_books (isbn, reg_number, librarian_id, super_admin_id, due_date, status)
             VALUES (?, ?, ?, NULL, ?, 'borrowed')`,
            [isbn, reg_number, librarian_id, due_date]
        );

        // Decrease available copies
        await db.query("UPDATE books SET available_copies = available_copies - 1 WHERE isbn = ?", [isbn]);

        res.status(201).json({ message: "Book checked out successfully." });
    } catch (error) {
        console.error("🚨 Error in Checkout:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Check-In Route (any authenticated user)
router.post("/checkin", authenticateUser, checkInBook);

module.exports = router;