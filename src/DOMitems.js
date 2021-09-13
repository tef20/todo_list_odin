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

function createSidebar() {
    // Sidebar //
    const sidebar = document.createElement('section');
    sidebar.id = 'sidebar';

    // create side toggle
    appendSideToggle(sidebar);

    const filterTabsList = document.createElement('ul');
    filterTabsList.id = 'filterTabsList';
    sidebar.appendChild(filterTabsList);
    
    const allTab = createFilterTab(null, null);
    filterTabsList.appendChild(allTab);
    
    events.on('taskUpdate', renderFilterTabs);

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
    const filterTabs = compileFilters(filterData);
    const filterTabsList = document.getElementById('filterTabsList');
    if (filterTabsList) {
        removeAllChildNodes(filterTabsList)
        renderList(filterTabsList, filterTabs);
    }    
}

function compileFilters(filterData) {
    const filterTabs = [
        [], 
        // projects
        [],
    ]

    // create default tab, 
    const allTab = createFilterTab(null, null)
    filterTabs[0].push(allTab);
    
    for (let filterInfo of filterData) {
        const filterTab = createFilterTab(filterInfo.name, filterInfo.type)
        if (filterInfo.type === 'project') {
            filterTabs[1].push(filterTab);
        }
        else {
            filterTabs[0].push(filterTab);
        }
    }

    return filterTabs.flat();
}

function createFilterTab(filterName, filterType) {
    const filterTab = document.createElement('li');
    filterTab.className = 'filterTab';
    filterTab.dataset.filterName = filterName;
    filterTab.dataset.filterType = filterType;
    filterTab.textContent = filterName === null ? 'inbox' : filterName;

    const filterIcon = document.createElement('i');
    filterIcon.textContent = 'icon'; // getIcon(filterType);
    // filterTab.appendChild(filterIcon);
    filterTab.insertAdjacentElement('afterbegin', filterIcon);

    if (filterType === 'project') {
        const deleteFilterIcon = document.createElement('i');
        deleteFilterIcon.textContent = 'delete';
        filterTab.appendChild(deleteFilterIcon);
    }    

    return filterTab;
}

function renderList(parentNode, elementsList) {
    for (tab in filterTabs) {
        parent.appendChild(tab);
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

function createViewer () {
    // which view?
    // default (inbox) or specified?

    // elements:
    // > title
    // > constraints:
    // -> time

    // Viewer //
    // Section
    const tasksViewer = document.createElement('section');
    tasksViewer.id = 'taskViewer';

    // View Title
    const tasksHeader = document.createElement('h2');
    tasksHeader.className = 'tasksHeader';
    tasksHeader.textContent = 'Task header';
    tasksViewer.appendChild(tasksHeader);

    // Task List
    const tasksList = document.createElement('ul');
    tasksList.className = 'tasksList';
    tasksViewer.appendChild(tasksList);

    // Task
    const task = document.createElement('li');
    task.className = 'task';
    tasksList.appendChild(task);

    // Task Checkbox
    const taskCheckbox = document.createElement('input');
    taskCheckbox.id = `checkID${1}`;
    taskCheckbox.type = 'checkbox';
    task.appendChild(taskCheckbox);

    // Task Label
    const taskCheckboxLabel = document.createElement('label');
    taskCheckboxLabel.htmlFor = `checkID${1}`;
    taskCheckboxLabel.textContent = "Test task";
    task.appendChild(taskCheckboxLabel);

    // Task Description
    const taskDescription = document.createElement('span');
    taskDescription.textContent = 'description';
    task.appendChild(taskDescription);

    // Task Due Date
    const taskDueDate = document.createElement('span');
    taskDueDate.textContent = '01.01.1999';
    task.appendChild(taskDueDate);

    // Task Priority Icon
    const taskPriorityIcon = document.createElement('icon');
    taskPriorityIcon.className = 'checkIcon';
    taskPriorityIcon.textContent = 'medium';
    task.appendChild(taskPriorityIcon);

    // Task Delete Icon
    const taskDeleteIcon = document.createElement('icon');
    taskDeleteIcon.className = 'checkIcon';
    taskDeleteIcon.textContent = 'delete';
    task.appendChild(taskDeleteIcon);

    // Add Task Button
    const addTaskButton = document.createElement('button');
    addTaskButton.id = 'addTask';
    addTaskButton.className = 'task';
    addTaskButton.textContent = 'Add task';
    tasksList.appendChild(addTaskButton);

    const addTaskIcon = document.createElement('i');
    addTaskIcon.textContent = 'icon';
    addTaskButton.insertAdjacentElement('afterbegin', addTaskIcon);

    return tasksViewer;
}

export {
    loadPage,
    createHeader, 
    createSidebar, 
    createViewer, 
}