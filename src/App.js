import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SuperAdminLogin from "./components/SuperAdminLogin";
import CheckOut from "./components/checkOut";
import RegisterStudent from "./components/RegisterStudent";
import SearchPatron from "./components/SearchPatron";
import Cataloging from "./components/cataloging";
import BookManagement from "./components/BookManagement";
import BookList from "./components/BookList";
import Circulation from "./components/circulation";
import CheckIn from "./components/CheckIn"; // Import CheckIn component
import FineManagement from "./components/FineManagement";
import Renew from "./components/Renew"; // ✅ Import the Renew Component 
import CirculationReports from "./components/CirculationReports";
import Acquisition from "./components/Acquisition";
import ClassificationCategories from "./components/ClassificationCategories";


import { FaBook, FaSearch, FaChartBar, FaBoxOpen, FaInfoCircle, FaUserPlus, FaUser } from "react-icons/fa";

import logo from "./logo.jpg";
import "./App.css"; // Ensure global CSS is imported

const menuItems = [
  { name: "Circulation", icon: <FaBook />, path: "/circulation" },
  { name: "Cataloging", icon: <FaSearch />, path: "/cataloging" },
  { name: "Acquisitions", icon: <FaBoxOpen />, path: "/acquisitions" },
  { name: "Reports", icon: <FaChartBar />, path: "/reports" },
  { name: "Advanced Search", icon: <FaSearch />, path: "/search" },
  { name: "Item Search", icon: <FaSearch />, path: "/item-search" },
  { name: "About", icon: <FaInfoCircle />, path: "/about" },
  { name: "Register Student", icon: <FaUserPlus />, path: "/register-student" },
  { name: "Search Patron", icon: <FaUser />, path: "/search-patron" },
];

// the Header
const Header = ({ navigate }) => {
  const handleLogout = () => {
    localStorage.removeItem("superAdminToken"); // Remove the token
    navigate("/super-admin-login"); // Redirect to login page
  };
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Library Logo" className="logo" />
        <h1>UOE Library</h1>
      </div>
      <div className="buttons">
        <button onClick={() => navigate("/checkout")}>Check Out</button>
        <button onClick={() => navigate("/checkin")}>Check In</button>
        <button onClick={() => navigate("/renew")}>Renew</button>
        <button onClick={() => navigate("/search-patron")}>Search Patrons</button>
        <button>Search Catalog</button>
        <button onClick={handleLogout} className="logout-btn">Logout</button> {/* ✅ Add Logout Button */}
      </div>
    </header>
  );
};

// ✅ Wraps pages to include the Header
const PageWrapper = ({ children }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Header navigate={navigate} />
      <div className="page-content">{children}</div>
    </div>
  );
};

// ✅ Ensure the dashboard has a proper layout
const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="main-content">
        {menuItems.map((item) => (
          <div key={item.name} className="grid-item" onClick={() => navigate(item.path)}>
            {item.icon} {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/super-admin-login" element={<SuperAdminLogin />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AdminDashboard />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <CheckOut />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-student"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <RegisterStudent />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-patron"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <SearchPatron />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cataloging"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Cataloging />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cataloging/book-management"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <BookManagement />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

<Route
          path="/cataloging/classification-categories"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <BookManagement />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-list"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <BookList />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
  path="/circulation"
  element={
    <ProtectedRoute>
      <PageWrapper>
        <Circulation />
      </PageWrapper>
    </ProtectedRoute>
  }
/>

<Route
  path="/checkin"
  element={
    <ProtectedRoute>
      <PageWrapper>
        <CheckIn />
      </PageWrapper>
    </ProtectedRoute>
  }
/>

<Route
          path="/fine-management"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <FineManagement />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

<Route
  path="/renew"
  element={
    <ProtectedRoute>
      <PageWrapper>
        <Renew />
      </PageWrapper>
    </ProtectedRoute>
  }
/>

<Route
  path="/reports/overdue-books"
  element={
    <ProtectedRoute>
      <PageWrapper>
        <CirculationReports reportType="overdue-books" />
      </PageWrapper>
    </ProtectedRoute>
  }
/>

<Route
  path="/reports/checked-out-books"
  element={
    <ProtectedRoute>
      <PageWrapper>
        <CirculationReports reportType="checked-out-books" />
      </PageWrapper>
    </ProtectedRoute>
  }
/>

<Route
  path="/reports/returned-books"
  element={
    <ProtectedRoute>
      <PageWrapper>
        <CirculationReports reportType="returned-books" />
      </PageWrapper>
    </ProtectedRoute>
  }
/>

<Route
  path="/reports/fine-collection"
  element={
    <ProtectedRoute>
      <PageWrapper>
        <CirculationReports reportType="fine-collection" />
      </PageWrapper>
    </ProtectedRoute>
  }
/>

<Route
  path="/acquisitions"
  element={
    <ProtectedRoute>
      <PageWrapper>
        <Acquisition />
      </PageWrapper>
    </ProtectedRoute>
  }
/>


      </Routes>
    </Router>
  );
};

export default App;
