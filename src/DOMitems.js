import { events } from './pubSub.js';

// Load basic page
function loadPage() {  
    // create content container
    const content = createContainer();
    document.body.appendChild(content);
    
    // create basic page
    // header
    const header = createHeader();
    content.appendChild(header);

    // main 
    const main = document.createElement('main');
    content.appendChild(main);

    // sidebar
    const sidebar = createSidebar();
    main.appendChild(sidebar);

    // viewer
    const viewer = createViewer();
    main.appendChild(viewer);

    return content;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild); 
    }
}

function createContainer() {
    // clear existing container
    if (document.getElementById('content')) {
        document.removeChild(document.getElementById('content'));
    }

    const container = document.createElement('div');
    container.id = 'content';

    return container;
}

// Header
function createHeader() {
    const header = document.createElement('header');

    const h1 = document.createElement('h1');
    h1.className = 'headerBar';
    h1.textContent = 'Main Header';
    header.appendChild(h1);

    return header;
}

// Sidebar //
function createSidebar() {
    const sidebar = document.createElement('section');
    sidebar.id = 'sidebar';

    // create side toggle
    appendSideToggle(sidebar);

    const filterTabsList = document.createElement('ul');
    filterTabsList.id = 'filterTabsList';
    sidebar.appendChild(filterTabsList);
        
    events.on('filtersUpdate', renderFilterTabs);

    const newFilterButton = createNewFilterButton();
    sidebar.appendChild(newFilterButton);

    return sidebar;
}

function appendSideToggle(parent) {
    const sideToggle = document.createElement('input');
    sideToggle.type = 'checkbox';
    sideToggle.id = 'sideToggle';
    parent.appendChild(sideToggle);

    const sideToggleLabel = document.createElement('label');
    sideToggleLabel.htmlFor = 'sideToggle';
    sideToggleLabel.textContent = '>'
    parent.appendChild(sideToggleLabel);
}

function renderFilterTabs(filterData) {
    const filterTabsList = document.getElementById('filterTabsList');
    if (filterTabsList) {
        removeAllChildNodes(filterTabsList)
        
        for (let key in filterData) {
            const filterTab = createFilterTab(filterData[key]);
            filterTabsList.appendChild(filterTab);
        }
    }    
}

function createFilterTab({id, name, type}) {
    const filterTab = document.createElement('li');
    filterTab.className = 'filterTab';
    filterTab.dataset.filterId = id;
    filterTab.dataset.filterName = name;
    
    filterTab.textContent = name;

    const filterIcon = document.createElement('i');
    filterIcon.textContent = 'icon'; // getIcon(filterType);
    // filterTab.appendChild(filterIcon);
    filterTab.insertAdjacentElement('afterbegin', filterIcon);

    if (type === 'project') {
        const deleteFilterIcon = document.createElement('i');
        deleteFilterIcon.textContent = 'delete';
        filterTab.appendChild(deleteFilterIcon);
    }    

    filterTab.addEventListener('click', handleFilterClick);
    
    return filterTab;
}

function handleFilterClick(event) {
    if (event.target.dataset.filterName) {
        document.querySelector('.tasksHeader').textContent = event.target.dataset.filterName;
        events.emit('requestTasks', event.target.dataset.filterId);
    }
}

function createNewFilterButton() {
    // Add Project Button
    const newFilterButton = document.createElement('button');
    newFilterButton.id = 'newFilterButton';
    // newFilterButton.className = 'project';
    newFilterButton.textContent = 'Add new';

    const addFilterIcon = document.createElement('i');
    addFilterIcon.textContent = 'icon';
    newFilterButton.insertAdjacentElement('afterbegin', addFilterIcon);

    return newFilterButton;
}

// View Window //
function createViewer () {
    // Section
    const tasksViewer = document.createElement('section');
    tasksViewer.id = 'taskViewer';

    // Header
    const tasksHeader = document.createElement('h2');
    tasksHeader.className = 'tasksHeader';
    tasksHeader.textContent = 'Task header';
    tasksViewer.appendChild(tasksHeader)

    events.on('updateViewHeader', updateViewHeader);

    // Task List
    const tasksList = document.createElement('ul');
    tasksList.className = 'tasksList';
    tasksViewer.appendChild(tasksList);

    events.on('filterApplied', renderViewTasks);

    // New Task Button
    const addNewTaskButton = createAddTaskButton();
    addNewTaskButton.addEventListener('click', openNewTaskForm)
    tasksViewer.appendChild(addNewTaskButton);

    
    return tasksViewer;
}

function updateViewHeader (name) {
    // View Title
    const tasksHeader = document.querySelector('.tasksHeader');
    tasksHeader.textContent = name;
}

function renderViewTasks(tasks) {
    const tasksList = document.querySelector('.tasksList');
    removeAllChildNodes(tasksList);

    tasks.forEach(task => {
        const taskEntry = createTaskEntry(task);
        tasksList.appendChild(taskEntry);
    });
}

