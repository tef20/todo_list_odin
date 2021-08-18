import './reset.css';
import './style.css';

const body = document.body;

const h1 = document.createElement('h1');
h1.className = 'headerBar';
body.appendChild(h1);
h1.textContent = 'Main Header';

// create nav 
const nav = document.createElement('nav');
nav.className = 'nav pagesection';
body.appendChild(nav);

const navList = document.createElement('ul');
navList.className = 'navList';
nav.appendChild(navList);

// add nav items
const navItem1 = document.createElement('li');
navItem1.textContent = "nav1";
navList.appendChild(navItem1);

const navItem2 = document.createElement('li');
navItem2.textContent = "nav2";
navList.appendChild(navItem2);

const navItem3 = document.createElement('li');
navItem3.textContent = "nav3";
navList.appendChild(navItem3);


// create list section
const tasksSection = document.createElement('section');
tasksSection.className = 'tasks pagesection';
body.appendChild(tasksSection);

const tasksHeader = document.createElement('h2');
tasksHeader.className = 'tasksHeader';
tasksHeader.textContent = 'Task header';
tasksSection.appendChild(tasksHeader);

const tasksList = document.createElement('ul');
tasksList.className = 'tasksList';
tasksSection.appendChild(tasksList);

const task1 = document.createElement('li');
task1.textContent = "task1";
tasksList.appendChild(task1);

const task2 = document.createElement('li');
task2.textContent = "task2";
tasksList.appendChild(task2);


