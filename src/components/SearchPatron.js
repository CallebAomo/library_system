import React, { useState } from "react";

const SearchPatron = () => {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState(null); // Initially null (avoids "No students found" on first load)
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError(""); // Clear previous errors

    if (!query.trim()) {
      setStudents(null); // Don't fetch if the input is empty
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/search?query=${query}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setStudents(data); // ✅ Ensure we store an array
      } else {
        setStudents([]); // ✅ Prevent map() errors
      }
    } catch (error) {
      setError("Error fetching students. Please try again.");
      setStudents([]); // Prevent crash
    }
  };

  return (
    <div>
      <h2>Search Patron</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter name, reg number, or email"
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {students === null ? (
          <p>Enter a query to search for students</p> // Message before searching
        ) : students.length > 0 ? (
          students.map((student) => (
            <li key={student.id}>
              {student.name} ({student.reg_number}) - {student.email}
            </li>
          ))
        ) : (
          <p>No students found</p>
        )}
      </ul>
    </div>
  );
};

export default SearchPatron;
