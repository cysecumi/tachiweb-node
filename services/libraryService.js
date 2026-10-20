const db = require('../data/db');

class LibraryService {
  getUserLibrary(userId) {
    const uid = parseInt(userId, 10);
    if (!uid) return [];

    const query = `
      SELECT l.id_library, l.id_user, l.id_komik, l.judul_komik, l.sumber, l.cover, l.created_at,
             r.last_chapter
      FROM library l
      LEFT JOIN riwayat_baca r ON l.id_komik = r.id_komik AND r.id_user = l.id_user
      WHERE l.id_user = ?
      ORDER BY l.id_library DESC
    `;

    return db.prepare(query).all(uid);
  }

  isComicInLibrary(userId, comicId) {
    const uid = parseInt(userId, 10);
    const cid = parseInt(comicId, 10);
    if (!uid || !cid) return false;

    const row = db.prepare('SELECT id_library FROM library WHERE id_user = ? AND id_komik = ?').get(uid, cid);
    return !!row;
  }

  addToLibrary(userId, comicId, { judul_komik, sumber, cover }) {
    const uid = parseInt(userId, 10);
    const cid = parseInt(comicId, 10);
    if (!uid || !cid) return { status: 'gagal' };

    if (this.isComicInLibrary(uid, cid)) {
      return { status: 'sudah_ada' };
    }

    const stmt = db.prepare(`
      INSERT INTO library (id_user, id_komik, judul_komik, sumber, cover)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(uid, cid, judul_komik, sumber, cover);
    return { status: 'sukses' };
  }

  removeFromLibrary(userId, comicId) {
    const uid = parseInt(userId, 10);
    const cid = parseInt(comicId, 10);
    if (!uid || !cid) return false;

    db.prepare('DELETE FROM library WHERE id_user = ? AND id_komik = ?').run(uid, cid);
    return true;
  }

  updateReadingHistory(userId, comicId, chapterNum) {
    const uid = parseInt(userId, 10);
    const cid = parseInt(comicId, 10);
    const num = parseInt(chapterNum, 10);

    if (uid <= 0 || cid <= 0 || num <= 0) return;

    const query = `
      INSERT INTO riwayat_baca (id_user, id_komik, last_chapter, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id_user, id_komik) DO UPDATE SET
        last_chapter = excluded.last_chapter,
        updated_at = CURRENT_TIMESTAMP
    `;

    db.prepare(query).run(uid, cid, num);
  }

  getReadingHistory(userId, comicId) {
    const uid = parseInt(userId, 10);
    const cid = parseInt(comicId, 10);
    if (!uid || !cid) return null;

    return db.prepare('SELECT * FROM riwayat_baca WHERE id_user = ? AND id_komik = ?').get(uid, cid) || null;
  }
}

module.exports = new LibraryService();
