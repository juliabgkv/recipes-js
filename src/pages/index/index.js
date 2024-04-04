import './index.scss';

import { URL_PATHS, getRecipes } from '../../scripts/api';
import { allCategoryTemplate, categoryItemTemplate, searchResTemplate } from '../../scripts/templates';
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
const moreLoader = document.getElementById('moreLoader');
const showMoreBtn = document.getElementById('showMoreBtn');
const CLASSES_SELECTORS = {
    SAVE_BTN: 'save-btn',
    SAVED: 'saved'
};

let total = 0; // total count of recipes list
let path = URL_PATHS.empty;
const params = {
    limit: 12, // 12 items of recipes list loads per one request
    skip: 0, // variable to indicate how recipes need to skip (not load in curr request)
    q: ''
};

init();

document.getElementById('openFormBtn').addEventListener('click', openFormBtnClickHandler);
document.getElementById('closeFormBtn').addEventListener('click', closeForm);
document.getElementById('showAllBtn').addEventListener('click', showAllSearchResultsHandler);
recipesContainer.addEventListener('click', onRecipeClickHandler);
backdrop.addEventListener('click', closeForm);
categoriesList.addEventListener('click', onCategoriesListClickHandler);
showMoreBtn.addEventListener('click', showMoreBtnClickHandler);
searchInp.addEventListener('keyup', delay(searchKeyUpHandler, 500)); // delay for executing function after the user has stoppes typing
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    showAllSearchResultsHandler();
});


// ------- event handlers -------

function openFormBtnClickHandler() {
    document.body.style.overflow = 'hidden';
    backdrop.classList.add('active');
    searchForm.classList.add('active');
    setTimeout(() => searchInp.focus(), 100);
}

function closeForm() {
    document.body.style.overflow = 'visible';
    searchResult.innerHTML = '';
    searchForm.reset();
    searchForm.classList.remove('active');
    backdrop.classList.remove('active');
}

function showAllSearchResultsHandler() {
    const searchStr = searchInp.value.trim();
    closeForm();

    if(searchStr) {
        const activeItem = categories.querySelector('.active');
        if(activeItem) activeItem.classList.remove('active');

        showLoader(true);
        showMoreBtnDisplaying(true);
        recipesContainer.innerHTML = '';

        path = URL_PATHS.search;
        params.skip = 0;
        params.q = searchStr;

        getRecipes(path, params)
            .then(data => {
                renderRecipes(data.recipes);
                showSearchResultMessage(data.total, searchStr);

                total = data.total;

                showLoader(false);
                showMoreBtnDisplaying();
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
    const searchStr = this.value.trim();

    searchResult.innerHTML = '';
    resMessage.classList.remove('active');

    if(searchStr) {
        path = URL_PATHS.search;
        let searchParams = {
            q: searchStr,
            limit: 5
        };

        getRecipes(path, searchParams)
            .then(data => {
                const recipes = data.recipes.map(({ id, name, image }) => { 
                    return { id, name, image };
                });

                if(recipes.length > 0) showPreviewSearchResults(recipes, data.total);
                else resMessage.classList.add('active');
            });
    }
}

function onCategoriesListClickHandler(e) {
    if(e.target.classList.contains('category')) {
        recipesContainer.innerHTML = '';
        searchResMessage.classList.remove('active');
        showLoader(true);
        showMoreBtnDisplaying(true);

        const activeCateg = categoriesList.querySelector('.active');
        if(activeCateg) activeCateg.classList.remove('active');
        
        e.target.classList.add('active');

        const type = e.target.dataset.categoryId;

        path = (type == 'all') ? URL_PATHS.empty : `${URL_PATHS.mealType}/${type}`;
        params.skip = 0;
        params.q = '';

        getRecipes(path, params)
            .then(data => {
                total = data.total;

                renderRecipes(data.recipes);

                showLoader(false);
                showMoreBtnDisplaying();
            });
    }
}

function showMoreBtnClickHandler() {
    showMoreLoader(true);
    showMoreBtnDisplaying(true);

    params.skip += params.limit;

    getRecipes(path, params)
        .then(data => {
            renderRecipes(data.recipes);

            showMoreLoader(false);
            showMoreBtnDisplaying();
        });
}


// ------- other functions -------

function init() {
    showLoader(true);

    getRecipes(path, params)
        .then(data => {
            total = data.total;

            const categories = extractCategories(data.recipes);
            renderCategoriesList(categories);

            renderRecipes(data.recipes);

            showLoader(false);
            showMoreBtnDisplaying();
        });
}

function showMoreBtnDisplaying(isHidden) {
    showMoreBtn.style.display = isHidden || ((total - params.skip) < params.limit)
        ? 'none'
        : 'block';
}

function showPreviewSearchResults(recipes, total) {
    if(total > 0) {
        document.getElementById('resultsCount').innerText = total;
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
    const recipes = extractRecipeCardData(recipesData);

    recipes.map(r => {
        const element = createRecipeCardElement(r);

        if(getSavedIDs().some(id => id == r.id))
            element.querySelector('.' + CLASSES_SELECTORS.SAVE_BTN).classList.add(CLASSES_SELECTORS.SAVED);

        recipesContainer.appendChild(element);
    });
}

function renderCategoriesList(categories) {
    categoriesList.appendChild(htmlToElement(allCategoryTemplate));
    
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

function showLoader(isActive) {
    if(isActive) loader.classList.add('active');
    else loader.classList.remove('active');
}

function showMoreLoader(isActive) {
    if(isActive) moreLoader.classList.add('active');
    else moreLoader.classList.remove('active');
}