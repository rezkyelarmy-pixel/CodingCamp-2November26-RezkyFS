/**
 * Task Manager
 * A vanilla JavaScript todo app with Local Storage persistence.
 */
(function () {
    "use strict";

    // ===== Storage Key =====
    const STORAGE_KEY = "task-manager-tasks";

    // ===== State =====
    let tasks = [];
    let currentFilter = "all";

    // ===== DOM References =====
    const form = document.getElementById("task-form");
    const input = document.getElementById("task-input");
    const list = document.getElementById("task-list");
    const emptyState = document.getElementById("empty-state");
    const emptyStateText = document.getElementById("empty-state-text");
    const taskCount = document.getElementById("task-count");
    const clearCompletedBtn = document.getElementById("clear-completed");
    const filterButtons = document.querySelectorAll(".filters__btn");
    const taskTemplate = document.getElementById("task-template");

    // ===== Persistence =====

    /** Load tasks from Local Storage. */
    function loadTasks() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            tasks = stored ? JSON.parse(stored) : [];
        } catch (err) {
            console.error("Failed to load tasks:", err);
            tasks = [];
        }
    }

    /** Save tasks to Local Storage. */
    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (err) {
            console.error("Failed to save tasks:", err);
        }
    }

    // ===== Helpers =====

    /** Generate a unique id. */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    /** Escape HTML to prevent injection when building strings. */
    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    // ===== Task Operations =====

    /** Add a new task. */
    function addTask(text) {
        const trimmed = text.trim();
        if (!trimmed) return;
        tasks.unshift({
            id: generateId(),
            text: trimmed,
            completed: false,
            createdAt: Date.now(),
        });
        saveTasks();
        render();
    }

    /** Toggle a task's completion status. */
    function toggleTask(id) {
        const task = tasks.find((t) => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            render();
        }
    }

    /** Delete a task by id. */
    function deleteTask(id) {
        tasks = tasks.filter((t) => t.id !== id);
        saveTasks();
        render();
    }

    /** Update a task's text. */
    function editTask(id, newText) {
        const trimmed = newText.trim();
        const task = tasks.find((t) => t.id === id);
        if (task && trimmed) {
            task.text = trimmed;
            saveTasks();
            render();
        } else if (task && !trimmed) {
            // Empty edit deletes the task.
            deleteTask(id);
        }
    }

    /** Remove all completed tasks. */
    function clearCompleted() {
        tasks = tasks.filter((t) => !t.completed);
        saveTasks();
        render();
    }

    // ===== Filtering =====

    /** Get tasks filtered by the current view. */
    function getFilteredTasks() {
        if (currentFilter === "active") return tasks.filter((t) => !t.completed);
        if (currentFilter === "completed") return tasks.filter((t) => t.completed);
        return tasks;
    }

    // ===== Rendering =====

    /** Create a DOM element for a single task. */
    function createTaskElement(task) {
        const node = taskTemplate.content.cloneNode(true);
        const item = node.querySelector(".task-item");
        const checkbox = node.querySelector(".task-item__checkbox");
        const text = node.querySelector(".task-item__text");
        const editInput = node.querySelector(".task-item__edit-input");
        const deleteBtn = node.querySelector(".task-item__delete");

        item.dataset.id = task.id;
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as complete");

        if (task.completed) {
            item.classList.add("task-item--completed");
        }

        // Use textContent for safe rendering.
        text.textContent = task.text;

        // Toggle completion.
        checkbox.addEventListener("change", () => toggleTask(task.id));

        // Delete task.
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        // Enter edit mode on double-click.
        text.addEventListener("dblclick", () => {
            text.hidden = true;
            editInput.hidden = false;
            editInput.value = task.text;
            editInput.focus();
            editInput.select();
        });

        // Save edit on Enter or blur, cancel on Escape.
        function commitEdit() {
            text.hidden = false;
            editInput.hidden = true;
            if (editInput.value.trim() !== task.text) {
                editTask(task.id, editInput.value);
            }
        }

        editInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                commitEdit();
            } else if (e.key === "Escape") {
                text.hidden = false;
                editInput.hidden = true;
            }
        });

        editInput.addEventListener("blur", commitEdit);

        return node;
    }

    /** Render the full task list and footer. */
    function render() {
        const filtered = getFilteredTasks();

        // Build list.
        list.innerHTML = "";
        const fragment = document.createDocumentFragment();
        filtered.forEach((task) => fragment.appendChild(createTaskElement(task)));
        list.appendChild(fragment);

        // Empty state messaging depends on context.
        const showEmpty = filtered.length === 0;
        emptyState.hidden = !showEmpty;
        if (showEmpty) {
            if (tasks.length === 0) {
                emptyStateText.textContent = "No tasks yet. Add one above!";
            } else if (currentFilter === "active") {
                emptyStateText.textContent = "No active tasks. Nice work!";
            } else if (currentFilter === "completed") {
                emptyStateText.textContent = "No completed tasks yet.";
            }
        }

        // Footer: count and clear button.
        const activeCount = tasks.filter((t) => !t.completed).length;
        taskCount.textContent = activeCount === 1 ? "1 task left" : `${activeCount} tasks left`;

        const hasCompleted = tasks.some((t) => t.completed);
        clearCompletedBtn.hidden = !hasCompleted;
    }

    // ===== Event Listeners =====

    // Submit new task.
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        addTask(input.value);
        input.value = "";
        input.focus();
    });

    // Filter switching.
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.filter;
            filterButtons.forEach((b) => {
                b.classList.remove("is-active");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("is-active");
            btn.setAttribute("aria-selected", "true");
            render();
        });
    });

    // Clear completed tasks.
    clearCompletedBtn.addEventListener("click", clearCompleted);

    // ===== Init =====
    loadTasks();
    render();
})();
