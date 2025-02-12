// Google Sheets API Configuration
const SHEET_ID = '1GsoLzgAwDDNTZPtjbP24VxDeWSiC0msSJHvP_kZBw8o'; // استبدل بمعرف الجدول الخاص بك
const API_KEY = 'AIzaSyA1TGjduvZUC00hS4F1k35Vo6VuqvjM650'; // استبدل بAPI Key الخاص بك
const SHEET_NAME = 'Sheet1'; // اسم الورقة في الجدول

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
    startPauseBtn.textContent = 'Pause';
  } else {
    clearInterval(interval);
    startPauseBtn.textContent = 'Resume';
  }
  isRunning = !isRunning;
}

// Reset Stopwatch
function resetStopwatch() {
  resetModal.style.display = 'flex';
}

async function confirmReset() {
  clearInterval(interval);
  elapsedTime = 0;
  updateStopwatch();
  isRunning = false;
  startPauseBtn.textContent = 'Start';
  tasks[currentTaskIndex].time = 0;
  await updateTimeInSheet(tasks[currentTaskIndex].name, '00:00:00'); // إرسال البيانات عند التصفير
  resetModal.style.display = 'none';
}

function cancelReset() {
  resetModal.style.display = 'none';
}

// Edit Task Name
function editTaskName() {
  newTaskNameInput.value = tasks[currentTaskIndex].name; // عرض اسم التاسك الحالي
  editModal.style.display = 'flex';
}

// Save Edited Task Name
async function saveTaskName() {
  const newName = newTaskNameInput.value.trim();
  if (newName) {
    tasks[currentTaskIndex].name = newName;
    taskName.textContent = newName;
    taskTabs[currentTaskIndex].textContent = newName;
    await updateTaskNameInSheet(tasks[currentTaskIndex].name); // إرسال البيانات عند تعديل الاسم
    editModal.style.display = 'none';
  }
}

// Cancel Edit
function cancelEdit() {
  editModal.style.display = 'none';
}

// Show Report
async function showReport() {
  let report = '';
  tasks.forEach((task, index) => {
    const hours = Math.floor(task.time / 3600000);
    const minutes = Math.floor((task.time % 3600000) / 60000);
    const seconds = Math.floor((task.time % 60000) / 1000);
    report += `${index + 1}. ${task.name}: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}\n`;
  });
  reportContent.textContent = report;
  reportModal.style.display = 'flex';
  await updateTimeInSheet(tasks[currentTaskIndex].name, stopwatch.textContent); // إرسال البيانات عند عرض التقرير
}

// Close Report
function closeReport() {
  reportModal.style.display = 'none';
}

// Switch Task
function switchTask(index) {
  // حفظ وقت التاسك الحالي
  tasks[currentTaskIndex].time = elapsedTime;

  // التبديل إلى التاسك الجديد
  currentTaskIndex = index;
  taskName.textContent = tasks[currentTaskIndex].name;
  elapsedTime = tasks[currentTaskIndex].time;
  updateStopwatch();

  // إعادة تعيين حالة الـ Stopwatch
  clearInterval(interval);
  isRunning = false;
  startPauseBtn.textContent = 'Start';

  // تحديث علامة التبويب النشطة
  taskTabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });

  // إخفاء جميع النوافذ
  resetModal.style.display = 'none';
  editModal.style.display = 'none';
  reportModal.style.display = 'none';
}

// Function to update time in Google Sheets
async function updateTimeInSheet(taskName, time) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A1:append?valueInputOption=RAW&key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [[taskName, time]],
    }),
  });

  if (!response.ok) {
    console.error('Failed to update time in Google Sheets:', await response.text());
  }
}

// Function to update task name in Google Sheets
async function updateTaskNameInSheet(taskName) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A1:append?valueInputOption=RAW&key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [[taskName, '']],
    }),
  });

  if (!response.ok) {
    console.error('Failed to update task name in Google Sheets:', await response.text());
  }
}

// Event Listeners
startPauseBtn.addEventListener('click', toggleStopwatch);
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
