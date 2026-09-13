# Undangan Pernikahan Digital — Rangga & Kirana

Website undangan pernikahan digital, single-page, responsive, dan siap
di-deploy ke GitHub Pages tanpa server sendiri.

Panduan ini ditulis untuk **non-programmer**. Anda hanya perlu mengedit
beberapa bagian yang ditandai jelas, tanpa perlu memahami keseluruhan kode.

```
wedding-invitation/
├── index.html                  ← struktur halaman
├── style.css                   ← tampilan & warna
├── script.js                   ← data pernikahan (weddingConfig) & interaksi
├── README.md                   ← panduan ini
├── google-apps-script/
│   └── Code.gs                 ← backend RSVP & ucapan (Google Sheets)
└── assets/
    ├── images/                 ← foto-foto undangan
    ├── music/                  ← musik latar
    └── icons/                  ← favicon (opsional)
```

---

## 1. Cara Mengganti Nama Mempelai

Buka `script.js`, cari bagian paling atas bertuliskan:

```javascript
// ========================================
// EDIT DATA PERNIKAHAN DI BAGIAN INI
// ========================================
const weddingConfig = {
  groom: {
    name: "Rangga Ardiansyah",
    parents: "Bapak Hendra Wijaya & Ibu Susilawati",
    childOrder: "Putra pertama dari 2 bersaudara"
  },
  bride: { ... }
```

Ganti nilai di dalam tanda kutip `" "` sesuai data Anda.

Untuk nama besar di halaman **Cover** dan **Closing** (misalnya "Rangga" dan
"Kirana"), buka `index.html` dan cari teks tersebut langsung — cukup ganti
teksnya (ada di beberapa tempat: cover, hero, closing).

## 2. Cara Mengganti Tanggal

Di `script.js`, ubah baris:

```javascript
weddingDate: "2027-02-14T08:00:00+07:00",
```

Format wajib: `YYYY-MM-DDTHH:MM:00+07:00` (jangan ubah `+07:00`, itu adalah
zona waktu Asia/Jakarta yang dipakai countdown).

Juga sesuaikan tanggal yang tampil di teks (`ceremony.date`,
`reception.date`) dan di halaman Cover pada `index.html`.

## 3. Cara Mengganti Foto

Simpan foto Anda ke folder `assets/images/` dengan nama:

```
couple.jpg
groom.jpg
bride.jpg
og-image.jpg
```

Baca `assets/images/README.txt` untuk ukuran yang disarankan dan tips
kompresi supaya website tetap ringan.

## 4. Cara Mengganti Lokasi

Di `script.js`, ubah bagian `ceremony` dan `reception`:

```javascript
ceremony: {
  title: "Akad Nikah",
  day: "Minggu",
  date: "14 Februari 2027",
  time: "08.00 – 10.00 WIB",
  venue: "Kediaman Mempelai Wanita",
  address: "Jl. Melati No. 21, Depok, Jawa Barat",
  mapsUrl: "..."
},
```

## 5. Cara Mengganti Google Maps

