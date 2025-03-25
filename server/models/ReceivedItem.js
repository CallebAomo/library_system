// models/ReceivedItem.js  
const mongoose = require('mongoose');  

// Define the received item schema  
const receivedItemSchema = new mongoose.Schema({  
    orderId: {  
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Order',  // Assuming there is an Order model  
        required: true, // Reference to an existing order  
    },  
    itemDetails: {  
        type: [{  
            name: {  
                type: String,  
                required: true, // Name of the item is required  
            },  
            quantity: {  
                type: Number,  
                required: true, // Quantity of the item received is required  
            },  
            description: {  
                type: String,  
                required: false, // Optional description of the item  
            },  
        }],  
        required: true, // Item details is required  
    },  
    dateReceived: {  
        type: Date,  
        default: Date.now, // Defaults to the current date if not provided  
    },  
}, {  
    timestamps: true, // Automatically manage createdAt and updatedAt fields  
});  

// Export the received item model  
module.exports = mongoose.model('ReceivedItem', receivedItemSchema);  