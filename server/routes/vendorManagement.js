const express = require('express');  
const router = express.Router();  
const { addVendor, getAllVendors } = require('../controllers/vendorController');  

// Add a new vendor  
router.post('/vendors', addVendor);  

// Get all vendors  
router.get('/vendors', getAllVendors);  

module.exports = router;  