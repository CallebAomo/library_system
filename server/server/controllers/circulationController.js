const db = require("../config/db");

// ✅ Get Borrowed Books Function
const getBorrowedBooks = async (req, res) => {
    try {
        const [books] = await db.query("SELECT * FROM borrowed_books WHERE status = 'borrowed'");
        return res.status(200).json(books);
    } catch (error) {
        console.error("🚨 Error fetching borrowed books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Check-In Function
const checkInBook = async (req, res) => {
    const { isbn, reg_number } = req.body;

    if (!isbn || !reg_number) {
        return res.status(400).json({ message: "ISBN and Registration Number are required" });
    }

    try {
        // Check if the book is currently borrowed
        const [borrowed] = await db.query(
            "SELECT * FROM borrowed_books WHERE isbn = ? AND reg_number = ? AND status = 'borrowed' LIMIT 1",
            [isbn, reg_number]
        );

        if (borrowed.length === 0) {
            return res.status(404).json({ message: "No matching borrowed book found" });
        }

        // ✅ If the book is overdue, log a fine (optional)
        const dueDate = new Date(borrowed[0].due_date);
        const today = new Date();
        if (today > dueDate) {
            console.log(`⚠️ Late return by ${reg_number} for book ${isbn}`);
            // Implement fine system here if needed
        }

        // ✅ Mark the book as "returned" instead of deleting it
        await db.query(
            "UPDATE borrowed_books SET status = 'returned' WHERE isbn = ? AND reg_number = ?",
            [isbn, reg_number]
        );

        // ✅ Increase available copies in the `books` table
        await db.query(
            "UPDATE books SET available_copies = available_copies + 1 WHERE isbn = ?",
            [isbn]
        );

        return res.status(200).json({ message: "Book successfully checked in" });

    } catch (error) {
        console.error("🚨 Error checking in book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getBorrowedBooks, checkInBook };
