const db = require('../data/db');

class FeedbackService {
  getAllFeedback() {
    const query = `
      SELECT f.id_feedback, f.id_user, f.isi_feedback, f.tanggal,
             u.username, u.nama_panggilan
      FROM feedback f
      LEFT JOIN users u ON f.id_user = u.id_user
      ORDER BY f.id_feedback DESC
    `;
    return db.prepare(query).all();
  }

  addFeedback(userId, isi_feedback) {
    const uid = parseInt(userId, 10);
    const content = (isi_feedback || '').trim();
    if (!content || !uid) return false;

    const stmt = db.prepare(`
      INSERT INTO feedback (id_user, isi_feedback)
      VALUES (?, ?)
    `);

    stmt.run(uid, content);
    return true;
  }

  deleteFeedback(id) {
    const fId = parseInt(id, 10);
    if (!fId) return false;
    db.prepare('DELETE FROM feedback WHERE id_feedback = ?').run(fId);
    return true;
  }
}

module.exports = new FeedbackService();