function createTaskEntry(task) {
    // Task
    const taskEntry = document.createElement('li');
    taskEntry.className = 'task';
    taskEntry.id = task.id;

    // Task Checkbox
    const taskCheckbox = document.createElement('input');
    taskCheckbox.id = `checkID${task.id}`;
    taskCheckbox.type = 'checkbox';
    taskEntry.appendChild(taskCheckbox);

    // Task Label
    const taskCheckboxLabel = document.createElement('label');
    taskCheckboxLabel.htmlFor = `checkID${task.id}`;
    taskCheckboxLabel.textContent = task.name;
    taskEntry.appendChild(taskCheckboxLabel);

    // Task Description
    const taskDescription = document.createElement('span');
    taskDescription.textContent = task.taskDescription;
    taskEntry.appendChild(taskDescription);

    // Task Due Date
    const taskDueDate = document.createElement('span');
    taskDueDate.textContent = task.document;
    taskEntry.appendChild(taskDueDate);

    // Task Priority Icon
    const taskPriorityIcon = document.createElement('icon');
    taskPriorityIcon.className = 'checkIcon';
    taskPriorityIcon.textContent = task.priority;
    taskEntry.appendChild(taskPriorityIcon);

    // Task Delete Icon
    const taskDeleteIcon = document.createElement('icon');
    taskDeleteIcon.className = 'checkIcon';
    taskDeleteIcon.textContent = 'delete';
    taskEntry.appendChild(taskDeleteIcon);

    return taskEntry;
}

function createAddTaskButton() {
    // Add Task Button
    const addTaskButton = document.createElement('button');
    addTaskButton.id = 'addTask';
    addTaskButton.className = 'task';
    addTaskButton.textContent = 'Add task';

    const addTaskIcon = document.createElement('i');
    addTaskIcon.textContent = 'icon';
    addTaskButton.insertAdjacentElement('afterbegin', addTaskIcon);

    return addTaskButton;
}

function createPopUpOverLay() {
    const overLay = document.createElement('div');
    overLay.id = 'popUpOverLay';

    return overLay;
}

function createNewTaskPopUp () {
    const newTaskPopUp = createPopUpOverLay();
    const newTaskForm = createNewTaskForm();

    newTaskPopUp.appendChild(newTaskForm);

    return newTaskPopUp;
}

function createNewTaskForm() {
    const addTaskForm = document.createElement('div');
    addTaskForm.id = 'taskForm';

    const formTitle = document.createElement('p');
    formTitle.textContent ='New Task';
    addTaskForm.appendChild(formTitle);

    const nameInputLabel = document.createElement('label');
    nameInputLabel.htmlFor = 'taskNameInput';
    nameInputLabel.textContent = 'Name: '
    addTaskForm.appendChild(nameInputLabel);
    
    const taskNameInput = document.createElement('input');
    taskNameInput.className = 'newTaskInput';
    taskNameInput.id = 'taskNameInput';
    addTaskForm.appendChild(taskNameInput);
    
    const descriptionInputLabel = document.createElement('label');
    descriptionInputLabel.htmlFor = 'detailsNameInput';
    descriptionInputLabel.textContent = 'Description: '
    addTaskForm.appendChild(descriptionInputLabel);
    
    const taskDescriptionInput = document.createElement('input');
    taskDescriptionInput.className = 'newTaskInput';
    taskDescriptionInput.id = 'taskDescriptionInput';
    addTaskForm.appendChild(taskDescriptionInput);
    
    const projectInputLabel = document.createElement('label');
    projectInputLabel.htmlFor = 'taskNameInput';
    projectInputLabel.textContent = 'Project: '
    addTaskForm.appendChild(projectInputLabel);
    
    const taskProjectInput = document.createElement('input');
    taskProjectInput.className = 'newTaskInput';
    taskProjectInput.id = 'taskProjectInput';
    addTaskForm.appendChild(taskProjectInput);

    const priorityInputLabel = document.createElement('label');
    priorityInputLabel.htmlFor = 'taskNameInput';
    priorityInputLabel.textContent = 'Priority: '
    addTaskForm.appendChild(priorityInputLabel);
    
    const taskPriorityInput = document.createElement('input');
    taskPriorityInput.className = 'newTaskInput';
    taskPriorityInput.id = 'taskPriorityInput';
    addTaskForm.appendChild(taskPriorityInput);

    const saveTaskButton = document.createElement('button');
    saveTaskButton.textContent = 'Save task';
    addTaskForm.appendChild(saveTaskButton);
    

    return addTaskForm;
}

const newTaskPopUp = createNewTaskPopUp();
document.body.appendChild(newTaskPopUp);

function openNewTaskForm(){
    const newTaskForm = document.getElementById('newTaskForm');
    newTaskForm.setAttribute('style', 'display: flex');

}

export {
    loadPage,
    createHeader, 
    createSidebar, 
    createViewer, 
}