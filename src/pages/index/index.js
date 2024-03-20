import './index.html';
import './index.scss';

const searchForm = document.getElementById('searchForm');
const searchInp = document.getElementById('searchInp');
const backdrop = document.getElementById('backdrop');
const searchResult = document.getElementById('searchResult');
const noResMessage = document.getElementById('noResMessage');
const searchResTemplate = document.getElementById('searchResTemplate');
let resCount = 0;


document.getElementById('openFormBtn').addEventListener('click', openFormBtnClickHandler);
document.getElementById('closeFormBtn').addEventListener('click', closeForm);
document.getElementById('showAllBtn').addEventListener('click', showAllSearchResultsHandler);
backdrop.addEventListener('click', closeForm);
searchInp.addEventListener('keyup', searchKeyUpHandler);
searchForm.addEventListener('submit', e => {
    e.preventDefault();

    if(resCount) showAllSearchResultsHandler();
});


// event handlers
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

    insertUrlParam('name', q);

    // redirect if not on index page

    if(q) {
        fetch(`https://dummyjson.com/recipes/search?q=${q}`)
            .then(res => res.json())
            .then(data => {

                const recipes = data.recipes.map(({ id, name, image, rating, reviewCount }) => { 
                    return { id, name, image, rating, reviewCount };
                });

                if(recipes.length) {
                    data.recipes.map(r => {
                        const recipeCardTemplate = document.getElementById('recipeCardTemplate');
                        const clone = recipeCardTemplate.content.cloneNode(true);

                        clone.querySelector('.recipe-card').setAttribute('href', `./recipe.html?recipe-id=${r.id}`);
                        clone.querySelector('.card-photo').setAttribute('src', r.image);
                        clone.querySelector('.card-photo').setAttribute('alt', r.name);
                        clone.querySelector('.card-description-name').innerText = r.name;
                        clone.querySelector('.card-description-rating').innerText = r.rating;

                        recipesContainer.appendChild(clone);
                    });
                } else {
                    recipesContainer.innerText = `Nothing found for your query "${searchInp.value.trim()}"...`;
                }
            });
    }
}
function searchKeyUpHandler() {
    const q = this.value.trim();

    if(q) {
        fetch(`https://dummyjson.com/recipes/search?q=${q}`)
            .then(res => res.json())
            .then(data => {
                const recipes = data.recipes.map(({ id, name, image }) => { 
                    return { id, name, image };
                });
                showPreviewSearchResults(recipes);
            })
            .catch(error => console.error(error));
    }
}


// other functions

function showPreviewSearchResults(recipes) {
    searchResult.innerHTML = '';
    noResMessage.classList.remove('active');

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
function insertUrlParam(key, value) {
    if (history.pushState) {
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set(key, value);
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
        window.history.pushState({path: newurl}, '', newurl);
    }
}