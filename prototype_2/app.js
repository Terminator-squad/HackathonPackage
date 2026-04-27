let tasks = [];
let finalTask = "";

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const spinBtn = document.getElementById('spinBtn');
const taskList = document.getElementById('taskList');
const resultBox = document.getElementById('resultBox');
const winnerDisplay = document.getElementById('winner');
const clearTasksBtn = document.getElementById('clearTasksBtn');
const navLink1 = document.querySelector('.nav-link1');

const tickSound = new Audio('https://www.soundjay.com/buttons_c2026/sounds/button-2.mp3');
const winSound = new Audio('https://www.soundjay.com/buttons_c2026/sounds/button-25.mp3');

window.onload = function() {
    let savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if(savedTasks && Array.isArray(savedTasks)){
        tasks = savedTasks;
        updateScreenList();
    }
};

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
    tickSound.play(); //Play tick sound
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
        
            spinBtn.disabled = true; // Disable the spin button after picking a task
            spinBtn.style.opacity = 0.5; // Visually indicate that the button is disabled
            spinBtn.style.cursor = 'not-allowed'; // Change cursor to indicate disabled state
            spinBtn.textContent = 'Task Picked'; // Change button text to indicate task has been picked
            
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            winSound.play(); // Play win sound

        }
    }, 100);
}

function loadTemplate(type) {
    if(type === 'exam') {
        tasks.push("Review lecture notes", "Practice past papers", "Create flashcards", "Summarize key concepts", "Teach the material to someone else", "Take a practice quiz", "Organize study group", "Create a mind map", "Focus on weak areas", "Set specific goals for this session");
    } else if(type === 'admin') {
        tasks.push("Respond to emails", "Update calendar", "Prepare meeting agenda", "Follow up on pending tasks", "File reports", "Schedule appointments", "Organize documents", "Update contact list", "Review team performance", "Plan upcoming projects");
    }
    updateScreenList();
    storeTasks();
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

if(navLink1) {
    navLink1.addEventListener('click', function() {
        localStorage.removeItem('selectedTask');
    });
}

addTaskBtn.addEventListener('click', addTask);
addTaskBtn.addEventListener('click', storeTasks);
spinBtn.addEventListener('click', pickRandomTask);
clearTasksBtn.addEventListener('click', clearTasks);
document.getElementById('goToFocusTimer').addEventListener('click', goToFocusTimer);