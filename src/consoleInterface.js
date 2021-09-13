import { events } from '../src/pubSub';
import { createTask, createTaskList, createProjectList } from '../src/todoLogic.js';

// create a new list 
const todolist = createTaskList();

// start some projects

// add some tasks
const task1 = createTask('Task1');
const task2 = createTask('Task2');
const task3 = createTask('Task3');

todolist.addItem(task1);
todolist.addItem(task2);
todolist.addItem(task3);

// present default
console.log(todolist.list())

// present tasks for project 1

// delete tasks

// project 1 auto updates 