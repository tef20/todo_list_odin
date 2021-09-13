import { loadPage, createHeader, createNav, createViewer } from './DOMitems.js';
import { createTask, createTaskList, createProjectList } from './todoLogic.js';
// import './consoleInterface.js';

function initiate() {
    // render page
    const content = loadPage();

    // check storage for items
    // if empty create new
    const todoList = createTaskList();
    const projectList = createProjectList();
    // add to storage 

    // render
    
    // return object?
}



export {
    initiate
}
