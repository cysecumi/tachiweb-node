const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const { initSession } = require('./middleware/authMiddleware');
const comicRoutes = require('./routes/comicRoutes');
const authRoutes = require('./routes/authRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Ensure required upload folders exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set EJS as View Engine (UI in views/)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'tachiweb_super_secret_session_key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

// Serve static assets and uploads
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attach session & user info
app.use(initSession);

// Mount Modular Routes (Logic in controllers/, services/, routes/)
app.use(comicRoutes);
app.use(authRoutes);
app.use(libraryRoutes);
app.use(adminRoutes);
app.use(feedbackRoutes);
app.use(commentRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).render('index', {
    title: 'Halaman Tidak Ditemukan - TachiWeb',
    komikList: [],
    jumlah_komik: 0,
    f_cari: '',
    f_status: '',
    f_sumber: '',
    daftar_sumber: []
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[TachiWeb Server Error]:', err);
  res.status(500).send('Terjadi kesalahan pada server TachiWeb: ' + err.message);
});

// Start Server on 0.0.0.0:3000
const server = app.listen(PORT, HOST, () => {
  console.log(`===============================================`);
  console.log(`  TachiWeb Server berjalan dengan sukses!`);
  console.log(`  URL: http://${HOST}:${PORT}`);
  console.log(`  Lingkungan: Node.js (Express + EJS)`);
  console.log(`===============================================`);
});

module.exports = { app, server };
