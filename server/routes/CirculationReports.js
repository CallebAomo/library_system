const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const db = require("../config/db");
const path = require("path"); // For logo file path

// Function to draw a header with logo
const drawHeader = (doc, title) => {
    const logoPath = path.join(__dirname, "../public/logo.jpeg"); // Adjust path if needed

    // Add University Logo
    try {
        doc.image(logoPath, 50, 30, { width: 80, height: 80 }); // Adjust size as needed
    } catch (error) {
        console.log("Error loading logo:", error);
    }

    // University Name
    doc.fontSize(18).font("Helvetica-Bold").text("UNIVERSITY OF ELDORET", { align: "center" });

    // Address (Optional)
    doc.fontSize(12).font("Helvetica").text("P.O. Box 1125-30100, Eldoret, Kenya", { align: "center" });

    // Add Report Title
    doc.moveDown();
    doc.fontSize(16).font("Helvetica-Bold").text(title, { align: "center" });

    // Draw a Line Below Header
    doc.moveTo(50, 130).lineTo(550, 130).stroke();
};

// Function to draw a table
const drawTable = (doc, data, startX, startY, columnWidths, rowHeight) => {
    let y = startY;

    // Draw Table Headers
    doc.font("Helvetica-Bold").fontSize(12);
    let x = startX;
    const headers = Object.keys(data[0]);

    headers.forEach((header, i) => {
        doc.text(header.toUpperCase(), x + 5, y + 5, { width: columnWidths[i], align: "left" });
        x += columnWidths[i];
    });

    // Draw header line
    doc.moveTo(startX, y).lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y).stroke();
    y += rowHeight;

    // Draw Data Rows
    doc.font("Helvetica").fontSize(10);
    data.forEach(row => {
        x = startX;
        Object.values(row).forEach((text, i) => {
            doc.text(String(text), x + 5, y + 5, { width: columnWidths[i], align: "left" });
            x += columnWidths[i];
        });

        // Draw row line
        doc.moveTo(startX, y).lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y).stroke();
        y += rowHeight;
    });

    // Draw vertical lines
    let currentX = startX;
    for (let i = 0; i <= headers.length; i++) {
        doc.moveTo(currentX, startY).lineTo(currentX, y).stroke();
        currentX += columnWidths[i] || 0;
    }

    // Draw bottom line
    doc.moveTo(startX, y).lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y).stroke();
};

// Function to generate reports
const generateReport = async (res, filename, title, query) => {
    try {
        const [data] = await db.execute(query);
        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for this report." });
        }

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);

        // Draw Header
        drawHeader(doc, title);

        // Define column widths
        const columnWidths = [40, 120, 100, 100, 120]; // Adjust as needed
        const startX = 50, startY = 150, rowHeight = 30; // Shift table down to avoid header overlap

        // Draw Table
        drawTable(doc, data, startX, startY, columnWidths, rowHeight);

        doc.end();
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Overdue Books Report
router.get("/overdue-books", async (req, res) => {
    const query = `
        SELECT b.id AS ID, bk.title AS Title, bk.isbn AS ISBN, 
               DATE_FORMAT(b.due_date, '%Y-%m-%d') AS "Due Date", 
               s.name AS "Borrowed By"
        FROM borrowed_books b
        INNER JOIN books bk ON b.isbn = bk.isbn
        INNER JOIN students s ON b.reg_number = s.reg_number
        WHERE b.due_date < CURDATE() AND b.status = 'borrowed'
    `;
    generateReport(res, "overdue_books.pdf", "Overdue Books Report", query);
});

// Checked-Out Books Report
router.get("/checked-out-books", async (req, res) => {
    const query = `
        SELECT b.id AS ID, bk.title AS Title, bk.isbn AS ISBN, 
               DATE_FORMAT(b.due_date, '%Y-%m-%d') AS "Due Date", 
               s.name AS "Borrowed By"
        FROM borrowed_books b
        INNER JOIN books bk ON b.isbn = bk.isbn
        INNER JOIN students s ON b.reg_number = s.reg_number
        WHERE b.status = 'borrowed'
    `;
    generateReport(res, "checked_out_books.pdf", "Checked-Out Books Report", query);
});

// Returned Books Report
router.get("/returned-books", async (req, res) => {
    const query = `
        SELECT b.id AS ID, bk.title AS Title, bk.isbn AS ISBN, 
               DATE_FORMAT(b.returned_at, '%Y-%m-%d') AS "Return Date", 
               s.name AS "Returned By"
        FROM borrowed_books b
        INNER JOIN books bk ON b.isbn = bk.isbn
        INNER JOIN students s ON b.reg_number = s.reg_number
        WHERE b.status = 'returned'
    `;
    generateReport(res, "returned_books.pdf", "Returned Books Report", query);
});

// Fine Collection Report
router.get("/fine-collection", async (req, res) => {
    const query = `
        SELECT f.id AS ID, s.name AS "Student Name", 
               f.fine_amount AS "Fine Amount", 
               DATE_FORMAT(f.paid_date, '%Y-%m-%d') AS "Paid Date"
        FROM fines f
        INNER JOIN students s ON f.reg_number = s.reg_number
    `;
    generateReport(res, "fine_collection.pdf", "Fine Collection Report", query);
});

module.exports = router;
