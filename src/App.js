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
import Acquisition from "./components/Acquisition"; 
import NotFound from "./components/NotFound";

import { FaBook, FaSearch, FaChartBar, FaBoxOpen, FaInfoCircle, FaUserPlus, FaUser } from "react-icons/fa";  
import logo from "./logo.jpg";  
import "./App.css"; 

const menuItems = [  
  { name: "Circulation", icon: <FaBook />, path: "/checkout" },  
  { name: "Cataloging", icon: <FaSearch />, path: "/cataloging" },  
  { name: "Acquisitions", icon: <FaBoxOpen />, path: "/acquisitions" },  
  { name: "Reports", icon: <FaChartBar />, path: "/reports" },  
  { name: "Advanced Search", icon: <FaSearch />, path: "/search" },  
  { name: "Item Search", icon: <FaSearch />, path: "/item-search" },  
  { name: "About", icon: <FaInfoCircle />, path: "/about" },  
  { name: "Register Student", icon: <FaUserPlus />, path: "/register-student" },  
  { name: "Search Patron", icon: <FaUser />, path: "/search-patron" },  
];  

const Header = ({ navigate }) => {
  const handleLogout = () => {
    localStorage.removeItem("superAdminToken"); 
    navigate("/super-admin-login"); 
  };
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Library Logo" className="logo" />
        <h1>UOE Library</h1>
      </div>
      <div className="buttons">
        <button onClick={() => navigate("/checkout")}>Check Out</button>
        <button>Check In</button>
        <button>Renew</button>
        <button onClick={() => navigate("/search-patron")}>Search Patrons</button>
        <button>Search Catalog</button>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </header>
  );
};

const PageWrapper = ({ children }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Header navigate={navigate} />
      <div className="page-content">{children}</div>
    </div>
  );
};

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
          path="/acquisitions/*"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Acquisition />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
