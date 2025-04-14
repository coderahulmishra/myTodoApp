const darkModeBtn = document.getElementById('darkModeBtn');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const taskDate = document.getElementById('taskDate');
const taskTime = document.getElementById('taskTime');
const taskForm = document.getElementById('taskForm');
const searchInput = document.getElementById('searchInput');

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

addTaskBtn.addEventListener('click', () => {
  const now = new Date();
  taskDate.value = now.toISOString().split('T')[0]; // yyyy-mm-dd
  taskTime.value = now.toTimeString().slice(0, 5); // hh:mm
  taskModal.style.display = 'flex';
});

// taskForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const taskName = document.getElementById('taskInput').value;
//   const date = taskDate.value;
//   const time = taskTime.value;
//   console.log("Task Added:", taskName, date, time);
//   taskModal.style.display = 'none';
//   taskForm.reset();
// });

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const taskName = document.getElementById('taskInput').value;
  const date = taskDate.value;
  const time = taskTime.value;

  const taskObj = {
    id: Date.now(),
    title: taskName,
    date,
    time,
    completed: false
  };

  tasksArray.push(taskObj);
  saveTasksToLocalStorage(tasksArray);
  renderTask(taskObj);
  showToast("Task added successfully!");

  taskModal.style.display = 'none';
  taskForm.reset();
});

function renderTask(taskObj) {
  const taskCard = document.createElement('div');
  taskCard.classList.add('task-card');
  if (taskObj.completed) taskCard.classList.add('completed');
  taskCard.setAttribute('data-id', taskObj.id);

  taskCard.innerHTML = `
    <h4 contenteditable="false">${taskObj.title}</h4>
    <small>${taskObj.date} at ${taskObj.time}</small>
    <div class="task-actions">
      <button class="edit-btn">✏️</button>
      <button class="complete-btn">✅</button>
      <button class="delete-btn">❌</button>
    </div>
  `;

  // Event: Delete
  taskCard.querySelector('.delete-btn').addEventListener('click', () => {
    taskCard.remove();
    showToast("Task deleted!");
    tasksArray = tasksArray.filter(t => t.id !== taskObj.id);
    saveTasksToLocalStorage(tasksArray);
  });

  // Event: Complete
  taskCard.querySelector('.complete-btn').addEventListener('click', () => {
    taskCard.classList.toggle('completed');
    const found = tasksArray.find(t => t.id === taskObj.id);
    found.completed = !found.completed;
    showToast("Task marked as completed!");
    saveTasksToLocalStorage(tasksArray);
  });

  // Event: Edit
  const titleEl = taskCard.querySelector('h4');
  const editBtn = taskCard.querySelector('.edit-btn');

  editBtn.addEventListener('click', () => {
    const isEditing = titleEl.getAttribute('contenteditable') === 'true';
    if (!isEditing) {
      titleEl.setAttribute('contenteditable', 'true');
      titleEl.focus();
      editBtn.textContent = '💾';
    } else {
      titleEl.setAttribute('contenteditable', 'false');
      editBtn.textContent = '✏️';
      const found = tasksArray.find(t => t.id === taskObj.id);
      found.title = titleEl.textContent.trim();
      showToast("Task updated!");
      saveTasksToLocalStorage(tasksArray);
    }
  });

  document.getElementById('taskList').appendChild(taskCard);
}

window.addEventListener('click', (e) => {
  if (e.target == taskModal) {
    taskModal.style.display = 'none';
  }
});

searchInput.addEventListener('input', () => {
  const searchValue = searchInput.value.toLowerCase();
  const tasks = document.querySelectorAll('.task-card');

  tasks.forEach(task => {
    const title = task.querySelector('h4').textContent.toLowerCase();
    if (title.includes(searchValue)) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
});

function saveTasksToLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
}

let tasksArray = loadTasksFromLocalStorage();

window.addEventListener('DOMContentLoaded', () => {
  tasksArray.forEach(task => renderTask(task));
});

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500); // 2.5 seconds
}

