const express = require('express');  
const router = express.Router();  
const { createUpdateBudget, getBudgets } = require('../controllers/budgetController');  

// Create or update budget  
router.post('/budgets', createUpdateBudget);  

// Get budget details  
router.get('/budgets', getBudgets);  

module.exports = router;  