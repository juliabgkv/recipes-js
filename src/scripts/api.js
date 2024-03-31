const API_BASE_URL = 'https://dummyjson.com/recipes';

export function getRecipes(path, params) {
    let url = `${API_BASE_URL}${path}`;
    if(params)
        url = `${url}?${new URLSearchParams(params)}`;

    return fetch(url)
            .then(res => res.json())
            .then(data => {
                return checkFixDishes(data.recipes);
            })
            .catch(error => console.error(error));
}

export function getRecipe(id) {
    return fetch(`${API_BASE_URL}/${id}`)
        .then(res => res.json())
        .then(recipe => { 
                if(isrus(recipe))
                    fix(recipe);

                return recipe;
        })
        .catch(error => console.error(error));
}

// fixed horrible, unacceptable API mistake - Borscht is Ukrainian meal
function checkFixDishes(recipes) {
    recipes.find(recipe => { if(isrus(recipe)) fix(recipe) });
    return recipes;
}

function isrus(recipe){
    return recipe.name.includes('Russian Borscht');
}

function fix(recipe) {
    recipe.name = 'Ukrainian Borscht';
    recipe.cuisine = 'Ukrainian';

    return recipe;
}