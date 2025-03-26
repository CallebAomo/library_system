import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem("superAdminToken");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/api/auth/verify-token", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.valid) {
          setIsValid(true);
        } else {
          setIsValid(false);
          localStorage.removeItem("superAdminToken"); // Remove expired token
        }
      } catch (error) {
        setIsValid(false);
        localStorage.removeItem("superAdminToken");
      }
    };

    verifyToken();
  }, [token]);

  if (isValid === null) return <p>Loading...</p>; // Prevent flickering

  return isValid ? children : <Navigate to="/super-admin-login" />;
};

export default ProtectedRoute;
