export const categoryItemTemplate = `
    <li data-category-id="{{id}}" class='category'>{{category}}</li>
`;
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