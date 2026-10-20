const db = require('../data/db');

class CommentService {
  getCommentsByComicId(comicId) {
    const cid = parseInt(comicId, 10);
    if (!cid) return [];

    const query = `
      SELECT k.id_komentar, k.id_komik, k.id_user, k.isi_komentar, k.tanggal,
             u.username, u.nama_panggilan
      FROM komentar k
      LEFT JOIN users u ON k.id_user = u.id_user
      WHERE k.id_komik = ?
      ORDER BY k.id_komentar DESC
    `;

    return db.prepare(query).all(cid);
  }

  addComment(comicId, userId, isi_komentar) {
    const cid = parseInt(comicId, 10);
    const uid = parseInt(userId, 10);
    const content = (isi_komentar || '').trim();

    if (!content || uid <= 0 || cid <= 0) return false;

    const stmt = db.prepare(`
      INSERT INTO komentar (id_komik, id_user, isi_komentar)
      VALUES (?, ?, ?)
    `);

    stmt.run(cid, uid, content);
    return true;
  }

  deleteComment(commentId, userId, isAdmin) {
    const cId = parseInt(commentId, 10);
    const uid = parseInt(userId, 10);
    if (!cId) return false;

    const comment = db.prepare('SELECT id_komentar, id_user FROM komentar WHERE id_komentar = ?').get(cId);
    if (!comment) return false;

    if (isAdmin || comment.id_user === uid) {
      db.prepare('DELETE FROM komentar WHERE id_komentar = ?').run(cId);
      return true;
    }

    return false;
  }
}

module.exports = new CommentService();
