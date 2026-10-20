const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${Date.now()}_${cleanName}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Admin Dashboard
router.get('/admin', requireAdmin, (req, res) => adminController.renderDashboard(req, res));
router.get('/admin.php', requireAdmin, (req, res) => adminController.renderDashboard(req, res));

// Comic Management
router.post('/admin/komik/tambah', requireAdmin, upload.single('cover'), (req, res) => adminController.handleAddComic(req, res));
router.post('/actions/tambah_komik.php', requireAdmin, upload.single('cover'), (req, res) => adminController.handleAddComic(req, res));

router.get('/admin/komik/edit/:id', requireAdmin, (req, res) => adminController.renderEditComic(req, res));
router.get('/edit_komik.php', requireAdmin, (req, res) => adminController.renderEditComic(req, res));
router.post('/admin/komik/edit', requireAdmin, upload.single('cover'), (req, res) => adminController.handleEditComic(req, res));
router.post('/actions/edit_komik.php', requireAdmin, upload.single('cover'), (req, res) => adminController.handleEditComic(req, res));

router.post('/admin/komik/hapus', requireAdmin, (req, res) => adminController.handleDeleteComic(req, res));
router.post('/actions/hapus_komik.php', requireAdmin, (req, res) => adminController.handleDeleteComic(req, res));

// Chapter Management
router.get('/admin/kelola-chapter/:id', requireAdmin, (req, res) => adminController.renderManageChapter(req, res));
router.get('/kelola_chapter.php', requireAdmin, (req, res) => adminController.renderManageChapter(req, res));

router.post('/admin/chapter/tambah', requireAdmin, upload.array('halaman', 30), (req, res) => adminController.handleAddChapter(req, res));
router.post('/actions/tambah_chapter.php', requireAdmin, upload.array('halaman', 30), (req, res) => adminController.handleAddChapter(req, res));

router.post('/admin/chapter/hapus', requireAdmin, (req, res) => adminController.handleDeleteChapter(req, res));
router.post('/actions/hapus_chapter.php', requireAdmin, (req, res) => adminController.handleDeleteChapter(req, res));

// User Management
router.post('/admin/user/hapus', requireAdmin, (req, res) => adminController.handleDeleteUser(req, res));
router.post('/actions/hapus_user.php', requireAdmin, (req, res) => adminController.handleDeleteUser(req, res));

router.post('/admin/user/reset-password', requireAdmin, (req, res) => adminController.handleResetUserPassword(req, res));
router.post('/actions/reset_password_user.php', requireAdmin, (req, res) => adminController.handleResetUserPassword(req, res));

router.post('/admin/user/role', requireAdmin, (req, res) => adminController.handleToggleUserRole(req, res));

// Feedback Management
router.post('/admin/feedback/hapus', requireAdmin, (req, res) => adminController.handleDeleteFeedback(req, res));
router.post('/actions/hapus_feedback.php', requireAdmin, (req, res) => adminController.handleDeleteFeedback(req, res));

module.exports = router;
