const Vendor = require('../models/Vendor'); // Vendor model  

// Add a new vendor  
exports.addVendor = async (req, res) => {  
    const { name, contactInfo } = req.body;  
    const newVendor = new Vendor({ name, contactInfo });  

    try {  
        await newVendor.save();  
        res.status(201).json({ message: 'Vendor added successfully', vendor: newVendor });  
    } catch (error) {  
        res.status(500).json({ message: 'Error adding vendor', error });  
    }  
};  

// Get all vendors  
exports.getAllVendors = async (req, res) => {  
    try {  
        const vendors = await Vendor.find();  
        res.status(200).json(vendors);  
    } catch (error) {  
        res.status(500).json({ message: 'Error retrieving vendors', error });  
    }  
};  