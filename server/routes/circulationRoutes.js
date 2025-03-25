const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Check Out a Book
router.post("/checkout", async (req, res) => {
    try {
        const { book_id, student_id, librarian_id, due_date } = req.body;

        // Validate required fields
        if (!book_id || !student_id || !librarian_id || !due_date) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if book exists and has available copies
        const [bookRows] = await db.query("SELECT available_copies FROM books WHERE id = ?", [book_id]);
        if (bookRows.length === 0 || bookRows[0].available_copies <= 0) {
            return res.status(400).json({ message: "Book is not available." });
        }

        // Check if student exists
        const [studentRows] = await db.query("SELECT id FROM students WHERE id = ?", [student_id]);
        if (studentRows.length === 0) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Check if librarian exists
        const [librarianRows] = await db.query("SELECT id FROM users WHERE id = ? AND role = 'librarian'", [librarian_id]);
        if (librarianRows.length === 0) {
            return res.status(403).json({ message: "Librarian not found or unauthorized." });
        }

        // Insert into borrowed_books
        await db.query(
            "INSERT INTO borrowed_books (book_id, student_id, librarian_id, due_date, status) VALUES (?, ?, ?, ?, 'borrowed')",
            [book_id, student_id, librarian_id, due_date]
        );

        // Decrease available copies
        await db.query("UPDATE books SET available_copies = available_copies - 1 WHERE id = ?", [book_id]);

        res.status(201).json({ message: "Book checked out successfully." });
    } catch (error) {
        console.error("Error checking out book:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// ✅ *Check In (Return Book) API*
router.post("/checkin", async (req, res) => {
    try {
        const { borrow_id } = req.body;

        if (!borrow_id) {
            return res.status(400).json({ message: "Borrow ID is required." });
        }

        // Check if the borrowed book exists and is still borrowed
        const [borrowedBookRows] = await db.query(
            "SELECT book_id FROM borrowed_books WHERE id = ? AND status = 'borrowed'",
            [borrow_id]
        );

        if (borrowedBookRows.length === 0) {
            return res.status(404).json({ message: "Borrowed book not found or already returned." });
        }

        const bookId = borrowedBookRows[0].book_id;

        // Mark book as returned
        await db.query(
            "UPDATE borrowed_books SET status = 'returned', returned_at = NOW() WHERE id = ?",
            [borrow_id]
        );

        // Increase available copies
        await db.query("UPDATE books SET available_copies = available_copies + 1 WHERE id = ?", [bookId]);

        res.status(200).json({ message: "Book checked in successfully." });
    } catch (error) {
        console.error("Error checking in book:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;