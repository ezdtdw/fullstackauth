const { Item, User } = require('../models');
const { Op } = require('sequelize');
//testing

// Get all items with optional search
exports.getAllItems = async (req, res) => {
    try {
        const { search } = req.query;
        let options = {};

        if (search) {
            options.where = {
                name: {
                    [Op.like]: `%${search}%`
                }
            };
        }

        const items = await Item.findAll(options);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get item by ID
exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findByPk(id);
        
        if (!item) {
            return res.status(404).json({ message: 'Item tidak ditemukan' });
        }
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create item
exports.createItem = async (req, res) => {
    try {
        const { name, stock } = req.body;

        if (!name || stock === undefined) {
            return res.status(400).json({ message: 'Nama dan stok harus diisi' });
        }

        const item = await Item.create({ name, stock });

        res.status(201).json({
            message: 'Item berhasil dibuat',
            item
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update item
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, stock } = req.body;

        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item tidak ditemukan' });
        }

        await item.update({ name, stock });

        res.json({
            message: 'Item berhasil diperbarui',
            item
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete item
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item tidak ditemukan' });
        }

        await item.destroy();

        res.json({ message: 'Item berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
