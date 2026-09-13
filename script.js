/* =========================================================================
   WEDDING INVITATION — SCRIPT
   ---------------------------------------------------------------------
   Semua data yang perlu Anda ganti (nama, tanggal, lokasi, dsb) ada di
   dalam "weddingConfig" di bawah ini. Anda TIDAK perlu mengubah bagian
   lain dari file ini untuk mengganti data pernikahan.
   ========================================================================= */

// ========================================
// EDIT DATA PERNIKAHAN DI BAGIAN INI
// ========================================
const weddingConfig = {

  groom: {
    name: "Erdwin Kamal Dimara",
    parents: "Bapak Agustinus & Ibu Rosmanah",
    childOrder: "Putra pertama dari 3 bersaudara"
  },

  bride: {
    name: "Hikmah Murwida",
    parents: "Bapak Murdjito (Alm) & Ibu Yayah",
    childOrder: "Putri Tunggal"
  },

  // Format WAJIB: "YYYY-MM-DDTHH:MM:00+07:00" (timezone Asia/Jakarta)
  weddingDate: "2026-12-12T16:00:00+07:00",

  ceremony: {
    title: "Akad Nikah",
    day: "Sabtu",
    date: "12 Desember 2026",
    time: "16.00 – 18.00 WIB",
    venue: "Sasono Mulyo Depok",
    address: "Jl. Raya Kalimulya No.30, Jatimulya, Kec. Cilodong, Kota Depok, Jawa Barat 16413",
    // Ganti dengan link Google Maps lokasi sebenarnya.
    // Cara mendapatkan: buka Google Maps > cari lokasi > Share > Copy link.
    mapsUrl: "https://maps.app.goo.gl/4V3rmX8dAQuKbfVz6=Jl.+Raya+Kalimulya+No.+30"
  },

  reception: {
    title: "Resepsi Pernikahan",
    day: "Sabtu",
    date: "12 Desember 2026",
    time: "19.00 – 21.00 WIB",
    venue: "Sasono Mulyo Depok",
    address: "Jl. Raya Kalimulya No.30, Jatimulya, Kec. Cilodong, Kota Depok, Jawa Barat 16413",
    mapsUrl: "https://maps.app.goo.gl/4V3rmX8dAQuKbfVz6=Jl.+Raya+Kalimulya+No.+30"
  },

  // URL Google Apps Script Web App (lihat google-apps-script/Code.gs & README.md)
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbzxTFLOrFfyBFfHgumKOfvBSKpo5GpMMBqXRiXU_-qjv-agkomwD3LfF9jxnINTa3ih/exec",

  // Aktifkan/nonaktifkan pengiriman RSVP & ucapan ke Google Sheets.
  // Jika googleScriptUrl belum diisi, form tetap bisa dicoba tapi akan gagal terkirim.
  enableGoogleSheets: true
};
// ========================================
// SELESAI BAGIAN EDIT DATA
// (bagian di bawah ini adalah logika, umumnya tidak perlu diubah)
// ========================================


document.addEventListener("DOMContentLoaded", () => {
  renderEventDetails();
  setupGuestName();
  setupCoverOpen();
  setupNav();
  setupCountdown();
  setupMaps();
  setupMusic();
  setupRevealAnimations();
  setupRsvpForm();
  setupWishForm();
  setupShareButton();
});

/* ---------------------------------------------------------
   1. Isi detail acara ke HTML dari weddingConfig
   --------------------------------------------------------- */
function renderEventDetails() {
  const map = {
    "ceremony-day": weddingConfig.ceremony.day,
    "ceremony-date": weddingConfig.ceremony.date,
    "ceremony-time": weddingConfig.ceremony.time,
    "ceremony-venue": weddingConfig.ceremony.venue,
    "ceremony-address": weddingConfig.ceremony.address,
    "reception-day": weddingConfig.reception.day,
    "reception-date": weddingConfig.reception.date,
    "reception-time": weddingConfig.reception.time,
    "reception-venue": weddingConfig.reception.venue,
    "reception-address": weddingConfig.reception.address
  };
  Object.keys(map).forEach((key) => {
    const el = document.querySelector(`[data-event="${key}"]`);
    if (el) el.textContent = map[key];
  });
}

/* ---------------------------------------------------------
   2. Nama tamu dari URL (?to=Nama%20Tamu)
      Menggunakan textContent (bukan innerHTML) agar aman dari XSS.
   --------------------------------------------------------- */
function setupGuestName() {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to");
  const guestEl = document.getElementById("guestName");
  if (guest && guest.trim().length > 0) {
    // textContent otomatis meng-escape karakter HTML, aman dari injeksi.
    guestEl.textContent = guest.trim().slice(0, 100);
  } else {
    guestEl.textContent = "";
  }
}

/* ---------------------------------------------------------
   3. Tombol "Buka Undangan"
   --------------------------------------------------------- */
