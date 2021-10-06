import { events } from './pubSub.js';
import { createTask } from './tasks.js';
import { createGoogleIcon, materialIconsOutlinedStylesheetLink } from './googleFonts.js';
import { format } from 'date-fns';

// TODO:
// - allow editing tasks 
// - manage local storage
// - tidy up!

const content = createMainContainer();
document.body.appendChild(content);

// Load basic page
function loadPage() {  
    document.head.appendChild(materialIconsOutlinedStylesheetLink);
    
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

    // Popups
    const popUpOverLay = createPopUpOverLay();
    popUpOverLay.classList.add('inactive');
    content.appendChild(popUpOverLay);

    // new filter 
    const newFilterForm = createNewFilterPopUp();
    newFilterForm.classList.add('inactive');
    popUpOverLay.appendChild(newFilterForm);

    // new task
    const newTaskForm = createNewTaskPopUp();
    newTaskForm.classList.add('inactive');
    popUpOverLay.appendChild(newTaskForm);

    // Binders 
    events.on('filterApplied', markSelectedFilter);
    // events.on('liveFilterUpdated', markSelectedFilter)

    return content;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild); 
    }
}

function createMainContainer() {
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
    h1.textContent = 'You have so much to do.';
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
    sideToggle.classList.add('checkbox');
    parent.appendChild(sideToggle);

    const sideToggleLabel = document.createElement('label');
    sideToggleLabel.htmlFor = 'sideToggle';
    // sideToggleLabel.textContent = 'hi'
    parent.appendChild(sideToggleLabel);

    const toggleIcon = createGoogleIcon('expansion');
    toggleIcon.classList.add('toggleIcon', 'tabIcon');
    toggleIcon.addEventListener('click', (e)=> e.target.classList.toggle('collapsed'));
    sideToggleLabel.appendChild(toggleIcon);
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

function markSelectedFilter({id}) {
    document.querySelectorAll('.filterTab').forEach(tab => {
        if (tab.dataset.filterId == id) {
            tab.classList.add('selectedTab');
        } else {
            tab.classList.remove('selectedTab');
        }
    })
}

function createFilterTab({id, name, type}) {
    const filterTab = document.createElement('li');
    filterTab.className = 'filterTab';
    filterTab.dataset.filterId = id;
    filterTab.dataset.filterName = name;
    
    const filterIcon = createGoogleIcon(type);
    filterIcon.classList.add('tabIcon');
    filterIcon.dataset.filterId = id;
    filterIcon.dataset.filterName = name;
    filterTab.appendChild(filterIcon);

    const tabInfo = document.createElement('span');
    tabInfo.className = 'expandedTab';
    tabInfo.textContent = name;
    tabInfo.dataset.filterId = id;
    tabInfo.dataset.filterName = name;
    filterTab.appendChild(tabInfo);

    if (type === 'project') {
        const deleteFilterIcon = createGoogleIcon('delete');
        deleteFilterIcon.classList.add('expandedTab', 'tabIcon', 'deleteFilterIcon');
        deleteFilterIcon.dataset.filterId = id;
        deleteFilterIcon.dataset.filterName = name;

        filterTab.appendChild(deleteFilterIcon);
        deleteFilterIcon.addEventListener('click', handleFilterRemove);
    }    

    filterIcon.addEventListener('click', handleFilterSelect);
    tabInfo.addEventListener('click', handleFilterSelect);
    
    return filterTab;
}

function handleFilterSelect(event) {
    if (event.target.dataset.filterName) {
        events.emit('updateLiveFilter', event.target.dataset.filterId);
    }
}

function handleFilterRemove(event) {
    if (event.target.dataset.filterName) {
        events.emit('filterRemove', event.target.dataset.filterId);
    }
}

function createNewFilterButton() {
    // Add Project Button
    const newFilterButton = document.createElement('button');
    newFilterButton.id = 'newFilterButton';

    const addFilterIcon = createGoogleIcon('add');
    addFilterIcon.classList.add('tabIcon');
    newFilterButton.appendChild(addFilterIcon);
    
    const buttonTitle = document.createElement('span');
    buttonTitle.className = 'expandedTab';
    buttonTitle.textContent = 'Add project';
    newFilterButton.appendChild(buttonTitle);
    
    newFilterButton.addEventListener('click', displayNewFilterPopUp);

    return newFilterButton;
}

function displayNewFilterPopUp() {
    document.querySelector('.popUpOverLay').classList.remove('inactive');
    document.querySelector('.newFilterPopUp').classList.remove('inactive');
    document.getElementById('filterNameInput').focus();
}

function createNewFilterPopUp() {
    const popUpBox = document.createElement('div');
    popUpBox.classList.add('newFilterPopUp', 'popUp')
    
    const newFilterForm = createNewFilterForm();
    popUpBox.appendChild(newFilterForm);

    const submitButton = createGoogleIcon('submit');
    submitButton.classList.add('submitButton');
    submitButton.addEventListener('click', (e) => {
        document.getElementById('filterForm').requestSubmit();
    });
    popUpBox.appendChild(submitButton);

    const cancelButton = createCloseButton();
    cancelButton.classList.add('filterCloseButton');
    popUpBox.appendChild(cancelButton);

    return popUpBox;
}

function createNewFilterForm() {
    const addFilterForm = document.createElement('form');
    addFilterForm.id = 'filterForm';

    const filterNameInput = document.createElement('input');
    filterNameInput.className = 'newFilterInput';
    filterNameInput.id = 'filterNameInput';
    filterNameInput.placeholder = 'Give your project a name!';
    filterNameInput.maxLength = '20';
    filterNameInput.required = true;
    addFilterForm.appendChild(filterNameInput);

    addFilterForm.addEventListener('submit', handleSaveFilter);
    
    return addFilterForm;
}

function handleSaveFilter(e) {
    e.preventDefault();

    const filterName = content.querySelector('#filterNameInput').value;
    events.emit('projectAdd', filterName)

    content.querySelector('#filterForm').reset()
    closePopUps();
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

    events.on('filterApplied', updateViewHeader);

    // Task List
    const tasksList = document.createElement('ul');
    tasksList.className = 'tasksList';
    tasksViewer.appendChild(tasksList);

    events.on('publishFilteredTasks', renderViewTasks);

    // New Task Button
    const addNewTaskButton = createAddTaskButton();
    tasksViewer.appendChild(addNewTaskButton);

    
    return tasksViewer;
}

function updateViewHeader ({name}) {
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
    taskCheckbox.className = 'checkbox';
    taskEntry.appendChild(taskCheckbox);

    // Task Label
    const taskLabel = document.createElement('label');
    taskLabel.htmlFor = `checkID${task.id}`;
    taskEntry.appendChild(taskLabel);
    
    // Task Name
    const taskName = document.createElement('span');
    taskName.classList.add('taskEntryName');
    taskName.textContent = task.name;
    taskLabel.appendChild(taskName);

    // Task Description
    const taskDescription = document.createElement('span');
    taskDescription.classList.add('taskEntryDescription');
    taskDescription.textContent = task.description ? task.description : '';
    taskLabel.appendChild(taskDescription);

    // Task Due Date
    const taskDueDate = document.createElement('span');
    taskDueDate.classList.add('taskEntryDueDate');
    taskDueDate.textContent = task.due ? format(task.due, 'dd/M/y') : '';
    taskLabel.appendChild(taskDueDate);

    // Task Priority Icon
    // const taskPriorityIcon = document.createElement('span');
    const taskPriorityIcon = createGoogleIcon('priority');
    taskPriorityIcon.classList.add('taskIcon', `priority${task.priority}`);
    taskEntry.appendChild(taskPriorityIcon);

    // Task Edit Icon
    const taskEditIcon = createGoogleIcon('edit');
    taskEditIcon.classList.add('taskIcon');
    taskEntry.appendChild(taskEditIcon);

    // Task Delete Icon
    const taskDeleteIcon = createGoogleIcon('delete');
    taskDeleteIcon.dataset.taskId = task.id;
    taskDeleteIcon.classList.add('taskIcon');
    taskDeleteIcon.addEventListener('click', handleTaskRemove);
    taskEntry.appendChild(taskDeleteIcon);

    return taskEntry;
}

function handleTaskRemove(e) {
    const taskID = e.target.dataset.taskId;
    if (taskID) {
        events.emit('taskRemove', taskID);
    }
}

function createAddTaskButton() {
    // Add Task Button
    const addTaskButton = document.createElement('button');
    addTaskButton.id = 'addTask';
    addTaskButton.className = 'task';
    addTaskButton.textContent = 'Add task';

    const addTaskIcon = createGoogleIcon('add');
    addTaskButton.insertAdjacentElement('afterbegin', addTaskIcon);

    // event binding
    addTaskButton.addEventListener('click', displayNewTaskPopUp);

    return addTaskButton;
}

function displayNewTaskPopUp() {
    document.querySelector('.popUpOverLay').classList.remove('inactive');
    document.querySelector('.newTaskPopUp').classList.remove('inactive');
    document.getElementById('taskNameInput').focus();
}

function createPopUpOverLay() {
    const overLay = document.createElement('div');
    overLay.classList.add('popUpOverLay', 'popUp');

    // click overlay to exit
    overLay.addEventListener('click', (e) => {
        if (e.target === overLay) {
            closePopUps();
        }
    });
    // press <esc> to exit
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            closePopUps();
        }
    });

    return overLay;
}

