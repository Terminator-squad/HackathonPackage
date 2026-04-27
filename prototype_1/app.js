let remainingTime = 25 * 60; // Time in seconds
let timerID = null;
let isRunning = false;
let currentMinutes = 25;

const startButton  = document.getElementById('start');
const pauseButton  = document.getElementById('pause');
const resetButton  = document.getElementById('reset');
const message      = document.getElementById('message');
const display      = document.getElementById('display');
const focusTaskDisplay = document.getElementById('currentTaskDisplay');
const minutesInput = document.getElementById('minutesInput');
const presetButtons = document.querySelectorAll('.preset');
const streakDisplay = document.getElementById('streakDisplay');

startButton.addEvesntListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Preset buttons set the timer to a specific number of minutes
presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isRunning) return; // don't change time mid-session
        const mins = parseInt(btn.dataset.min, 10);
        setMinutes(mins);
    });
});

// Manual input (typing or using the up/down arrows) updates the timer
minutesInput.addEventListener('input', () => {
    if (isRunning) return;
    let mins = parseInt(minutesInput.value, 10);
    if (isNaN(mins)) return;
    // clamp to allowed range
    if (mins < 1) mins = 1;
    if (mins > 120) mins = 120;
    setMinutes(mins, false); // don't overwrite the input while typing
});

function setMinutes(mins, syncInput = true) {
    currentMinutes = mins;
    remainingTime = mins * 60;
    if (syncInput) minutesInput.value = mins;
    updateTimerDisplay();
}

window.onload = function() {
    let savedTask = localStorage.getItem('selectedTask');
    if(savedTask){
        focusTaskDisplay.textContent = `Current Task: ${savedTask}`;
    }else {
        focusTaskDisplay.textContent = "General study session";
    }
    updateStreakDisplay();
}

function updateTimerDisplay(){
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer(){
    if(isRunning) return;
    isRunning = true;
    document.body.classList.remove('busted');
    message.textContent = "Timer started. Stay focused!";
    document.fullscreenEnabled && document.documentElement.requestFullscreen();
    timerID = setInterval(() => {
        if(remainingTime > 0){
            remainingTime--;
            updateTimerDisplay();
        }
        else {
            clearInterval(timerID);
            isRunning = false;
            handleSessionComplete();
        }
    }, 1000);
}

function pauseTimer(){
    if(!isRunning) return;
    clearInterval(timerID);
    isRunning = false;
    message.textContent = "Timer paused by user, Come back soon!";
    document.fullscreenElement && document.exitFullscreen();
}

function resetTimer(){
    clearInterval(timerID);
    remainingTime = currentMinutes * 60;
    updateTimerDisplay();
    isRunning = false;
    document.body.classList.remove('busted');
    message.textContent = "Timer reset.";
    document.fullscreenElement && document.exitFullscreen();
}

function handleSessionComplete() {
    message.textContent = "Session complete! Great work 🎉";
    document.fullscreenElement && document.exitFullscreen();
    incrementStreak();
}

function getStreak() {
    const val = parseInt(localStorage.getItem('focusStreak'), 10);
    return isNaN(val) ? 0 : val;
}

function incrementStreak() {
    const newStreak = getStreak() + 1;
    localStorage.setItem('focusStreak', newStreak);
    updateStreakDisplay();
}

function updateStreakDisplay() {
    if (!streakDisplay) return;
    streakDisplay.textContent = `🔥 ${getStreak()}`;
}

document.addEventListener('visibilitychange', () => {
    if(document.hidden && isRunning){
        resetTimer();
        document.body.classList.add('busted');
        message.textContent = "You left! Timer paused. Please stay focused.";
        hasBeenBusted = true;
    }
});
