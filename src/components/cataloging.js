import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaTags, FaCopy, FaUpload, FaLayerGroup, FaUser, FaFileAlt, FaChartBar } from "react-icons/fa";
import "./cataloging.css"; // Ensure you have the corresponding CSS file for styling

const catalogingModules = [
  { name: "Book Management", icon: <FaBook />, path: "/cataloging/book-management" },
  { name: "Classification & Subjects", icon: <FaTags />, path: "/cataloging/classification" },
  { name: "Book Copies & Availability", icon: <FaCopy />, path: "/cataloging/book-copies" },
  { name: "Book Import & Bulk Upload", icon: <FaUpload />, path: "/cataloging/bulk-upload" },
  { name: "Book Categories & Genres", icon: <FaLayerGroup />, path: "/cataloging/categories" },
  { name: "Author & Publisher Management", icon: <FaUser />, path: "/cataloging/authors" },
  { name: "Lost & Damaged Books", icon: <FaFileAlt />, path: "/cataloging/lost-books" },
  { name: "Reports & Statistics", icon: <FaChartBar />, path: "/cataloging/reports" }
];

const Cataloging = () => {
  const navigate = useNavigate();

  return (
    <div className="cataloging-container">
      <h2>Cataloging</h2>
      <div className="cataloging-grid">
        {catalogingModules.map((module) => (
          <div key={module.name} className="cataloging-item" onClick={() => navigate(module.path)}>
            {module.icon} {module.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cataloging;