// Notion API Configuration
const NOTION_API_KEY = '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'; // استبدل بAPI Key الخاص بك
const NOTION_DATABASE_ID = '197ccd4f9d9f80a5a76ddedbdab0efec'; // استبدل بمعرف قاعدة البيانات الخاصة بك

// DOM Elements
const taskTabs = document.querySelectorAll('.task-tab');
const taskName = document.querySelector('.task-name');
const stopwatch = document.querySelector('.stopwatch');
const startPauseBtn = document.querySelector('.start-pause');
const resetBtn = document.querySelector('.reset');
const editBtn = document.querySelector('.edit');
const reportBtn = document.querySelector('.report');
const resetModal = document.getElementById('reset-modal');
const editModal = document.getElementById('edit-modal');
const newTaskNameInput = document.getElementById('new-task-name');
const saveEditBtn = document.getElementById('save-edit');
const cancelEditBtn = document.getElementById('cancel-edit');
const reportModal = document.getElementById('report-modal');
const reportContent = document.getElementById('report-content');
const closeReportBtn = document.getElementById('close-report');

// Stopwatch Variables
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let interval;
let updateInterval;

// Task Data
const tasks = [
  { name: 'Task 1', time: 0 },
  { name: 'Task 2', time: 0 },
  { name: 'Task 3', time: 0 },
  { name: 'Task 4', time: 0 },
  { name: 'Task 5', time: 0 },
];

let currentTaskIndex = 0;

// Update Stopwatch Display
function updateStopwatch() {
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  stopwatch.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Start/Pause Stopwatch
function toggleStopwatch() {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime;
    interval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateStopwatch();
    }, 1000);

    updateInterval = setInterval(() => {
      updateTimeInNotion(tasks[currentTaskIndex].name, stopwatch.textContent);
    }, 900000); // تحديث كل 15 دقيقة

    startPauseBtn.textContent = 'Pause';
  } else {
    clearInterval(interval);
    clearInterval(updateInterval);
    updateTimeInNotion(tasks[currentTaskIndex].name, stopwatch.textContent); // تحديث عند التوقف
    startPauseBtn.textContent = 'Resume';
  }
  isRunning = !isRunning;
}

// Reset Stopwatch
function resetStopwatch() {
  resetModal.style.display = 'flex';
}

function confirmReset() {
  clearInterval(interval);
  clearInterval(updateInterval);
  elapsedTime = 0;
  updateStopwatch();
  isRunning = false;
  startPauseBtn.textContent = 'Start';
  tasks[currentTaskIndex].time = 0;
  updateTimeInNotion(tasks[currentTaskIndex].name, '00:00:00');
  resetModal.style.display = 'none';
}

function cancelReset() {
  resetModal.style.display = 'none';
}

// Edit Task Name
function editTaskName() {
  newTaskNameInput.value = tasks[currentTaskIndex].name;
  editModal.style.display = 'flex';
}

async function saveTaskName() {
  const newName = newTaskNameInput.value.trim();
  if (newName) {
    tasks[currentTaskIndex].name = newName;
    taskName.textContent = newName;
    taskTabs[currentTaskIndex].textContent = newName;
    await updateTaskNameInNotion(newName);
    editModal.style.display = 'none';
  }
}

function cancelEdit() {
  editModal.style.display = 'none';
}

// Show Report
function showReport() {
  let report = '';
  tasks.forEach((task, index) => {
    report += `${index + 1}. ${task.name}: ${stopwatch.textContent}\n`;
  });
  reportContent.textContent = report;
  reportModal.style.display = 'flex';
}

function closeReport() {
  reportModal.style.display = 'none';
}

// Switch Task
function switchTask(index) {
  tasks[currentTaskIndex].time = elapsedTime;
  currentTaskIndex = index;
  taskName.textContent = tasks[currentTaskIndex].name;
  elapsedTime = tasks[currentTaskIndex].time;
  updateStopwatch();
  clearInterval(interval);
  clearInterval(updateInterval);
  isRunning = false;
  startPauseBtn.textContent = 'Start';
  taskTabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
}

// Notion API Functions
async function updateTimeInNotion(taskName, time) {
  console.log(`Updating Notion: ${taskName} - ${time}`);
}

async function updateTaskNameInNotion(taskName) {
  console.log(`Updating Task Name in Notion: ${taskName}`);
}

async function sendToNotion(taskName, time) {
  console.log(`Sending to Notion: ${taskName} - ${time}`);
}

// Event Listeners
startPauseBtn.addEventListener('click', toggleStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
editBtn.addEventListener('click', editTaskName);
reportBtn.addEventListener('click', showReport);
saveEditBtn.addEventListener('click', saveTaskName);
cancelEditBtn.addEventListener('click', cancelEdit);
closeReportBtn.addEventListener('click', closeReport);
taskTabs.forEach((tab, index) => tab.addEventListener('click', () => switchTask(index)));

// Initialize First Task
switchTask(0);
