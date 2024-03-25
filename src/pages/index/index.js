import './index.html';
import './index.scss';

import { getRecipes } from '../../scripts/api';
import { categoryItemTemplate, searchResTemplate } from '../../scripts/templates';
import { htmlToElement, extractRecipeCardData, createRecipeCardElement } from '../../scripts/utils';
import { addID, deleteID, getSavedIDs } from '../../scripts/storage';

const searchForm = document.getElementById('searchForm');
const searchInp = document.getElementById('searchInp');
const backdrop = document.getElementById('backdrop');
const searchResult = document.getElementById('searchResult');
const resMessage = document.getElementById('resMessage');
const categoriesList = document.getElementById('categories');
const recipesContainer = document.getElementById('recipesContainer');
const searchResMessage = document.getElementById('searchResMessage');
const loader = document.getElementById('loader');
const CLASSES_SELECTORS = {
    SAVE_BTN: 'save-btn',
    SAVED: 'saved'
};
let resCount = 0;

init();

document.getElementById('openFormBtn').addEventListener('click', openFormBtnClickHandler);
document.getElementById('closeFormBtn').addEventListener('click', closeForm);
document.getElementById('showAllBtn').addEventListener('click', showAllSearchResultsHandler);
recipesContainer.addEventListener('click', onRecipeClickHandler);
backdrop.addEventListener('click', closeForm);
categoriesList.addEventListener('click', onCategoriesListClickHandler);
searchInp.addEventListener('keyup', delay(searchKeyUpHandler, 500)); // delay for executing function after the user has stoppes typing
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    showAllSearchResultsHandler();
});


// ------- event handlers -------

function openFormBtnClickHandler() {
    backdrop.classList.add('active');
    searchForm.classList.add('active');
    setTimeout(() => searchInp.focus(), 100);
}
function closeForm() {
    searchForm.reset();
    searchResult.innerHTML = '';
    searchForm.classList.remove('active');
    backdrop.classList.remove('active');
}
function showAllSearchResultsHandler() {
    const q = searchInp.value.trim();
    closeForm();

    const activeItem = categories.querySelector('.active');
    if(activeItem) activeItem.classList.remove('active');

    if(q) {
        loader.style.display = 'flex';

        getRecipes('/search', { q: q })
            .then(recipesData => {
                showSearchResultMessage(recipesData.length, q);
                renderRecipes(recipesData);
                loader.style.display = 'none';
            });
    }
}
function onRecipeClickHandler(e) {
    const target = e.target;

    if(target.classList.contains(CLASSES_SELECTORS.SAVE_BTN)) {
        e.preventDefault();

        if(target.classList.contains(CLASSES_SELECTORS.SAVED)) {
            target.classList.remove(CLASSES_SELECTORS.SAVED);
            deleteID(target.closest('.recipe-card').id);
        } else {
            target.classList.add(CLASSES_SELECTORS.SAVED);
            addID(target.closest('.recipe-card').id);
        }
    }
}
function searchKeyUpHandler() {
    const q = this.value.trim();

    searchResult.innerHTML = '';
    resMessage.classList.remove('active');

    if(q) {
        getRecipes('/search', { q: q })
            .then(recipesData => {
                const recipes = recipesData.map(({ id, name, image }) => { 
                    return { id, name, image };
                });

                if(recipes.length > 0) showPreviewSearchResults(recipes);
                else resMessage.classList.add('active');
            });
    }
}
function onCategoriesListClickHandler(e) {
    if(e.target.classList.contains('category')) {
        recipesContainer.innerHTML = '';
        searchResMessage.classList.remove('active');
        loader.style.display = 'flex';

        const activeCateg = categoriesList.querySelector('.active');
        if(activeCateg) activeCateg.classList.remove('active');
        
        e.target.classList.add('active');

        const type = e.target.dataset.categoryId;
        let path, params;

        if(type == 'all') {
            path = '';
            params = { limit: 0 };
        } else {
            path = `/meal-type/${type}`;
            params = null;
        }

        getRecipes(path, params)
            .then(recipesData => {
                renderRecipes(recipesData);

                loader.style.display = 'none';
            });
    }
}


// ------- other functions -------

function init() {
    loader.style.display = 'flex';

    getRecipes('', { limit: 0 })
        .then(recipesData => {
            const categories = extractCategories(recipesData);
            renderCategoriesList(categories);

            renderRecipes(recipesData);

            loader.style.display = 'none';
        });
}
function showPreviewSearchResults(recipes) {
    resCount = recipes.length;
    
    if(resCount > 0) {
        if(resCount > 5)  recipes = recipes.slice(0, 5);

        document.getElementById('resultsCount').innerText = resCount;
        recipes.map(renderSearchResPreviewItem);
    } else {
        resMessage.classList.add('active');
    }
}
function showSearchResultMessage(count, query) {
    searchResMessage.classList.add('active');

    searchResMessage.innerText = (count == 0) 
    ? `Nothing found on your query "${query}"...` 
    : `Found ${count} recipe(s) on your query "${query}": `;
}
function renderSearchResPreviewItem(recipe) {
    const html = searchResTemplate.replace('{{id}}', recipe.id)
                                    .replace('{{img}}', recipe.image)
                                    .replace('{{imgAlt}}', recipe.name)
                                    .replace('{{name}}', recipe.name);

    const element = htmlToElement(html);
    searchResult.appendChild(element);
}
function renderRecipes(recipesData) {
    recipesContainer.innerHTML = '';

    const recipes = extractRecipeCardData(recipesData);

    recipes.map(r => {
        const element = createRecipeCardElement(r);

        if(getSavedIDs().some(id => id == r.id))
            element.querySelector('.' + CLASSES_SELECTORS.SAVE_BTN).classList.add(CLASSES_SELECTORS.SAVED);

        recipesContainer.appendChild(element);
    });
}
function renderCategoriesList(categories) {
    for(let c of categories) {
        const html = categoryItemTemplate.replace('{{id}}', c)
                                            .replace('{{category}}', c);

        const element = htmlToElement(html);
        categoriesList.appendChild(element);
    }
}
function extractCategories(data) {
    const arr = data.map(r => r.mealType);
    return new Set(arr.flat());
}
function delay(fn, ms) {
    let timer = 0;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(fn.bind(this, ...args), ms || 0);
    }
}