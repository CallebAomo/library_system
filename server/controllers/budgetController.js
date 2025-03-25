const Budget = require('../models/Budget'); // Budget model  

// Create or update budget  
exports.createUpdateBudget = async (req, res) => {  
    const { category, allocatedAmount } = req.body;  
    const budget = await Budget.findOneAndUpdate(  
        { category },  
        { allocatedAmount },  
        { new: true, upsert: true }  
    );  

    res.status(200).json({ message: 'Budget updated successfully', budget });  
};  

// Get budget details  
exports.getBudgets = async (req, res) => {  
    try {  
        const budgets = await Budget.find();  
        res.status(200).json(budgets);  
    } catch (error) {  
        res.status(500).json({ message: 'Error retrieving budgets', error });  
    }  
};  