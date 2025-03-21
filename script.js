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
const resetAllBtn = document.querySelector('.reset-all');
const resetAllModal = document.getElementById('reset-all-modal');

// App State
const APP_STATE = {
    isRunning: false,
    startTime: 0,
    elapsedTime: 0,
    currentTaskIndex: 0,
    interval: null
};

// Default Tasks
const defaultTasks = [
    { name: 'Task 1', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 2', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 3', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 4', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 5', time: 0, startTime: null, endTime: null, done: false },
];

// Storage Functions
function isStorageAvailable() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

function saveTasks() {
    if (!isStorageAvailable()) return;
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [...defaultTasks];
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [...defaultTasks];
    }
}

// Initialize tasks
let tasks = loadTasks();

// Core Functions
function updateStopwatch() {
    const hours = Math.floor(APP_STATE.elapsedTime / 3600000);
    const minutes = Math.floor((APP_STATE.elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((APP_STATE.elapsedTime % 60000) / 1000);
    stopwatch.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateUIState() {
    updateStopwatch();
    startPauseBtn.textContent = APP_STATE.isRunning ? 'Pause' : 'Start';
    doneBtn.classList.toggle('hidden', tasks[APP_STATE.currentTaskIndex].done);
    taskTabs.forEach((tab, index) => {
        tab.textContent = tasks[index].name;
        tab.classList.toggle('active', index === APP_STATE.currentTaskIndex);
    });
    taskName.textContent = tasks[APP_STATE.currentTaskIndex].name;
}

// Event Handlers
function toggleStopwatch() {
    if (!APP_STATE.isRunning) {
        APP_STATE.startTime = Date.now() - APP_STATE.elapsedTime;
        APP_STATE.interval = setInterval(() => {
            APP_STATE.elapsedTime = Date.now() - APP_STATE.startTime;
            updateStopwatch();
            tasks[APP_STATE.currentTaskIndex].time = APP_STATE.elapsedTime;
            saveTasks();
        }, 1000);
        if (!tasks[APP_STATE.currentTaskIndex].startTime) {
            tasks[APP_STATE.currentTaskIndex].startTime = new Date().toLocaleTimeString('ar-EG');
        }
    } else {
        clearInterval(APP_STATE.interval);
        tasks[APP_STATE.currentTaskIndex].time = APP_STATE.elapsedTime;
    }
    APP_STATE.isRunning = !APP_STATE.isRunning;
    startPauseBtn.textContent = APP_STATE.isRunning ? 'Pause' : 'Start';
    saveTasks();
}

function switchTask(index) {
    if (APP_STATE.isRunning) {
        clearInterval(APP_STATE.interval);
        tasks[APP_STATE.currentTaskIndex].time = APP_STATE.elapsedTime;
    }
    APP_STATE.currentTaskIndex = index;
    APP_STATE.elapsedTime = tasks[index].time || 0;
    APP_STATE.isRunning = false;
    updateUIState();
    saveTasks();
}

// Event Listeners Setup
function setupEventListeners() {
    startPauseBtn.addEventListener('click', toggleStopwatch);
    doneBtn.addEventListener('click', markTaskDone);
    resetBtn.addEventListener('click', () => resetModal.style.display = 'flex');
    editBtn.addEventListener('click', editTaskName);
    reportBtn.addEventListener('click', showReport);
    themeToggleBtn.addEventListener('click', toggleTheme);

    document.querySelector('.confirm') ?.addEventListener('click', confirmReset);
    document.querySelector('.cancel') ?.addEventListener('click', cancelReset);
    saveEditBtn.addEventListener('click', saveTaskName);
    cancelEditBtn.addEventListener('click', cancelEdit);
    closeReportBtn.addEventListener('click', closeReport);

    taskTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => switchTask(index));
    });

    resetAllBtn.addEventListener('click', () => resetAllModal.style.display = 'flex');
    document.querySelector('#reset-all-modal .confirm') ?.addEventListener('click', confirmResetAll);
    document.querySelector('#reset-all-modal .cancel') ?.addEventListener('click', cancelResetAll);
}

// Initialize App
function initializeApp() {
    tasks = loadTasks();
    APP_STATE.elapsedTime = tasks[APP_STATE.currentTaskIndex].time || 0;
    setupEventListeners();
    updateUIState();
    initializeTheme();
}

// Start App
document.addEventListener('DOMContentLoaded', initializeApp);

// إضافة في بداية الملف
const currentTheme = localStorage.getItem('theme');

