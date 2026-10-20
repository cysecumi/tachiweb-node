const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_DIR = path.join(__dirname);
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'tachiweb.sqlite');
const db = new DatabaseSync(DB_PATH);

// Enable WAL mode and foreign keys for high performance and integrity
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

// Initialize Tables
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id_user INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nama_panggilan TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS komik (
      id_komik INTEGER PRIMARY KEY AUTOINCREMENT,
      judul TEXT NOT NULL,
      author TEXT NOT NULL,
      sumber TEXT NOT NULL,
      status TEXT DEFAULT 'Ongoing',
      tipe TEXT DEFAULT 'Manga',
      genre TEXT DEFAULT '',
      cover TEXT NOT NULL,
      sinopsis TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chapter (
      id_chapter INTEGER PRIMARY KEY AUTOINCREMENT,
      id_komik INTEGER NOT NULL REFERENCES komik(id_komik) ON DELETE CASCADE,
      nomor_chapter INTEGER NOT NULL,
      judul_chapter TEXT DEFAULT '',
      tanggal_rilis DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(id_komik, nomor_chapter)
    );

    CREATE TABLE IF NOT EXISTS halaman_komik (
      id_halaman INTEGER PRIMARY KEY AUTOINCREMENT,
      id_chapter INTEGER NOT NULL REFERENCES chapter(id_chapter) ON DELETE CASCADE,
      nomor_halaman INTEGER NOT NULL,
      url_gambar TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS library (
      id_library INTEGER PRIMARY KEY AUTOINCREMENT,
      id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
      id_komik INTEGER NOT NULL REFERENCES komik(id_komik) ON DELETE CASCADE,
      judul_komik TEXT NOT NULL,
      sumber TEXT NOT NULL,
      cover TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(id_user, id_komik)
    );

    CREATE TABLE IF NOT EXISTS riwayat_baca (
      id_riwayat INTEGER PRIMARY KEY AUTOINCREMENT,
      id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
      id_komik INTEGER NOT NULL REFERENCES komik(id_komik) ON DELETE CASCADE,
      last_chapter INTEGER NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(id_user, id_komik)
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id_feedback INTEGER PRIMARY KEY AUTOINCREMENT,
      id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
      isi_feedback TEXT NOT NULL,
      tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS komentar (
      id_komentar INTEGER PRIMARY KEY AUTOINCREMENT,
      id_komik INTEGER NOT NULL REFERENCES komik(id_komik) ON DELETE CASCADE,
      id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
      isi_komentar TEXT NOT NULL,
      tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_chapter_comic ON chapter(id_komik);
    CREATE INDEX IF NOT EXISTS idx_pages_chapter ON halaman_komik(id_chapter);
    CREATE INDEX IF NOT EXISTS idx_library_user ON library(id_user);
    CREATE INDEX IF NOT EXISTS idx_komentar_comic ON komentar(id_komik);
  `);
}

// Seed initial dataset if database is newly initialized
function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id_user, username, password, nama_panggilan, role)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertUser.run(1, 'admin', bcrypt.hashSync('admin123', 10), 'Administrator', 'admin');
    insertUser.run(2, 'sunna', bcrypt.hashSync('sunna123', 10), 'una', 'user');
    insertUser.run(3, 'cyse', bcrypt.hashSync('cyse123', 10), 'cumi', 'user');

    const insertKomik = db.prepare(`
      INSERT INTO komik (id_komik, judul, author, sumber, status, tipe, genre, cover, sinopsis)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertKomik.run(1, 'Sunna x', 'Cyse', 'Asura', 'Completed', 'Manhwa', 'Action, Fantasy, Romance', '/assets/1792317708_48729.jpg', 'Sunna X adalah gadis malang yang diselamatkan raja suki dengan kekuatan misterius yang mengubah takdir dunia.');
    insertKomik.run(2, 'Mybini', 'Unknown', 'SUKI', 'Ongoing', 'Manga', 'Comedy, Slice of Life', '/assets/imgwa.jpeg', 'Admin ternyata seorang SUKI. Mengikuti kisah komedi sehari-hari penuh kekacauan dan tawa.');
    insertKomik.run(3, 'Omniscient Readers Viewpoint', 'Sing Shong', 'Asura', 'Ongoing', 'Manhwa', 'Action, Fantasy, Supernatural', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80', 'Dokja adalah satu-satunya pembaca novel web apokaliptik yang tiba-tiba menjadi kenyataan nyata di hadapannya.');
    insertKomik.run(4, 'Jujutsu Kaisen', 'Gege Akutami', 'MangaPlus', 'Ongoing', 'Manga', 'Action, Supernatural, School', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80', 'Kisah pertarungan sengit para penyihir jujutsu melawan roh kutukan jahat demi melindungi kedamaian manusia.');
    insertKomik.run(5, 'Asa Made Sugoi', 'Clesta', 'SUKI', 'Completed', 'Manga', 'Comedy, Romance', '/assets/1792300263_WhatsApp Image 2026-10-14 at 13.31.35 (1).jpeg', 'Cicak-cicak di dinding, kisah penuh keceriaan dan canda tawa di pagi hari hingga malam larut.');

    const insertChapter = db.prepare(`
      INSERT INTO chapter (id_chapter, id_komik, nomor_chapter, judul_chapter, tanggal_rilis)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertChapter.run(1, 1, 1, 'Awal Pertemuan', '2026-10-18 05:16:56');
    insertChapter.run(2, 1, 2, 'Kekuatan Baru', '2026-10-18 05:16:56');
    insertChapter.run(3, 3, 1, 'Dimulainya Akhir Dunia', '2026-10-18 15:41:50');
    insertChapter.run(4, 3, 2, 'Skenario Pertama', '2026-10-18 18:20:00');
    insertChapter.run(5, 2, 1, 'Kehidupan Si Admin', '2026-10-18 10:00:00');
    insertChapter.run(6, 4, 1, 'Kutukan Ryomen Sukuna', '2026-10-18 09:00:00');

    const insertPage = db.prepare(`
      INSERT INTO halaman_komik (id_halaman, id_chapter, nomor_halaman, url_gambar)
      VALUES (?, ?, ?, ?)
    `);

    insertPage.run(1, 1, 1, 'https://i.pinimg.com/736x/60/81/50/6081501cc88e46b69be37378907a130d.jpg');
    insertPage.run(2, 1, 2, 'https://i.pinimg.com/736x/11/2b/87/112b875a54e2893e0bf1151a8c840338.jpg');
    insertPage.run(3, 1, 3, 'https://i.pinimg.com/736x/c8/96/0d/c8960d3ee850a620fd6f125e441b2213.jpg');
    insertPage.run(4, 2, 1, 'https://i.pinimg.com/736x/60/81/50/6081501cc88e46b69be37378907a130d.jpg');
    insertPage.run(5, 2, 2, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80');
    insertPage.run(6, 2, 3, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80');
    insertPage.run(7, 3, 1, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&auto=format&fit=crop&q=80');
    insertPage.run(8, 3, 2, 'https://images.unsplash.com/photo-1563089145-599997674d42?w=900&auto=format&fit=crop&q=80');
    insertPage.run(9, 4, 1, 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80');
    insertPage.run(10, 5, 1, '/assets/imgwa.jpeg');
    insertPage.run(11, 6, 1, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&auto=format&fit=crop&q=80');

    const insertLibrary = db.prepare(`
      INSERT INTO library (id_user, id_komik, judul_komik, sumber, cover)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertLibrary.run(1, 1, 'Sunna x', 'Asura', '/assets/1792317708_48729.jpg');
    insertLibrary.run(1, 3, 'Omniscient Readers Viewpoint', 'Asura', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80');
    insertLibrary.run(3, 2, 'Mybini', 'SUKI', '/assets/imgwa.jpeg');
    insertLibrary.run(3, 1, 'Sunna x', 'Asura', '/assets/1792317708_48729.jpg');

    const insertRiwayat = db.prepare(`
      INSERT INTO riwayat_baca (id_user, id_komik, last_chapter)
      VALUES (?, ?, ?)
    `);

    insertRiwayat.run(1, 1, 2);
    insertRiwayat.run(1, 3, 1);
    insertRiwayat.run(3, 1, 1);

    const insertFeedback = db.prepare(`
      INSERT INTO feedback (id_user, isi_feedback, tanggal)
      VALUES (?, ?, ?)
    `);

    insertFeedback.run(3, 'Fitur dark mode dan pembaca manga vertikal sangat nyaman dibaca lewat HP! Tolong perbanyak chapter Omniscient Reader ya min.', '2026-10-18 19:30:00');

    const insertKomentar = db.prepare(`
      INSERT INTO komentar (id_komik, id_user, isi_komentar, tanggal)
      VALUES (?, ?, ?, ?)
    `);

    insertKomentar.run(1, 2, 'Ceritanya seru banget! Ditunggu kelanjutan Chapter 3 min 👍', '2026-10-18 20:15:00');
    insertKomentar.run(1, 1, 'Terima kasih dukungannya! Chapter baru akan diupdate setiap minggu.', '2026-10-18 21:00:00');
  }
}

initSchema();
seedDatabase();

module.exports = db;
