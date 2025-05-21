// src/components/CheckOut.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./checkOut.css";

const CheckOut = () => {
  const [studentRegNumber, setStudentRegNumber] = useState("");
  const [isbn, setIsbn] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("superAdminToken");

  const handleCheckOut = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    console.log("🔍 Checking token:", token); // Debug token

    if (!studentRegNumber.trim() || !isbn.trim() || !dueDate.trim()) {
      setError("All fields are required.");
      return;
    }

    if (!token) {
      setError("Please log in to check out a book.");
      setTimeout(() => navigate("/librarian-login"), 2000); // Redirect to /librarian-login
      return;
    }

    const requestData = {
      isbn,
      reg_number: studentRegNumber,
      due_date: dueDate,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log("📤 Sending Request:", requestData);
    console.log("🔹 Request Headers:", headers);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/circulation/checkout", requestData, { headers });
      console.log("✅ Server Response:", response.data);
      setMessage(response.data.message);
      setStudentRegNumber("");
      setIsbn("");
      setDueDate("");
    } catch (err) {
      console.error("❌ Server Error:", err.response?.data);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        localStorage.clear();
        setTimeout(() => navigate("/librarian-login"), 2000); // Redirect to /librarian-login
      } else {
        setError(err.response?.data?.message || "An error occurred while checking out the book.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Check Out Book</h2>
      <form onSubmit={handleCheckOut}>
        <label>Student Reg. Number:</label>
        <input type="text" value={studentRegNumber} onChange={(e) => setStudentRegNumber(e.target.value)} required />
        <label>Book ISBN:</label>
        <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
        <label>Due Date:</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Check Out"}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <button className="back-btn" onClick={() => navigate("/")}>Back to Dashboard</button>
    </div>
  );
};

export default CheckOut;