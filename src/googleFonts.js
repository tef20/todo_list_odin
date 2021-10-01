const materialIconsOutlinedStylesheetLink = document.createElement('link');
materialIconsOutlinedStylesheetLink.setAttribute('rel', 'stylesheet');
Object.assign(
    materialIconsOutlinedStylesheetLink, {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Material+Icons+Outlined',
    }
);

const _icons = {
    'expansion': 'expand_more',

    'inbox': 'inbox', 
    'due': 'calendar_today', 
    'project': 'list',
    
    'priority': 'circle',
    'delete': 'delete', 
    'edit': 'edit',
    'add': 'add',
}

function matchIcon (iconName) {
    return _icons[iconName];
}

function createGoogleIcon(iconName) {
    const icon = document.createElement('i');
    icon.classList.add('material-icons-outlined');
    icon.textContent = matchIcon(iconName);

    return icon;
}


export {
    materialIconsOutlinedStylesheetLink,
    matchIcon,
    createGoogleIcon,
};
