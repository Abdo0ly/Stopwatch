// Notion API Configuration
const NOTION_API_KEY = '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'; // استبدل بهذا المفتاح
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
    interval = setInterval(async () => {
      elapsedTime = Date.now() - startTime;
      updateStopwatch();
      await updateTimeInNotion(tasks[currentTaskIndex].name, stopwatch.textContent, 'PAGE_ID'); // استبدل PAGE_ID بمعرف الصفحة
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

function confirmReset() {
  clearInterval(interval);
  elapsedTime = 0;
  updateStopwatch();
  isRunning = false;
  startPauseBtn.textContent = 'Start';
  tasks[currentTaskIndex].time = 0;
  updateTimeInNotion(tasks[currentTaskIndex].name, '00:00:00', 'PAGE_ID'); // إعادة تعيين الوقت في Notion
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
    await updateTaskNameInNotion(tasks[currentTaskIndex].name, 'PAGE_ID'); // تحديث اسم التاسك في Notion
    editModal.style.display = 'none';
  }
}

// Cancel Edit
function cancelEdit() {
  editModal.style.display = 'none';
}

// Show Report
function showReport() {
  let report = '';
  tasks.forEach((task, index) => {
    const hours = Math.floor(task.time / 3600000);
    const minutes = Math.floor((task.time % 3600000) / 60000);
    const seconds = Math.floor((task.time % 60000) / 1000);
    report += `${index + 1}. ${task.name}: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}\n`;
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

// Function to update time in Notion
async function updateTimeInNotion(taskName, time, pageId) {
  // البحث عن الصف الحالي
  const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Task Name', title: { equals: taskName } },
          { property: 'Page ID', rich_text: { equals: pageId } },
        ],
      },
    }),
  });

  const data = await response.json();
  if (data.results.length > 0) {
    // إذا وجد الصف، قم بتحديثه
    const pageIdToUpdate = data.results[0].id;
    await fetch(`https://api.notion.com/v1/pages/${pageIdToUpdate}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        properties: {
          'Time': { rich_text: [{ text: { content: time } }] },
        },
      }),
    });
  } else {
    // إذا لم يوجد الصف، قم بإضافته
    await sendToNotion(taskName, time, pageId);
  }
}

// Function to update task name in Notion
async function updateTaskNameInNotion(taskName, pageId) {
  // البحث عن الصف الحالي
  const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Task Name', title: { equals: tasks[currentTaskIndex].name } },
          { property: 'Page ID', rich_text: { equals: pageId } },
        ],
      },
    }),
  });

  const data = await response.json();
  if (data.results.length > 0) {
    // إذا وجد الصف، قم بتحديثه
    const pageIdToUpdate = data.results[0].id;
    await fetch(`https://api.notion.com/v1/pages/${pageIdToUpdate}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        properties: {
          'Task Name': { title: [{ text: { content: taskName } }] },
        },
      }),
    });
  }
}

// Function to send data to Notion
async function sendToNotion(taskName, time, pageId) {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        'Task Name': { title: [{ text: { content: taskName } }] },
        'Time': { rich_text: [{ text: { content: time } }] },
        'Page ID': { rich_text: [{ text: { content: pageId } }] },
      },
    }),
  });

  if (!response.ok) {
    console.error('Failed to send data to Notion:', await response.text());
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
