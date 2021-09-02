// import from pubsub

function createTask (name, description='description', due='none', priority='medium', project='unassigned', status='pending', id=genID.newID()) {
    // subscribe to project name changes

    return {
        id,
        'details': {
            name, 
            description,
            due,
            priority,
            project,
            status,
        }
    }
}

const genID = (() => {
    // check for uniqueness / existing ID's in local storage 
    // update local storage
    let id = 0;

    function newID() {
        return id++;
    }

    return {newID};
})();

function createTaskList () {
    const _tasksList = [];

    function listIDs () {
        return _tasksList.map(item => item.id)
    }

    function _checkID(id) {
        return listIDs().includes(id);
    }

    function _getItemIndex(id) {
        if (_checkID) {
             _tasksList.forEach(item => {
                if (item.id === id) {
                    return _tasksList.indexOf(item);
                }
            });
        }
    }

    function getItemByID(id) {
        if (_checkID(id)) {
            return _tasksList[_getItemIndex(id)];
        }
    }

    function addItem(newTask) {
        if (!(listIDs().includes(newTask.id))) {
            _tasksList.push(newTask);
        }
        // pubsub
    } 

    function removeItemByID(id) {
        if (_checkID(id)) {
            _tasksList.splice(_getItemIndex(id), 1);
            // pubsub
        }
    }

    function editItemDetails(id, newDetails) {
        if (_checkID) {
            getItemByID(id).details = {...newDetails}
            // pubsub
        }
    }

    function activeProjectsList() {
        const activeProjects = [];

        _tasksList.forEach(task => {
            // checks ID uniqueness but what if not?
            if (Object.keys(task.details).includes('project')) {
                activeProjects.push(task.details.project);
            }
        });

        return activeProjects;
    }
    
    return {
        listIDs,
        getItemByID,
        addItem,
        removeItemByID,
        editItemDetails,
        activeProjectsList,
    }
}


function createProjectList () {
    const _projectsList = new Set();

    function addProject(name) {
        return _projectsList.add(name);
    }

    function removeProject(project) {
        if (_projectsList.has(project)) {
            _projectsList.delete(project);
        }
    }

    function editProject(oldProject, newProject) {
        if (_projectsList.has(oldProject)) {
            _projectsList.delete(oldProject);
            _projectsList.add(newProject);
        }
        // publish oldProject -> newProject change 
    }
    
    function listProjects() {
        let list = [..._projectsList].sort();
        return list;
    }

    return {
        addProject,
        removeProject,
        editProject,
        listProjects,
    }
}

// const taskList = createTaskList();
// const task1 = createTask('task1');
// const task2 = createTask('task2');
// const task3 = createTask('task3', description='description', due='none', priority='medium', project='shopping');
// taskList.addItem(task1);
// taskList.addItem(task2);
// taskList.addItem(task3);
// const projects = createProjectList();
// let activePs = taskList.activeProjectsList();
// activePs.forEach(p => projects.addProject(p));
// console.log(projects.listProjects());
// console.log(taskList.listIDs())
// console.log(taskList.removeItemByID(taskList.listIDs()[0]))
// console.log(taskList.listIDs())

export {
    createTask,
    createTaskList,
    createProjectList,
}