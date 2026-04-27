let tasks = [];
let finalTask = "";

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const spinBtn = document.getElementById('spinBtn');
const taskList = document.getElementById('taskList');
const resultBox = document.getElementById('resultBox');
const winnerDisplay = document.getElementById('winner');


function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        tasks.push(taskText);
        taskInput.value = '';
        updateScreenList();
    }
}

function updateScreenList() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = `${task}`;
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

    let spinInterval = setInterval(() => {
        let randomIndex = Math.floor(Math.random() * tasks.length);
        winnerDisplay.textContent = tasks[randomIndex];
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

addTaskBtn.addEventListener('click', addTask);
spinBtn.addEventListener('click', pickRandomTask);
document.getElementById('goToFocusTimer').addEventListener('click', goToFocusTimer);