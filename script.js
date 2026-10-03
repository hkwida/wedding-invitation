const weddingConfig = {
    // Tanggal Pernikahan (Sabtu, 12 Desember 2026 jam 16:00 WIB)
    targetDate: "2026-12-12T16:00:00+07:00",
    
    // Link Google Maps Sasono Mulyo Depok
    mapsUrl: "https://maps.app.goo.gl/PfyUT2oNVL5RQWBWA",
    
    // Paste URL Apps Script Web App kamu di sini (akhiran /exec)
    googleScriptUrl: "https://script.google.com/macros/s/AKfycbx.../exec" 
};

document.addEventListener("DOMContentLoaded", () => {
    initGuestName();
    initOpenButton();
    initCountdown();
    initMapsUrl();
    setupRsvpForm();
    setupWishesForm();
    loadWishesFromSheet();
});

// Ambil Nama Tamu dari Parameter URL (?to=Nama)
function initGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to');
    if (guestParam) {
        document.getElementById("guestName").textContent = guestParam;
        const rsvpNameInput = document.getElementById("rsvpName");
        const wishNameInput = document.getElementById("wishName");
        if (rsvpNameInput) rsvpNameInput.value = guestParam;
        if (wishNameInput) wishNameInput.value = guestParam;
    }
}

// Buka Undangan
function initOpenButton() {
    const openBtn = document.getElementById("openBtn");
    const cover = document.getElementById("cover");
    const mainContent = document.getElementById("mainContent");

    openBtn.addEventListener("click", () => {
        cover.classList.add("fade-out");
        setTimeout(() => {
            cover.style.display = "none";
            mainContent.classList.remove("hidden");
        }, 500);
    });
}

