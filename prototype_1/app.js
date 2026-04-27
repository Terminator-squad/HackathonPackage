let remainingTime = 25 * 60; // Time in seconds
let timerID = null;
let isRunning = false;
// comment to test git branch
const startButton  = document.getElementById('start');
const pauseButton  = document.getElementById('pause');
const resetButton  = document.getElementById('reset');
const message      = document.getElementById('message');
const display      = document.getElementById('display');
const focusTaskDisplay = document.getElementById('currentTaskDisplay');

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

window.onload = function() {
    let savedTask = localStorage.getItem('selectedTask');
    if(savedTask){
        focusTaskDisplay.textContent = `Current Task: ${savedTask}`;
    }else {
        focusTaskDisplay.textContent = "General study session";
    }
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
    remainingTime = 25 * 60;
    updateTimerDisplay();
    isRunning = false;
    document.body.classList.remove('busted');
    message.textContent = "Timer reset.";
}

document.addEventListener('visibilitychange', () => {
    if(document.hidden && isRunning){
        resetTimer();
        document.body.classList.add('busted');
        message.textContent = "You left! Timer paused. Please stay focused.";
        hasBeenBusted = true;
    }
});