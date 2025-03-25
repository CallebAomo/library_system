import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./checkOut.css";


const CheckOut = () => {
  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ Allows navigation back

  const handleCheckOut = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/circulation/checkout", {
  book_id: bookId,        // ✅ Match the API field names
  student_id: studentId,  // ✅ Match the API field names
  librarian_id: 1,        // ❗ Temporary: Replace with actual logged-in librarian's ID
  due_date: dueDate,
      });
      setMessage(response.data.message);
      setStudentId("");
      setBookId("");
      setDueDate("");
    } catch (err) {
      console.error("Error:", err.response?.data);
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Check Out Book</h2>
      <form onSubmit={handleCheckOut}>
        <label>Student ID:</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <label>Book ID:</label>
        <input
          type="text"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        />
        <label>Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Check Out</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* ✅ Back Button to Return to Dashboard */}
      <button onClick={() => navigate("/")}>Back to Dashboard</button>
    </div>
  );
};

export default CheckOut;