import { useState } from "react";
import axios from "axios";
import "./CheckInForm.css";

const CheckInForm = () => {
  const [isbn, setIsbn] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [message, setMessage] = useState(null);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setMessage(null);

    // ✅ Retrieve token
    const token = localStorage.getItem("superAdminToken");
    if (!token) {
      alert("Session expired. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/circulation/checkin",
        { isbn, reg_number: regNumber },
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Include token
        }
      );
      setMessage({ type: "success", text: response.data.message });
      setIsbn("");
      setRegNumber("");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "An error occurred." });
    }
  };

  return (
    <div className="checkin-form">
      <h3>Manual Check In</h3>
      {message && <p className={`message ${message.type}`}>{message.text}</p>}
      <form onSubmit={handleCheckIn}>
        <label>ISBN:</label>
        <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="Enter ISBN" required />
        <label>Student Registration Number:</label>
        <input type="text" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} placeholder="Enter Reg Number" required />
        <button type="submit">Check In</button>
      </form>
    </div>
  );
};

export default CheckInForm;
