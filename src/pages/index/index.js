import './index.html';
import './index.scss';

const searchForm = document.getElementById('searchForm');
const searchInp = document.getElementById('searchInp');
const backdrop = document.getElementById('backdrop');
const searchResult = document.getElementById('searchResult');
const noResMessage = document.getElementById('noResMessage');
const categoriesList = document.getElementById('categories');
const searchResTemplate = document.getElementById('searchResTemplate');
let resCount = 0;

init();

document.getElementById('openFormBtn').addEventListener('click', openFormBtnClickHandler);
document.getElementById('closeFormBtn').addEventListener('click', closeForm);
document.getElementById('showAllBtn').addEventListener('click', showAllSearchResultsHandler);
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

    if(q) {
        fetch(`https://dummyjson.com/recipes/search?q=${q}`)
            .then(res => res.json())
            .then(data => {
                fixDishOrigin(data.recipes);
                const recipes = data.recipes.map(({ id, name, image, rating, reviewCount, mealType }) => { 
                    return { id, name, image, rating, reviewCount, mealType };
                });

                renderRecipes(recipes);
            })
            .catch(error => console.error(error));
    }
}
function searchKeyUpHandler() {
    const q = this.value.trim();

    searchResult.innerHTML = '';
    noResMessage.classList.remove('active');

    if(q) {
        fetch(`https://dummyjson.com/recipes/search?q=${q}`)
            .then(res => res.json())
            .then(data => {
                fixDishOrigin(data.recipes);
                const recipes = data.recipes.map(({ id, name, image }) => { 
                    return { id, name, image };
                });

                if(recipes.length > 0) showPreviewSearchResults(recipes);
                else noResMessage.classList.add('active');
            })
            .catch(error => console.error(error));
    }
}
function onCategoriesListClickHandler(e) {
    if(e.target.classList.contains('category')) {
        categories.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');

        const type = e.target.dataset.categoryId;

        let url = (type == 'all') 
            ? 'https://dummyjson.com/recipes?limit=0' 
            : `https://dummyjson.com/recipes/meal-type/${type}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                fixDishOrigin(data.recipes);
                const recipes = data.recipes.map(({ id, name, image, rating, reviewCount, mealType }) => { 
                    return { id, name, image, rating, reviewCount, mealType };
                });

                renderRecipes(recipes);
            })
            .catch(error => console.error(error));
    }
}


// ------- other functions -------

function init() {
    fetch('https://dummyjson.com/recipes?limit=0')
    .then(res => res.json())
    .then(data => {
        fixDishOrigin(data.recipes);

        // get recipes list
        const recipes = data.recipes.map(({ id, name, image, rating, reviewCount }) => { 
            return { id, name, image, rating, reviewCount };
        });

        renderRecipes(recipes);

        // get all meal categories
        const arr = data.recipes.map(r => r.mealType);
        let categories = new Set(arr.flat());

        renderCategoriesList(categories);
    })
    .catch(error => console.error(error));
}
function showPreviewSearchResults(recipes) {
    resCount = recipes.length;
    
    if(resCount > 0) {
        if(resCount > 5)  recipes = recipes.slice(0, 5);

        document.getElementById('resultsCount').innerText = resCount;
        recipes.map(renderSearchResPreviewItem);
    } else {
        noResMessage.classList.add('active');
    }
}
function renderSearchResPreviewItem(recipe) {
    const clone = searchResTemplate.content.cloneNode(true);
    const imgEl = clone.querySelector('.result-item-img');

    imgEl.setAttribute('src', recipe.image);
    imgEl.setAttribute('alt', recipe.name);
    clone.querySelector('.result-item').setAttribute('href', `./recipe.html?recipe-id=${recipe.id}`);
    clone.querySelector('.result-item-name').innerText = recipe.name;

    searchResult.appendChild(clone);
}
function renderRecipes(recipes) {
    recipesContainer.innerHTML = '';

    recipes.map(r => {
        const recipeCardTemplate = document.getElementById('recipeCardTemplate');
        const clone = recipeCardTemplate.content.cloneNode(true);

        clone.querySelector('.recipe-card').setAttribute('href', `./recipe.html?recipe-id=${r.id}`);
        clone.querySelector('.card-photo').setAttribute('src', r.image);
        clone.querySelector('.card-photo').setAttribute('alt', r.name);
        clone.querySelector('.card-description-name').innerText = r.name;
        clone.querySelector('.rating').innerText = r.rating;
        clone.querySelector('.star-inner').style.width = `${(r.rating / 5) * 100}%`;
        clone.querySelector('.review-count').innerText = `(${r.reviewCount})`;

        recipesContainer.appendChild(clone);
    });
}
// fix horrible, unacceptable API mistake - Borzch is Ukrainian meal
function fixDishOrigin(recipes) {
    recipes.map(r => {
        if(r.name.includes('Borscht')) {
            r.name = 'Ukrainian Borscht';
            r.cuisine = 'Ukrainian';
            let idx = r.tags.indexOf('Russian');
            r.tags[idx] = 'Ukrainian';
        }
    });
}
function renderCategoriesList(categories) {
    for(let c of categories) {
        const liEl = document.createElement('li');

        liEl.innerText = c;
        liEl.classList.add('category');
        liEl.dataset.categoryId = c;

        categoriesList.appendChild(liEl);
    }
}
function delay(fn, ms) {
    let timer = 0;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(fn.bind(this, ...args), ms || 0);
    }
}