function setupCoverOpen() {
  const cover = document.getElementById("cover");
  const mainContent = document.getElementById("mainContent");
  const openBtn = document.getElementById("openInvitation");

  openBtn.addEventListener("click", () => {
    cover.classList.add("is-hidden");
    mainContent.classList.add("is-visible");
    mainContent.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "";

    // Coba mainkan musik setelah interaksi user (autoplay browser-friendly)
    const music = document.getElementById("bgMusic");
    music.play().then(() => {
      setMusicButtonState(true);
    }).catch(() => {
      // Autoplay diblokir browser — biarkan tombol musik tetap OFF,
      // user bisa menekan tombol musik secara manual.
      setMusicButtonState(false);
    });

    // Fokuskan ke konten utama untuk aksesibilitas keyboard/screen reader
    mainContent.setAttribute("tabindex", "-1");
    mainContent.focus({ preventScroll: true });

    // Jalankan reveal untuk section pertama yang sudah terlihat
    triggerVisibleReveals();
  }, { once: true });

  document.body.style.overflow = "hidden";
}

/* ---------------------------------------------------------
   4. Navigasi (desktop nav + mobile hamburger menu)
   --------------------------------------------------------- */
function setupNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-hidden", String(!isOpen));
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    });
  });

  // Highlight menu aktif sesuai section yang sedang dilihat
  const sections = document.querySelectorAll("#mainContent section[id]");
  if (!sections.length) return;
  const navLinks = document.querySelectorAll(".nav__link");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("is-active"));
        const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach((s) => observer.observe(s));
}

/* ---------------------------------------------------------
   5. Countdown menuju hari-H (Asia/Jakarta, UTC+7)
   --------------------------------------------------------- */
function setupCountdown() {
  const targetDate = new Date(weddingConfig.weddingDate).getTime();
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds")
  };
  const grid = document.getElementById("countdownGrid");
  const arrived = document.getElementById("countdownArrived");

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      grid.hidden = true;
      arrived.hidden = false;
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* ---------------------------------------------------------
   6. Tombol Google Maps
   --------------------------------------------------------- */
function setupMaps() {
  document.querySelectorAll("[data-maps]").forEach((btn) => {
    const key = btn.getAttribute("data-maps"); // "ceremony" atau "reception"
    const url = weddingConfig[key] && weddingConfig[key].mapsUrl;
    if (url) {
      btn.setAttribute("href", url);
    }
  });
}

/* ---------------------------------------------------------
   7. Toggle musik latar
   --------------------------------------------------------- */
function setupMusic() {
  const btn = document.getElementById("musicToggle");
  const music = document.getElementById("bgMusic");

  btn.addEventListener("click", () => {
    if (music.paused) {
      music.play().then(() => setMusicButtonState(true)).catch(() => {
        // Jika tetap gagal (misalnya file belum tersedia), beri tahu di console.
        console.warn("Tidak dapat memutar musik. Pastikan file assets/music/wedding-music.mp3 tersedia.");
      });
    } else {
      music.pause();
      setMusicButtonState(false);
    }
  });
}

function setMusicButtonState(isPlaying) {
  const btn = document.getElementById("musicToggle");
  btn.classList.toggle("is-playing", isPlaying);
  btn.setAttribute("aria-pressed", String(isPlaying));
  btn.setAttribute("aria-label", isPlaying ? "Matikan musik" : "Aktifkan musik");
}

/* ---------------------------------------------------------
   8. Animasi reveal saat scroll (IntersectionObserver)
   --------------------------------------------------------- */
let revealObserver;

function setupRevealAnimations() {
  const targets = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((t) => revealObserver.observe(t));
}

function triggerVisibleReveals() {
  // Memastikan section pertama (hero) langsung ter-reveal setelah cover dibuka,
  // untuk kasus dimana section tersebut sudah berada dalam viewport.
  const hero = document.getElementById("hero");
  if (hero) hero.classList.add("is-visible");
}

/* ---------------------------------------------------------
   9. Utility: escape teks sebelum ditampilkan (defense in depth)
   --------------------------------------------------------- */
function sanitizeText(value) {
  return String(value)
    .replace(/[<>&"']/g, (ch) => ({
      "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;"
    }[ch]));
}

/* ---------------------------------------------------------
   10. Kirim data ke Google Apps Script
   --------------------------------------------------------- */
async function sendToGoogleSheets(payload) {
  if (!weddingConfig.enableGoogleSheets || !weddingConfig.googleScriptUrl || weddingConfig.googleScriptUrl === "YOUR_GOOGLE_APPS_SCRIPT_URL") {
    throw new Error("Google Apps Script belum dikonfigurasi.");
  }

  // Apps Script Web App tidak selalu mengirim header CORS standar,
  // sehingga kita kirim sebagai "text/plain" (lihat README untuk penjelasan).
  const response = await fetch(weddingConfig.googleScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Gagal mengirim data.");
  }
  return response.json().catch(() => ({}));
}

