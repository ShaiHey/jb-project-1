function collectData() {
    const taskDescription = document.getElementById("taskDescription").value;
    const dateTask = document.getElementById("dateTask").value;
    const timeTask = document.getElementById("timeTask").value;
    const index = getLengthOfTasks();

    return {taskDescription, dateTask, timeTask, index};
}

function generateHTML(data) {
    const newHTML = `
    <div class="taskCard">
        <div>
            <span class="glyphicon glyphicon-remove" onclick="deleteTask(${data.index})"></span>
        </div>
        <div class="desc">${data.taskDescription}</div>
        <div>${data.dateTask}</div>
        <div>${data.timeTask}</div>
    </div>
    `;
    
    return newHTML;
}

function saveTaskToStorage(taskObj) {
    const currentTasksInStorageJSON = localStorage.getItem("tasks");
    const currentTasksInStorage = JSON.parse(currentTasksInStorageJSON);
    currentTasksInStorage.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(currentTasksInStorage));
}

function renderHTML(newHTML) {
    const tasksContainer = document.getElementById("tasksContainer");
    tasksContainer.innerHTML += newHTML;
}

function clearTasksBoard() {
    const tasksContainer = document.getElementById("tasksContainer");
    tasksContainer.innerHTML = "";
}

function clearForm() {
    const taskForm = document.getElementById("taskForm");
    taskForm.reset();

    const taskDescription = document.getElementById("taskDescription");
    taskDescription.focus();
}

function addTask(event) {
    event.preventDefault();
    const data = collectData();
    const newHTML = generateHTML(data);
    saveTaskToStorage(data);
    renderHTML(newHTML);
    clearForm();
}

function deleteTask(index) {
    const currentTasksInStorageJSON = localStorage.getItem("tasks");
    const tasks = JSON.parse(currentTasksInStorageJSON);
    tasks.splice(index, 1);

    clearTasksBoard();
    let newIndex = 0;
    let finalHTML = "";
    for(const task of tasks) {
        task.index = newIndex;
        const newHTML = generateHTML(task);
        finalHTML += newHTML;
        newIndex++
    }
    renderHTML(finalHTML);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getLengthOfTasks() {
    return JSON.parse(localStorage.getItem("tasks")).length;
}

function loadTask() {
    const currentTasksInStorageJSON = localStorage.getItem("tasks");
    let finalHTML = "";
    if(currentTasksInStorageJSON) {
        const tasks = JSON.parse(currentTasksInStorageJSON);
        let index = 0;
        for(const task of tasks){
            const currentTime = new Date();
            const expirationDate = new Date(`${task.dateTask} ${task.timeTask}`);
            if(expirationDate >= currentTime) {
                const newHTML = generateHTML(task);
                finalHTML += newHTML;
            } else {
                tasks.splice(index, 1);
            }
            index++
        }
        if(finalHTML) renderHTML(finalHTML);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}

function initStorage() {
    const currentTasksInStorageJSON = localStorage.getItem("tasks");
    if(!currentTasksInStorageJSON) {
        localStorage.setItem("tasks", JSON.stringify([]));
    }
}

initStorage();
loadTask();