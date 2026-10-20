const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const { requireLogin } = require('../middleware/authMiddleware');

router.get('/library', requireLogin, (req, res) => libraryController.renderLibrary(req, res));
router.get('/library.php', requireLogin, (req, res) => libraryController.renderLibrary(req, res));

router.post('/library/tambah', requireLogin, (req, res) => libraryController.addToLibrary(req, res));
router.post('/actions/tambah_library.php', requireLogin, (req, res) => libraryController.addToLibrary(req, res));

router.post('/library/hapus', requireLogin, (req, res) => libraryController.removeFromLibrary(req, res));
router.post('/actions/hapus_library.php', requireLogin, (req, res) => libraryController.removeFromLibrary(req, res));

module.exports = router;
