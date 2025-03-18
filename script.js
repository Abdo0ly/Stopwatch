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

// Stopwatch Variables
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let interval;

// تعديل متغير المهام ليقرأ من localStorage إذا وجد، وإلا يستخدم القيم الافتراضية
const defaultTasks = [
    { name: 'Task 1', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 2', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 3', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 4', time: 0, startTime: null, endTime: null, done: false },
    { name: 'Task 5', time: 0, startTime: null, endTime: null, done: false },
];

let tasks = JSON.parse(localStorage.getItem('tasks')) || defaultTasks;

let currentTaskIndex = 0;

// إضافة في بداية الملف مع باقي المتغيرات
const currentTheme = localStorage.getItem('theme');

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
            tasks[currentTaskIndex].time = elapsedTime;
            saveTasks();
        }, 1000);
        startPauseBtn.textContent = 'Pause';
        if (!tasks[currentTaskIndex].startTime) {
            tasks[currentTaskIndex].startTime = new Date().toLocaleTimeString('ar-EG');
        }
        saveTasks();
    } else {
        clearInterval(interval);
        startPauseBtn.textContent = 'Resume';
        tasks[currentTaskIndex].time = elapsedTime;
        saveTasks();
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

    // تخزين الوقت النهائي للمهمة
    tasks[currentTaskIndex].endTime = new Date().toLocaleTimeString('ar-EG');

    // تخزين الوقت المنقضي بدون مضاعفة
    tasks[currentTaskIndex].time = elapsedTime;
    tasks[currentTaskIndex].done = true;
    tasks[currentTaskIndex].isRunning = false;

    saveTasks(); // حفظ البيانات
    celebrate();
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
    clearInterval(interval);
    elapsedTime = 0;
    updateStopwatch();
    isRunning = false;
    startPauseBtn.textContent = 'Start';
    tasks[currentTaskIndex].time = 0;
    tasks[currentTaskIndex].startTime = null;
    tasks[currentTaskIndex].endTime = null;
    tasks[currentTaskIndex].done = false;
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

// Switch Task
function switchTask(index) {
    // إذا كان المؤقت يعمل، قم بإيقافه وحفظ الوقت المنقضي
    if (isRunning) {
        clearInterval(interval);
        tasks[currentTaskIndex].time = elapsedTime;
        tasks[currentTaskIndex].isRunning = isRunning;
        saveTasks();
    }

    // حفظ الوقت المنقضي للمهمة الحالية قبل التبديل
    tasks[currentTaskIndex].time = elapsedTime;
    tasks[currentTaskIndex].isRunning = isRunning;
    saveTasks();

    // تغيير المهمة الحالية
    currentTaskIndex = index;
    taskName.textContent = tasks[currentTaskIndex].name;

    // استعادة الوقت المنقضي للمهمة الجديدة
    elapsedTime = tasks[currentTaskIndex].time;
    isRunning = tasks[currentTaskIndex].isRunning;

    // تحديث عرض الوقت
    updateStopwatch();

    // إذا كانت المهمة الجديدة في حالة تشغيل، قم بتشغيل المؤقت
    if (isRunning) {
        startTime = Date.now() - elapsedTime;
        interval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateStopwatch();
            tasks[currentTaskIndex].time = elapsedTime;
            saveTasks();
        }, 1000);
        startPauseBtn.textContent = 'Pause';
    } else {
        startPauseBtn.textContent = 'Start';
    }

    // تحديث واجهة المستخدم
    taskTabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
        tab.textContent = tasks[i].name;
    });

    resetModal.style.display = 'none';
    editModal.style.display = 'none';
    reportModal.style.display = 'none';
    doneBtn.classList.toggle('hidden', tasks[currentTaskIndex].done);
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

// Event Listeners
startPauseBtn.addEventListener('click', toggleStopwatch);
doneBtn.addEventListener('click', markTaskDone);
resetBtn.addEventListener('click', resetStopwatch);
editBtn.addEventListener('click', editTaskName);
reportBtn.addEventListener('click', showReport);
themeToggleBtn.addEventListener('click', toggleTheme);
saveEditBtn.addEventListener('click', saveTaskName);
cancelEditBtn.addEventListener('click', cancelEdit);
closeReportBtn.addEventListener('click', closeReport);

taskTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => switchTask(index));
});

// Initialize First Task
switchTask(0);

// دالة لحفظ البيانات في localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// دالة إعادة تعيين كل المهام
function resetAllTasks() {
    // إيقاف الستوب واتش إذا كان يعمل
    if (isRunning) {
        clearInterval(interval);
        isRunning = false;
    }

    // إعادة تعيين المهام للوضع الافتراضي
    tasks = [
        { name: 'Task 1', time: 0, startTime: null, endTime: null, done: false, isRunning: false },
        { name: 'Task 2', time: 0, startTime: null, endTime: null, done: false, isRunning: false },
        { name: 'Task 3', time: 0, startTime: null, endTime: null, done: false, isRunning: false },
        { name: 'Task 4', time: 0, startTime: null, endTime: null, done: false, isRunning: false },
        { name: 'Task 5', time: 0, startTime: null, endTime: null, done: false, isRunning: false }
    ];

    // تحديث localStorage
    saveTasks();

    // إعادة تعيين الواجهة
    elapsedTime = 0;
    updateStopwatch();
    startPauseBtn.textContent = 'Start';
    doneBtn.classList.remove('hidden');

    // تحديث أسماء المهام في الشريط الجانبي
    taskTabs.forEach((tab, index) => {
        tab.textContent = tasks[index].name;
    });

    // تحديث المهمة الحالية
    taskName.textContent = tasks[currentTaskIndex].name;

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
