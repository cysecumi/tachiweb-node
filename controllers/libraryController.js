const libraryService = require('../services/libraryService');
const comicService = require('../services/comicService');

class LibraryController {
  renderLibrary(req, res) {
    const userId = req.session.id_user;
    const libraryItems = libraryService.getUserLibrary(userId);

    res.render('library', {
      title: 'Library Saya - TachiWeb',
      libraryList: libraryItems,
      jumlah_lib: libraryItems.length
    });
  }

  addToLibrary(req, res) {
    const userId = req.session.id_user;
    const comicId = parseInt(req.body.id_asli || req.body.id_komik, 10);
    const comic = comicService.getComicById(comicId);

    const judul_komik = req.body.judul_komik || (comic ? comic.judul : 'Komik');
    const sumber_komik = req.body.sumber_komik || (comic ? comic.sumber : 'Aggregator');
    const cover_komik = req.body.cover_komik || (comic ? comic.cover : '');

    const result = libraryService.addToLibrary(userId, comicId, {
      judul_komik,
      sumber: sumber_komik,
      cover: cover_komik
    });

    res.redirect(`/detail/${comicId}?status=${result.status}`);
  }

  removeFromLibrary(req, res) {
    const userId = req.session.id_user;
    const comicId = parseInt(req.body.id_komik, 10);

    libraryService.removeFromLibrary(userId, comicId);

    const redirectUrl = req.body.redirect === 'library' ? '/library' : `/detail/${comicId}?status=hapus_sukses`;
    res.redirect(redirectUrl);
  }
}

module.exports = new LibraryController();
