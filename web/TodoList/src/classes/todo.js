export class Todo {
    completed = false;
    
    constructor(title, description = "", dueDate = null, priority = 10, completed = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
    }
}