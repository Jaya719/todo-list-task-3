
// Get HTML elements
const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const filterButtons = document.querySelector(".filters");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <input type="checkbox" class="complete-btn"
                ${task.completed ? "checked" : ""}>
            <span class="task-text"></span>
            <div class="task-actions">
                <button type="button" class="edit-btn">Edit</button>
                <button type="button" class="delete-btn">Delete</button>
            </div>
        `;

        li.querySelector(".task-text").textContent = task.text;
        taskList.appendChild(li);
    });

    const remainingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${remainingTasks} tasks remaining`;

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";
}

// Add task
todoForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (!taskText) return;

    tasks.push({
        id: Date.now().toString(),
        text: taskText,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = "";
});

// Edit and Delete using event delegation
taskList.addEventListener("click", function(event) {
    const taskItem = event.target.closest(".task-item");
    if (!taskItem) return;

    const taskId = taskItem.dataset.id;

    if (event.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }

    if (event.target.classList.contains("edit-btn")) {
        const task = tasks.find(task => task.id === taskId);
        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText !== null && updatedText.trim() !== "") {
            task.text = updatedText.trim();
            saveTasks();
            renderTasks();
        }
    }
});

// Complete and Uncomplete tasks
taskList.addEventListener("change", function(event) {
    if (!event.target.classList.contains("complete-btn")) return;

    const taskItem = event.target.closest(".task-item");
    const task = tasks.find(item => item.id === taskItem.dataset.id);

    if (task) {
        task.completed = event.target.checked;
        saveTasks();
        renderTasks();
    }
});

// Filter tasks
filterButtons.addEventListener("click", function(event) {
    const button = event.target.closest(".filter-btn");
    if (!button) return;

    currentFilter = button.dataset.filter;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
    renderTasks();
});

// Load tasks when page opens
renderTasks();