// إضافة في بداية الملف
function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Update Stopwatch Display
function updateStopwatch() {
    const hours = Math.floor(APP_STATE.elapsedTime / 3600000);
    const minutes = Math.floor((APP_STATE.elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((APP_STATE.elapsedTime % 60000) / 1000);
    stopwatch.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Start/Pause Stopwatch
function toggleStopwatch() {
    try {
        if (!APP_STATE.isRunning) {
            APP_STATE.startTime = Date.now() - APP_STATE.elapsedTime;
            APP_STATE.interval = setInterval(() => {
                APP_STATE.elapsedTime = Date.now() - APP_STATE.startTime;
                updateStopwatch();
                tasks[APP_STATE.currentTaskIndex].time = APP_STATE.elapsedTime;
                saveTasks();
            }, 1000);
            startPauseBtn.textContent = 'Pause';
            if (!tasks[APP_STATE.currentTaskIndex].startTime) {
                tasks[APP_STATE.currentTaskIndex].startTime = new Date().toLocaleTimeString('ar-EG');
            }
        } else {
            clearInterval(APP_STATE.interval);
            startPauseBtn.textContent = 'Start';
            tasks[APP_STATE.currentTaskIndex].time = APP_STATE.elapsedTime;
        }

        APP_STATE.isRunning = !APP_STATE.isRunning;
        tasks[APP_STATE.currentTaskIndex].isRunning = APP_STATE.isRunning;
        saveTasks();
    } catch (e) {
        console.error('Error in toggleStopwatch:', e);
        // في حالة حدوث خطأ، نحاول إيقاف المؤقت
        clearInterval(APP_STATE.interval);
        APP_STATE.isRunning = false;
        startPauseBtn.textContent = 'Start';
    }
}

// Done Button
function markTaskDone() {
    if (APP_STATE.isRunning) {
        clearInterval(APP_STATE.interval);
        APP_STATE.isRunning = false;
        startPauseBtn.textContent = 'Start';
    }

    tasks[APP_STATE.currentTaskIndex].endTime = new Date().toLocaleTimeString('ar-EG');
    tasks[APP_STATE.currentTaskIndex].time = APP_STATE.elapsedTime;
    tasks[APP_STATE.currentTaskIndex].done = true;
    tasks[APP_STATE.currentTaskIndex].isRunning = false;

    // حفظ البيانات في localStorage مع timestamp
    saveTasks();

    // إضافة نسخة احتياطية
    saveBackup();

    celebrate();
    doneBtn.classList.add('hidden');
}

// Celebration Animation
function celebrate() {
    const colors = [
        '#FFD700', // ذهبي
        '#FFA500', // برتقالي
        '#FF6B6B', // وردي فاتح
        '#FF4136', // أحمر
        '#FFE4B5', // بيج فاتح
        '#FFFFFF', // أبيض
        '#FFB6C1', // وردي فاتح
        '#FFC0CB', // وردي
        '#FFD700', // ذهبي آخر
        '#FF69B4' // وردي غامق
    ];

    // الحصول على موقع زر Done
    const doneButton = document.querySelector('.done');
    const buttonRect = doneButton.getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    // إنشاء 150 قطعة
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // تحديد نوع القطعة
        const type = Math.random();
        if (type < 0.4) {
            confetti.classList.add('square');
        } else if (type < 0.7) {
            confetti.classList.add('rectangle');
        } else {
            confetti.classList.add('strip');
        }

        // تعيين موقع البداية
        confetti.style.left = startX + 'px';
        confetti.style.top = startY + 'px';

        // تعيين لون عشوائي
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // تعيين حجم أصغر
        const size = Math.random() * 4 + 1;
        if (confetti.classList.contains('strip')) {
            confetti.style.width = (size / 2) + 'px';
            confetti.style.height = (size * 3) + 'px';
        } else if (confetti.classList.contains('rectangle')) {
            confetti.style.width = size + 'px';
            confetti.style.height = (size * 1.2) + 'px';
        } else {
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
        }

        // تعيين زاوية للانتشار في جميع الاتجاهات مع تفضيل الاتجاه لأعلى
        const baseAngle = Math.random() * 90 - 45; // انتشار أولي في نطاق 90 درجة
        const angle = baseAngle + (Math.random() * 60 + 240); // إضافة زاوية عشوائية مع تفضيل الاتجاه لأعلى
        const velocity = 150 + Math.random() * 120; // مسافة متوسطة (من 150 إلى 270 بكسل)
        confetti.style.setProperty('--angle', angle + 'deg');
        confetti.style.setProperty('--distance', velocity + 'px');

        // حركة أبطأ قليلاً
        confetti.style.animationDelay = Math.random() * 0.2 + 's';
        confetti.style.animationDuration = Math.random() * 0.8 + 1 + 's';

        // دوران عشوائي
        const rotation = Math.random() * 360 - 180;
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
    clearInterval(APP_STATE.interval);
    APP_STATE.elapsedTime = 0;
    updateStopwatch();
    APP_STATE.isRunning = false;
    startPauseBtn.textContent = 'Start';
    tasks[APP_STATE.currentTaskIndex].time = 0;
    tasks[APP_STATE.currentTaskIndex].startTime = null;
    tasks[APP_STATE.currentTaskIndex].endTime = null;
    tasks[APP_STATE.currentTaskIndex].done = false;
    doneBtn.classList.remove('hidden');
    resetModal.style.display = 'none';
    saveTasks(); // حفظ البيانات
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
    newTaskNameInput.value = tasks[APP_STATE.currentTaskIndex].name;
    editModal.style.display = 'flex';
}

// Save Edited Task Name
function saveTaskName() {
    const newName = newTaskNameInput.value.trim();
    if (newName) {
        tasks[APP_STATE.currentTaskIndex].name = newName;
        taskName.textContent = newName;
        taskTabs[APP_STATE.currentTaskIndex].textContent = newName;
        editModal.style.display = 'none';
        saveTasks(); // حفظ البيانات
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

// Toggle Theme
function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
        // من الداكن إلى الحديث
        document.body.classList.remove('dark-mode');
        document.body.classList.add('modern-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-palette"></i>';
        themeToggleBtn.title = 'الوضع العادي';
        localStorage.setItem('theme', 'modern');
    } else if (document.body.classList.contains('modern-mode')) {
        // من الحديث إلى العادي
        document.body.classList.remove('modern-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggleBtn.title = 'الوضع الداكن';
        localStorage.setItem('theme', 'light');
    } else {
        // من العادي إلى الداكن
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggleBtn.title = 'الوضع الحديث';
        localStorage.setItem('theme', 'dark');
    }
}

// إضافة كود تهيئة الوضع عند تحميل الصفحة (قبل نهاية الملف)
if (currentTheme) {
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggleBtn.title = 'الوضع الحديث';
    } else if (currentTheme === 'modern') {
        document.body.classList.add('modern-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-palette"></i>';
        themeToggleBtn.title = 'الوضع العادي';
    }
}

// إضافة دالة جديدة لتهيئة الثيم
function initializeTheme() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggleBtn.title = 'الوضع الحديث';
    } else if (currentTheme === 'modern') {
        document.body.classList.add('modern-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-palette"></i>';
        themeToggleBtn.title = 'الوضع العادي';
    }
}

// دالة إعادة تعيين كل المهام
function resetAllTasks() {
    // حفظ الثيم الحالي
    const currentTheme = localStorage.getItem('theme');

    // مسح كل البيانات من localStorage
    localStorage.clear();

    // إعادة تعيين الثيم
    if (currentTheme) {
        localStorage.setItem('theme', currentTheme);
    }

    // إعادة تعيين المهام للوضع الافتراضي
    tasks = defaultTasks.map(task => ({...task }));

    // إيقاف الستوب واتش إذا كان يعمل
    if (APP_STATE.isRunning) {
        clearInterval(APP_STATE.interval);
        APP_STATE.isRunning = false;
    }

    // إعادة تعيين الحالة
    APP_STATE.elapsedTime = 0;
    APP_STATE.currentTaskIndex = 0;

    // تحديث الواجهة
    updateUIState();

    // إغلاق Modal
    resetAllModal.style.display = 'none';
}

function confirmResetAll() {
    resetAllTasks();
}

function cancelResetAll() {
    resetAllModal.style.display = 'none';
}

// إضافة Event Listener للزر
resetAllBtn.addEventListener('click', () => {
    resetAllModal.style.display = 'flex';
});

window.addEventListener('storage', function(e) {
    if (e.key === 'tasks') {
        loadTasks();
        updateUIState();
    }
});

// تبسيط إضافة event listeners
function addEventListeners() {
    startPauseBtn.addEventListener('click', toggleStopwatch);
    doneBtn.addEventListener('click', markTaskDone);
    resetBtn.addEventListener('click', () => resetModal.style.display = 'flex');
    editBtn.addEventListener('click', editTaskName);
    reportBtn.addEventListener('click', showReport);
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Modal buttons
    document.querySelector('.confirm') ?.addEventListener('click', confirmReset);
    document.querySelector('.cancel') ?.addEventListener('click', cancelReset);
    saveEditBtn.addEventListener('click', saveTaskName);
    cancelEditBtn.addEventListener('click', cancelEdit);
    closeReportBtn.addEventListener('click', closeReport);

    // Task tabs
    taskTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => switchTask(index));
    });

    // Reset all
    resetAllBtn.addEventListener('click', () => resetAllModal.style.display = 'flex');
    document.querySelector('#reset-all-modal .confirm') ?.addEventListener('click', confirmResetAll);
    document.querySelector('#reset-all-modal .cancel') ?.addEventListener('click', cancelResetAll);
}
