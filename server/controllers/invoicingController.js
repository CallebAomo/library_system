const db = require('../config/db'); // Import the database configuration  

// Create an invoice  
exports.createInvoice = async (req, res) => {  
    const { orderId, amount, status } = req.body;  
    const newInvoice = {  
        orderId,  
        amount,  
        status,  
    };  

    try {  
        const invoice = await db.Invoice.create(newInvoice); // Assuming Invoice is defined in db  
        res.status(201).json({ message: 'Invoice created successfully', invoice });  
    } catch (error) {  
        res.status(500).json({ message: 'Error creating invoice', error });  
    }  
};  

// Get all invoices  
exports.getAllInvoices = async (req, res) => {  
    try {  
        const invoices = await db.Invoice.find();  
        res.status(200).json(invoices);  
    } catch (error) {  
        res.status(500).json({ message: 'Error retrieving invoices', error });  
    }  
};  