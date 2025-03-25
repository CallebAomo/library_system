const express = require('express');  
const router = express.Router();  
const { addCatalogItem, getAllCatalogItems } = require('../controllers/catalogController');  

// Add a new catalog item  
router.post('/catalog', addCatalogItem);  

// Get all catalog items  
router.get('/catalog', getAllCatalogItems);  

module.exports = router;  