import './recipe.html';
import './recipe.scss';

if(window.location.search) {
    const params = new URLSearchParams(location.search);
    const id = parseInt(params.get('id'));

    fetch(`https://dummyjson.com/recipes/${id}`)
        .then(res => res.json())
        .then(console.log);
}