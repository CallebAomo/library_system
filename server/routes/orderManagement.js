const express = require('express');  
const router = express.Router();  
const { createOrder, getAllOrders } = require('../controllers/orderController');  

// Create a new purchase order  
router.post('/orders', createOrder);  

// Get all orders  
router.get('/orders', getAllOrders);  

module.exports = router;  