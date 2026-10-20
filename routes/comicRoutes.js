const express = require('express');
const router = express.Router();
const comicController = require('../controllers/comicController');

// Home catalog
router.get('/', (req, res) => comicController.renderHome(req, res));
router.get('/index.php', (req, res) => comicController.renderHome(req, res));

// Comic detail
router.get('/detail/:id', (req, res) => comicController.renderDetail(req, res));
router.get('/detail.php', (req, res) => comicController.renderDetail(req, res));

// Comic reader
router.get('/baca/:id/:ch', (req, res) => comicController.renderReader(req, res));
router.get('/baca.php', (req, res) => comicController.renderReader(req, res));

module.exports = router;
