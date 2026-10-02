export class Project {
    todos = {};
    
    constructor(name) {
        this.name = name;
    }

    addTodo(todo) {
        this.todos[todo.title] = todo;
    }

    removeTodo(todoName) {
        delete this.todos[todoName];
    }

    static addMethods(jsonProject) {
        jsonProject.addTodo = (todo) => {
            jsonProject.todos[todo.title] = todo;
        }

        jsonProject.removeTodo = (todoName) => {
            delete jsonProject.todos[todoName];
        }
    }
}
