// models/Vendor.js  
const mongoose = require('mongoose');  

// Define the vendor schema  
const vendorSchema = new mongoose.Schema({  
    name: {  
        type: String,  
        required: true, // Name is required  
    },  
    contactInfo: {  
        type: String,  
        required: true, // Contact information is required  
    },  
    address: {  
        type: String,   // Optional: to store vendor address  
        required: false,  
    },  
    // Add more fields as needed (e.g., phone, email, etc.)  
}, {  
    timestamps: true, // Automatically manage createdAt and updatedAt properties  
});  

// Export the vendor model  
module.exports = mongoose.model('Vendor', vendorSchema);  