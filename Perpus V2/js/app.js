//=============================================
// DATA KOLEKSI BUKU PERPUS
//=============================================
const KOLEKSI_BUKU = [
  { id: 1, judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: "Fiksi", stok: 3, rating: 4.8, favorit: false },
  { id: 2, judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", kategori: "Fiksi", stok: 0, rating: 4.9, favorit: false },
  { id: 3, judul: "Sapiens", penulis: "Yuval Noah Harari", kategori: "Sains", stok: 2, rating: 4.7, favorit: false },
  { id: 4, judul: "Atomic Habits", penulis: "James Clear", kategori: "Non-fiksi", stok: 5, rating: 4.6, favorit: false },
  { id: 5, judul: "Negeri 5 Menara", penulis: "Ahmad Fuadi", kategori: "Fiksi", stok: 1, rating: 4.5, favorit: false },
  { id: 6, judul: "Deep Work", penulis: "Cal Newport", kategori: "Non-fiksi", stok: 0, rating: 4.4, favorit: false },
  { id: 7, judul: "A Brief History of Time", penulis: "Stephen Hawking", kategori: "Sains", stok: 3, rating: 4.6, favorit: false },
  { id: 8, judul: "Pulang", penulis: "Tere Liye", kategori: "Fiksi", stok: 2, rating: 4.3, favorit: false }
];

// State aktif — copy dari data sumber, boleh dimodifikasi
let state = KOLEKSI_BUKU.map(buku => ({ ...buku }));

// State Global untuk menyimpan status filter & pencarian
let stateFilter = {
  kategori: "Semua",
  keyword: ""
};

function toggleFavorit(id) {
  state = state.map(buku =>
    buku.id === id ? { ...buku, favorit: !buku.favorit } : buku
  );
}

//=============================================
// UTILITY FUNCTIONS
//=============================================
function ambilKategori(koleksi) {
  const kategoriSet = new Set(koleksi.map(b => b.kategori));
  return ["Semua", ...kategoriSet];
}

function filterBuku(koleksi, kategori, keyword) {
  return koleksi.filter(buku => {
    const matchKategori = kategori === "Semua" || buku.kategori === kategori;
    const kataKunciClean = keyword.toLowerCase().trim();
    const matchJudul = buku.judul.toLowerCase().includes(kataKunciClean);
    const matchPenulis = buku.penulis.toLowerCase().includes(kataKunciClean);
    const matchKeyword = matchJudul || matchPenulis;

    return matchKategori && matchKeyword;
  });
}

// Fungsi helper untuk menghitung statistik data
function hitungStatistik(koleksi) {
  const total = koleksi.length;
  const tersedia = koleksi.filter(b => b.stok > 0).length;
  const habis = koleksi.filter(b => b.stok === 0).length;
  const totalRating = koleksi.reduce((acc, b) => acc + b.rating, 0);
  const rataRating = total > 0 ? totalRating / total : 0;

  return { total, tersedia, habis, rataRating };
}

//=============================================
// RENDER FUNCTIONS
//=============================================
function renderKartuBuku(buku) {
  const { id, judul, penulis, kategori, stok, rating, favorit } = buku;
  const tersedia = stok > 0;
  const kelasKartu = [
    "kartu-buku",
    tersedia ? "" : "habis",
    favorit ? "favorit" : ""
  ].filter(Boolean).join(" ");

  const badgeStokKelas = tersedia ? "badge badge-tersedia" : "badge badge-habis";
  const badgeStokTeks = tersedia ? `${stok} tersisa` : "Habis";
  const bintang = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  const ikonFavorit = favorit ? "❤️" : "🤍";
  const labelFavorit = favorit ? "Hapus dari favorit" : "Tambah ke favorit";

  return `
    <div class="${kelasKartu}" data-id="${id}">
      <div class="kartu-header">
        <h3 class="kartu-judul">${judul}</h3>
        <button
          class="tombol-favorit ${favorit ? "aktif" : ""}"
          data-id="${id}"
          title="${labelFavorit}"
          aria-label="${labelFavorit}"
        >${ikonFavorit}</button>
      </div>
      <p class="kartu-penulis">${penulis}</p>
      <div class="kartu-footer">
        <span class="badge badge-kategori">${kategori}</span>
        <span class="${badgeStokKelas}">${badgeStokTeks}</span>
        <span class="kartu-rating" title="${rating}/5">${bintang} ${rating}</span>
      </div>
    </div>
  `;
}

function renderKartuStatistik(data) {
  return `
    <div class="kartu-statistik warna-${data.warna}">
      <span class="angka-statistik">${data.angka}</span>
      <span class="label-statistik">${data.label}</span>
    </div>
  `;
}

function renderStatistik(koleksi) {
  const kontainer = document.getElementById("ringkasan-statistik");
  if (!kontainer) return;

  const { total, tersedia, habis, rataRating } = hitungStatistik(koleksi);
  const jumlahFavorit = koleksi.filter(b => b.favorit).length;

  const kartuData = [
    { angka: total, label: "Total Buku", warna: "biru" },
    { angka: tersedia, label: "Tersedia", warna: "hijau" },
    { angka: habis, label: "Habis", warna: "merah" },
    { angka: rataRating.toFixed(1), label: "Rata-rata ★", warna: "kuning" },
    { angka: jumlahFavorit, label: "Favorit ❤️", warna: "biru" }
  ];

  kontainer.innerHTML = kartuData.map(renderKartuStatistik).join("");
}

function renderDaftarBuku(koleksi) {
  const kontainer = document.getElementById("kontainer-buku");
  const infoJumlah = document.getElementById("info-jumlah");

  if (!kontainer) return;

  if (koleksi.length === 0) {
    kontainer.innerHTML = `
      <div class="pesan-kosong">
        <span class="pesan-kosong-ikon">📭</span>
        <p>Tidak ada buku yang sesuai dengan pencarian/kategori ini</p>
      </div>
    `;
    if (infoJumlah) infoJumlah.textContent = "0 buku ditemukan";
    return;
  }

  kontainer.innerHTML = koleksi.map(renderKartuBuku).join("");
  if (infoJumlah) infoJumlah.textContent = `Menampilkan ${koleksi.length} buku`;
}

function renderTombolFilter(kategoriList, aktif) {
  const kontainer = document.getElementById("tombol-filter");
  if (!kontainer) return;

  kontainer.innerHTML = kategoriList.map(kat => `
    <button
      class="tombol-filter ${kat === aktif ? "aktif" : ""}"
      data-kategori="${kat}"
    >
      ${kat}
    </button>
  `).join("");
}

// Perbarui tampilan dengan memperhitungkan status filter & favorit
function perbaruiTampilan() {
  const hasilFilter = filterBuku(state, stateFilter.kategori, stateFilter.keyword);
  renderDaftarBuku(hasilFilter);
  renderStatistik(state);
}

function hapusSemuaFavorit() {
  state = state.map(buku => ({ ...buku, favorit: false }));
  perbaruiTampilan();
}

//=============================================
// EVENT HANDLING
//=============================================
function setupEvents(kategoriList) {
  const kontainerFilter = document.getElementById("tombol-filter");
  const inputSearch = document.getElementById("input-search");
  const tombolHapusSearch = document.getElementById("tombol-hapus-search");

  // 1. Event Klik Tombol Kategori
  if (kontainerFilter) {
    kontainerFilter.addEventListener("click", function(event) {
      const tombol = event.target.closest(".tombol-filter");
      if (!tombol) return;

      stateFilter.kategori = tombol.dataset.kategori;
      renderTombolFilter(kategoriList, stateFilter.kategori);
      perbaruiTampilan();
    });
  }

  // 2. Event Ketik pada Input Pencarian
  if (inputSearch) {
    inputSearch.addEventListener("input", function(event) {
      stateFilter.keyword = event.target.value;

      if (tombolHapusSearch) {
        tombolHapusSearch.style.display = stateFilter.keyword ? "block" : "none";
      }

      perbaruiTampilan();
    });
  }

  // 3. Event Klik Tombol Hapus Search (✕)
  if (tombolHapusSearch && inputSearch) {
    tombolHapusSearch.addEventListener("click", function() {
      inputSearch.value = "";
      stateFilter.keyword = "";
      tombolHapusSearch.style.display = "none";
      inputSearch.focus();
      perbaruiTampilan();
    });
  }
}

function setupEventFavorit() {
  const kontainer = document.getElementById("kontainer-buku");
  if (!kontainer) return;

  kontainer.addEventListener("click", function(event) {
    const tombol = event.target.closest(".tombol-favorit");
    if (!tombol) return;

    const id = Number(tombol.dataset.id);
    toggleFavorit(id);
    perbaruiTampilan();
  });
}

//=============================================
// INISIALISASI
//=============================================
function inisialisasi() {
  const kategoriList = ambilKategori(state);

  renderTombolFilter(kategoriList, stateFilter.kategori);
  setupEvents(kategoriList);
  setupEventFavorit();
  perbaruiTampilan();

  console.log(`Perpus siap — ${state.length} buku dimuat`);
}

// Jalankan saat DOM telah siap
document.addEventListener("DOMContentLoaded", inisialisasi);