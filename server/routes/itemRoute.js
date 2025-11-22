const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const auth = require('../middleware/auth');

// Get all items
router.get('/', itemController.getAllItems);

// Get item by ID
router.get('/:id', itemController.getItemById);

// Create item (authenticated)
router.post('/', auth, itemController.createItem);

// Update item (authenticated)
router.put('/:id', auth, itemController.updateItem);

// Delete item (authenticated)
router.delete('/:id', auth, itemController.deleteItem);

module.exports = router;
