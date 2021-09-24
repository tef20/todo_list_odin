function genID(lastID) {
    // check for uniqueness / existing ID's in local storage 
    // update local storage

    let id = lastID || -1;

    function newID() {
        return ++id;
    }

    return { newID };
}

export { genID };