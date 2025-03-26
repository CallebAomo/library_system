import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CheckInForm from "./CheckInForm"; // Import the form component
import "./checkin.css";

const CheckIn = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBorrowedBooks = useCallback(async () => {
        try {
            const token = localStorage.getItem("superAdminToken"); // ✅ Use correct token key
            console.log("🔹 Retrieved Token:", token); // Debugging

            if (!token) {
                console.error("❌ No token found. Redirecting to login...");
                alert("Session expired. Please log in again.");
                navigate("/super-admin-login"); // Redirect to login if no token
                return;
            }

            const response = await axios.get("http://localhost:5000/api/circulation/borrowed-books", {
                headers: { Authorization: `Bearer ${token}` }, // ✅ Correct token usage
            });

            setBorrowedBooks(response.data);
        } catch (error) {
            console.error("❌ Error fetching borrowed books:", error.response?.data || error.message);
            alert("Failed to fetch borrowed books.");
        } finally {
            setLoading(false);
        }
    }, [navigate]); // ✅ Ensuring correct dependency handling

    useEffect(() => {
        fetchBorrowedBooks();
    }, [fetchBorrowedBooks]); // ✅ Fixed missing dependency warning

    const handleCheckIn = async (isbn, reg_number) => {  // Accept reg_number
        if (window.confirm("Are you sure you want to check in this book?")) {
            try {
                const token = localStorage.getItem("superAdminToken");
                if (!token) {
                    console.error("❌ No token found. Redirecting to login...");
                    alert("Session expired. Please log in again.");
                    navigate("/super-admin-login");
                    return;
                }
    
                console.log("🔹 Sending Check-In Request:", { isbn, reg_number }); // Debugging
    
                await axios.post(
                    "http://localhost:5000/api/circulation/checkin",
                    { isbn, reg_number }, // ✅ Include reg_number in request
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                alert("✅ Book checked in successfully!");
                fetchBorrowedBooks(); // Refresh book list
            } catch (error) {
                console.error("❌ Error checking in book:", error.response?.data || error.message);
                alert("⚠️ Failed to check in the book.");
            }
        }
    };
    

    return (
        <div className="checkin-container">
            <h2>Check In Books</h2>

            {/* Borrowed Books Table */}
            {loading ? (
                <p>Loading borrowed books...</p>
            ) : (
                <table className="checkin-table">
                    <thead>
                        <tr>
                            <th>ISBN</th>
                            <th>Title</th>
                            <th>Borrower</th>
                            <th>Due Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {borrowedBooks.map((book) => (
                            <tr key={book.id}>
                                <td>{book.isbn}</td>
                                <td>{book.title}</td>
                                <td>{book.reg_number}</td>
                                <td>{new Date(book.due_date).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        className="checkin-btn"
                                        onClick={() => handleCheckIn(book.isbn, book.reg_number)} // ✅ Pass reg_number
                                    >
                                    Check In
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Manual Check-In Form */}
            <CheckInForm />

            <button className="back-btn" onClick={() => navigate("/circulation")}>Back to Circulation</button>
        </div>
    );
};

export default CheckIn;
