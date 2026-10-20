import { storage } from '../services/storageService.js';

export const renderReader = (req, res) => {
  const id_komik = parseInt(req.query.id, 10) || 0;
  const ch_num = parseInt(req.query.ch, 10) || 1;

  if (req.session.status === 'login' && req.session.id_user > 0) {
    storage.recordReadingProgress(req.session.id_user, id_komik, ch_num);
  }

  const komik = storage.getKomikList().find(k => k.id_komik === id_komik);
  const chapter = storage.getChapters().find(c => c.id_komik === id_komik && c.nomor_chapter === ch_num);

  let halaman_komik = [];
  if (chapter) {
    halaman_komik = storage.getHalamanList()
      .filter(h => h.id_chapter === chapter.id_chapter)
      .sort((a, b) => a.nomor_halaman - b.nomor_halaman)
      .map(h => h.url_gambar);
  }

  const cek_prev = storage.getChapters().some(c => c.id_komik === id_komik && c.nomor_chapter === ch_num - 1);
  const cek_next = storage.getChapters().some(c => c.id_komik === id_komik && c.nomor_chapter === ch_num + 1);

  res.render('baca', {
    id_komik,
    ch_num,
    komik,
    chapter,
    halaman_komik,
    cek_prev,
    cek_next
  });
};
