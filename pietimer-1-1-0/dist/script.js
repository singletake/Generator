const pieChartCanvas = document.getElementById('pieChartCanvas');
const ctx = pieChartCanvas.getContext('2d');
const startStopButton = document.getElementById('startStopButton');
const resetButton = document.getElementById('resetButton');
const minutesInput = document.getElementById('minutesInput');
const progressColorInput = document.getElementById('progressColor');

const maxTime = 60; // Maximum time in minutes
const maxTimeInSeconds = maxTime * 60; // Maximum time in seconds

let currentTime = 0;
let timerInterval;
let isTimerRunning = false;
let progressColor = '#4CAF50';
let startTime = null;

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
    startTime = timestamp;
    drawFilledPieChart();
  }

  const progress = timestamp - startTime;
  const timeElapsed = Math.floor(progress / 1000);
  currentTime = Math.max(0, parseInt(minutesInput.value, 10) * 60 - timeElapsed);

  if (currentTime > 0) {
    drawFilledPieChart();
    requestAnimationFrame(animatePieChart);
  } else {
    isTimerRunning = false;
    startStopButton.innerText = 'Start';
    blinkPieChart();
    blinkContainer();
  }
}

function startStopTimer() {
  if (!isTimerRunning) {
    isTimerRunning = true;
    startStopButton.innerText = 'Stop';
    startTime = null; // Reset start time
    requestAnimationFrame(animatePieChart);
  } else {
    isTimerRunning = false;
    startStopButton.innerText = 'Start';
  }
}

function updateTimer() {
  if (currentTime > 0) {
    currentTime--;
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  currentTime = 0;
  isTimerRunning = false;
  startStopButton.innerText = 'Start';
  drawFilledPieChart();
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

startStopButton.addEventListener('click', () => {
  startStopTimer();
});

resetButton.addEventListener('click', () => {
  resetTimer();
});

minutesInput.addEventListener('input', () => {
  currentTime = Math.max(0, parseInt(minutesInput.value, 10) * 60);
  drawFilledPieChart();
});

progressColorInput.addEventListener('input', () => {
  progressColor = progressColorInput.value;
  drawFilledPieChart();
});

// Initial draw of the full pie chart
drawFilledPieChart();