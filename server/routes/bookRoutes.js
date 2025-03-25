const express = require("express");
const { addBook, getBooks, getBookById, updateBook, deleteBook, bulkUpload } = require("../controllers/bookController");
const multer = require("multer");

const router = express.Router();

// Multer for handling file uploads (CSV)
const upload = multer({ dest: "uploads/" });

// Book Management Routes
router.post("/add", upload.single("coverImage"), addBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", deleteBook);
router.post("/bulk-upload", upload.single("bulkUploadFile"), bulkUpload);

module.exports = router;
