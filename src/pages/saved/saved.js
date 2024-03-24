import './saved.html';
import './saved.scss';
import { getRecipes } from '../../scripts/api';

const recipesContainer = document.getElementById('recipesContainer');

recipesContainer.addEventListener('click', onRecipeClickHandler);
document.getElementById('backBtn').addEventListener('click', () => history.back());

init();

function init() {
    document.getElementById('loader').style.display = 'flex';

    getRecipes('', { limit: 0 })
        .then(recipesData => {
            // get recipes list
            const recipes = recipesData.map(({ id, name, image, rating, reviewCount }) => { 
                return { id, name, image, rating, reviewCount };
            });
    
            let savedIds = JSON.parse(localStorage.getItem('saved-recipes-id')) || [];
            const savedRecipes = savedIds.map(id => {
                return recipes.find(r => r.id == id);
            });
    
            renderRecipes(savedRecipes);
            
            document.getElementById('loader').style.display = 'none';
        });
}
function renderRecipes(recipes) {
    const savedIds = JSON.parse(localStorage.getItem('saved-recipes-id')) || [];

    if(!savedIds.length) {
        document.getElementById('emptyMssg').style.display = 'flex';
    }

    recipes.map(r => {
        const recipeCardTemplate = document.getElementById('recipeCardTemplate');
        const clone = recipeCardTemplate.content.cloneNode(true);
        const card = clone.querySelector('.recipe-card');
        const photo = clone.querySelector('.card-photo');

        card.setAttribute('id', r.id);
        card.setAttribute('href', `./recipe.html?recipe-id=${r.id}`);
        photo.setAttribute('src', r.image);
        photo.setAttribute('alt', r.name);
        clone.querySelector('.card-description-name').innerText = r.name;
        clone.querySelector('.rating').innerText = r.rating;
        clone.querySelector('.star-inner').style.width = `${(r.rating / 5) * 100}%`;
        clone.querySelector('.review-count').innerText = `(${r.reviewCount})`;

        if(savedIds.some(id => id == r.id))
            clone.querySelector('.save-btn').classList.add('saved');

        recipesContainer.appendChild(clone);
    });
}

function onRecipeClickHandler(e) {
    const target = e.target;

    if(target.classList.contains('save-btn')) {
        e.preventDefault();

        let recIds = JSON.parse(localStorage.getItem('saved-recipes-id')) || [];

        const recipeCardEl = target.closest('.recipe-card');

        const idx = recIds.indexOf(recipeCardEl.id);
        recIds.splice(idx, 1);

        localStorage.setItem('saved-recipes-id', JSON.stringify(recIds));
        recipeCardEl.remove();

        if(!recIds.length) document.getElementById('emptyMssg').style.display = 'flex';
        
    }
}