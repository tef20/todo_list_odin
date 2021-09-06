import './reset.css';
import './style.css';
import { createTask, createTaskList, createProjectList } from './todoLogic.js';

const body = document.body;

const header = createHeader();
body.appendChild(header);

const main = document.createElement('main');
body.appendChild(main);

const nav = createNav();
main.appendChild(nav);

const viewer = createViewer();
main.appendChild(viewer);

// const footer = document.createElement('footer');

// Header
function createHeader() {
    const header = document.createElement('headerThe Arcade, Newbury');
    body.appendChild(header);

    const h1 = document.createElement('h1');
    h1.className = 'headerBar';
    h1.textContent = 'Main Header';
    header.appendChild(h1);

    return header;
}

function createNav() {
    // Nav //
    const nav = document.createElement('nav');
    // nav.className = 'nav pagesection';

    // create side toggle
    const sideToggle = document.createElement('input');
    sideToggle.type = 'checkbox';
    sideToggle.id = 'sideToggle';
    nav.appendChild(sideToggle);

    const sideToggleLabel = document.createElement('label');
    sideToggleLabel.htmlFor = 'sideToggle';
    sideToggleLabel.textContent = '>'
    nav.appendChild(sideToggleLabel);

    const navList = document.createElement('ul');
    // navList.className = 'navList';
    nav.appendChild(navList);

    // Nav items 
    // Inbox
    const inbox = document.createElement('li');
    inbox.className = 'navHeading';
    inbox.textContent = "Inbox";
    navList.appendChild(inbox);

    const inboxIcon = document.createElement('i');
    inboxIcon.textContent = 'icon';
    inbox.insertAdjacentElement('afterbegin', inboxIcon);

    // Today
    const today= document.createElement('li');
    today.className = 'navHeading';
    today.textContent = "Today";
    navList.appendChild(today);

    const todayIcon = document.createElement('i');
    todayIcon.textContent = 'icon';
    today.insertAdjacentElement('afterbegin', todayIcon);

    // Upcoming
    const upcoming = document.createElement('li');
    upcoming.className = 'navHeading';
    upcoming.textContent = "Upcoming";
    navList.appendChild(upcoming);

    const upcomingIcon = document.createElement('i');
    upcomingIcon.textContent = 'icon';
    upcoming.insertAdjacentElement('afterbegin', upcomingIcon);

    // Projects toggle
    const projects = document.createElement('li');
    projects.id = 'projectsHeading';
    projects.className = 'navHeading';
    navList.appendChild(projects);

    const projectsToggle = document.createElement('input');
    projectsToggle.type = 'checkbox';
    projectsToggle.id = 'projectsToggle';
    projects.appendChild(projectsToggle);

    const projectsToggleLabel = document.createElement('label');
    projectsToggleLabel.htmlFor = 'projectsToggle';
    projectsToggleLabel.textContent = 'Projects \\/'
    projects.appendChild(projectsToggleLabel);

    const projectsToggleIcon = document.createElement('i');
    projectsToggleIcon.textContent = 'icon';
    projectsToggleLabel.insertAdjacentElement('afterbegin', projectsToggleIcon);


    // Projects
    const projectsList = document.createElement('ul');
    projectsList.className = 'navList';
    projectsList.id = 'projList';
    projects.appendChild(projectsList);

    // Project
    const project = document.createElement('ul');
    project.className = 'project';
    project.id = 'projID';
    project.textContent = 'Test Project';
    projectsList.appendChild(project);

    const projectIcon = document.createElement('i');
    projectIcon.textContent = 'icon';
    project.insertAdjacentElement('afterbegin', projectIcon);

    const deleteProjectIcon = document.createElement('i');
    deleteProjectIcon.textContent = 'delete';
    project.appendChild(deleteProjectIcon);

    // Add Project Button
    const addProjectButton = document.createElement('button');
    addProjectButton.id = 'addProject';
    addProjectButton.className = 'project';
    // addProjectButton.className = 'project';
    addProjectButton.textContent = 'Add project';
    projectsList.appendChild(addProjectButton);

    const addProjectIcon = document.createElement('i');
    addProjectIcon.textContent = 'icon';
    addProjectButton.insertAdjacentElement('afterbegin', addProjectIcon);

    return nav;
}

function createViewer () {
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

