const express = require("express");  
const cors = require("cors");  
const jwt = require("jsonwebtoken");  
require("dotenv").config();  
const db = require("./config/db");  
const circulationRoutes = require("./routes/circulationRoutes");  
const studentRoutes = require("./routes/studentRoutes");  
const bookRoutes = require("./routes/bookRoutes");  
const authRoutes = require("./routes/authRoutes"); // Import auth routes  
const orderManagement = require("./routes/orderManagement"); // Import order management routes  
const vendorManagement = require("./routes/vendorManagement"); // Import vendor management routes  
const budgetControl = require("./routes/budgetControl"); // Import budget control routes  
const receiving = require("./routes/receiving"); // Import receiving routes  
const invoicing = require("./routes/invoicing"); // Import invoicing routes  
const catalogIntegration = require("./routes/catalogIntegration"); // Import catalog integration routes  

const app = express();  
app.use(express.json());  
app.use(cors({  
    origin: "*", // Allows all devices (for now, update later for security)  
    methods: "GET, POST, PUT, DELETE",  
    allowedHeaders: "Content-Type, Authorization"  
}));  

const PORT = process.env.PORT || 5000;  

app.get("/", (req, res) => {  
    res.send("Library Management System Backend Running...");  
});  

app.use("/api/auth", authRoutes);  
app.use("/api/circulation", circulationRoutes);  
app.use("/api/students", studentRoutes);  
app.use("/api/books", bookRoutes);  

// Acquisition module routes  
app.use("/api/orders", orderManagement);  
app.use("/api/vendors", vendorManagement);  
app.use("/api/budgets", budgetControl);  
app.use("/api/receive", receiving);  
app.use("/api/invoices", invoicing);  
app.use("/api/catalog", catalogIntegration);  

// Define Acquisition sub-modules route  
app.get("/api/acquisition/submodules", (req, res) => {  
    const acquisitionSubModules = {  
        title: 'Acquisition',  
        subModules: [  
            'Budget Control',  
            'Order Management',  
            'Vendor Management',  
            'Receiving',  
            'Invoicing',  
            'Catalog Integration'  
        ]  
    };  
    res.json(acquisitionSubModules);  
});  

// ✅ Token Verification Route  
app.post("/api/auth/verify-token", (req, res) => {  
    const token = req.headers.authorization?.split(" ")[1];  

    if (!token) {  
        return res.status(401).json({ valid: false, message: "No token provided" });  
    }  

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {  
        if (err) {  
            return res.status(401).json({ valid: false, message: "Invalid or expired token" });  
        }  
        res.json({ valid: true, user: decoded });  
    });  
});  

app.listen(PORT, () => {  
    console.log(`🚀 Server running on port ${PORT}`);  
});  