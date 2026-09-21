//=============================================
// DATA KOLEKSI BUKU PERPUS
//=============================================
const KOLEKSI_BUKU = [
  { id: 1, judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: "Fiksi", stok: 3, rating: 4.8 },
  { id: 2, judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", kategori: "Fiksi", stok: 0, rating: 4.9 },
  { id: 3, judul: "Sapiens", penulis: "Yuval Noah Harari", kategori: "Sains", stok: 2, rating: 4.7 },
  { id: 4, judul: "Atomic Habits", penulis: "James Clear", kategori: "Non-fiksi", stok: 5, rating: 4.6 },
  { id: 5, judul: "Negeri 5 Menara", penulis: "Ahmad Fuadi", kategori: "Fiksi", stok: 1, rating: 4.5 },
  { id: 6, judul: "Deep Work", penulis: "Cal Newport", kategori: "Non-fiksi", stok: 0, rating: 4.4 },
  { id: 7, judul: "A Brief History of Time", penulis: "Stephen Hawking", kategori: "Sains", stok: 3, rating: 4.6 },
  { id: 8, judul: "Pulang", penulis: "Tere Liye", kategori: "Fiksi", stok: 2, rating: 4.3 }
];

// State Global untuk menyimpan status filter & pencarian
let stateFilter = {
  kategori: "Semua",
  keyword: ""
};

//=============================================
// UTILITY FUNCTIONS
//=============================================
// Ambil semua kategori unik dari koleksi
function ambilKategori(koleksi) {
  const kategoriSet = new Set(koleksi.map(b => b.kategori));
  return ["Semua", ...kategoriSet];
}

// Filter gabungan: Kategori DAN Kata Kunci Pencarian (Judul / Penulis)
function filterBuku(koleksi, kategori, keyword) {
  return koleksi.filter(buku => {
    // Check Kategori
    const matchKategori = kategori === "Semua" || buku.kategori === kategori;
    
    // Check Keyword (Judul atau Penulis, Case-Insensitive)
    const kataKunciClean = keyword.toLowerCase().trim();
    const matchJudul = buku.judul.toLowerCase().includes(kataKunciClean);
    const matchPenulis = buku.penulis.toLowerCase().includes(kataKunciClean);
    const matchKeyword = matchJudul || matchPenulis;

    return matchKategori && matchKeyword;
  });
}

//=============================================
// RENDER FUNCTIONS
//=============================================
function renderKartuBuku(buku) {
  const badgeStokKelas = buku.stok > 0 ? "badge-stok-tersedia" : "badge-stok-habis";
  const badgeStokTeks = buku.stok > 0 ? `${buku.stok} tersisa` : "Habis";

  return `
    <div class="kartu-buku">
      <h3 class="kartu-judul-buku">${buku.judul}</h3>
      <p class="kartu-penulis-buku">${buku.penulis}</p>
      <div class="kartu-meta">
        <span class="badge-kategori">${buku.kategori}</span>
        <span class="${badgeStokKelas}">${badgeStokTeks}</span>
        <span class="kartu-rating">★ ${buku.rating}</span>
      </div>
    </div>
  `;
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

function renderTombolFilter(kategori, aktif) {
  const kontainer = document.getElementById("tombol-filter");
  if (!kontainer) return;

  kontainer.innerHTML = kategori.map(kat => `
    <button
      class="tombol-filter ${kat === aktif ? "aktif" : ""}"
      data-kategori="${kat}"
    >
      ${kat}
    </button>
  `).join("");
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
      
      // Tampilkan/sembunyikan tombol hapus (✕)
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

// Fungsi helper untuk memproses pencarian & filter lalu memperbarui DOM
function perbaruiTampilan() {
  const hasilFilter = filterBuku(KOLEKSI_BUKU, stateFilter.kategori, stateFilter.keyword);
  renderDaftarBuku(hasilFilter);
}

//=============================================
// INISIALISASI
//=============================================
function inisialisasi() {
  const kategoriList = ambilKategori(KOLEKSI_BUKU);

  // Render awal
  renderTombolFilter(kategoriList, "Semua");
  renderDaftarBuku(KOLEKSI_BUKU);
  setupEvents(kategoriList);

  console.log("Perpus Filter & Pencarian siap");
}

// Jalankan saat DOM telah siap
document.addEventListener("DOMContentLoaded", inisialisasi);