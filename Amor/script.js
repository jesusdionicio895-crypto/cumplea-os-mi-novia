const surpriseButton = document.getElementById("surpriseButton");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");
const welcomeScreen = document.getElementById("welcomeScreen");
const openGift = document.getElementById("openGift");

document.body.classList.add("welcome-active");

let audioContext;
let musicTimer;

function playRomanticMusic() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") audioContext.resume();

  const notes = [261.63, 329.63, 392.0, 493.88, 440.0, 392.0, 329.63, 293.66];
  let step = 0;

  clearInterval(musicTimer);
  musicTimer = setInterval(() => {
    if (!musicButton.classList.contains("playing")) return;
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = notes[step % notes.length];
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 1.85);
    step += 1;
  }, 850);
}

openGift.addEventListener("click", () => {
  welcomeScreen.classList.add("opening");
  document.body.classList.remove("welcome-active");
  musicButton.classList.add("playing");
  musicLabel.textContent = "Sonando";
  playRomanticMusic();
  window.setTimeout(() => surpriseButton.focus({ preventScroll: true }), 900);
});

surpriseButton.addEventListener("click", () => {
  window.location.href = "sorpresa.html";
});

musicButton.addEventListener("click", () => {
  const isPlaying = musicButton.classList.toggle("playing");
  musicLabel.textContent = isPlaying ? "Sonando" : "Musica";
  if (isPlaying) playRomanticMusic();
});
