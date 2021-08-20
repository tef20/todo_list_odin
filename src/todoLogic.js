const todoItems = (() => {
    const _itemsList = [];
    
    function newTodoItem (name, description, due, priority, project) {
        return {
            name,
            description, 
            due,
            priority, 
            project,
        }
    }

    function listFilteredByProperty(property, filterValue) {
        if (property) {
            return _itemsList.filter((item) => {
                return item[property] === filterValue;
            });
        }
    }

    function updateProperty(item, property, newValue) {
        if (_itemsList.includes(item)) {
            _itemsList[item][property] = newValue;
        }
        // publish update
    }

    return {
        ...adder(_itemsList),
        ...lister(_itemsList),
        ...remover(_itemsList),
        listFilteredByProperty,
        newTodoItem,
        updateProperty,
    }

})();

const projects = (() => {
    const _projectsList = [];

    function newProject(name) {
        return {name};
    }

    function editProjName(oldName, newName) {
        if (_projectsList.includes(oldName)) {
            _projectsList[_projectsList.indexOf(oldName)] = newName;
        }
        // publish name change
    }
    
    function sortProjects() {
        _projectsList.sort();
    }

    return {
        ...adder(_projectsList),
        ...lister(_projectsList),
        ...remover(_projectsList),
        editProjName,
        newProject,
        sortProjects,
    }
})();

function adder(items) {
    return {
        add: (newItem) => items.push(newItem)
        // publish ?
    }
}

function remover(items) {
    return {
        remove: (itemToRemove) => items.splice(items.indexOf(itemToRemove), 1)
    }
        // publish ?
}

function lister(items) {
    return {
        list: () => [...items]
    }
}

export {
    todoItems, 
    projects
}