/* ---------------------------------------------------------
   11. Form RSVP
   --------------------------------------------------------- */
function setupRsvpForm() {
  const form = document.getElementById("rsvpForm");
  const submitBtn = document.getElementById("rsvpSubmit");
  const statusEl = document.getElementById("rsvpStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const attendance = form.attendance.value;
    const guests = form.guests.value;

    let valid = true;
    document.getElementById("rsvpNameError").textContent = "";
    document.getElementById("rsvpAttendanceError").textContent = "";
    document.getElementById("rsvpGuestsError").textContent = "";

    if (!name) {
      document.getElementById("rsvpNameError").textContent = "Nama wajib diisi.";
      valid = false;
    }
    if (!attendance) {
      document.getElementById("rsvpAttendanceError").textContent = "Silakan pilih status kehadiran.";
      valid = false;
    }
    if (!guests) {
      document.getElementById("rsvpGuestsError").textContent = "Silakan pilih jumlah tamu.";
      valid = false;
    }
    if (!valid) return;

    setFormBusy(submitBtn, statusEl, "Mengirim...");

    try {
      await sendToGoogleSheets({
        action: "rsvp",
        name: sanitizeText(name),
        attendance: sanitizeText(attendance),
        guests: sanitizeText(guests)
      });
      statusEl.textContent = "Terima kasih! Konfirmasi kehadiran Anda telah diterima.";
      statusEl.className = "form__status is-success";
      form.reset();
    } catch (err) {
      statusEl.textContent = "Maaf, terjadi kendala. Silakan coba kembali beberapa saat lagi.";
      statusEl.className = "form__status is-error";
    } finally {
      setFormIdle(submitBtn, "Kirim Konfirmasi");
    }
  });
}

/* ---------------------------------------------------------
   12. Form Ucapan / Buku Tamu
   --------------------------------------------------------- */
function setupWishForm() {
  const form = document.getElementById("wishForm");
  const submitBtn = document.getElementById("wishSubmit");
  const statusEl = document.getElementById("wishStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const message = form.message.value.trim();

    let valid = true;
    document.getElementById("wishNameError").textContent = "";
    document.getElementById("wishMessageError").textContent = "";

    if (!name) {
      document.getElementById("wishNameError").textContent = "Nama wajib diisi.";
      valid = false;
    }
    if (!message) {
      document.getElementById("wishMessageError").textContent = "Ucapan wajib diisi.";
      valid = false;
    }
    if (!valid) return;

    setFormBusy(submitBtn, statusEl, "Mengirim...");

    try {
      await sendToGoogleSheets({
        action: "wish",
        name: sanitizeText(name),
        message: sanitizeText(message)
      });
      statusEl.textContent = "Terima kasih atas ucapan dan doanya!";
      statusEl.className = "form__status is-success";

      // Tampilkan langsung di daftar ucapan (sesi ini saja / tidak tersimpan permanen).
      addWishCard(name, message);
      form.reset();
    } catch (err) {
      statusEl.textContent = "Maaf, ucapan belum berhasil dikirim. Silakan coba lagi.";
      statusEl.className = "form__status is-error";
    } finally {
      setFormIdle(submitBtn, "Kirim Ucapan");
    }
  });
}

function addWishCard(name, message) {
  const list = document.getElementById("wishesList");
  const card = document.createElement("article");
  card.className = "wish-card";

  const nameEl = document.createElement("p");
  nameEl.className = "wish-card__name";
  nameEl.textContent = name; // textContent -> aman dari HTML injection

  const textEl = document.createElement("p");
  textEl.className = "wish-card__text";
  textEl.textContent = message;

  card.appendChild(nameEl);
  card.appendChild(textEl);
  list.prepend(card);
}

/* ---------------------------------------------------------
   13. Helper status tombol form (mencegah submit berkali-kali)
   --------------------------------------------------------- */
function setFormBusy(button, statusEl, label) {
  button.disabled = true;
  button.querySelector(".btn__label").textContent = label;
  statusEl.textContent = "";
  statusEl.className = "form__status";
}

function setFormIdle(button, label) {
  button.disabled = false;
  button.querySelector(".btn__label").textContent = label;
}

/* ---------------------------------------------------------
   14. Bagikan undangan via WhatsApp
   --------------------------------------------------------- */
function setupShareButton() {
  const btn = document.getElementById("shareButton");
  btn.addEventListener("click", () => {
    const url = window.location.href;
    const message =
      "Assalamu'alaikum,\n\n" +
      "Dengan penuh kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami.\n\n" +
      "Lihat undangan:\n" + url + "\n\n" +
      "Terima kasih atas doa dan restunya.";

    const waUrl = "https://wa.me/?text=" + encodeURIComponent(message);
    window.open(waUrl, "_blank", "noopener");
  });
}
