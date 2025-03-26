const db = require("../config/db");
const csv = require("csv-parser");
const fs = require("fs");

// 📌 Add a new book
exports.addBook = async (req, res) => {
    try {
        const { title, author, genre, isbn, language, edition, publisher, publicationYear, callNumber, keywords, description, location, availability, circulationType, coverImage, copies } = req.body;

        console.log("📌 Received Data:", req.body);  // Debugging log

        // Check if ISBN already exists
        const [existingBooks] = await db.query("SELECT id FROM books WHERE isbn = ?", [isbn]);
        if (existingBooks.length > 0) {
            return res.status(400).json({ error: "A book with this ISBN already exists" });
        }

        const sql = `INSERT INTO books (title, author, genre, isbn, language, edition, publisher, publication_year, call_number, keywords, description, location, availability, circulation_type, cover_image, available_copies) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [title, author, genre, isbn, language, edition, publisher, publicationYear, callNumber, keywords, description, location, availability, circulationType, coverImage, copies];

        console.log("📌 SQL Query:", sql);  // Debugging log
        console.log("📌 Values:", values);  // Debugging log

        const [result] = await db.query(sql, values);
        const bookId = result.insertId;

        console.log("📌 Book added successfully, ID:", bookId);  // Debugging log

        // Insert book copies
        const copySql = `INSERT INTO book_copies (book_id, copy_number, status) VALUES (?, ?, ?)`;
        const copyPromises = [];
        for (let i = 1; i <= copies; i++) {
            copyPromises.push(db.query(copySql, [bookId, i, "Available"]));
        }
        await Promise.all(copyPromises);

        return res.status(201).json({ message: "Book added successfully", bookId });
    } catch (err) {
        console.error("❌ Database Error:", err);  // Log error details
        return res.status(500).json({ error: "Database error", details: err.message });
    }
};

// 📌 Get all books
exports.getBooks = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM books");
        return res.status(200).json(results);
    } catch (err) {
        return res.status(500).json({ error: "Database error", details: err.message });
    }
};

// 📌 Get book by ID
exports.getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        const [results] = await db.query("SELECT * FROM books WHERE id = ?", [bookId]);

        if (results.length === 0) return res.status(404).json({ message: "Book not found" });

        return res.status(200).json(results[0]);
    } catch (err) {
        return res.status(500).json({ error: "Database error", details: err.message });
    }
};

// 📌 Update book details
exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, author, genre, isbn, language, edition, publisher, publicationYear, callNumber, keywords, description, location, availability, circulationType, coverImage } = req.body;

        const sql = `UPDATE books SET title=?, author=?, genre=?, isbn=?, language=?, edition=?, publisher=?, publication_year=?, call_number=?, keywords=?, description=?, location=?, availability=?, circulation_type=?, cover_image=? WHERE id=?`;
        const values = [title, author, genre, isbn, language, edition, publisher, publicationYear, callNumber, keywords, description, location, availability, circulationType, coverImage, bookId];

        await db.query(sql, values);
        return res.status(200).json({ message: "Book updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Database error", details: err.message });
    }
};

// 📌 Delete book
exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        await db.query("DELETE FROM books WHERE id = ?", [bookId]);
        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Database error", details: err.message });
    }
};

// 📌 Bulk Upload Books from CSV
exports.bulkUpload = (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const books = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
            books.push([
                row.title, row.author, row.genre, row.isbn, row.language, row.edition, row.publisher, row.publicationYear, row.callNumber, row.keywords, row.description, row.location, "Available", "Loanable", null
            ]);
        })
        .on("end", async () => {
            const sql = `INSERT INTO books (title, author, genre, isbn, language, edition, publisher, publication_year, call_number, keywords, description, location, availability, circulation_type, cover_image) 
                         VALUES ?`;

            try {
                await db.query(sql, [books]);
                fs.unlinkSync(filePath); // Delete file after processing
                return res.status(201).json({ message: `${books.length} books added successfully` });
            } catch (err) {
                return res.status(500).json({ error: "Database error", details: err.message });
            }
        });
};
