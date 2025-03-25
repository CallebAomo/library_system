// controllers/receivingController.js  
const ReceivedItem = require('../models/ReceivedItem');  

exports.receiveItem = async (req, res) => {  
    const { orderId, itemDetails } = req.body;  
    const receivedItem = new ReceivedItem({ orderId, itemDetails });  

    try {  
        await receivedItem.save();  
        res.status(201).json({ message: 'Item received successfully', item: receivedItem });  
    } catch (error) {  
        res.status(500).json({ message: 'Error receiving item', error });  
    }  
};  

exports.getReceivedItems = async (req, res) => {  
    try {  
        const items = await ReceivedItem.find();  
        res.status(200).json(items);  
    } catch (error) {  
        res.status(500).json({ message: 'Error retrieving received items', error });  
    }  
};  