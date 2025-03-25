import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookManagement.css";

const BookManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingBook = location.state?.book || null; // Prevents undefined errors

  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    language: "",
    edition: "",
    publisher: "",
    publicationYear: "",
    copies: "",
    location: "",
    callNumber: "",
    keywords: "",
    description: "",
    availability: "Available",
    circulationType: "Loanable",
    coverImage: null,
  });

  const [editingBookId, setEditingBookId] = useState(null);

  useEffect(() => {
    if (editingBook) {
      setEditingBookId(editingBook.id);
      setBookData({
        title: editingBook.title || "",
        author: editingBook.author || "",
        genre: editingBook.genre || "",
        isbn: editingBook.isbn || "",
        language: editingBook.language || "",
        edition: editingBook.edition || "",
        publisher: editingBook.publisher || "",
        publicationYear: editingBook.publication_year || "",
        copies: editingBook.available_copies || "",
        location: editingBook.location || "",
        callNumber: editingBook.call_number || "",
        keywords: editingBook.keywords || "",
        description: editingBook.description || "",
        availability: editingBook.availability || "Available",
        circulationType: editingBook.circulation_type || "Loanable",
        coverImage: editingBook.cover_image || null,
      });
    } else {
      setEditingBookId(null);
    }
  }, [editingBook]);

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setBookData({ ...bookData, coverImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(bookData).forEach((key) => {
        if (bookData[key] !== null && bookData[key] !== "") {
          formData.append(key, bookData[key]);
        }
      });

      if (editingBookId) {
        await axios.put(`http://localhost:5000/api/books/update/${editingBookId}`, bookData);
        alert("Book updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/books/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Book added successfully!");
      }

      navigate("/book-list");
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      alert("Operation failed. Check console for details.");
    }
  };

  const resetForm = () => {
    setBookData({
      title: "",
      author: "",
      genre: "",
      isbn: "",
      language: "",
      edition: "",
      publisher: "",
      publicationYear: "",
      copies: "",
      location: "",
      callNumber: "",
      keywords: "",
      description: "",
      availability: "Available",
      circulationType: "Loanable",
      coverImage: null,
    });
    setEditingBookId(null);
    navigate("/book-list");
  };

  return (
    <div className="book-management-container">
      <h2>{editingBookId ? "Edit Book" : "Add New Book"}</h2>
      <button onClick={() => navigate("/book-list")} className="view-books-btn">View Books</button>

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-grid">
          {Object.keys(bookData).map(
            (key) =>
              key !== "coverImage" && (
                <div className="form-group" key={key}>
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                  <input
                    type={key === "publicationYear" || key === "copies" ? "number" : "text"}
                    name={key}
                    value={bookData[key]}
                    onChange={handleChange}
                    required
                  />
                </div>
              )
          )}
          <div className="form-group">
            <label>Book Cover:</label>
            <input type="file" name="coverImage" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
        <button type="submit" className="submit-btn">
          {editingBookId ? "Update Book" : "Add Book"}
        </button>
        {editingBookId && <button onClick={resetForm} className="cancel-btn">Cancel</button>}
      </form>
    </div>
  );
};

export default BookManagement;
