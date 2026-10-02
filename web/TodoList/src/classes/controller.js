import { Todo } from "./todo.js";
import { Project } from "./project.js";

export class Controller {
    constructor(element, projects) {
        this.element = element;
        this.projects = projects;
        this.projectCards = {}
        this.renderProjects();
    }

    renderProjects() {
        if (!this.projects) {
            return;
        }
        
        for (const [name, project] of Object.entries(this.projects)) {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');

            const projectHeader = document.createElement('div');
            projectHeader.classList.add('project-header');
            
            const projectTitle = document.createElement('h2');
            projectTitle.textContent = project.name;
            projectHeader.appendChild(projectTitle);

            const deleteProject = document.createElement('button');
            deleteProject.classList.add('delete-project');
            deleteProject.textContent = '×';
            deleteProject.onclick = () => {
                delete this.projects[name];
                this.reload();
            }
            projectHeader.appendChild(deleteProject);

            const addTodo = document.createElement('button');
            addTodo.classList.add('add-todo');
            addTodo.textContent = 'Add ToDo';
            addTodo.onclick = () => {
                const editor = projectCard.querySelector('.editor-card');
                if (editor.classList.contains('invisible')) {
                    editor.classList.remove('invisible');
                }
                else {
                    editor.classList.add('invisible');
                }
            };
            projectHeader.appendChild(addTodo);

            projectCard.appendChild(projectHeader);

            const editorCard = this.generateEditor(project);
            projectCard.appendChild(editorCard);
            
            let completedTodos = {};
            let hasCompletedTodos = false;
            for (const [title, todo] of Object.entries(project.todos)) {
                if (todo.completed) {
                    hasCompletedTodos = true;
                    completedTodos[title] = todo;
                    continue;
                }
                
                projectCard.appendChild(this.generateTodo(todo, project));
            }

            if (hasCompletedTodos) {
                const completedSeparator = document.createElement('button');
                completedSeparator.classList.add('completed-separator');
                completedSeparator.textContent = 'Show/Hide completed';
                completedSeparator.onclick = () => {
                    projectCard.querySelectorAll('.completed').forEach((element) => {
                        if (element.classList.contains('invisible')) {
                            element.classList.remove('invisible');
                        }
                        else {
                            element.classList.add('invisible');
                        }
                    });
                };
                projectCard.appendChild(completedSeparator);
            }
            
            for (const [title, todo] of Object.entries(completedTodos)) {
                projectCard.appendChild(this.generateTodo(todo, project));
            }
            
            this.projectCards[project.name] = projectCard;
            this.element.appendChild(projectCard);
        }
    }

    generateTodo(todo, project) {
        const todoCard = document.createElement('div');
        todoCard.classList.add('todo-card');
        
        const todoTitle = document.createElement('p');
        todoTitle.textContent = todo.title;
        todoCard.appendChild(todoTitle);

        const todoDesc = document.createElement('p');
        todoDesc.textContent = todo.description;
        todoCard.appendChild(todoDesc);

        if (todo.dueDate) {
            const todoDate = document.createElement('p');
            todoDate.textContent = `Due: ${todo.dueDate}`;
            todoDate.classList.add('due-date');
            todoCard.appendChild(todoDate);
        }

        if (todo.priority) {
            const todoPriority = document.createElement('p');
            todoPriority.textContent = `Priority: ${todo.priority}`;
            todoPriority.classList.add('priority');
            todoCard.appendChild(todoPriority);
        }

        const todoOptions = document.createElement('div');
        todoOptions.classList.add('options');

        const todoDelete = document.createElement('button');
        todoDelete.classList.add('delete-todo');
        todoDelete.textContent = "×";
        todoDelete.onclick = () => {
            Project.addMethods(project);
            project.removeTodo(todo.title);
            todoCard.remove();
        }
        todoOptions.appendChild(todoDelete);

        const todoEdit = document.createElement('button');
        todoEdit.classList.add('edit-todo');
        todoEdit.textContent = "Edit";
        todoEdit.onclick = () => {
            const editor = this.generateEditor(project, todo);
            todoCard.replaceWith(editor);
        };
        todoOptions.appendChild(todoEdit);

        const todoMarkComplete = document.createElement('input');
        todoMarkComplete.classList.add('mark');
        todoMarkComplete.type = 'checkbox';

        if (todo.completed) {
            todoCard.classList.add('completed');
            todoMarkComplete.checked = true;
        }

        todoMarkComplete.onclick = () => {
            todo.completed = !todo.completed;
            if (todo.completed) {
                todoCard.classList.add('completed');
            }
            else {
                todoCard.classList.remove('completed');
            }
        }
        
        todoOptions.appendChild(todoMarkComplete);
        todoCard.appendChild(todoOptions);

        return todoCard;
    }

    reload() {
        this.element.replaceChildren();
        this.renderProjects();
    }

    generateEditor(project, todo = null) {
        const editorCard = document.createElement('div');
        editorCard.classList.add('editor-card');

        const editorTitle = document.createElement('input');
        editorTitle.placeholder = 'Título';
        editorCard.appendChild(editorTitle);

        const editorDesc = document.createElement('textarea');
        editorDesc.placeholder = 'Descripción';
        editorCard.appendChild(editorDesc);

        const editorDate = document.createElement('input');
        editorDate.type = 'date';
        editorCard.appendChild(editorDate);

        const editorPriority = document.createElement('input');
        editorPriority.type = 'number';
        editorPriority.placeholder = 'Priority';
        editorCard.appendChild(editorPriority);

        const editorAdd = document.createElement('button');
        editorCard.appendChild(editorAdd);
        
        // ¿El editor es para actualizar un todo existente?
        if (todo) {
            editorAdd.textContent = 'Update';
            editorTitle.value = todo.title;
            editorDesc.value = todo.description;
            editorDate.value = todo.dueDate;
            editorPriority.value = todo.priority;

            editorAdd.onclick = () => {
                todo.title = editorTitle.value;
                todo.description = editorDesc.value;
                todo.dueDate = editorDate.value;
                todo.priority = editorPriority.value;

                this.reload();
            };
        }
        else {
            editorCard.classList.add('invisible');
            editorAdd.textContent = 'Add';

            editorAdd.onclick = () => {
                const todo = new Todo(
                    editorTitle.value,
                    editorDesc.value,
                    editorDate.value,
                    editorPriority.value
                );
                
                Project.addMethods(project);
                project.addTodo(todo);
                this.reload();
            };
        }
        
        return editorCard;
    }
}
