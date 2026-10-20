const comicService = require('../services/comicService');
const commentService = require('../services/commentService');
const libraryService = require('../services/libraryService');

class ComicController {
  renderHome(req, res) {
    const f_cari = (req.query.cari || '').trim();
    const f_status = (req.query.status || '').trim();
    const f_sumber = (req.query.sumber || '').trim();

    const komikList = comicService.getAllComics({ cari: f_cari, status: f_status, sumber: f_sumber });
    const daftar_sumber = comicService.getDistinctSources();

    res.render('index', {
      title: 'Halaman Utama - TachiWeb',
      komikList,
      jumlah_komik: komikList.length,
      f_cari,
      f_status,
      f_sumber,
      daftar_sumber
    });
  }

  renderDetail(req, res) {
    const comicId = parseInt(req.params.id || req.query.id, 10);
    const comic = comicService.getComicById(comicId);

    if (!comic) {
      return res.render('detail', {
        title: 'Komik Tidak Ditemukan - TachiWeb',
        data: {
          id_komik: 0,
          judul: 'Komik Tidak Ditemukan',
          author: 'Unknown',
          sumber: 'Asura',
          tipe: 'Manga',
          genre: '',
          cover: 'https://placehold.co/300x450/2c2c2c/bb86fc?text=Not+Found',
          sinopsis: 'Maaf, data komik ini tidak tersedia di database.'
        },
        chapters: [],
        total_chapter: 0,
        comments: [],
        inLibrary: false,
        pesan: req.query.pesan || '',
        status_action: req.query.status || ''
      });
    }

    const chapters = comicService.getChaptersByComicId(comicId);
    const comments = commentService.getCommentsByComicId(comicId);
    const userId = req.session.id_user || 0;
    const inLibrary = userId > 0 ? libraryService.isComicInLibrary(userId, comicId) : false;

    res.render('detail', {
      title: `${comic.judul} - TachiWeb`,
      data: comic,
      chapters,
      total_chapter: chapters.length,
      comments,
      inLibrary,
      pesan: req.query.pesan || '',
      status_action: req.query.status || ''
    });
  }

  renderReader(req, res) {
    const comicId = parseInt(req.params.id || req.query.id, 10);
    const chNum = parseInt(req.params.ch || req.query.ch || 1, 10);

    const comic = comicService.getComicById(comicId);
    const judul_komik = comic ? comic.judul : 'Komik';

    const chapter = comicService.getChapter(comicId, chNum);
    const chapters = comicService.getChaptersByComicId(comicId);
    const pages = chapter ? comicService.getPagesByChapterId(chapter.id_chapter) : [];

    // Save reading history if logged in
    const userId = req.session.id_user || 0;
    if (req.session.status === 'login' && userId > 0 && comicId > 0 && chNum > 0) {
      libraryService.updateReadingHistory(userId, comicId, chNum);
    }

    const hasPrev = comicService.hasPrevChapter(comicId, chNum);
    const hasNext = comicService.hasNextChapter(comicId, chNum);

    res.render('baca', {
      title: `Baca ${judul_komik} - Ch. ${chNum} - TachiWeb`,
      id_komik: comicId,
      ch_num: chNum,
      judul_komik,
      chapter,
      chapters,
      pages,
      hasPrev,
      hasNext
    });
  }
}

module.exports = new ComicController();
