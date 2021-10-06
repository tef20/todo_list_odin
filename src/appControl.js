import { events } from './pubSub';
import { loadPage } from './DOMitems.js';
import { addTask, createTask, listTasks, runDemoTasks, tasksEmpty } from './tasks.js';
import { addNewProject, applyFilter, getFilters, runDemoFilters } from './filters.js';

function initiate() {
    // render page
    loadPage();
    
    // check storage for filters
    if (tasksEmpty()) {
        runDemo();
    }
}

function runDemo() {
    runDemoFilters();
    runDemoTasks();
}
// function runDemoTasks() {

// }
// load from storage

export {
    initiate,
}
