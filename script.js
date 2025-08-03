let focusMinutes = 25;
let breakMinutes = 5;
let time = focusMinutes * 60;
let totalTime = time;
let timerInterval = null;
let isRunning = false;
let isFocus = true;

const alarmSound = document.getElementById("alarm-sound");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const customTimeInput = document.getElementById("custom-time");
const breakTimeInput = document.getElementById("break-time");
const setTimeBtn = document.getElementById("set-time");
const modeLabel = document.getElementById("mode-label");
const themeToggle = document.getElementById("theme-toggle");

// Enable sound on first click
document.body.addEventListener("click", () => {
  alarmSound.play().then(() => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }).catch(() => {});
}, { once: true });

function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const FULL_DASH_ARRAY = 2 * Math.PI * 45;

function updateCircleAnimation(timeLeft, total) {
  const progressCircle = document.querySelector('.progress');
  const offset = FULL_DASH_ARRAY * (1 - timeLeft / total);
  progressCircle.style.strokeDashoffset = offset;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  totalTime = time;
  updateCircleAnimation(time, totalTime);

  timerInterval = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
      updateCircleAnimation(time, totalTime);
    } else {
      clearInterval(timerInterval);
      isRunning = false;

      alarmSound.play().catch(e => console.warn("Alarm error:", e));

      setTimeout(() => {
        if (isFocus) {
          alert("Focus session complete! Break time starts now.");
          stopAlarm();
          startBreak();
        } else {
          alert("Break over! Ready to start focusing again.");
          stopAlarm();
          resetToFocus();
        }
      }, 100);
    }
  }, 1000);
}

function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isFocus = true;
  time = focusMinutes * 60;
  totalTime = time;
  updateDisplay();
  updateCircleAnimation(time, totalTime);
  modeLabel.textContent = "Focus Session";
  isRunning = false;
}

function setCustomTimes() {
  const focus = parseInt(customTimeInput.value);
  const brk = parseInt(breakTimeInput.value);
  if (!isNaN(focus) && focus > 0) focusMinutes = focus;
  if (!isNaN(brk) && brk > 0) breakMinutes = brk;
  resetTimer();
}

function startBreak() {
  isFocus = false;
  time = breakMinutes * 60;
  totalTime = time;
  updateDisplay();
  updateCircleAnimation(time, totalTime);
  modeLabel.textContent = "Break Time";
  startTimer();
}

function resetToFocus() {
  isFocus = true;
  time = focusMinutes * 60;
  totalTime = time;
  updateDisplay();
  updateCircleAnimation(time, totalTime);
  modeLabel.textContent = "Focus Session";
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
setTimeBtn.addEventListener("click", setCustomTimes);

updateDisplay();

// Dark mode toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
