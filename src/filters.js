import { events } from './pubSub.js';
import { genID as filterIDFactory } from './idGenerator.js';

const _filters = {}

const IDGenerator = filterIDFactory();

let _liveFilter = 0;

function getLiveFilter() {
    return _liveFilter;
}

function setLiveFilter(filterID) {
    if (Object.keys(_filters).includes(filterID)) {
        _liveFilter = filterID;
    }
}

function getFilters() {
    return JSON.parse(JSON.stringify(_filters));
}

function getFilterByID(filterID) {
    return JSON.parse(JSON.stringify(_filters[filterID]));
}

function addNewProject(projectName) {
    const condition = makeProjectMatchCondition(projectName);
    // console.log('condition: ', condition);
    // const dummyTask = {'project': projectName}
    // console.log('result: ', condition(dummyTask));
    const conditionsList = [];
    conditionsList.push(condition);
    // console.log({conditionsList})
    const project = createFilter(projectName, 'project', conditionsList);
    // console.log(project)
    addFilter(project);
    const filts = getFilters();
    // console.log(filts)
    // if (Object.keys(filts).includes('1')) {
    //     console.log(1, filts['1']['rules'])
    //     console.log(2, _filters['1']['rules']);
    // }
}

function createFilter(name, type, rules, id) {
    return {
        name, 
        type, 
        rules,
        id,
    }
}

function addFilter(filter) {
    if (filter['id'] === undefined) {
        filter['id'] = IDGenerator.newID();
    }
    const filterID = filter.id;
    _filters[filterID] = filter;
    events.emit('filtersUpdate', getFilters());
}

function removeFilterByID(filterID) {
    delete _filters[filterID];
    events.emit('filtersUpdate', getFilters());
}

function clearAllFilters() {
    for (let filter in _filters) {
        delete _filters[filter];
    }
    events.emit('filtersUpdate', getFilters());
}

function filtersEmpty() {
    return !Object.keys(_filters).length;
}

function editFilter(filterID, newFilterDetails) {
    if (_filters.hasOwnProperty(filterID)) {
        _filters[filterID] = newFilterDetails;
        events.emit('filtersUpdate', getFilters());
    }
}

function makeDueDaysCondition(days) {
    return (task) => {
        if (Object.keys(task).includes('due')) {
                return (task['due'] < days) ? true : false;
        }
    }
}

function makeDueByCondition(date) {
    return (task) => {
        if (Object.keys(task).includes('due')) {
                return (task['due'] < date) ? true : false;
        }
    }
}

function makeProjectMatchCondition(projectName) {
    return (task) => {
        if (Object.keys(task).includes('project')) {
                return (task['project'] === projectName) ? true : false;
        }
    }
}

function applyFilter(tasksList) {
    const filteredTasks = tasksList.filter(task => {
        const filters = getFilters();
        // const liveFilterID = getLiveFilter();
        const filter = _filters[_liveFilter];
        const rules = filter.rules;
        return rules.every(rule => rule(task));
    });
    
    events.emit('filterApplied', filteredTasks);
}

function addDefaultFilters() {
    // inbox
    const inboxFilter = createFilter('Inbox', 'inbox', []);
    addFilter(inboxFilter);

    // today
    // const todayFilter = createFilter('Today', 'due', makeDueDaysCondition(0));
    // addFilter(todayFilter);

    // upcoming
    // const upcomingFilter = createFilter('Upcoming', 'due', makeDueDaysCondition(6));
    // addFilter(upcomingFilter);
}

function runDemoFilters() {
    clearAllFilters();
    addDefaultFilters();
    addNewProject('Shopping List');
    addNewProject('Housework');
    addNewProject('Favourite movies');
    addNewProject('Website');
}

events.on('filterSelected', setLiveFilter);
events.on('filterUpdated', applyFilter);
events.on('filterAdd', addFilter);
events.on('filterRemove', removeFilterByID);
events.on('filterEdit', editFilter);
events.on('runDemo', runDemoFilters);

export {
    applyFilter,
    addNewProject,
    addDefaultFilters,
    runDemoFilters,
    removeFilterByID,
    getFilters,
}