import './saved.html';
import './saved.scss';

import { getRecipes } from '../../scripts/api';
import { deleteID, getSavedIDs } from '../../scripts/storage';
import { extractRecipeCardData, createRecipeCardElement } from '../../scripts/utils';

const recipesContainer = document.getElementById('recipesContainer');
const loader = document.getElementById('loader');
const emptyMssg = document.getElementById('emptyMssg');

recipesContainer.addEventListener('click', onRecipeClickHandler);
document.getElementById('backBtn').addEventListener('click', () => history.back());

init();

function init() {
    loader.style.display = 'flex';

    getRecipes('', { limit: 0 })
        .then(recipesData => {
            const recipes = extractRecipeCardData(recipesData);
            const savedRecipes = getSavedIDs().map(id => recipes.find(r => r.id == id));
    
            renderRecipes(savedRecipes);
            
            loader.style.display = 'none';
        });
}

function onRecipeClickHandler(e) {
    const target = e.target;

    if(target.classList.contains('save-btn')) {
        e.preventDefault();

        const recipeCardEl = target.closest('.recipe-card');
        deleteID(recipeCardEl.id);
        recipeCardEl.remove();

        if(!getSavedIDs().length) emptyMssg.style.display = 'flex';
    }
}

function renderRecipes(recipes) {
    const savedIds = getSavedIDs();

    if(!savedIds.length)
        emptyMssg.style.display = 'flex';

    recipes.map(r => {
        const element = createRecipeCardElement(r);
        element.querySelector('.save-btn').classList.add('saved');

        recipesContainer.appendChild(element);
    });
}