// models/Order.js  
const mongoose = require('mongoose');  

// Define the order schema  
const orderSchema = new mongoose.Schema({  
    title: {  
        type: String,  
        required: true,  
    },  
    author: {  
        type: String,  
        required: true,  
    },  
    quantity: {  
        type: Number,  
        required: true,  
    },  
    vendorId: {  
        type: mongoose.Schema.Types.ObjectId, // Assuming vendorId references another document  
        required: true,  
        ref: 'Vendor', // Adjust this line if your vendor model file has a different name  
    },  
    status: {  
        type: String,  
        default: 'Pending', // Default status when the order is created  
    },  
}, {  
    timestamps: true, // Automatically manage createdAt and updatedAt properties  
});  

// Export the order model  
module.exports = mongoose.model('Order', orderSchema);  