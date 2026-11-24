const photoInput = document.getElementById("photoInput");
const gallery = document.getElementById("gallery");
const songInput = document.getElementById("songInput");
const audio = document.getElementById("audio");
const playButton = document.getElementById("playButton");
const progress = document.getElementById("progress");
const duration = document.getElementById("duration");
const trackName = document.getElementById("trackName");
const playlist = document.getElementById("playlist");
const toast = document.getElementById("toast");
const giftButton = document.getElementById("giftButton");
const loveButton = document.getElementById("loveButton");

const initialTrack = document.createElement("button");
initialTrack.type = "button";
initialTrack.textContent = "Jósean Log - Doma";
initialTrack.style.fontWeight = "800";
initialTrack.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playButton.textContent = "❚❚";
  } else {
    audio.pause();
    playButton.textContent = "▶";
  }
});
playlist.appendChild(initialTrack);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

document.querySelectorAll("[data-add-photos]").forEach((button) => {
  button.addEventListener("click", () => photoInput.click());
});

photoInput.addEventListener("change", () => {
  const files = Array.from(photoInput.files);
  if (!files.length) return;

  document.querySelectorAll(".gallery-item.placeholder").forEach((item) => item.remove());

  files.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = () => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item";
      figure.innerHTML = `
        <img src="${reader.result}" alt="Nuestro recuerdo ${index + 1}">
        <figcaption>
          <span>${String(index + 2).padStart(2, "0")}</span>
          <strong>Otro recuerdo lindo</strong>
        </figcaption>
      `;
      gallery.appendChild(figure);
    };
    reader.readAsDataURL(file);
  });

  showToast(`${files.length} recuerdo${files.length === 1 ? "" : "s"} agregado${files.length === 1 ? "" : "s"}`);
});

songInput.addEventListener("change", () => {
  const songs = Array.from(songInput.files);
  if (!songs.length) return;

  playlist.innerHTML = "";
  songs.forEach((song) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = song.name.replace(/\.[^/.]+$/, "");
    button.addEventListener("click", () => playSong(song, button));
    playlist.appendChild(button);
  });

  playSong(songs[0], playlist.querySelector("button"));
  showToast("Canciones agregadas");
});

function playSong(song, button) {
  if (audio.src) URL.revokeObjectURL(audio.src);
  audio.src = URL.createObjectURL(song);
  trackName.textContent = song.name.replace(/\.[^/.]+$/, "");
  [...playlist.children].forEach((item) => item.style.fontWeight = "");
  if (button) button.style.fontWeight = "800";
  audio.play();
  playButton.textContent = "❚❚";
}

playButton.addEventListener("click", () => {
  if (!audio.currentSrc && !audio.querySelector("source")) {
    showToast("Agrega una cancion especial");
    return;
  }
  if (audio.paused) {
    audio.play();
    playButton.textContent = "❚❚";
  } else {
    audio.pause();
    playButton.textContent = "▶";
  }
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  const seconds = Math.floor(audio.currentTime);
  duration.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
});

audio.addEventListener("loadedmetadata", () => {
  if (!audio.duration) return;
  const seconds = Math.floor(audio.duration);
  duration.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
});

audio.addEventListener("ended", () => {
  playButton.textContent = "▶";
  progress.value = 0;
});

progress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
});

giftButton.addEventListener("click", () => {
  launchConfetti();
  document.getElementById("galeria").scrollIntoView({ behavior: "smooth" });
});

loveButton.addEventListener("click", () => {
  launchConfetti();
  showToast("Feliz cumpleaños, mi amor ♥");
});

const canvas = document.getElementById("confetti");
const context = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function launchConfetti() {
  resizeCanvas();
  particles = Array.from({ length: 140 }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.65,
    vx: (Math.random() - 0.5) * 12,
    vy: -Math.random() * 12 - 4,
    gravity: 0.18 + Math.random() * 0.12,
    size: 5 + Math.random() * 7,
    color: ["#ce7d78", "#edbbb1", "#c59a67", "#fffaf4"][Math.floor(Math.random() * 4)],
    life: 100 + Math.random() * 50
  }));
  requestAnimationFrame(animateConfetti);
}

