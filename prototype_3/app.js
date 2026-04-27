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

function setStudyAlarm() {
    subject = subjectInput.value.trim();
    agenda = agendaInput.value.trim();
    scheduleTime = timeInput.value; // Expecting format "HH:MM"
    if(!subject || !scheduleTime) {
        alert("Please enter both subject and time for the alarm."); //This allows the user to set an alarm without an agenda, but requires both subject and time.
        return;
    }

    document.getElementById("statusMessage").classList.remove('hidden');
    document.getElementById("statusMessage").textContent = `Alarm set for ${subject} at ${scheduleTime}`;
    clockInterval = setInterval(checkTime, 1000);
}
function checkTime() {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = (now.getMinutes() + 1 ).toString().padStart(2, '0'); // Subtracting 1 minute warns user a minute before the scheduled time
    let currentTime = `${hours}:${minutes}`;
    if(currentTime === scheduleTime) {
        triggerAlarm();
    }
}

function triggerAlarm() {
    clearInterval(clockInterval);// Stop checking the time once the alarm is triggered
    displaySubject.textContent = subject;
    displayAgenda.textContent = agenda ? `Agenda: ${agenda}` : '';
    setupScreen.classList.add('hidden');
    alarmScreen.classList.remove('hidden');
    goToTimerBtn.classList.remove('hidden');
}

function startSession() {
    currentStudyTask = `${subject}${agenda ? " - " + agenda : ""}`;// This creates a string that combines the subject and agenda, if the agenda is provided. If not, it just uses the subject.
    localStorage.setItem('selectedTask', currentStudyTask);// This saves the current study task to local storage, which can be accessed by the timer page to display the task being focused on.
    window.location.href = '../prototype_1/index.html';
}

document.getElementById('setAlarmBtn').addEventListener('click', setStudyAlarm);
goToTimerBtn.addEventListener('click', startSession);// This event listener is added to the "Start Focus Timer" button, which will trigger the startSession function when clicked.