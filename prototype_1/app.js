let remainingTime = 25 * 60; // Time in seconds

let timerID = null;

let isRunning = false;

let currentMinutes = 25;

// comment to test git branch

// second comment to test git branch

const startButton = document.getElementById('start');

const pauseButton = document.getElementById('pause');

const resetButton = document.getElementById('reset');

const message = document.getElementById('message');

const display = document.getElementById('display');

const focusTaskDisplay = document.getElementById('currentTaskDisplay');

const minutesInput = document.getElementById('minutesInput');

const presetButtons = document.querySelectorAll('.preset');

const streakDisplay = document.getElementById('streakDisplay');


startButton.addEventListener('click', startTimer);

pauseButton.addEventListener('click', pauseTimer);

resetButton.addEventListener('click', resetTimer);


// Preset buttons set the timer to a specific number of minutes

presetButtons.forEach(btn => { // e.g. 15, 25, 50

btn.addEventListener('click', () => {

if (isRunning) return; // don't change time mid-session

const mins = parseInt(btn.dataset.min, 10); // get minutes from data attribute

setMinutes(mins);// update timer and input field

});

});


// Manual input (typing or using the up/down arrows) updates the timer

minutesInput.addEventListener('input', () => {// validate and update timer based on input

if (isRunning) return;

let mins = parseInt(minutesInput.value, 10);// get minutes from input

if (isNaN(mins)) return;// ignore non numeric input

// clamp to allowed range

if (mins < 1) mins = 1;

if (mins > 120) mins = 120;

setMinutes(mins, false); // don't overwrite the input

});


function setMinutes(mins, syncInput = true) {// update timer and optionally sync input field

currentMinutes = mins;

remainingTime = mins * 60;

if (syncInput) minutesInput.value = mins;

updateTimerDisplay();

}


window.onload = function() {// restore saved task and streak on page load

let savedTask = localStorage.getItem('selectedTask');

if(savedTask){

focusTaskDisplay.textContent = `Current Task: ${savedTask}`;// show saved task if it exists

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