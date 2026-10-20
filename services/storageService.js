import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const dbFilePath = path.join(dataDir, 'db.json');

// Initial seed data from original db_komik
const initialSeed = {
  users: [
    {
      id_user: 5,
      username: 'admin',
      role: 'admin',
      password: '$2y$10$lvn6.xquUKOIWNYGN0w3VuPbpWJE2I71dPrNRPq6tyo8G/nVyLLyS',
      nama_panggilan: 'Administrator',
      pesan_notifikasi: ''
    },
    {
      id_user: 6,
      username: 'sunna',
      role: 'member',
      password: '$2y$12$d5c277EERDbgWS158PmnTOPog08a8VKnqbqmbTeVK1/V7upVyySzu',
      nama_panggilan: 'una',
      pesan_notifikasi: ''
    },
    {
      id_user: 7,
      username: 'cyse',
      role: 'member',
      password: '$2y$12$lBCOZUhg5.0OdnWQA5KW4OMeqJq7PqpzoTuUhv5bzCLWyAxk1bH6y',
      nama_panggilan: 'cumi',
      pesan_notifikasi: ''
    }
  ],
  komikList: [
    {
      id_komik: 1,
      judul: 'Sunna x',
      author: 'Cyse',
      sumber: 'Asura',
      status: 'Completed',
      cover: 'assets/1792317708_48729.jpg',
      sinopsis: 'Sunna X adalah gadis malang yang diselamatkan raja suki.',
      tipe: 'Manga',
      genre: 'Fantasy, Romance'
    },
    {
      id_komik: 2,
      judul: 'Mybini',
      author: 'Unknown',
      sumber: 'SUKI',
      status: 'Ongoing',
      cover: 'assets/imgwa.jpeg',
      sinopsis: 'Admin ternyata seorang SUKI',
      tipe: 'Manhwa',
      genre: 'Comedy'
    },
    {
      id_komik: 3,
      judul: 'Omniscient Readers Viewpoint',
      author: 'Asura',
      sumber: 'Asura',
      status: 'Ongoing',
      cover: 'https://placehold.co/300x450/2c2c2c/bb86fc?text=ORV',
      sinopsis: 'Sinopsis komik Omniscient Readers Viewpoint.',
      tipe: 'Manhwa',
      genre: 'Action, Adventure, Fantasy'
    },
    {
      id_komik: 4,
      judul: 'Jujutsu Kaisen',
      author: 'Gege Akutami',
      sumber: 'MangaPlus',
      status: 'Ongoing',
      cover: 'https://placehold.co/300x450/2c2c2c/bb86fc?text=Jujutsu+Kaisen',
      sinopsis: 'Kisah pertarungan para penyihir jujutsu melawan kutukan.',
      tipe: 'Manga',
      genre: 'Action, Supernatural'
    },
    {
      id_komik: 5,
      judul: 'asa made sugoi',
      author: 'clesta',
      sumber: 'SUKI',
      status: 'Completed',
      cover: 'assets/1792300263_WhatsApp Image 2026-10-14 at 13.31.35 (1).jpeg',
      sinopsis: 'cicak cicak didinding ',
      tipe: 'Manga',
      genre: 'Comedy'
    }
  ],
  chapters: [
    { id_chapter: 1, id_komik: 1, nomor_chapter: 1, judul_chapter: 'Awal Pertemuan', tanggal_rilis: '2026-10-18 05:16:56' },
    { id_chapter: 2, id_komik: 1, nomor_chapter: 2, judul_chapter: 'Kekuatan Baru', tanggal_rilis: '2026-10-18 05:16:56' },
    { id_chapter: 3, id_komik: 3, nomor_chapter: 1, judul_chapter: 'wewe', tanggal_rilis: '2026-10-18 15:41:50' }
  ],
  halamanList: [
    { id_halaman: 1, id_chapter: 1, nomor_halaman: 1, url_gambar: 'https://i.pinimg.com/736x/60/81/50/6081501cc88e46b69be37378907a130d.jpg' },
    { id_halaman: 2, id_chapter: 1, nomor_halaman: 2, url_gambar: 'https://i.pinimg.com/736x/11/2b/87/112b875a54e2893e0bf1151a8c840338.jpg' },
    { id_halaman: 3, id_chapter: 1, nomor_halaman: 3, url_gambar: 'https://i.pinimg.com/736x/c8/96/0d/c8960d3ee850a620fd6f125e441b2213.jpg' },
    { id_halaman: 4, id_chapter: 2, nomor_halaman: 1, url_gambar: 'https://i.pinimg.com/736x/60/81/50/6081501cc88e46b69be37378907a130d.jpg' },
    { id_halaman: 5, id_chapter: 2, nomor_halaman: 2, url_gambar: 'https://placehold.co/800x1200/1e1e1e/bb86fc?text=Sunna+x+-+Ch.2+Hal.2' },
    { id_halaman: 6, id_chapter: 3, nomor_halaman: 1, url_gambar: 'https://placehold.co/800x1200/1e1e1e/bb86fc?text=ORV+Ch.1+Hal.1' }
  ],
  libraryList: [
    { id_library: 3, id_user: 2, id_komik: 2, judul_komik: 'Mybini', sumber: 'Asura', cover: 'assets/imgwa.jpeg', category: 'reading', added_at: '2026-10-18T05:00:00.000Z' },
    { id_library: 10, id_user: 2, id_komik: 1, judul_komik: 'Sunna x', sumber: 'Asura', cover: 'assets/Coversunna.jpeg', category: 'favorite', added_at: '2026-10-18T06:00:00.000Z' },
    { id_library: 11, id_user: 5, id_komik: 1, judul_komik: 'Sunna x', sumber: 'Asura', cover: 'assets/1792317708_48729.jpg', category: 'reading', added_at: '2026-10-18T07:00:00.000Z' },
    { id_library: 12, id_user: 7, id_komik: 2, judul_komik: 'Mybini', sumber: 'SUKI', cover: 'assets/imgwa.jpeg', category: 'favorite', added_at: '2026-10-18T08:00:00.000Z' },
    { id_library: 13, id_user: 7, id_komik: 1, judul_komik: 'Sunna x', sumber: 'Asura', cover: 'assets/1792317708_48729.jpg', category: 'reading', added_at: '2026-10-18T09:00:00.000Z' }
  ],
  riwayatBaca: [
    { id_user: 7, id_komik: 1, last_chapter: 2, updated_at: '2026-10-18T10:00:00.000Z' },
    { id_user: 5, id_komik: 1, last_chapter: 1, updated_at: '2026-10-18T10:00:00.000Z' }
  ],
  komentarList: [
    { id_komentar: 1, id_komik: 1, id_user: 6, isi_komentar: 'Ceritanya seru banget, ditunggu chapter selanjutnya min!', waktu: '2026-10-18 10:20:00' },
    { id_komentar: 2, id_komik: 1, id_user: 7, isi_komentar: 'Artnya keren abis!', waktu: '2026-10-18 12:45:00' }
  ],
  feedbackList: [
    { id_feedback: 1, id_user: 7, isi_feedback: 'Fitur baca sangat lancar! Mohon tambah koleksi manhwa terbaru.', waktu: '2026-10-18 16:00:00' }
  ],
  nextIds: {
    user: 8,
    komik: 6,
    chapter: 4,
    halaman: 7,
    library: 14,
    komentar: 3,
    feedback: 2
  }
};

