import { events } from './pubSub';
import { loadPage } from './DOMitems.js';
import { addTask, createTask, listTasks, runDemoTasks } from './tasks.js';
import { addNewProject, applyFilter, getFilters, runDemoFilters } from './filters.js';

function initiate() {
    // render page
    loadPage();
        
    // check storage for tasks
    // check storage for filters
    // if empty create new
    runDemoFilters();
    runDemoTasks();
}

// load from storage

export {
    initiate,
}
