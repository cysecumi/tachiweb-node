const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { requireLogin } = require('../middleware/authMiddleware');

router.post('/komentar/tambah', requireLogin, (req, res) => commentController.handleAddComment(req, res));
router.post('/actions/tambah_komentar.php', requireLogin, (req, res) => commentController.handleAddComment(req, res));

router.post('/komentar/hapus', requireLogin, (req, res) => commentController.handleDeleteComment(req, res));
router.post('/actions/hapus_komentar.php', requireLogin, (req, res) => commentController.handleDeleteComment(req, res));

module.exports = router;
