const pieChartCanvas = document.getElementById('pieChartCanvas');
const ctx = pieChartCanvas.getContext('2d');
const startStopButton = document.getElementById('startStopButton');
const resetButton = document.getElementById('resetButton');
const minutesInput = document.getElementById('minutesInput');
const progressColorInput = document.getElementById('progressColor');
const timerDisplay = document.getElementById('timerDisplay');

const maxTime = 60; // Maximum time in minutes
const maxTimeInSeconds = maxTime * 60; // Maximum time in seconds

let currentTime = 0;
let timerInterval;
let isTimerRunning = false;
let progressColor = '#4CAF50';
let startTime = null;
let pauseStartTime = null;
let pausedTime = 0;

function drawFilledPieChart() {
  ctx.clearRect(0, 0, pieChartCanvas.width, pieChartCanvas.height);
  const remainingTime = currentTime;
  const percentage = remainingTime / maxTimeInSeconds;
  const progressAngle = percentage * Math.PI * 2;

  // Draw the filled pie slice
  ctx.beginPath();
  ctx.moveTo(pieChartCanvas.width / 2, pieChartCanvas.height / 2);
  ctx.arc(pieChartCanvas.width / 2, pieChartCanvas.height / 2, pieChartCanvas.width / 2, -Math.PI / 2, -Math.PI / 2 + progressAngle);
  ctx.closePath();
  ctx.fillStyle = progressColor;
  ctx.fill();
}

function animatePieChart(timestamp) {
  if (!isTimerRunning) return;

  if (!startTime) {
    startTime = timestamp - pausedTime;
    drawFilledPieChart();
  }

  const progress = timestamp - startTime;
  const timeElapsed = Math.floor(progress / 1000);
  currentTime = Math.max(0, parseInt(minutesInput.value, 10) * 60 - timeElapsed);

  if (currentTime > 0) {
    drawFilledPieChart();
    displayCountdownTimer(currentTime); // Update the countdown timer display
    requestAnimationFrame(animatePieChart);
  } else {
    isTimerRunning = false;
    startStopButton.innerText = 'Start';
    blinkPieChart();
    blinkContainer();
    startTime = null; // Reset the start time when the timer completes
    pausedTime = 0; // Reset the paused time when the timer completes
  }
}

function startStopTimer() {
  if (!isTimerRunning) {
    isTimerRunning = true;
    startStopButton.innerText = 'Stop';
    if (currentTime === 0) {
      currentTime = Math.max(0, parseInt(minutesInput.value, 10) * 60); // Start the timer from the input value if it was not running previously
      drawFilledPieChart();
    }
    startTime = performance.now() - pausedTime; // Start the timer from the paused time
    pausedTime = 0; // Reset the paused time
    requestAnimationFrame(animatePieChart);
  } else {
    isTimerRunning = false;
    startStopButton.innerText = 'Start';
    pauseStartTime = performance.now(); // Store timestamp when the timer is paused
    pausedTime = performance.now() - startTime; // Store the paused time
  }
}

function updateTimer() {
  if (currentTime > 0) {
    currentTime--;
    displayCountdownTimer(currentTime); // Update the countdown timer display
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  currentTime = 0;
  isTimerRunning = false;
  startStopButton.innerText = 'Start';
  drawFilledPieChart();
  displayCountdownTimer(currentTime); // Update the countdown timer display
  startTime = null; // Reset the start time when the timer is reset
  pauseStartTime = null; // Reset pauseStartTime when the timer is reset
  pausedTime = 0; // Reset pausedTime when the timer is reset
}

function blinkPieChart() {
  const interval = setInterval(() => {
    pieChartCanvas.classList.toggle('blinking');
  }, 500);

  setTimeout(() => {
    clearInterval(interval);
    pieChartCanvas.classList.remove('blinking');
  }, 10000); // Blink for 10 seconds
}

function blinkContainer() {
  const container = document.querySelector('.container');
  container.classList.add('blinking');
  setTimeout(() => {
    container.classList.remove('blinking');
  }, 10000); // Blink for 10 seconds
}

function displayCountdownTimer(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  const displayMinutes = String(minutes).padStart(2, '0');
  const displaySeconds = String(seconds).padStart(2, '0');
  timerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
}

startStopButton.addEventListener('click', () => {
  startStopTimer();
});

resetButton.addEventListener('click', () => {
  resetTimer();
});

minutesInput.addEventListener('input', () => {
  currentTime = Math.max(0, parseInt(minutesInput.value, 10) * 60);
  drawFilledPieChart();
  displayCountdownTimer(currentTime); // Update the countdown timer display
});

progressColorInput.addEventListener('input', () => {
  progressColor = progressColorInput.value;
  drawFilledPieChart();
});

// Initial draw of the full pie chart
drawFilledPieChart();
displayCountdownTimer(currentTime); // Display the initial countdown timer value
