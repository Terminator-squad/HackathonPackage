let tasks = []; // Empty Array to hold tasks
let finalTask = "";


const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const clearTasksBtn = document.getElementById('clearTasks');
const spinBtn = document.getElementById('spinBtn');
const taskList = document.getElementById('taskList');
const resultBox = document.getElementById('resultBox');
const winnerDisplay = document.getElementById('winner');

const tickSound = new Audio('https://www.soundjay.com/buttons_c2026/sounds/button-2.mp3');

window.onload = function() {
    let storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks && Array.isArray(storedTasks)) {
        tasks = storedTasks;
        updateScreenList();
    }
}


function storeTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        tasks.push(taskText);
        taskInput.value = '';
        updateScreenList();
        storeTasks();
    }
}

function clearTasks() {
    tasks = [];
    updateScreenList();
    localStorage.removeItem('tasks');
    spinBtn.disabled = false; // Re-enable the spin button
    spinBtn.style.opacity = 1; // Reset button opacity
    spinBtn.style.cursor = 'pointer';
}

function updateScreenList() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = `${task} (click to remove)`;
        li.title = "Click to remove this task";
        li.style.cursor = "pointer";
        
        li.addEventListener('click', () => {
            tasks.splice(index, 1);
            updateScreenList();
            storeTasks();
        });
        taskList.appendChild(li);
    });
}

function pickRandomTask() {
    if (tasks.length === 0) {
        alert('Please add some tasks first!');
        return;
    }
    resultBox.classList.remove('hidden');
    document.getElementById('goToFocusTimer').classList.add('hidden');

    let spinCount = 0;
    tickSound.play();

    let spinInterval = setInterval(() => {
        let randomIndex = Math.floor(Math.random() * tasks.length);
        winnerDisplay.textContent = tasks[randomIndex];
        finalTask = tasks[randomIndex];
        winnerDisplay.className = "spinning-text";
        spinCount++;

        if (spinCount >= 20) {
            clearInterval(spinInterval);
            finalTask = tasks[randomIndex];
            winnerDisplay.className = "winner-text";
            winnerDisplay.textContent = `Focus on: ${tasks[randomIndex]}`;
            document.getElementById('goToFocusTimer').classList.remove('hidden');
        }
    }, 100);
}

function goToFocusTimer() {
    localStorage.setItem('selectedTask', finalTask);
    window.location.href = '../prototype_1/index.html';
}


// Allow pressing Enter to add task
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

addTaskBtn.addEventListener('click', addTask);
addTaskBtn.addEventListener('click', storeTasks);
spinBtn.addEventListener('click', pickRandomTask);
document.getElementById('goToFocusTimer').addEventListener('click', goToFocusTimer);