// DOM Elements
const taskTabs = document.querySelectorAll('.task-tab');
const taskName = document.querySelector('.task-name');
const stopwatch = document.querySelector('.stopwatch');
const startPauseBtn = document.querySelector('.start-pause');
const doneBtn = document.querySelector('.done');
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
const reportDate = document.getElementById('report-date');

// Stopwatch Variables
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let interval;

// Task Data
const tasks = [
  { name: 'Task 1', time: 0, startTime: null, endTime: null },
  { name: 'Task 2', time: 0, startTime: null, endTime: null },
  { name: 'Task 3', time: 0, startTime: null, endTime: null },
  { name: 'Task 4', time: 0, startTime: null, endTime: null },
  { name: 'Task 5', time: 0, startTime: null, endTime: null },
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
    startPauseBtn.textContent = 'Pause';
    tasks[currentTaskIndex].startTime = new Date().toLocaleTimeString('ar-EG');
  } else {
    clearInterval(interval);
    startPauseBtn.textContent = 'Resume';
  }
  isRunning = !isRunning;
}

// Done Button
function markTaskDone() {
  if (isRunning) {
    clearInterval(interval);
    isRunning = false;
    startPauseBtn.textContent = 'Start';
  }
  tasks[currentTaskIndex].endTime = new Date().toLocaleTimeString('ar-EG');
  tasks[currentTaskIndex].time += elapsedTime; // إضافة الوقت المنقضي إلى الوقت الإجمالي
  elapsedTime = 0; // إعادة تعيين الوقت المنقضي
  updateStopwatch();
  showReport();
}

// Reset Stopwatch
function resetStopwatch() {
  resetModal.style.display = 'flex';
}

function confirmReset() {
  clearInterval(interval);
  elapsedTime = 0;
  updateStopwatch();
  isRunning = false;
  startPauseBtn.textContent = 'Start';
  tasks[currentTaskIndex].time = 0;
  tasks[currentTaskIndex].startTime = null;
  tasks[currentTaskIndex].endTime = null;
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

// Save Edited Task Name
function saveTaskName() {
  const newName = newTaskNameInput.value.trim();
  if (newName) {
    tasks[currentTaskIndex].name = newName;
    taskName.textContent = newName;
    taskTabs[currentTaskIndex].textContent = newName;
    editModal.style.display = 'none';
  }
}

// Cancel Edit
function cancelEdit() {
  editModal.style.display = 'none';
}

// Show Report
function showReport() {
  reportDate.textContent = new Date().toLocaleDateString('ar-EG');
  let report = '';
  tasks.forEach((task) => {
    if (task.time > 0) { // عرض المهام التي تم العمل عليها فقط
      const hours = Math.floor(task.time / 3600000);
      const minutes = Math.floor((task.time % 3600000) / 60000);
      const seconds = Math.floor((task.time % 60000) / 1000);
      report += `${task.name}: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}\n${task.startTime || 'N/A'} - ${task.endTime || 'N/A'}\n\n`;
    }
  });
  reportContent.textContent = report;
  reportModal.style.display = 'flex';
}

// Close Report
function closeReport() {
  reportModal.style.display = 'none';
}

// Switch Task
function switchTask(index) {
  currentTaskIndex = index;
  taskName.textContent = tasks[currentTaskIndex].name;
  elapsedTime = tasks[currentTaskIndex].time;
  updateStopwatch();
  clearInterval(interval);
  isRunning = false;
  startPauseBtn.textContent = 'Start';
  taskTabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
  resetModal.style.display = 'none';
  editModal.style.display = 'none';
  reportModal.style.display = 'none';
}

// Event Listeners
startPauseBtn.addEventListener('click', toggleStopwatch);
doneBtn.addEventListener('click', markTaskDone);
resetBtn.addEventListener('click', resetStopwatch);
editBtn.addEventListener('click', editTaskName);
reportBtn.addEventListener('click', showReport);
saveEditBtn.addEventListener('click', saveTaskName);
cancelEditBtn.addEventListener('click', cancelEdit);
closeReportBtn.addEventListener('click', closeReport);

taskTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => switchTask(index));
});

// Initialize First Task
switchTask(0);
