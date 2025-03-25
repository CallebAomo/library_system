const db = require('../config/db'); // Import the database configuration  

// Add a new catalog item  
exports.addCatalogItem = async (req, res) => {  
    const { title, author, classification, location } = req.body;  
    const catalogItem = {  
        title,  
        author,  
        classification,  
        location,  
    };  

    try {  
        const item = await db.CatalogItem.create(catalogItem); // Assuming CatalogItem is defined in db  
        res.status(201).json({ message: 'Catalog item added successfully', item });  
    } catch (error) {  
        res.status(500).json({ message: 'Error adding catalog item', error });  
    }  
};  

// Get all catalog items  
exports.getAllCatalogItems = async (req, res) => {  
    try {  
        const catalogItems = await db.CatalogItem.find();  
        res.status(200).json(catalogItems);  
    } catch (error) {  
        res.status(500).json({ message: 'Error retrieving catalog items', error });  
    }  
};  