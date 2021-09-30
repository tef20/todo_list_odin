import { events } from './pubSub.js';
import { genID as filterIDFactory } from './idGenerator.js';

const _filters = {}

const IDGenerator = filterIDFactory();

let _liveFilter;

events.on('updateLiveFilter', setLiveFilter);
events.on('requestLiveFilter', publishLiveFilter)
events.on('liveFilterUpdated', publishLiveFilter)

events.on('filterAdd', addFilter);
events.on('projectAdd', addProjectFilter);
events.on('filterRemove', removeFilterByID);
events.on('filterEdit', editFilter);
events.on('runDemo', runDemoFilters);

function setLiveFilter(filterID) {
    if (Object.keys(_filters).includes(filterID)) {
        _liveFilter = filterID;
        events.emit('liveFilterUpdated', filterID);
    }
}

function getFilters() {
    return _filters;
}

function getFilterByID(filterID) {
    return _filters[filterID];
}

function addProjectFilter(projectName) {
    const conditionsList = [makeProjectMatchCondition(projectName)];
    const project = createFilter(projectName, 'project', conditionsList);
    addFilter(project);

    return project;
}

function createFilter(name, type, rules, state, id) {
    return {
        name, 
        type, 
        rules,
        state,
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

function publishLiveFilter() {
    events.emit('publishLiveFilter', getFilterByID(_liveFilter));
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
    setLiveFilter('0');

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
    addProjectFilter('Shopping List');
    addProjectFilter('Housework');
    addProjectFilter('Favourite movies');
    addProjectFilter('Website');
}


export {
    applyFilter,
    addProjectFilter,
    addDefaultFilters,
    runDemoFilters,
    removeFilterByID,
    getFilters,
}