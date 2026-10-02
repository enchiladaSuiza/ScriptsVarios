import { Todo } from "./classes/todo.js";
import { Project } from "./classes/project.js";
import { Controller } from "./classes/controller.js";

let projects = JSON.parse(localStorage.getItem('projects'));

// console.log(projects);

const main = document.querySelector('main');
const controller = new Controller(main, projects);

const saveButton = document.getElementById('save');
saveButton.onclick = () => storeTodos();

const reloadButton = document.getElementById('reload');
reloadButton.onclick = () => reloadTodos();

const addProjectButton = document.getElementById('add-project');
addProjectButton.onclick = () => addProject();

function storeTodos() {
    const json = JSON.stringify(projects);
    console.log('Saving');
    console.log(json);
    localStorage.setItem('projects', json);
}

function reloadTodos() {
    controller.reload();
}

function addProject() {
    const newProjectName = document.getElementById('new-project').value;
    const project = new Project(newProjectName);
    projects[newProjectName] = project;
    controller.reload();
}