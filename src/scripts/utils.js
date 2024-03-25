import { recipeCardTemplate } from "./templates";

export function htmlToElement(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild;
}
export function extractRecipeCardData(data) {
    return data.map(({ id, name, image, rating, reviewCount }) => { 
        return { id, name, image, rating, reviewCount };
    });
}
export function createRecipeCardElement(r) {
    const html = recipeCardTemplate.replace('{{id}}', r.id)
                                        .replace('{{cardId}}', r.id)
                                        .replace('{{img}}', r.image)
                                        .replace('{{imgAlt}}', r.name)
                                        .replace('{{name}}', r.name)
                                        .replace('{{rating}}', r.rating)
                                        .replace('{{reviewCount}}', r.reviewCount);

    const element = htmlToElement(html);
    element.querySelector('.star-inner').style.width = `${(r.rating / 5) * 100}%`;

    return element;
}