function animateConfetti() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) => particle.life > 0);
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.gravity;
    particle.life -= 1;
    context.fillStyle = particle.color;
    context.fillRect(particle.x, particle.y, particle.size, particle.size * 0.6);
  });
  if (particles.length) requestAnimationFrame(animateConfetti);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

document.querySelectorAll(".gallery-item.interactive").forEach((item) => {
  const reveal = () => item.classList.toggle("revealed");
  item.addEventListener("click", reveal);
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      reveal();
    }
  });
});

document.querySelectorAll(".scratch-card").forEach((card) => {
  const scratchCanvas = card.querySelector(".scratchCanvas");
  const scratchContext = scratchCanvas.getContext("2d");
  let scratching = false;

  function resizeScratchCanvas() {
    const rect = card.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    scratchCanvas.width = rect.width * ratio;
    scratchCanvas.height = rect.height * ratio;
    scratchCanvas.style.width = `${rect.width}px`;
    scratchCanvas.style.height = `${rect.height}px`;
    scratchContext.setTransform(ratio, 0, 0, ratio, 0, 0);

    const gradient = scratchContext.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#c49a92");
    gradient.addColorStop(0.5, "#dcb0a6");
    gradient.addColorStop(1, "#b87e78");
    scratchContext.fillStyle = gradient;
    scratchContext.fillRect(0, 0, rect.width, rect.height);

    scratchContext.fillStyle = "rgba(255, 250, 244, 0.72)";
    scratchContext.font = "800 11px Segoe UI";
    scratchContext.textAlign = "center";
    scratchContext.fillText("RASCA AQUI", rect.width / 2, rect.height / 2);
  }

  function scratchAt(event) {
    if (!scratching) return;
    const rect = scratchCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    scratchContext.globalCompositeOperation = "destination-out";
    scratchContext.beginPath();
    scratchContext.arc(x, y, 22, 0, Math.PI * 2);
    scratchContext.fill();
  }

  scratchCanvas.addEventListener("pointerdown", (event) => {
    scratching = true;
    scratchCanvas.setPointerCapture(event.pointerId);
    scratchAt(event);
  });
  scratchCanvas.addEventListener("pointermove", scratchAt);
  scratchCanvas.addEventListener("pointerup", () => scratching = false);
  scratchCanvas.addEventListener("pointercancel", () => scratching = false);

  window.addEventListener("resize", resizeScratchCanvas);
  resizeScratchCanvas();
});

const heart = document.getElementById("beatingHeart");
const heartMessage = document.getElementById("heartMessage");
const heartPhrases = [
  "Eres la razón por la que sonrío sin motivo",
  "Contigo, cada día tiene una historia bonita",
  "Tu amor hace que todo sea más especial",
  "Quiero seguir creando recuerdos contigo",
  "Hoy celebraremos a la persona más hermosa",
  "Mi corazón siempre te eligirá"
];
let heartIndex = 0;

function changeHeartMessage() {
  heartMessage.style.opacity = "0";
  window.setTimeout(() => {
    heartIndex = (heartIndex + 1) % heartPhrases.length;
    heartMessage.textContent = heartPhrases[heartIndex];
    heartMessage.style.opacity = "1";
  }, 180);
  launchConfetti();
}

heart?.addEventListener("click", changeHeartMessage);
heart?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    changeHeartMessage();
  }
});

const passwordForm = document.getElementById("passwordForm");
const loveAnswer = document.getElementById("loveAnswer");
const passwordResult = document.getElementById("passwordResult");
const passwordReveal = document.getElementById("passwordReveal");

passwordForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const normalized = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

  if (normalized(loveAnswer.value) === normalized("En un evento")) {
    passwordResult.textContent = "¡Contraseña correcta!";
    passwordReveal.classList.add("visible");
    launchConfetti();
  } else {
    passwordResult.textContent = "Esa no es la respuesta secreta. Inténtalo otra vez.";
    passwordReveal.classList.remove("visible");
  }
});
