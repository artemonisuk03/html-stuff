let todo = JSON.parse(localStorage.getItem("todo")) || [];

const todo_input = document.getElementById("todo_input");
const todo_list = document.getElementById("todo_list");
const todo_count = document.getElementById("todo_count");
const add_button = document.querySelector(".btn");
const delete_button = document.getElementById("delete_button");

document.addEventListener("DOMContentLoaded", function () {
  add_button.addEventListener("click", addTask);
  todo_input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });
  display_tasks();
});

function addTask() {
  const newTask = todo_input.value.trim();
  if (newTask !== "") {
    todo.push({
      text: newTask,
      disabled: false,
    });
    saveToLocalStorage();
    todo_input.value = "";
    display_tasks();
  }
}

function deleteTask(index) {

    for(let i = index; i < todo.length-1; i++) {
        todo[i] = todo[i+1];

    }
    todo.pop();
    saveToLocalStorage();
    display_tasks();
}

function display_tasks() {
  todo_list.innerHTML = "";
  todo.forEach((item, index) => {
    const p = document.createElement("p");

    p.innerHTML = `
        <div class="todo_container">

            <input type="checkbox" class="todo_checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
            <input type="button" class="todo_checkbox1" id="delete-${index}">


        <p id="todo_${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">
        ${item.text}
        </p>
        </div>
        `;
        p.querySelector(".todo_checkbox").addEventListener("change", () => {
            toggleTask(index);
        });
        p.querySelector(".todo_checkbox1").addEventListener("click", () => {
            deleteTask(index);
        });
    todo_list.appendChild(p);
  });
  todo_count.textContent = todo.length;
}

function editTask(index) {
    const todoItem = document.getElementById(`todo_${index}`);
    const existingText = todo[index].text;
    const inputElement = document.createElement("input");

    inputElement.value = existingText;
    todoItem.replaceWith(inputElement);
    inputElement.focus();

    
    inputElement.addEventListener("keydown", function (event) {
        const updatedText = inputElement.value.trim();
        if (updatedText && event.key === "Enter") {
            todo[index].text = updatedText;
            saveToLocalStorage();
            display_tasks();
        }
    });
    inputElement.addEventListener("blur", function() {
        const updatedText = inputElement.value.trim();
        if (updatedText) {
            todo[index].text = updatedText;
            saveToLocalStorage();
        }
        display_tasks();
    });
}

function toggleTask(index) {
    todo[index].disabled = !todo[index].disabled;
    saveToLocalStorage();
    display_tasks();
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}