class StorageService {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(dbFilePath)) {
      try {
        const fileContent = fs.readFileSync(dbFilePath, 'utf-8');
        this.data = JSON.parse(fileContent);
        // Ensure all collections exist
        if (!this.data.users) this.data.users = [...initialSeed.users];
        if (!this.data.libraryList) this.data.libraryList = [];
        if (!this.data.riwayatBaca) this.data.riwayatBaca = [];
        if (!this.data.nextIds) this.data.nextIds = { ...initialSeed.nextIds };
        
        // Ensure every user has a role assigned in the database
        this.data.users.forEach(u => {
          if (!u.role) {
            u.role = u.username.toLowerCase() === 'admin' ? 'admin' : 'member';
          }
        });
      } catch (err) {
        console.error('Failed to parse database file, restoring seed:', err);
        this.data = JSON.parse(JSON.stringify(initialSeed));
        this.persist();
      }
    } else {
      this.data = JSON.parse(JSON.stringify(initialSeed));
      this.persist();
    }
  }

  persist() {
    try {
      const tempPath = dbFilePath + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, dbFilePath);
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  // --- User Database Methods ---
  getUserById(id) {
    if (!id) return null;
    return this.data.users.find(u => u.id_user === Number(id)) || null;
  }

  getUserByUsername(username) {
    if (!username) return null;
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  }

  updateUserRole(userId, newRole) {
    const user = this.getUserById(userId);
    if (user) {
      user.role = newRole;
      this.persist();
      return user;
    }
    return null;
  }

  // --- Library Methods ---
  getLibraryByUser(userId) {
    const list = this.data.libraryList.filter(item => item.id_user === Number(userId));
    return list.map(item => {
      const history = this.data.riwayatBaca.find(r => r.id_user === Number(userId) && r.id_komik === item.id_komik);
      const komik = this.data.komikList.find(k => k.id_komik === item.id_komik);
      const totalChapters = this.data.chapters.filter(c => c.id_komik === item.id_komik).length;
      return {
        ...item,
        last_chapter: history ? history.last_chapter : null,
        total_chapters: totalChapters,
        author: komik ? komik.author : '',
        status: komik ? komik.status : 'Ongoing',
        tipe: komik ? komik.tipe : 'Manga',
        genre: komik ? komik.genre : ''
      };
    });
  }

  hasInLibrary(userId, idKomik) {
    return this.data.libraryList.some(item => item.id_user === Number(userId) && item.id_komik === Number(idKomik));
  }

  getLibraryItem(userId, idKomik) {
    return this.data.libraryList.find(item => item.id_user === Number(userId) && item.id_komik === Number(idKomik));
  }

  addToLibrary(userId, { id_komik, judul_komik, sumber, cover, category = 'reading' }) {
    const existing = this.data.libraryList.find(item => item.id_user === Number(userId) && item.id_komik === Number(id_komik));
    if (existing) {
      existing.category = category || existing.category || 'reading';
      existing.updated_at = new Date().toISOString();
      this.persist();
      return { item: existing, added: false };
    }

    const newItem = {
      id_library: this.data.nextIds.library++,
      id_user: Number(userId),
      id_komik: Number(id_komik),
      judul_komik: judul_komik || 'Komik',
      sumber: sumber || 'Asura',
      cover: cover || 'https://placehold.co/300x450/2c2c2c/bb86fc?text=No+Cover',
      category: category || 'reading',
      added_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.libraryList.push(newItem);
    this.persist();
    return { item: newItem, added: true };
  }

  updateLibraryCategory(userId, idLibrary, newCategory) {
    const item = this.data.libraryList.find(l => l.id_library === Number(idLibrary) && l.id_user === Number(userId));
    if (item) {
      item.category = newCategory;
      item.updated_at = new Date().toISOString();
      this.persist();
      return item;
    }
    return null;
  }

  removeFromLibrary(userId, idLibrary) {
    const idx = this.data.libraryList.findIndex(l => l.id_library === Number(idLibrary) && l.id_user === Number(userId));
    if (idx !== -1) {
      const removed = this.data.libraryList.splice(idx, 1)[0];
      this.persist();
      return removed;
    }
    return null;
  }

  removeFromLibraryByComic(userId, idKomik) {
    const idx = this.data.libraryList.findIndex(l => l.id_komik === Number(idKomik) && l.id_user === Number(userId));
    if (idx !== -1) {
      const removed = this.data.libraryList.splice(idx, 1)[0];
      this.persist();
      return removed;
    }
    return null;
  }

  // --- Reading Progress ---
  recordReadingProgress(userId, idKomik, chapterNum) {
    if (!userId || userId <= 0) return;
    const existing = this.data.riwayatBaca.find(r => r.id_user === Number(userId) && r.id_komik === Number(idKomik));
    if (existing) {
      existing.last_chapter = Number(chapterNum);
      existing.updated_at = new Date().toISOString();
    } else {
      this.data.riwayatBaca.push({
        id_user: Number(userId),
        id_komik: Number(idKomik),
        last_chapter: Number(chapterNum),
        updated_at: new Date().toISOString()
      });
    }
    this.persist();
  }

  getLastReadChapter(userId, idKomik) {
    const item = this.data.riwayatBaca.find(r => r.id_user === Number(userId) && r.id_komik === Number(idKomik));
    return item ? item.last_chapter : null;
  }

  // --- General Accessors ---
  getUsers() { return this.data.users; }
  getKomikList() { return this.data.komikList; }
  getChapters() { return this.data.chapters; }
  getHalamanList() { return this.data.halamanList; }
  getKomentarList() { return this.data.komentarList; }
  getFeedbackList() { return this.data.feedbackList; }
  getNextIds() { return this.data.nextIds; }
}

export const storage = new StorageService();