function createNewTaskPopUp() {
    const popUpBox = document.createElement('div');
    popUpBox.classList.add('newTaskPopUp', 'popUp')

    const newTaskForm = createNewTaskForm();
    popUpBox.appendChild(newTaskForm);
    
    const formOptionsDiv = document.createElement('div');
    formOptionsDiv.className = 'taskFormOptionsDiv';
    popUpBox.appendChild(formOptionsDiv);
    
    const saveTaskButton = createGoogleIcon('submit');
    saveTaskButton.classList.add('submitButton');
    saveTaskButton.addEventListener('click', () => {
        document.getElementById('taskForm').requestSubmit();
    })
    formOptionsDiv.appendChild(saveTaskButton);

    const closeButton = createCloseButton();
    formOptionsDiv.appendChild(closeButton);

    return popUpBox;
}

function createCloseButton() {
    const closeButton = createGoogleIcon('close');
    closeButton.classList.add('closeButton');
    closeButton.href = '#';
    closeButton.addEventListener('click', () => closePopUps());

    return closeButton;
}

function closePopUps() {
    document.querySelectorAll('.popUp').forEach((element) => {
        element.classList.add('inactive')
    });
    document.querySelectorAll('form').forEach((element) => {
        element.reset();
    });
}

function createNewTaskForm() {
    const addTaskForm = document.createElement('form');
    addTaskForm.id = 'taskForm';

    const nameInputLabel = document.createElement('label');
    nameInputLabel.htmlFor = 'taskNameInput';
    nameInputLabel.textContent = 'Name: '
    addTaskForm.appendChild(nameInputLabel);
    
    const taskNameInput = document.createElement('input');
    taskNameInput.className = 'newTaskInput';
    taskNameInput.id = 'taskNameInput';
    taskNameInput.maxLength = 29;
    taskNameInput.required = true;
    addTaskForm.appendChild(taskNameInput);
    
    const descriptionInputLabel = document.createElement('label');
    descriptionInputLabel.htmlFor = 'taskDescriptionInput';
    descriptionInputLabel.textContent = 'Description: '
    addTaskForm.appendChild(descriptionInputLabel);
    
    const taskDescriptionInput = document.createElement('textarea');
    taskDescriptionInput.className = 'newTaskInput';
    taskDescriptionInput.id = 'taskDescriptionInput';
    taskDescriptionInput.maxLength = 29;
    taskDescriptionInput.rows = 2;
    taskDescriptionInput.cols = 27;
    addTaskForm.appendChild(taskDescriptionInput);
    
    const projectInputLabel = document.createElement('label');
    projectInputLabel.htmlFor = 'taskProjectInput';
    projectInputLabel.textContent = 'Project: '
    addTaskForm.appendChild(projectInputLabel);
    
    const taskProjectInput = document.createElement('input');
    taskProjectInput.className = 'newTaskInput';
    taskProjectInput.id = 'taskProjectInput';
    addTaskForm.appendChild(taskProjectInput);
    
    const dueLabel = document.createElement('label');
    dueLabel.htmlFor = 'taskDueInput';
    dueLabel.textContent = 'Due: '
    addTaskForm.appendChild(dueLabel);
    
    const taskDueInput = document.createElement('input');
    taskDueInput.type = 'date';
    taskDueInput.className = 'newTaskInput';
    taskDueInput.id = 'taskDueInput';
    addTaskForm.appendChild(taskDueInput);

    const priorityInputLabel = document.createElement('label');
    priorityInputLabel.htmlFor = 'taskPriorityInput';
    priorityInputLabel.textContent = 'Priority: '
    addTaskForm.appendChild(priorityInputLabel);
    
    const taskPriorityInput = document.createElement('select');
    taskPriorityInput.className = 'newTaskInput';
    taskPriorityInput.id = 'taskPriorityInput';
    addTaskForm.appendChild(taskPriorityInput);

    const priorityLevels = {1: 'low', 2: 'medium',3: 'high'};
    Object.keys(priorityLevels).forEach((level) => {
        const option = document.createElement('option');
        option.textContent = priorityLevels[level];
        option.value = level;
        taskPriorityInput.appendChild(option);
    })

    // const saveTaskButton = document.createElement('button');
    // saveTaskButton.textContent = 'Save task';
    // saveTaskButton.classList.add('save');
    // addTaskForm.appendChild(saveTaskButton);

    addTaskForm.addEventListener('submit', handleSaveTask);

    return addTaskForm;
}

function handleSaveTask(e) {
    e.preventDefault();

    const taskName = document.getElementById('taskNameInput').value;
    const taskDescription = document.getElementById('taskDescriptionInput').value;
    const taskProject = document.getElementById('taskProjectInput').value;
    const taskDueDate = document.getElementById('taskDueInput').value;
    const taskPriority = document.getElementById('taskPriorityInput').value;

    events.emit('taskAdd', createTask(
            taskName, 
            taskDescription, 
            taskDueDate, 
            taskPriority, 
            taskProject,
        )
    )

    content.querySelector('#taskForm').reset()
    closePopUps();
}

export {
    loadPage,
    createHeader, 
    createSidebar, 
    createViewer, 
}