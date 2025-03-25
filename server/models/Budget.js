// models/Budget.js  
const mongoose = require('mongoose');  

// Define the budget schema  
const budgetSchema = new mongoose.Schema({  
    category: {  
        type: String,  
        required: true, // Category is required  
    },  
    allocatedAmount: {  
        type: Number,  
        required: true, // Allocated amount is required  
    },  
    // You can add more fields as needed, such as:  
    spentAmount: {  
        type: Number,  
        default: 0, // Default to 0 if not provided  
    },  
    date: {  
        type: Date,  
        default: Date.now, // Default to current date  
    },  
}, {  
    timestamps: true, // Automatically manage createdAt and updatedAt properties  
});  

// Export the budget model  
module.exports = mongoose.model('Budget', budgetSchema);  