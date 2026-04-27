let scheduleTime = "";
let subject = "";
let agenda = "";
let currentStudyTask = "";
let clockInterval = null;

const subjectInput = document.getElementById('subjectInput');
const agendaInput = document.getElementById('agendaInput');
const timeInput = document.getElementById('timeInput');
const displaySubject = document.getElementById('displaySubject');
const displayAgenda = document.getElementById('displayAgenda');
const setupScreen = document.getElementById('setupScreen');
const alarmScreen = document.getElementById('alarmScreen');
const goToTimerBtn = document.getElementById('goToTimerBtn');
const snoozeBtn = document.getElementById('snoozeBtn');
const snoozeDuration = document.getElementById('snoozeDuration');
const themeSelect = document.getElementById('themeSelect');

// Theme switching UI: user can select light or dark mode and the choice is saved.
function setStudyAlarm() {
    subject = subjectInput.value.trim();
    agenda = agendaInput.value.trim();
    scheduleTime = timeInput.value; // Expecting format "HH:MM"

    if(!subject || !scheduleTime) {
        alert("Please enter both subject and time for the alarm.");
        return;
    }

    document.getElementById("statusMessage").classList.remove('hidden');
    document.getElementById("statusMessage").textContent = `Alarm set for ${subject} at ${scheduleTime}`;
    
    clockInterval = setInterval(checkTime, 1000);
}
function checkTime() {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = (now.getMinutes()+1).toString().padStart(2, '0');
    let currentTime = `${hours}:${minutes}`;
    if(currentTime === scheduleTime) {
        triggerAlarm();
    }
}

function triggerAlarm() {
    clearInterval(clockInterval);
    displaySubject.textContent = subject;
    displayAgenda.textContent = agenda ? `Agenda: ${agenda}` : '';
    setupScreen.classList.add('hidden');
    alarmScreen.classList.remove('hidden');
    goToTimerBtn.classList.remove('hidden');
}

function snooze() {
    // Read the selected snooze duration from the dropdown.
    const snoozeMinutes = parseInt(snoozeDuration.value, 10) || 10;

    // Add the snooze minutes to the scheduled alarm time.
    let [hours, minutes] = scheduleTime.split(':').map(Number);
    minutes += snoozeMinutes;
    if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes %= 60;
        if (hours >= 24) {
            hours %= 24;
        }
    }

    scheduleTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    timeInput.value = scheduleTime;

    document.getElementById("statusMessage").textContent = `Alarm snoozed for ${snoozeMinutes} minutes until ${scheduleTime}`;
    document.getElementById("statusMessage").classList.remove('hidden');

    alarmScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');

    clearInterval(clockInterval);
    clockInterval = setInterval(checkTime, 1000);
}

// Apply the selected theme by toggling CSS classes on the body.
// The selected theme is also stored in localStorage so it persists across page reloads.
function applyTheme(theme) {
    document.body.classList.toggle('light-mode', theme === 'light');
    document.body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('theme', theme);
}

// Load the saved user theme preference when the page opens.
// Default to dark mode if no preference exists yet.
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';// Set the dropdown to the saved theme and apply it.
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);
}

// Handle theme changes from the dropdown selector.
function handleThemeChange() {
    applyTheme(themeSelect.value);
}


function startSession() {
    currentStudyTask = `${subject}${agenda ? " - " + agenda : ""}`;
    localStorage.setItem('selectedTask', currentStudyTask);
    window.location.href = '../prototype_1/index.html';
}

document.getElementById('setAlarmBtn').addEventListener('click', setStudyAlarm);
goToTimerBtn.addEventListener('click', startSession);
snoozeBtn.addEventListener('click', snooze);
themeSelect.addEventListener('change', handleThemeChange);

loadTheme();