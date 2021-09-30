import { events } from './pubSub';
import { genID as taskIDFactory} from './idGenerator.js';

const _tasks = [];
const IDGenerator = taskIDFactory();

events.on('taskAdd', addTask);
events.on('taskRemove', removeTaskByID);
events.on('taskEdit', editTaskDetail);

events.on('publishLiveFilter', applyFilter);
events.on('tasksUpdated', requestLiveFilter);

function listTasks() {
    return JSON.parse(JSON.stringify(_tasks));
}

function createTask (name, description='', due='', priority='medium', project='unassigned', status='pending', selected=true, id=IDGenerator.newID()) {
    const _task = {
        name, 
        description,
        due,
        priority,
        project,
        status,
        selected,
        id,
    }
        
    function getAttribute(attribute){
        return _task[attribute];
    }

    function setAttribute(attribute, newValue) {
        _task[attribute] = newValue;
    }

    return {
        name, 
        description,
        due,
        priority,
        project,
        status,
        selected,
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
    events.emit('tasksUpdated', listTasks());
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

function requestLiveFilter() {
    events.emit('requestLiveFilter');
}

function applyFilter(filter) {
    const {rules} = filter; 
    _tasks.forEach(task => {
        task['selected'] = rules.every(rule => rule(task)) ? true : false;
    });
        
    events.emit('filterApplied', filter);
    events.emit('publishFilteredTasks', getFilteredTasks());
}

function getFilteredTasks() {
    return _tasks.filter(task => task['selected'] === true);
}

function _checkID(id) {
    return _tasks.find(element => element.id == id);
}

function _getItemIndex(id) {
    for (let i = 0; i < _tasks.length; i++) {
        if (_tasks[i]['id'] == id) {
            return i;
        }
    }
}

function runDemoTasks() {
    clearAllTasks();

    const demoTask1 = createTask('Wash the dishes');
    demoTask1['project'] = 'Housework';
    demoTask1['priority'] = 'medium';
    addTask(demoTask1);
    
    const demoTask2 = createTask('Learn html');
    demoTask2['project'] = 'Website';
    demoTask2['priority'] = 'high';
    addTask(demoTask2);
    
    const demoTask3 = createTask('Buy a banana');
    demoTask3['project'] = 'Shopping List';
    demoTask3['priority'] = 'low';
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
