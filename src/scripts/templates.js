export const categoryItemTemplate = `
    <li data-category-id="{{id}}" class='category'>{{category}}</li>
`;

export const allCategoryTemplate = `<li data-category-id="all" class="category active">All</li>`;

export const recipeCardTemplate = `
    <a href="./recipe.html?recipe-id={{id}}" id={{cardId}} class="recipe-card">
        <div class="save-btn"></div>
        <div class="card-photo-wrap">
            <img src={{img}} alt={{imgAlt}} class="card-photo">
        </div>
        <div class="card-description">
            <h4 class="card-description-name">{{name}}</h4>
            <div class="card-description-rating">
                <div class="star-outer">
                    <div class="star-inner"></div>
                </div>
                <div class="rating">{{rating}}</div>
                <div class="review-count">({{reviewCount}})</div>
            </div>
        </div>
    </a>
`;

export const searchResTemplate = `
    <a href="./recipe.html?recipe-id={{id}}" class="result-item">
        <img src="{{img}}" alt="{{imgAlt}}" class="result-item-img">
        <p class="result-item-name">{{name}}</p>
    </a>
`;

export const recipePageTemplate = `
    <div id="recipe" class="recipe">
        <div class="save-btn save-recipe-btn"></div>
        <div class="header">
            <div class="recipe-name">{{name}}</div>
            <div class="categories"></div>
            <div class="rating-block">
                <div class="star-outer">
                    <div class="star-inner"></div>
                </div>
                <div class="rating">{{rating}}/5</div>
                <div class="review-count">({{reviewCount}})</div>
            </div>
        </div>
        <div class="recipe-details">
            <div class="left-side">
                <div class="icon"></div>
                <div class="group">
                    <div class="group-title">PREP TIME</div>
                    <div class="group-data">{{prepTimeMinutes}} minute(s)</div>
                </div>
                <div class="group">
                    <div class="group-title">COOK TIME</div>
                    <div class="group-data">{{cookTimeMinutes}} minute(s)</div>
                </div>
                <div class="group">
                    <div class="group-title">DIFFICULTY</div>
                    <div class="group-data">{{difficulty}}</div>
                </div>
            </div>
            <img src="{{image}}" alt="{{imgAlt}}" class="recipe-photo">
            <div class="right-side">
                <div class="icon"></div>
                <div class="group">
                    <div class="group-title">SERVINGS</div>
                    <div class="group-data">{{servings}} person(s)</div>
                </div>
                <div class="group">
                    <div class="group-title">CALORIES</div>
                    <div class="group-data">{{caloriesPerServing}} Kcal</div>
                </div>
                <div class="group">
                    <div class="group-title">CUISINE</div>
                    <div class="group-data">{{cuisine}}</div>
                </div>
            </div>
        </div>
        <div class="recipe-body">
            <div class="ingredients">
                <h3 class="recipe-body-title"><span>Ingredients</span></h3>
                <ul class="ingredients-list"></ul>
            </div>
            <div class="instructions">
                <h3 class="recipe-body-title"><span>Instructions</span></h3>
                <ol class="instructions-list"></ol>
            </div>
        </div>
        <div class="btns-group">
            <button id="saveBtn" class="save-bottom-button save-recipe-btn">Favourite</button>
        </div>
    </div>
`;