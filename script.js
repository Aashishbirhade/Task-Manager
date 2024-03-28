
document.addEventListener("DOMContentLoaded", function () {
 const taskInput = document.getElementById("taskInput");
 const taskDate = document.getElementById("taskDate");
 const addTaskBtn = document.getElementById("addTaskBtn");
 const taskList = document.getElementById("taskList");
 const filterCompletedCheckbox = document.getElementById("filterCompleted");

 // Retrieve tasks from local storage on page load
 const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

 // Function to add task to the list
 function addTaskToList(taskContent, taskDateValue, completed = false) {
     const li = document.createElement("li");
     li.innerHTML = `
         <span class="task-content">${taskContent}</span>
         <span class="task-date">${taskDateValue}</span>
         <button class="edit-btn">Edit</button>
         <button class="complete-btn">${completed ? 'Undo' : 'Complete'}</button>
         <button class="delete-btn">Delete</button>
     `;
     if (completed) {
         li.classList.add("completed");
     }
     taskList.appendChild(li);
 }

 // Function to show the task list
 function showTaskList() {
     taskList.style.display = "block";
 }

 // Display tasks from local storage
 if (tasks.length > 0) {
     showTaskList();
     tasks.forEach(task => {
         addTaskToList(task.content, task.date, task.completed);
     });
 }

 // Event listener for adding a new task
 addTaskBtn.addEventListener("click", function () {
     const taskContent = taskInput.value.trim();
     const taskDateValue = taskDate.value;
     if (taskContent !== "" && taskDateValue !== "") {
         if (tasks.length === 0) {
             showTaskList();
         }
         addTaskToList(taskContent, taskDateValue);
         tasks.push({ content: taskContent, date: taskDateValue, completed: false });
         localStorage.setItem("tasks", JSON.stringify(tasks));
         taskInput.value = "";
         taskDate.value = "";
     }
 });

 // Event listener for marking task as complete or deleting it
 taskList.addEventListener("click", function (e) {
     if (e.target.classList.contains("delete-btn")) {
         const taskElement = e.target.parentElement;
         const taskContent = taskElement.querySelector(".task-content").textContent;
         const index = tasks.findIndex(task => task.content === taskContent);
         if (index !== -1) {
             tasks.splice(index, 1);
             localStorage.setItem("tasks", JSON.stringify(tasks));
             taskElement.remove();
             if (tasks.length === 0) {
                 taskList.style.display = "none";
             }
         }
     } else if (e.target.classList.contains("complete-btn")) {
         const taskElement = e.target.parentElement;
         const taskContent = taskElement.querySelector(".task-content").textContent;
         const index = tasks.findIndex(task => task.content === taskContent);
         if (index !== -1) {
             tasks[index].completed = !tasks[index].completed;
             localStorage.setItem("tasks", JSON.stringify(tasks));
             taskElement.classList.toggle("completed");
             e.target.textContent = tasks[index].completed ? 'Undo' : 'Complete';
         }
     } else if (e.target.classList.contains("edit-btn")) {
         const taskElement = e.target.parentElement;
         const taskContentElement = taskElement.querySelector(".task-content");
         const taskDateElement = taskElement.querySelector(".task-date");
         const taskContent = taskContentElement.textContent;
         const taskDate = taskDateElement.textContent;
         const newTaskContent = prompt("Edit Task:", taskContent);
         const newTaskDate = prompt("Edit Date:", taskDate);
         if (newTaskContent !== null && newTaskDate !== null) {
             taskContentElement.textContent = newTaskContent;
             taskDateElement.textContent = newTaskDate;
             tasks[index].content = newTaskContent;
             tasks[index].date = newTaskDate;
             localStorage.setItem("tasks", JSON.stringify(tasks));
         }
     }
 });

 // Event listener for filtering completed tasks
 filterCompletedCheckbox.addEventListener("change", function () {
     const isChecked = filterCompletedCheckbox.checked;
     const allTasks = document.querySelectorAll("#taskList li");
     allTasks.forEach(task => {
         if (isChecked && task.classList.contains("completed")) {
             task.style.display = "flex";
         } else if (!isChecked && task.classList.contains("completed")) {
             task.style.display = "none";
         } else {
             task.style.display = "flex";
         }
     });
 });
});

