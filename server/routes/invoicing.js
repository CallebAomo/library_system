const express = require('express');  
const router = express.Router();  
const { createInvoice, getAllInvoices } = require('../controllers/invoicingController');  

// Create an invoice  
router.post('/invoices', createInvoice);  

// Get all invoices  
router.get('/invoices', getAllInvoices);  

module.exports = router;  