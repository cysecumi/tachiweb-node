const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { requireLogin } = require('../middleware/authMiddleware');

router.get('/feedback', requireLogin, (req, res) => feedbackController.renderFeedback(req, res));
router.get('/feedback.php', requireLogin, (req, res) => feedbackController.renderFeedback(req, res));

router.post('/feedback', requireLogin, (req, res) => feedbackController.handleCreateFeedback(req, res));
router.post('/actions/tambah_feedback.php', requireLogin, (req, res) => feedbackController.handleCreateFeedback(req, res));

module.exports = router;
