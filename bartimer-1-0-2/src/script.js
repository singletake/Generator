const progressBar = document.getElementById('progressBar');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const progressColorInput = document.getElementById('progressColor');
let timerInterval;
let currentTime = 0;
let totalTime = 0;
let isRunning = false;
let isPaused = false;
let pausedTime = 0;
let currentProgress = 0;
let blinkInterval;

function updateProgressBar() {
    const progressPercentage = ((totalTime - currentProgress) / totalTime) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function startBlinkAnimation() {
    blinkInterval = setInterval(() => {
        document.body.classList.toggle('blinking');
    }, 500);
}

function stopBlinkAnimation() {
    clearInterval(blinkInterval);
    document.body.classList.remove('blinking');
}

function startStopTimer() {
    if (!isRunning) {
        if (isPaused) {
            // Resume the timer from where it was paused
            isRunning = true;
            isPaused = false;
            progressBar.style.backgroundColor = progressColorInput.value;
            timerInterval = setInterval(() => {
                currentTime--;
                currentProgress++; // Increment the current progress
                updateProgressBar();

                if (currentTime <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    isRunning = false;
                    progressBar.style.width = '0%'; // Reset progress bar to 0 width when timer is stopped
                    startButton.innerText = 'Start'; // Change the button text back to "Start"
                    startBlinkAnimation(); // Start blinking animation when the timer reaches zero
                }
            }, 1000);
        } else {
            // Start the timer from the initial time
            const minutes = parseInt(minutesInput.value) || 0; // Use 0 if no input provided
            const seconds = parseInt(secondsInput.value) || 0; // Use 0 if no input provided
            totalTime = minutes * 60 + seconds;
            currentTime = totalTime;
            currentProgress = 0; // Set current progress to 0
            progressBar.style.backgroundColor = progressColorInput.value;
            progressBar.style.width = '100%'; // Reset progress bar to full width
            updateProgressBar();

            timerInterval = setInterval(() => {
                currentTime--;
                currentProgress++; // Increment the current progress
                updateProgressBar();

                if (currentTime <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    isRunning = false;
                    progressBar.style.width = '0%'; // Reset progress bar to 0 width when timer is stopped
                    startButton.innerText = 'Start'; // Change the button text back to "Start"
                    startBlinkAnimation(); // Start blinking animation when the timer reaches zero
                }
            }, 1000);
        }

        isRunning = true;
        startButton.innerText = 'Stop'; // Change the button text to "Stop"
    } else {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
        isPaused = true;
        pausedTime = currentTime;
        startButton.innerText = 'Start'; // Change the button text back to "Start"
    }
}

function resetProgressBar() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    isPaused = false;
    currentTime = 0;
    currentProgress = 0;
    progressBar.style.width = '0%'; // Reset progress bar to 0 width
    startButton.innerText = 'Start'; // Change the button text back to "Start"
    stopBlinkAnimation(); // Stop blinking animation when reset
}

startButton.addEventListener('click', startStopTimer);
resetButton.addEventListener('click', resetProgressBar);
