const db = require("../config/db");
const csv = require("csv-parser");
const fs = require("fs");

// 📌 Add a new book
exports.addBook = (req, res) => {
    const { title, author, genre, isbn, language, edition, publisher, publicationYear, callNumber, keywords, description, location, availability, circulationType, coverImage, copies } = req.body;

    const sql = `INSERT INTO books (title, author, genre, isbn, language, edition, publisher, publication_year, call_number, keywords, description, location, availability, circulation_type, cover_image, available_copies) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [title, author, genre, isbn, language, edition, publisher, publicationYear, callNumber, keywords, description, location, availability, circulationType, coverImage, copies];

    db.query(sql, values, async (err, result) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });

        const bookId = result.insertId;
        const copySql = `INSERT INTO book_copies (book_id, copy_number, status) VALUES (?, ?, ?)`;

        try {
            const copyPromises = [];
            for (let i = 1; i <= copies; i++) {
                copyPromises.push(db.promise().query(copySql, [bookId, i, "Available"]));
            }
            await Promise.all(copyPromises);

            return res.status(201).json({ message: "Book added successfully", bookId });
        } catch (copyError) {
            return res.status(500).json({ error: "Error inserting book copies", details: copyError });
        }
    });
};


// 📌 Get all books
exports.getBooks = (req, res) => {
    db.query("SELECT * FROM books", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });
        return res.status(200).json(results);
    });
};

// 📌 Get book by ID
exports.getBookById = (req, res) => {
    const bookId = req.params.id;
    db.query("SELECT * FROM books WHERE id = ?", [bookId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });
        if (results.length === 0) return res.status(404).json({ message: "Book not found" });
        return res.status(200).json(results[0]);
    });
};

// 📌 Update book details
exports.updateBook = (req, res) => {
    const bookId = req.params.id;
    const { title, author, genre, isbn, language, edition, publisher, publicationYear, callNumber, keywords, description, location, availability, circulationType, coverImage } = req.body;

    const sql = `UPDATE books SET title=?, author=?, genre=?, isbn=?, language=?, edition=?, publisher=?, publication_year=?, call_number=?, keywords=?, description=?, location=?, availability=?, circulation_type=?, cover_image=? WHERE id=?`;
    const values = [title, author, genre, isbn, language, edition, publisher, publicationYear, callNumber, keywords, description, location, availability, circulationType, coverImage, bookId];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });
        return res.status(200).json({ message: "Book updated successfully" });
    });
};

// 📌 Delete book
exports.deleteBook = (req, res) => {
    const bookId = req.params.id;
    db.query("DELETE FROM books WHERE id = ?", [bookId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });
        return res.status(200).json({ message: "Book deleted successfully" });
    });
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
        .on("end", () => {
            const sql = `INSERT INTO books (title, author, genre, isbn, language, edition, publisher, publication_year, call_number, keywords, description, location, availability, circulation_type, cover_image) 
                         VALUES ?`;

            db.query(sql, [books], (err, result) => {
                if (err) return res.status(500).json({ error: "Database error", details: err });
                fs.unlinkSync(filePath); // Delete file after processing
                return res.status(201).json({ message: `${result.affectedRows} books added successfully` });
            });
        });
};
