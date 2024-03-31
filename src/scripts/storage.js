const STORAGE_KEY = 'saved-recipes-id';

export function getSavedIDs() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function addID(id) {
    const ids = getSavedIDs();
    ids.push(id);
    saveIDs(ids);
}

export function deleteID(id) {
    let ids = getSavedIDs();
    const idx = ids.indexOf(id);
    ids.splice(idx, 1);
    saveIDs(ids);
}

function saveIDs(idArr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(idArr));
}