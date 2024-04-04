const API_BASE_URL = 'https://dummyjson.com/recipes';
export const URL_PATHS = {
    search: '/search',
    mealType: '/meal-type',
    empty: ''
};

export function getRecipes(path, params) {
    let url = buildURL(path, params);

    return fetch(url)
            .then(res => res.json())
            .then(data => {
                data.recipes = checkFixDishes(data.recipes);
                return data;
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

function buildURL(path, params) {
    let url = `${API_BASE_URL}${path}`;
    params = cleanEmptyProps(params);

    if(params)
        url = `${url}?${new URLSearchParams(params)}`;

    return url;
}

function cleanEmptyProps(obj) {
    for(let propName in obj) {
        if(obj[propName] === '') {
            delete obj[propName];
        }
    }

    return obj;
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