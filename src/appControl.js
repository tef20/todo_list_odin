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
    runDemoTasks();
    runDemoFilters();
}

events.on('requestTasks', handleTaskRequest);

function handleTaskRequest(filterID) {
    events.emit('filterSelected', filterID);
    
    const tasks = listTasks();
    console.log(tasks);
    events.emit('filterUpdated', tasks)
}

// load from storage

export {
    initiate,
}
