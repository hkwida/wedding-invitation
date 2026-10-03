const weddingConfig = {
    // Tanggal Pernikahan (Sabtu, 12 Desember 2026 jam 16:00 WIB)
    targetDate: "2026-12-12T16:00:00+07:00",
    
    // Link Google Maps Sasono Mulyo Depok
    mapsUrl: "https://maps.app.goo.gl/PfyUT2oNVL5RQWBWA",
    
    // Paste URL Apps Script Web App kamu di sini
    googleScriptUrl: "ISI_DENGAN_URL_GOOGLE_APPS_SCRIPT_KAMU" 
};

document.addEventListener("DOMContentLoaded", () => {
    initGuestName();
    initOpenButton();
    initCountdown();
    initMapsUrl();
    setupRsvpForm();
    setupWishesForm();
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

// Buka Undangan & Play Musik
function initOpenButton() {
    const openBtn = document.getElementById("openBtn");
    const cover = document.getElementById("cover");
    const mainContent = document.getElementById("mainContent");
    const musicControl = document.getElementById("musicControl");
    const bgMusic = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicBtn");

    openBtn.addEventListener("click", () => {
        cover.classList.add("fade-out");
        setTimeout(() => {
            cover.style.display = "none";
            mainContent.classList.remove("hidden");
            musicControl.classList.remove("hidden");
        }, 500);

        if (bgMusic) {
            bgMusic.play().catch(() => console.log("Autoplay blocked"));
        }
    });

    if (musicBtn && bgMusic) {
        musicBtn.addEventListener("click", () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicBtn.textContent = "🎵";
            } else {
                bgMusic.pause();
                musicBtn.textContent = "🔇";
            }
        });
    }
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
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days;
        document.getElementById("hours").textContent = hours;
        document.getElementById("minutes").textContent = minutes;
        document.getElementById("seconds").textContent = seconds;
    }, 1000);
}

// Set URL Google Maps
function initMapsUrl() {
    const mapsBtn = document.getElementById("mapsBtn");
    if (mapsBtn && weddingConfig.mapsUrl) {
        mapsBtn.href = weddingConfig.mapsUrl;
    }
}

// Form RSVP
function setupRsvpForm() {
    const rsvpForm = document.getElementById("rsvpForm");
    const attendanceSelect = document.getElementById("rsvpAttendance");
    const guestsGroup = document.getElementById("guestsGroup");

    attendanceSelect.addEventListener("change", () => {
        if (attendanceSelect.value === "Tidak Hadir") {
            guestsGroup.style.display = "none";
        } else {
            guestsGroup.style.display = "block";
        }
    });

    rsvpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("rsvpName").value;
        const attendance = attendanceSelect.value;
        const guests = document.getElementById("rsvpGuests").value;
        const errorElement = document.getElementById("rsvpGuestsError");
        const statusElement = document.getElementById("rsvpStatus");

        errorElement.textContent = "";
        
        // Validasi: Jumlah Tamu hanya wajib jika Pilihi Hadir
        if (attendance === "Hadir" && !guests) {
            errorElement.textContent = "Silakan pilih jumlah tamu.";
            return;
        }

        statusElement.textContent = "Mengirim...";

        const payload = {
            type: "rsvp",
            name: name,
            attendance: attendance,
            guests: attendance === "Hadir" ? guests : "0"
        };

        fetch(weddingConfig.googleScriptUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(() => {
            statusElement.textContent = "Terima kasih! Konfirmasi Anda telah tersimpan.";
            rsvpForm.reset();
        })
        .catch(() => {
            statusElement.textContent = "Gagal mengirim. Silakan coba lagi.";
        });
    });
}

// Form Ucapan (Wishes)
function setupWishesForm() {
    const wishesForm = document.getElementById("wishesForm");
    const wishesList = document.getElementById("wishesList");
    const wishStatus = document.getElementById("wishStatus");

    wishesForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("wishName").value;
        const message = document.getElementById("wishMessage").value;

        wishStatus.textContent = "Mengirim ucapan...";

        const payload = {
            type: "wish",
            name: name,
            message: message
        };

        fetch(weddingConfig.googleScriptUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(() => {
            wishStatus.textContent = "Ucapan Anda berhasil terkirim!";
            
            // Tampilkan ucapan secara langsung di layar
            const card = document.createElement("div");
            card.className = "wish-card";
            card.innerHTML = `<strong>${escapeHtml(name)}</strong><p>${escapeHtml(message)}</p>`;
            wishesList.prepend(card);

            wishesForm.reset();
        })
        .catch(() => {
            wishStatus.textContent = "Gagal mengirim ucapan.";
        });
    });
}

function escapeHtml(string) {
    return String(string).replace(/[&<>"']/g, function (s) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[s];
    });
}