// Countdown Timer
function initCountdown() {
    const target = new Date(weddingConfig.targetDate).getTime();

    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = target - now;

        if (difference < 0) {
            clearInterval(timerInterval);
            document.getElementById("timer").innerHTML = "<p>Acara Telah Berlangsung</p>";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        Siap, Wida! Semua penyesuaian sudah diselesaikan:

1. **Hapus Gelar**: Gelar akademis `A.Md.` dan `A.Md.A.B.` sudah dihapus dari nama Erdwin maupun Wida.
2. **Hapus Musik / Lagu**: Elemen pemutar musik beserta tombol kontrolnya telah dihapus sepenuhnya dari HTML dan JavaScript.
3. **Koneksi Google Apps Script untuk Google Sheets**: Kode `script.js` dan `Code.gs` telah diperbarui untuk memastikan data RSVP dan Ucapan masuk ke Google Sheets (`RSVP Wida & Erdwin`) dengan aman dan lancar.

---

### 1. Update File `index.html`

Silakan **copy** seluruh isi kode di bawah ini lalu **paste & commit** ke file `index.html` di GitHub:

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Undangan Pernikahan Wida & Erdwin</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
    <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
    <link href="[https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap](https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap)" rel="stylesheet">
</head>
<body>

    <!-- COVER UNTUK TAMU -->
    <div id="cover" class="cover-overlay">
        <div class="cover-content">
            <p class="sub-title">The Wedding of</p>
            <h1>Wida & Erdwin</h1>
            <p class="guest-to">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <h2 id="guestName" class="guest-name">Tamu Undangan</h2>
            <button id="openBtn" class="btn-primary">Buka Undangan</button>
        </div>
    </div>

    <!-- MAIN CONTENT -->
    <main id="mainContent" class="main-content hidden">
        
        <!-- HERO SECTION -->
        <section class="hero">
            <p class="sub-title">WE ARE GETTING MARRIED</p>
            <h1>Wida & Erdwin</h1>
            <p class="date-hero">Sabtu, 12 Desember 2026</p>
        </section>

        <!-- QUOTE SECTION -->
        <section class="quote-section">
            <p class="arabic">وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِى ذَٰلِكَ لَءَايَٰتٍ لِّقَوْمٍ يَتَفَكَّرُونَ</p>
            <p class="translation">“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”</p>
            <p class="surah">(QS. Ar-Rum: 21)</p>
        </section>

        <!-- COUPLE SECTION (TANPA GELAR & TANPA FOTO) -->
        <section id="couples" class="couples-section">
            <h2>Mempelai</h2>
            <div class="couple-container">
                <!-- Groom -->
                <div class="couple-card">
                    <div class="avatar-initial">E</div>
                    <h3>Erdwin Kamal Dimara</h3>
                    <p class="parents-info">Putra dari Bapak Urip Agustinus & Ibu Rosmanah</p>
                </div>

                <div class="separator-and">&</div>

                <!-- Bride -->
                <div class="couple-card">
                    <div class="avatar-initial">W</div>
                    <h3>Hikmah Murwida</h3>
                    <p class="parents-info">Putri dari Alm. Bapak Murdjito & Ibu Yayah</p>
                </div>
            </div>
        </section>

        <!-- COUNTDOWN SECTION -->
        <section class="countdown-section">
            <h2>Menghitung Hari</h2>
            <div id="timer" class="timer-grid">
                <div class="timer-item"><span id="days">0</span><label>Hari</label></div>
                <div class="timer-item"><span id="hours">0</span><label>Jam</label></div>
                <div class="timer-item"><span id="minutes">0</span><label>Menit</label></div>
                <div class="timer-item"><span id="seconds">0</span><label>Detik</label></div>
            </div>
        </section>

        <!-- EVENT SECTION -->
        <section id="event" class="event-section">
            <h2>Rangkaian Acara</h2>
            <p class="event-date">Sabtu, 12 Desember 2026</p>

            <div class="event-details">
                <div class="event-box">
                    <h3>Akad Nikah</h3>
                    <p class="time">16.00 - 18.00 WIB</p>
                    <p class="venue"><strong>SASONO MULYO Depok</strong></p>
                    <p class="address">Jl. Raya Kalimulya No. 30, Kalimulya, Kec. Cilodong, Kota Depok, Jawa Barat</p>
                </div>

                <div class="event-box">
                    <h3>Resepsi</h3>
                    <p class="time">19.00 - 21.00 WIB</p>
                    <p class="venue"><strong>SASONO MULYO Depok</strong></p>
                    <p class="address">Jl. Raya Kalimulya No. 30, Kalimulya, Kec. Cilodong, Kota Depok, Jawa Barat</p>
                </div>
            </div>

            <div class="maps-container">
                <a id="mapsBtn" href="[https://maps.app.goo.gl/PfyUT2oNVL5RQWBWA](https://maps.app.goo.gl/PfyUT2oNVL5RQWBWA)" target="_blank" rel="noopener noreferrer" class="btn-primary">
                    📍 Lihat Lokasi (Google Maps)
                </a>
            </div>
        </section>

        <!-- RSVP SECTION -->
        <section id="rsvp" class="rsvp-section">
            <h2>Konfirmasi Kehadiran (RSVP)</h2>
            <form id="rsvpForm" class="form-container">
                <div class="form-group">
                    <label for="rsvpName">Nama</label>
                    <input type="text" id="rsvpName" required placeholder="Masukkan Nama Anda">
                </div>
                <div class="form-group">
                    <label for="rsvpAttendance">Konfirmasi</label>
                    <select id="rsvpAttendance" required>
                        <option value="">-- Pilih Kehadiran --</option>
                        <option value="Hadir">Hadir</option>
                        <option value="Tidak Hadir">Tidak Hadir</option>
                    </select>
                </div>
                <div class="form-group" id="guestsGroup">
                    <label for="rsvpGuests">Jumlah Tamu</label>
                    <select id="rsvpGuests">
                        <option value="">-- Pilih Jumlah --</option>
                        <option value="1">1 Orang</option>
                        <option value="2">2 Orang</option>
                    </select>
                    <span id="rsvpGuestsError" class="error-msg"></span>
                </div>
                <button type="submit" id="submitRsvp" class="btn-primary">Kirim RSVP</button>
            </form>
            <div id="rsvpStatus" class="form-status"></div>
        </section>

        <!-- WISHES SECTION -->
        <section id="wishes" class="wishes-section">
            <h2>Buku Tamu & Ucapan</h2>
            <form id="wishesForm" class="form-container">
                <div class="form-group">
                    <input type="text" id="wishName" required placeholder="Nama Anda">
                </div>
                <div class="form-group">
                    <textarea id="wishMessage" rows="3" required placeholder="Berikan doa & ucapan selamat..."></textarea>
                </div>
                <button type="submit" id="submitWish" class="btn-primary">Kirim Ucapan</button>
            </form>
            <div id="wishStatus" class="form-status"></div>

            <div id="wishesList" class="wishes-list">
                <!-- Ucapan langsung tampil saat dikirim -->
            </div>
        </section>

        <!-- GIFTS SECTION -->
        <section id="gifts" class="gifts-section">
            <h2>Tanda Kasih</h2>
            <div class="gifts-notice">
                <p>
                    Mohon maaf, kami tidak mencantumkan nomor rekening dalam undangan ini. 
                    Apabila Bapak/Ibu/Saudara/i berkenan memberikan tanda kasih berupa hadiah pernikahan, kami dengan senang hati menerimanya. 
                    Untuk informasi lebih lanjut, Bapak/Ibu/Saudara/i dapat menghubungi salah satu mempelai secara langsung.
                </p>
            </div>
        </section>

        <!-- FOOTER -->
        <footer>
            <p>Terima Kasih</p>
            <h3>Wida & Erdwin</h3>
        </footer>
    </main>

    <script src="script.js"></script>
</body>
</html>
