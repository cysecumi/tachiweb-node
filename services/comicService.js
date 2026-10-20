const db = require('../data/db');

class ComicService {
  getAllComics({ cari = '', status = '', sumber = '' } = {}) {
    let query = 'SELECT * FROM komik';
    const conditions = [];
    const params = [];

    if (cari) {
      conditions.push('(LOWER(judul) LIKE ? OR LOWER(author) LIKE ? OR LOWER(genre) LIKE ?)');
      const term = `%${cari.toLowerCase()}%`;
      params.push(term, term, term);
    }

    if (status) {
      conditions.push('LOWER(status) = LOWER(?)');
      params.push(status);
    }

    if (sumber) {
      conditions.push('LOWER(sumber) = LOWER(?)');
      params.push(sumber);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id_komik DESC';

    return db.prepare(query).all(...params);
  }

  getDistinctSources() {
    const rows = db.prepare("SELECT DISTINCT sumber FROM komik WHERE sumber IS NOT NULL AND sumber != '' ORDER BY sumber ASC").all();
    return rows.map(r => r.sumber);
  }

  getComicById(id) {
    const comicId = parseInt(id, 10);
    if (!comicId) return null;
    return db.prepare('SELECT * FROM komik WHERE id_komik = ?').get(comicId) || null;
  }

  getChaptersByComicId(comicId) {
    const id = parseInt(comicId, 10);
    if (!id) return [];
    return db.prepare('SELECT * FROM chapter WHERE id_komik = ? ORDER BY nomor_chapter DESC').all(id);
  }

  getChapter(comicId, chapterNum) {
    const cid = parseInt(comicId, 10);
    const num = parseInt(chapterNum, 10);
    return db.prepare('SELECT * FROM chapter WHERE id_komik = ? AND nomor_chapter = ?').get(cid, num) || null;
  }

  getPagesByChapterId(chapterId) {
    const id = parseInt(chapterId, 10);
    return db.prepare('SELECT * FROM halaman_komik WHERE id_chapter = ? ORDER BY nomor_halaman ASC').all(id);
  }

  hasPrevChapter(comicId, chapterNum) {
    const cid = parseInt(comicId, 10);
    const num = parseInt(chapterNum, 10) - 1;
    const row = db.prepare('SELECT id_chapter FROM chapter WHERE id_komik = ? AND nomor_chapter = ?').get(cid, num);
    return !!row;
  }

  hasNextChapter(comicId, chapterNum) {
    const cid = parseInt(comicId, 10);
    const num = parseInt(chapterNum, 10) + 1;
    const row = db.prepare('SELECT id_chapter FROM chapter WHERE id_komik = ? AND nomor_chapter = ?').get(cid, num);
    return !!row;
  }

  addComic({ judul, author, sumber, status, tipe = 'Manga', genre = '', cover, sinopsis }) {
    const stmt = db.prepare(`
      INSERT INTO komik (judul, author, sumber, status, tipe, genre, cover, sinopsis)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      judul,
      author,
      sumber,
      status || 'Ongoing',
      tipe || 'Manga',
      genre || '',
      cover || 'https://placehold.co/300x450/2c2c2c/bb86fc?text=No+Cover',
      sinopsis || ''
    );

    return this.getComicById(Number(result.lastInsertRowid));
  }

  updateComic(id, { judul, author, sumber, status, tipe, genre, cover, sinopsis }) {
    const comicId = parseInt(id, 10);
    const comic = this.getComicById(comicId);
    if (!comic) return null;

    const newJudul = judul !== undefined ? judul : comic.judul;
    const newAuthor = author !== undefined ? author : comic.author;
    const newSumber = sumber !== undefined ? sumber : comic.sumber;
    const newStatus = status !== undefined ? status : comic.status;
    const newTipe = tipe !== undefined ? tipe : comic.tipe;
    const newGenre = genre !== undefined ? genre : comic.genre;
    const newCover = cover !== undefined ? cover : comic.cover;
    const newSinopsis = sinopsis !== undefined ? sinopsis : comic.sinopsis;

    db.prepare(`
      UPDATE komik 
      SET judul = ?, author = ?, sumber = ?, status = ?, tipe = ?, genre = ?, cover = ?, sinopsis = ?
      WHERE id_komik = ?
    `).run(newJudul, newAuthor, newSumber, newStatus, newTipe, newGenre, newCover, newSinopsis, comicId);

    return this.getComicById(comicId);
  }

  deleteComic(id) {
    const comicId = parseInt(id, 10);
    db.prepare('DELETE FROM komik WHERE id_komik = ?').run(comicId);
    return true;
  }

  addChapter({ id_komik, nomor_chapter, judul_chapter, pages = [] }) {
    const cid = parseInt(id_komik, 10);
    const num = parseInt(nomor_chapter, 10);

    // Check if chapter number exists
    const exists = db.prepare('SELECT id_chapter FROM chapter WHERE id_komik = ? AND nomor_chapter = ?').get(cid, num);
    if (exists) return { error: 'nomor_kembar' };

    const insertCh = db.prepare(`
      INSERT INTO chapter (id_komik, nomor_chapter, judul_chapter)
      VALUES (?, ?, ?)
    `);

    const result = insertCh.run(cid, num, judul_chapter || '');
    const chapterId = Number(result.lastInsertRowid);

    const insertPage = db.prepare(`
      INSERT INTO halaman_komik (id_chapter, nomor_halaman, url_gambar)
      VALUES (?, ?, ?)
    `);

    pages.forEach((url, idx) => {
      insertPage.run(chapterId, idx + 1, url);
    });

    const chapter = db.prepare('SELECT * FROM chapter WHERE id_chapter = ?').get(chapterId);
    return { chapter };
  }

  deleteChapter(id_chapter) {
    const chId = parseInt(id_chapter, 10);
    db.prepare('DELETE FROM chapter WHERE id_chapter = ?').run(chId);
    return true;
  }

  getNextChapterNumber(comicId) {
    const cid = parseInt(comicId, 10);
    const row = db.prepare('SELECT COALESCE(MAX(nomor_chapter), 0) + 1 AS next_num FROM chapter WHERE id_komik = ?').get(cid);
    return row ? row.next_num : 1;
  }
}

module.exports = new ComicService();
