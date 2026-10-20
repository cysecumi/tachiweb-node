const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireLogin } = require('../middleware/authMiddleware');

// Login
router.get('/login', (req, res) => authController.renderLogin(req, res));
router.get('/login.php', (req, res) => authController.renderLogin(req, res));
router.post('/login', (req, res) => authController.handleLogin(req, res));
router.post('/actions/cek_login.php', (req, res) => authController.handleLogin(req, res));

// Register
router.get('/register', (req, res) => authController.renderRegister(req, res));
router.get('/register.php', (req, res) => authController.renderRegister(req, res));
router.post('/register', (req, res) => authController.handleRegister(req, res));
router.post('/actions/simpan_register.php', (req, res) => authController.handleRegister(req, res));

// Logout
router.get('/logout', (req, res) => authController.handleLogout(req, res));
router.get('/logout.php', (req, res) => authController.handleLogout(req, res));

// Guest
router.get('/masuk-guest', (req, res) => authController.handleGuest(req, res));
router.get('/masuk_guest.php', (req, res) => authController.handleGuest(req, res));

// Settings
router.get('/pengaturan', requireLogin, (req, res) => authController.renderSettings(req, res));
router.get('/pengaturan.php', requireLogin, (req, res) => authController.renderSettings(req, res));
router.post('/pengaturan/profil', requireLogin, (req, res) => authController.handleUpdateProfile(req, res));
router.post('/actions/ubah_profil.php', requireLogin, (req, res) => authController.handleUpdateProfile(req, res));
router.post('/pengaturan/password', requireLogin, (req, res) => authController.handleUpdatePassword(req, res));
router.post('/actions/ubah_password.php', requireLogin, (req, res) => authController.handleUpdatePassword(req, res));

module.exports = router;
