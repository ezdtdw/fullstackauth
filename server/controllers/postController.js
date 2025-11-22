const { Post, User } = require('../models');
const { Op } = require('sequelize');

// Get all posts dengan search
exports.getAllPosts = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            where = {
                [Op.or]: [
                    { title: { [Op.like]: `%${search}%` } },
                    { content: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const posts = await Post.findAll({
            where,
            include: [{ model: User, attributes: ['id', 'username', 'email'] }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            message: 'Berhasil mengambil data posts',
            data: posts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get post by ID
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id, {
            include: [{ model: User, attributes: ['id', 'username', 'email'] }]
        });

        if (!post) {
            return res.status(404).json({ message: 'Post tidak ditemukan' });
        }

        res.status(200).json({
            message: 'Berhasil mengambil data post',
            data: post
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create post
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title dan content harus diisi' });
        }

        const post = await Post.create({
            title,
            content,
            userId
        });

        res.status(201).json({
            message: 'Post berhasil dibuat',
            data: post
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update post
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.user.id;

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ message: 'Post tidak ditemukan' });
        }

        if (post.userId !== userId) {
            return res.status(403).json({ message: 'Anda tidak berhak mengubah post ini' });
        }

        await post.update({ title, content });

        res.status(200).json({
            message: 'Post berhasil diperbarui',
            data: post
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ message: 'Post tidak ditemukan' });
        }

        if (post.userId !== userId) {
            return res.status(403).json({ message: 'Anda tidak berhak menghapus post ini' });
        }

        await post.destroy();

        res.status(200).json({ message: 'Post berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
