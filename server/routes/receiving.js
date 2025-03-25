// routes/receiving.js  
const express = require('express');  
const router = express.Router();  
const receivingController = require('../controllers/receivingController');  

router.post('/receive-item', receivingController.receiveItem);  
router.get('/received-items', receivingController.getReceivedItems);  

module.exports = router;  