1. Buka [Google Maps](https://maps.google.com), cari lokasi acara Anda.
2. Klik **Share / Bagikan** → **Copy link**.
3. Tempel link tersebut ke `mapsUrl` pada `ceremony` atau `reception` di
   `script.js`.

## 6. Cara Mengatur Countdown

Countdown otomatis mengikuti `weddingDate` pada `script.js` (lihat poin 2).
Tidak ada pengaturan lain yang perlu diubah — begitu tanggal diganti,
countdown otomatis menghitung ulang.

## 7. Cara Membuat Google Sheet

1. Buka [Google Sheets](https://sheets.google.com), buat spreadsheet baru.
2. Beri nama, misalnya "RSVP Pernikahan Rangga & Kirana".
3. Anda tidak perlu membuat sheet/kolom secara manual — script akan
   membuatnya otomatis saat data pertama masuk. Tapi jika ingin
   menyiapkannya sendiri, buat 2 sheet (tab) berikut:

**Sheet "RSVP"**

| Timestamp | Nama | Status Kehadiran | Jumlah Tamu |
|---|---|---|---|

**Sheet "Wishes"**

| Timestamp | Nama | Ucapan |
|---|---|---|

## 8. Cara Membuat Google Apps Script

1. Di spreadsheet yang baru dibuat, klik menu **Extensions** →
   **Apps Script**.
2. Hapus kode default yang ada, lalu salin-tempel seluruh isi file
   `google-apps-script/Code.gs` dari project ini.
3. Klik ikon **Save** (disket).

## 9. Cara Deploy Apps Script sebagai Web App

1. Di editor Apps Script, klik **Deploy** → **New deployment**.
2. Klik ikon gerigi ⚙️ di samping "Select type", pilih **Web app**.
3. Isi:
   - **Description**: `Wedding RSVP API` (bebas)
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Klik **Deploy**.
5. Google akan meminta izin (permission) — klik **Authorize access**,
   pilih akun Google Anda, lalu klik **Advanced** → **Go to (nama
   project) (unsafe)** → **Allow**. Ini normal karena script ini milik
   Anda sendiri.
6. Setelah berhasil, Anda akan mendapatkan **Web App URL** seperti:
   ```
   https://script.google.com/macros/s/XXXXXXXXXXXX/exec
   ```
7. Salin URL tersebut.

> Catatan keamanan: URL ini hanya bisa menerima data yang dikirim
> (menulis baris baru) — ia tidak mengekspos isi spreadsheet Anda ke
> publik, dan tidak ada API key rahasia yang perlu disimpan di frontend.

## 10. Cara Menghubungkan RSVP & Buku Tamu

Buka `script.js`, cari:

```javascript
googleScriptUrl: "YOUR_GOOGLE_APPS_SCRIPT_URL",
```

Ganti dengan Web App URL dari langkah 9. Baik form RSVP maupun form
Ucapan menggunakan URL yang sama — Apps Script otomatis membedakan
tujuan berdasarkan `action` (`rsvp` atau `wish`) yang dikirim dari
website.

### Cara testing RSVP

1. Buka website Anda, isi form RSVP, klik **Kirim Konfirmasi**.
2. Buka Google Sheet Anda, sheet **RSVP** akan bertambah satu baris baru.
3. Jika muncul pesan error di website, cek kembali apakah
   `googleScriptUrl` sudah benar dan deployment sudah "Anyone" access.

### Cara testing ucapan

1. Isi form **Ucapan & Doa**, klik **Kirim Ucapan**.
2. Sheet **Wishes** akan bertambah satu baris baru.
3. Ucapan yang berhasil dikirim juga langsung muncul sebagai kartu di
   halaman (hanya untuk sesi kunjungan itu — lihat catatan di bawah).

### Catatan tentang menampilkan ucapan tamu lain secara publik

Karena GitHub Pages adalah hosting statis dan Apps Script Web App tidak
dirancang untuk query publik yang aman tanpa proteksi tambahan, website
ini **tidak** mengambil daftar ucapan langsung dari Google Sheets secara
realtime ke semua pengunjung. Ini dilakukan agar tidak perlu membuka
akses baca spreadsheet ke publik.

Jika Anda tetap ingin menampilkan ucapan dari semua tamu secara publik,
ada dua opsi yang lebih aman dibanding membuka akses penuh:
- Tambahkan fungsi `doGet` khusus di `Code.gs` yang **hanya**
  mengembalikan kolom Nama & Ucapan (tanpa data sensitif), lalu panggil
  dari `script.js` menggunakan `fetch()`.
- Atau, secara berkala salin ucapan favorit dari spreadsheet ke dalam
  daftar statis di `index.html` (bagian `#wishesList`) sebelum
  membagikan ulang link undangan.

### Tentang CORS

Google Apps Script Web App tidak selalu mengirim header CORS standar
untuk permintaan `fetch()` dari domain lain (seperti GitHub Pages).
Untuk menghindari masalah ini, `script.js` mengirim data dengan header
`Content-Type: text/plain`, yang menghindari "preflight request" CORS
yang sering diblokir. Jika Anda tetap mengalami error terkait CORS,
pastikan deployment Apps Script sudah diatur ke **Anyone** access dan
gunakan versi deployment terbaru (redeploy setiap kali mengubah kode).

## 11. Cara Deploy ke GitHub Pages

### Langkah 1 — Buat repository

Buat repository baru di GitHub, misalnya bernama `wedding-invitation`.

### Langkah 2 — Upload file

Upload seluruh isi folder project ini (`index.html`, `style.css`,
`script.js`, folder `assets/`, dst.) ke repository tersebut.

### Langkah 3 — Buka pengaturan Pages

Masuk ke repository → **Settings** → **Pages**.

### Langkah 4 — Aktifkan deployment

- **Source**: `Deploy from a branch`
- **Branch**: `main`
- **Folder**: `/ (root)`

Klik **Save**.

### Langkah 5 — Akses website

Setelah beberapa menit, website dapat diakses melalui:

```
https://USERNAME.github.io/wedding-invitation/
```

> Ganti `USERNAME` dengan username GitHub Anda, dan `wedding-invitation`
> dengan nama repository Anda jika berbeda.

## 12. Cara Menggunakan Nama Tamu Melalui URL

Tambahkan parameter `?to=` di akhir URL undangan, contoh:

```
https://USERNAME.github.io/wedding-invitation/?to=Bapak%20Budi
```

Spasi pada nama ditulis sebagai `%20`. Website akan otomatis menampilkan:

```
Kepada Yth.
Bapak/Ibu/Saudara/i
Bapak Budi
```

Jika parameter `to` tidak disertakan, hanya baris umum "Bapak/Ibu/
Saudara/i" yang tampil. Nama tamu ditampilkan menggunakan `textContent`
di JavaScript sehingga aman dari serangan HTML/script injection.

## 13. Cara Mengganti Musik

Simpan file musik ke `assets/music/wedding-music.mp3` (nama file harus
sama persis). Lihat `assets/music/README.txt` untuk tips ukuran file dan
hak cipta lagu.

## 14. Cara Mengganti Warna

Buka `style.css`, cari bagian paling atas:

```css
:root {
  --color-ink: #2f3a2f;
  --color-ivory: #faf7f1;
  --color-sage: #7c8863;
  --color-gold: #b3945f;
  ...
}
```

Ganti kode warna (`#......`) sesuai selera. Semua elemen di halaman akan
otomatis mengikuti warna baru ini karena seluruh CSS merujuk ke variabel
ini, bukan warna yang ditulis berulang-ulang.

## 15. Cara Mengganti Font

Masih di bagian atas `style.css`:

```css
--font-display: 'Cormorant Garamond', 'Times New Roman', serif;
--font-body: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
```

Jika ingin memakai font Google Fonts lain:

1. Buka [fonts.google.com](https://fonts.google.com), pilih font, salin
   tag `<link>`-nya.
2. Ganti tag `<link>` Google Fonts yang ada di `index.html` (di dalam
   `<head>`) dengan yang baru.
3. Ganti nama font pada `--font-display` / `--font-body` di atas agar
   sesuai dengan nama font baru.

---

## Ringkasan Fitur

- Single-page, scroll vertikal: Cover → Ayat Al-Qur'an → Profil Mempelai
  → Detail Acara → Countdown → RSVP → Buku Tamu → Hadiah → Closing.
- Nama tamu personal lewat URL (`?to=Nama`), aman dari XSS.
- Countdown real-time (Asia/Jakarta, UTC+7).
- Tombol Google Maps per lokasi acara.
- RSVP & Buku Tamu terhubung ke Google Sheets lewat Google Apps Script,
  tanpa server sendiri dan tanpa API key di frontend.
- Musik latar dengan tombol ON/OFF (menghormati kebijakan autoplay
  browser).
- Tombol bagikan ke WhatsApp.
- Responsive penuh dari 320px hingga layar desktop besar, tanpa
  horizontal scroll.
- Mendukung `prefers-reduced-motion` untuk pengguna yang sensitif
  terhadap animasi.
- SEO dasar & Open Graph agar preview link rapi saat dibagikan.

## Kompatibilitas Browser

Diuji secara struktural untuk berjalan baik di Chrome, Firefox, Safari,
Edge, serta browser bawaan Android & iOS. Semua fitur menggunakan
HTML5/CSS3/JavaScript standar tanpa framework berat.

## Troubleshooting Singkat

| Masalah | Kemungkinan Penyebab |
|---|---|
| Musik tidak otomatis berbunyi | Wajar — browser modern memblokir autoplay. Tamu perlu menekan tombol musik atau "Buka Undangan". |
| RSVP/Ucapan gagal terkirim | `googleScriptUrl` belum diganti, atau deployment Apps Script belum "Anyone" access. |
| Nama tamu tidak muncul | Pastikan parameter URL ditulis `?to=Nama` (bukan `?nama=` atau lainnya). |
| Foto pecah/terpotong | Cek ukuran foto sesuai `assets/images/README.txt`, pastikan nama file sudah benar. |
