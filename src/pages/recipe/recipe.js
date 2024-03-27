import './recipe.html';
import './recipe.scss';

import { getRecipe } from '../../scripts/api';
import { htmlToElement} from '../../scripts/utils';

const loader = document.getElementById('loader');

document.getElementById('backBtn').addEventListener('click', () => history.back());

if(window.location.search) {
    loader.style.display = 'flex';
    const params = new URLSearchParams(location.search);
    const id = parseInt(params.get('recipe-id'));

    getRecipe(id)
        .then(data => {
            if(!data) {
                showNotFound();
            } else {
                document.title = data.name;

                const template = document.getElementById('recipeTemplate').innerHTML;
                const html = template.replace('{{id}}', data.id)
                                        .replace('{{name}}', data.name)
                                        .replace('{{rating}}', data.rating)
                                        .replace('{{reviewCount}}', data.reviewCount)
                                        .replace('{{prepTimeMinutes}}', data.prepTimeMinutes)
                                        .replace('{{cookTimeMinutes}}', data.cookTimeMinutes)
                                        .replace('{{difficulty}}', data.difficulty)
                                        .replace('{{image}}', data.image)
                                        .replace('{{imgAlt}}', data.name)
                                        .replace('{{servings}}', data.servings)
                                        .replace('{{caloriesPerServing}}', data.caloriesPerServing)
                                        .replace('{{cuisine}}', data.cuisine);

                const element = htmlToElement(html);

                // render meal categorie(s)
                const span = document.createElement('span');
                data.mealType.map(t => {
                    if(span.innerText.length > 0) span.innerText = `${span.innerText} / ${t}`;
                    else span.innerText = `${t}`;
                    
                    element.querySelector('.categories').appendChild(span);
                });

                // render ingredients list
                const ingredientsList = element.querySelector('.ingredients-list');
                data.ingredients.map(ingr => ingredientsList.appendChild(createLiElement(ingr)));

                // render instructions list
                const instructionsList = element.querySelector('.instructions-list');
                data.instructions.map(step => instructionsList.appendChild(createLiElement(step)));

                // append filled out recipe element
                document.getElementById('recipeWrapper').appendChild(element);
                document.getElementById('background').style.backgroundImage = `url(${data.image})`;

                loader.style.display = 'none';
            }
        });
} else {
    showNotFound();
}

function showNotFound() {
    document.getElementById('recipeWrapper').innerText = 'Recipe Not Found';
}
function createLiElement(text) {
    const li = document.createElement('li');
    li.innerText = text;

    return li;
}