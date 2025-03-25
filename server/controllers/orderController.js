// src/controllers/orderController.js  
const Order = require('../models/Order'); // Import the Order model  

// Create a new order  
const createOrder = async (req, res) => {  
    try {  
        const { name } = req.body; // Extract the name from the request body  
        if (!name) {  
            return res.status(400).json({ error: 'Order name is required' }); // Validate input  
        }  

        const newOrder = new Order({ name }); // Create a new order instance  
        await newOrder.save(); // Save the order to the database  

        res.status(201).json({  
            id: newOrder._id, // Include the ID of the newly created order  
            name: newOrder.name,  
            status: newOrder.status, // Send back the status (default is 'Pending')  
            message: 'Order created successfully' // Provide a success message  
        });  
    } catch (error) {  
        console.error(error); // Log the error for debugging  
        res.status(500).json({ error: 'An error occurred while creating the order' }); // Handle server error  
    }  
};  

// Get all orders  
const getAllOrders = async (req, res) => {  
    try {  
        const orders = await Order.find(); // Fetch all orders from the database  
        if (orders.length === 0) {  
            return res.status(404).json({ message: 'No orders found' }); // Handle no orders case  
        }  

        // Format the response to include more detail if necessary  
        const formattedOrders = orders.map(order => ({  
            id: order._id,  
            name: order.name,  
            status: order.status,  
            createdAt: order.createdAt, // Assuming you have a createdAt field  
            updatedAt: order.updatedAt  // Assuming you have an updatedAt field  
        }));  

        res.json(formattedOrders); // Return the formatted orders as JSON  
    } catch (error) {  
        console.error(error); // Log the error for debugging  
        res.status(500).json({ error: 'An error occurred while retrieving orders' }); // Handle server error  
    }  
};  

module.exports = { createOrder, getAllOrders };  