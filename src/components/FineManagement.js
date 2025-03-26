import { useState, useEffect } from "react";
import axios from "axios";
import "./FineManagement.css";

const FineManagement = () => {
  const [fines, setFines] = useState([]);
  const [searchRegNumber, setSearchRegNumber] = useState("");
  const [filteredFines, setFilteredFines] = useState([]);
  const [loadingFineId, setLoadingFineId] = useState(null); // Track loading state per fine ID

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fines/unpaid");
      setFines(response.data);
      setFilteredFines(response.data);
    } catch (error) {
      console.error("❌ Error fetching fines:", error.response?.data || error.message);
    }
  };

  const handleSearch = () => {
    if (searchRegNumber.trim() === "") {
      setFilteredFines(fines);
    } else {
      const filtered = fines.filter((fine) =>
        fine.reg_number.toLowerCase().includes(searchRegNumber.toLowerCase())
      );
      setFilteredFines(filtered);
    }
  };

  const markAsPaid = async (fineId) => {
    try {
      setLoadingFineId(fineId);
      await axios.put(`http://localhost:5000/api/fines/pay/${fineId}`);
      fetchFines();
    } catch (error) {
      console.error("❌ Error marking fine as paid:", error.response?.data || error.message);
    } finally {
      setLoadingFineId(null);
    }
  };

  return (
    <div className="fine-management">
      <h2>Fine Management</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Reg Number"
          value={searchRegNumber}
          onChange={(e) => setSearchRegNumber(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Fine List Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Reg Number</th>
              <th>Book Title</th>
              <th>Due Date</th>
              <th>Fine Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFines.length > 0 ? (
              filteredFines.map((fine) => (
                <tr key={fine.id}>
                  <td>{fine.student_name}</td>
                  <td>{fine.reg_number}</td>
                  <td>{fine.book_title}</td>
                  <td>{new Date(fine.due_date).toLocaleDateString("en-GB")}</td>
                  <td>₦{parseFloat(fine.fine_amount).toFixed(2)}</td>
                  <td>
                    <button
                      className="pay-button"
                      onClick={() => markAsPaid(fine.id)}
                      disabled={loadingFineId === fine.id}
                    >
                      {loadingFineId === fine.id ? "Processing..." : "Mark as Paid"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No unpaid fines found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FineManagement;
