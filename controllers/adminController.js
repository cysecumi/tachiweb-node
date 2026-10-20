const comicService = require('../services/comicService');
const userService = require('../services/userService');
const feedbackService = require('../services/feedbackService');

class AdminController {
  renderDashboard(req, res) {
    const comics = comicService.getAllComics();
    const users = userService.getAllUsersExceptAdmin();
    const feedbackList = feedbackService.getAllFeedback();
    const pesan = req.query.pesan || '';

    res.render('admin', {
      title: 'Dashboard Admin - TachiWeb',
      comics,
      users,
      feedbackList,
      pesan
    });
  }

  renderEditComic(req, res) {
    const comicId = parseInt(req.params.id || req.query.id, 10);
    const comic = comicService.getComicById(comicId);

    if (!comic) {
      return res.redirect('/admin');
    }

    res.render('edit_komik', {
      title: 'Edit Komik - TachiWeb',
      data: comic
    });
  }

  renderManageChapter(req, res) {
    const comicId = parseInt(req.params.id || req.query.id, 10);
    const comic = comicService.getComicById(comicId);

    if (!comic) {
      return res.redirect('/admin');
    }

    const rawChapters = comicService.getChaptersByComicId(comicId);
    const chapters = rawChapters.map(c => {
      const pages = comicService.getPagesByChapterId(c.id_chapter);
      return {
        ...c,
        jumlah_halaman: pages.length
      };
    });

    const nomorSaran = comicService.getNextChapterNumber(comicId);
    const pesan = req.query.pesan || '';

    res.render('kelola_chapter', {
      title: `Kelola Chapter - ${comic.judul} - TachiWeb`,
      komik: comic,
      chapters,
      nomor_saran: nomorSaran,
      pesan
    });
  }

  handleAddComic(req, res) {
    const { judul, author, sumber, status, tipe, genre, sinopsis } = req.body;

    let coverUrl = 'https://placehold.co/300x450/2c2c2c/bb86fc?text=No+Cover';
    if (req.file) {
      coverUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.cover_url && req.body.cover_url.trim()) {
      coverUrl = req.body.cover_url.trim();
    }

    comicService.addComic({
      judul: (judul || '').trim(),
      author: (author || '').trim(),
      sumber: (sumber || '').trim(),
      status: status || 'Ongoing',
      tipe: tipe || 'Manga',
      genre: (genre || '').trim(),
      cover: coverUrl,
      sinopsis: (sinopsis || '').trim()
    });

    res.redirect('/admin?pesan=tambah_sukses');
  }

  handleEditComic(req, res) {
    const comicId = parseInt(req.body.id_komik || req.params.id, 10);
    const { judul, author, sumber, status, tipe, genre, sinopsis } = req.body;

    let coverUrl;
    if (req.file) {
      coverUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.cover_url && req.body.cover_url.trim()) {
      coverUrl = req.body.cover_url.trim();
    }

    comicService.updateComic(comicId, {
      judul: (judul || '').trim(),
      author: (author || '').trim(),
      sumber: (sumber || '').trim(),
      status: status || 'Ongoing',
      tipe: tipe || 'Manga',
      genre: (genre || '').trim(),
      cover: coverUrl,
      sinopsis: (sinopsis || '').trim()
    });

    res.redirect('/admin?pesan=edit_sukses');
  }

  handleDeleteComic(req, res) {
    const comicId = parseInt(req.body.id_komik || req.query.id, 10);
    comicService.deleteComic(comicId);
    res.redirect('/admin?pesan=hapus_sukses');
  }

  handleAddChapter(req, res) {
    const comicId = parseInt(req.body.id_komik, 10);
    const nomor = parseInt(req.body.nomor_chapter, 10);
    const judul = (req.body.judul_chapter || '').trim();

    if (nomor < 1) {
      return res.redirect(`/admin/kelola-chapter/${comicId}?pesan=nomor_salah`);
    }

    // Collect pages from uploaded files or textarea URLs
    const pages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(f => {
        pages.push(`/uploads/${f.filename}`);
      });
    }

    // Also support manual image URL list (one per line)
    if (req.body.urls_halaman) {
      const urls = req.body.urls_halaman.split('\n').map(u => u.trim()).filter(Boolean);
      urls.forEach(u => pages.push(u));
    }

    if (pages.length === 0) {
      // Add default placeholder pages if none provided so chapter is immediately viewable
      pages.push(`https://placehold.co/800x1200/1e1e1e/bb86fc?text=Ch.${nomor}+Page+1`);
      pages.push(`https://placehold.co/800x1200/1e1e1e/bb86fc?text=Ch.${nomor}+Page+2`);
    }

    const result = comicService.addChapter({
      id_komik: comicId,
      nomor_chapter: nomor,
      judul_chapter: judul,
      pages
    });

    if (result.error) {
      return res.redirect(`/admin/kelola-chapter/${comicId}?pesan=${result.error}`);
    }

    res.redirect(`/admin/kelola-chapter/${comicId}?pesan=tambah_sukses`);
  }

  handleDeleteChapter(req, res) {
    const chapterId = parseInt(req.body.id_chapter, 10);
    const comicId = parseInt(req.body.id_komik, 10);

    comicService.deleteChapter(chapterId);
    res.redirect(`/admin/kelola-chapter/${comicId}?pesan=hapus_sukses`);
  }

  handleDeleteUser(req, res) {
    const userId = parseInt(req.body.id_user, 10);
    userService.deleteUser(userId);
    res.redirect('/admin?pesan=hapus_user_sukses');
  }

  handleResetUserPassword(req, res) {
    const userId = parseInt(req.body.id_user, 10);
    userService.resetPasswordByAdmin(userId, 'user123');
    res.redirect('/admin?pesan=reset_password_sukses');
  }

  handleToggleUserRole(req, res) {
    const userId = parseInt(req.body.id_user, 10);
    const newRole = req.body.role === 'admin' ? 'admin' : 'user';
    userService.updateRole(userId, newRole);
    res.redirect('/admin?pesan=ubah_role_sukses');
  }

  handleDeleteFeedback(req, res) {
    const feedbackId = parseInt(req.body.id_feedback, 10);
    feedbackService.deleteFeedback(feedbackId);
    res.redirect('/admin?pesan=hapus_feedback_sukses');
  }
}

module.exports = new AdminController();
