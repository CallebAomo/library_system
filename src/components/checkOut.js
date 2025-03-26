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

  // Retrieve user details from localStorage
  const userId = localStorage.getItem("user_id");
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("superAdminToken"); // ✅ Fixed token key

  const handleCheckOut = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate inputs
    if (!studentRegNumber.trim() || !isbn.trim() || !dueDate.trim()) {
      setError("All fields are required.");
      return;
    }

    if (!userId || !userRole || !token) {
      setError("Authentication failed. Please log in again.");
      console.error("🚨 Missing Authentication Data:", { userId, userRole, token });
      return;
    }

    // Construct request payload
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
      setError(err.response?.data?.message || "An error occurred while checking out the book.");
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
