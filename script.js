// DOM Elements
const taskTabs = document.querySelectorAll('.task-tab');
const taskName = document.querySelector('.task-name');
const stopwatch = document.querySelector('.stopwatch');
const startPauseBtn = document.querySelector('.start-pause');
const doneBtn = document.querySelector('.done');
const resetBtn = document.querySelector('.reset');
const editBtn = document.querySelector('.edit');
const reportBtn = document.querySelector('.report');
const themeToggleBtn = document.querySelector('.theme-toggle');
const resetModal = document.getElementById('reset-modal');
const editModal = document.getElementById('edit-modal');
const newTaskNameInput = document.getElementById('new-task-name');
const saveEditBtn = document.getElementById('save-edit');
const cancelEditBtn = document.getElementById('cancel-edit');
const reportModal = document.getElementById('report-modal');
const reportContent = document.getElementById('report-content');
const closeReportBtn = document.getElementById('close-report');
const reportDate = document.getElementById('report-date');
const celebrationAnimation = document.getElementById('celebration-animation');

// Stopwatch Variables
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let interval;

// Task Data
const tasks = [
    { name: 'Task 1', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 2', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 3', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 4', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 5', time: 0, startTime: null, endTime: null, done: false },
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
    tasks[currentTaskIndex].time += elapsedTime;
    tasks[currentTaskIndex].done = true;
    celebrate(); // تشغيل الانيميشن قبل إخفاء الزر
}

// Celebration Animation
function celebrate() {
    const colors = [
        '#FFD700', // ذهبي
        '#FFA500', // برتقالي
        '#FF6B6B', // وردي فاتح
        '#FF4136', // أحمر
        '#FFE4B5', // بيج فاتح
        '#FFFFFF' // أبيض
    ];

    // الحصول على موقع زر Done
    const doneButton = document.querySelector('.done');
    const buttonRect = doneButton.getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    // إنشاء 600 قطعة
    for (let i = 0; i < 600; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // تحديد نوع القطعة
        const type = Math.random();
        if (type < 0.3) {
            confetti.classList.add('square');
        } else if (type < 0.6) {
            confetti.classList.add('rectangle');
        } else {
            confetti.classList.add('strip');
        }

        // تعيين موقع البداية عند زر Done
        confetti.style.left = startX + 'px';
        confetti.style.top = startY + 'px';

        // تعيين لون عشوائي
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // تعيين حجم عشوائي حسب النوع
        const size = Math.random() * 8 + 2;
        if (confetti.classList.contains('strip')) {
            confetti.style.width = (size / 2) + 'px';
            confetti.style.height = (size * 4) + 'px';
        } else if (confetti.classList.contains('rectangle')) {
            confetti.style.width = size + 'px';
            confetti.style.height = (size * 1.5) + 'px';
        } else {
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
        }

        // تعيين زاوية وسرعة عشوائية
        const angle = Math.random() * 360;
        const velocity = 300 + Math.random() * 200; // زيادة السرعة
        confetti.style.setProperty('--angle', angle + 'deg');
        confetti.style.setProperty('--distance', velocity + 'px');

        // تأخير وسرعة عشوائية (أسرع)
        confetti.style.animationDelay = Math.random() * 0.2 + 's';
        confetti.style.animationDuration = Math.random() * 0.8 + 1 + 's'; // تقليل مدة الانيميشن

        // دوران عشوائي
        const rotation = Math.random() * 720 - 360;
        confetti.style.setProperty('--rotation', rotation + 'deg');

        celebrationAnimation.appendChild(confetti);
    }

    // إخفاء زر Done بعد الانيميشن
    setTimeout(() => {
        doneBtn.classList.add('hidden');
    }, 1000);

    // إزالة عناصر الانيميشن
    setTimeout(() => {
        celebrationAnimation.innerHTML = '';
    }, 2500);
}

// Reset Stopwatch
function resetStopwatch() {
    clearInterval(interval);
    elapsedTime = 0;
    updateStopwatch();
    isRunning = false;
    startPauseBtn.textContent = 'Start';
    tasks[currentTaskIndex].time = 0;
    tasks[currentTaskIndex].startTime = null;
    tasks[currentTaskIndex].endTime = null;
    tasks[currentTaskIndex].done = false; // إعادة تعيين حالة المهمة
    doneBtn.classList.remove('hidden'); // إظهار زر Done
    resetModal.style.display = 'none';
}

function confirmReset() {
    resetStopwatch();
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
            report += `${task.name}: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}\nبدأ: ${task.startTime || 'N/A'} - انتهى: ${task.endTime || 'N/A'}\n\n`;
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
    doneBtn.classList.toggle('hidden', tasks[currentTaskIndex].done); // إظهار/إخفاء زر Done بناءً على حالة المهمة
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggleBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    themeToggleBtn.title = isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن';
}

// Event Listeners
startPauseBtn.addEventListener('click', toggleStopwatch);
doneBtn.addEventListener('click', markTaskDone);
resetBtn.addEventListener('click', resetStopwatch);
editBtn.addEventListener('click', editTaskName);
reportBtn.addEventListener('click', showReport);
themeToggleBtn.addEventListener('click', toggleDarkMode);
saveEditBtn.addEventListener('click', saveTaskName);
cancelEditBtn.addEventListener('click', cancelEdit);
closeReportBtn.addEventListener('click', closeReport);

taskTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => switchTask(index));
});

// Initialize First Task
switchTask(0);
