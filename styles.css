/* General Styles */

body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    color: #333;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    transition: background-color 0.3s, color 0.3s;
}

body.dark-mode {
    background-color: #1e1e1e;
    color: #f4f4f4;
}

.container {
    display: flex;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 800px;
    max-width: 90%;
    transition: background-color 0.3s, color 0.3s;
}

body.dark-mode .container {
    background-color: #2c3e50;
    color: #f4f4f4;
}


/* Sidebar Styles */

.sidebar {
    background-color: #2c3e50;
    padding: 20px;
    width: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: background-color 0.3s;
}

body.dark-mode .sidebar {
    background-color: #1c2a38;
}

.sidebar .task-tab {
    background: none;
    border: none;
    color: white;
    padding: 10px;
    margin: 5px 0;
    cursor: pointer;
    width: 100%;
    text-align: right;
    border-radius: 5px;
    transition: background 0.3s;
}

.sidebar .task-tab.active {
    background-color: #34495e;
}

.sidebar .task-tab:hover {
    background-color: #34495e;
}


/* Main Content Styles */

.main-content {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.main-content .task-name {
    font-size: 24px;
    margin-bottom: 20px;
    color: #2c3e50;
    transition: color 0.3s;
}

body.dark-mode .main-content .task-name {
    color: #f4f4f4;
}

.main-content .stopwatch {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #2c3e50;
    transition: color 0.3s;
}

body.dark-mode .main-content .stopwatch {
    color: #f4f4f4;
}

.main-content .controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.main-content .controls button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.main-content .controls button.done {
    background-color: #2196F3;
}

.main-content .controls button.reset {
    background-color: #f44336;
    padding: 10px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-content .controls button:hover {
    opacity: 0.9;
}

.main-content .controls button.hidden {
    display: none;
}


/* Side Buttons (Edit and Report) */

.main-content .side-buttons {
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.main-content .side-buttons button {
    background: none;
    border: none;
    color: #2c3e50;
    cursor: pointer;
    font-size: 20px;
    position: relative;
    transition: color 0.3s;
}

body.dark-mode .main-content .side-buttons button {
    color: #f4f4f4;
}

.main-content .side-buttons button::after {
    content: attr(title);
    position: absolute;
    top: 50%;
    left: 30px;
    transform: translateY(-50%);
    background: #2c3e50;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
}

.main-content .side-buttons button:hover::after {
    opacity: 1;
}


/* Modal Styles */

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, color 0.3s;
}

body.dark-mode .modal-content {
    background-color: #2c3e50;
    color: #f4f4f4;
}

.modal-content h3 {
    margin-top: 0;
    color: #2c3e50;
    transition: color 0.3s;
}

body.dark-mode .modal-content h3 {
    color: #f4f4f4;
}

.modal-content input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

body.dark-mode .modal-content input {
    background-color: #1c2a38;
    color: #f4f4f4;
    border-color: #34495e;
}

.modal-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

.modal-buttons button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.modal-buttons button.confirm {
    background-color: #4CAF50;
    color: white;
}

.modal-buttons button.cancel {
    background-color: #f44336;
    color: white;
}

.modal-buttons button#save-edit {
    background-color: #4CAF50;
    color: white;
}

.modal-buttons button#cancel-edit,
.modal-buttons button#close-report {
    background-color: #f44336;
    color: white;
}


/* Celebration Animation */

#celebration-animation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
    overflow: hidden;
}

.confetti {
    position: fixed;
    transform-origin: center;
    animation: confetti-spread var(--duration, 2s) ease-out forwards;
}

.confetti.square {
    border-radius: 2px;
}

.confetti.rectangle {
    border-radius: 1px;
}

.confetti.strip {
    border-radius: 1px;
    transform-origin: center bottom;
}

@keyframes confetti-spread {
    0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 1;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: translate( calc(cos(var(--angle)) * var(--distance)), calc(sin(var(--angle)) * var(--distance))) rotate(var(--rotation, 360deg));
        opacity: 0;
    }
}
