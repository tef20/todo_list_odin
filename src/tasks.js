import {events} from './pubSub';
import { genID as taskIDFactory} from './idGenerator.js';

const _tasks = [];
const IDGenerator = taskIDFactory();

events.on('taskAdd', addTask);
events.on('taskRemove', removeTaskByID);
events.on('taskEdit', editTaskDetail);


function listTasks() {
    return JSON.parse(JSON.stringify(_tasks));
}

function createTask (name, description='description', due='none', priority='medium', project='unassigned', status='pending', id=IDGenerator.newID()) {
    // let _name = name;
    // let _description = description;
    // let _due = due;
    // let _priority = priority;
    // let _project = project;
    // let _status = status;
    // let _id = id;

    const _task = {
        name, 
        description,
        due,
        priority,
        project,
        status,
        id,
    }
        
    function getAttribute(key, value){
        return _task[key] = value;
    }

    function setAttribute(key, value) {
        _task[key] = value;
    }

    return {
        name, 
        description,
        due,
        priority,
        project,
        status,
        id,
    }
}

function addTask(newTask) {
        _tasks.push(newTask);
        events.emit('tasksUpdated', listTasks());
} 

function removeTaskByID(id) {
    if (_checkID(id)) {
        _tasks.splice(_getItemIndex(id), 1);
        events.emit('tasksUpdated', listTasks());
    }
}

function clearAllTasks() {
    while (_tasks.length > 0) {
        _tasks.pop();
    }
    events.emit('tasksUpdate', listTasks());
}

function editTaskDetail(id, taskDetail, newValue) {
    for (let item of _tasks) {
        if (item.id === id) {
            item[taskDetail] = newValue;
            events.emit('tasksUpdated', listTasks());
            break;
        }
    }
}

function _checkID(id) {
    return _tasks.find(element => element.id === id);
}

function _getItemIndex(id) {
    for (let i = 0; i < _tasks.length; i++) {
        if (_tasks['id'] = id) {
            return i;
        }
    }
}

function runDemoTasks() {
    clearAllTasks();

    const demoTask1 = createTask('Wash the dishes');
    demoTask1['project'] = 'Housework';
    addTask(demoTask1);
    
    const demoTask2 = createTask('Learn html');
    demoTask2['project'] = 'Website';
    addTask(demoTask2);
    
    const demoTask3 = createTask('Buy a banana');
    demoTask3['project'] = 'Shopping List';
    addTask(demoTask3);
    
}

export {
    listTasks,
    createTask,
    addTask,
    removeTaskByID,
    editTaskDetail,
    runDemoTasks,
}
