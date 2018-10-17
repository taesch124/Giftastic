const animals = ['turtle', 'dog', 'cat', 'panda'];
// localStorage.clear();
var favorites = JSON.parse(localStorage.getItem('favorites')) ;
if(!Array.isArray(favorites)) favorites = [];
const gifLimit = 10;

document.addEventListener('DOMContentLoaded', function() {
    renderButtons();
    renderFavorites();

    document.getElementById('new-animal-button').addEventListener('click', addAnimal);
});

function renderButtons() {
    let buttonContainer = document.getElementById('giphy-buttons');
    while (buttonContainer.firstChild) {
        buttonContainer.removeChild(buttonContainer.firstChild);
    }

    animals.forEach((e) => {
        let button = document.createElement('button');
        button.setAttribute('data-name', e);
        button.classList.add('animal-button');
        button.textContent = e;
        button.addEventListener('click', getGifs);
        buttonContainer.appendChild(button);
    });
}

function getGifs() {
    let xhr = new XMLHttpRequest();
    let apiKey = 'dc6zaTOxFJmzC';
    let url = 'https://api.giphy.com/v1/gifs/search?limit=' + gifLimit + '&api_key=' + apiKey + '&q=' + this.getAttribute('data-name');
    console.log(url);

    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200 ) {
                renderGifs(JSON.parse(xhr.response).data);
            }else if(xhr.status === 400) {
                console.error('failed api request');
            }
        }
    }
    
    xhr.open('GET', url);
    xhr.responseType = "text";
    xhr.send();
}

function getFavorite() {
    let id = this.getAttribute('data-id');
    let xhr = new XMLHttpRequest();
    let apiKey = 'dc6zaTOxFJmzC';
    let url = 'https://api.giphy.com/v1/gifs/' + id + '?api_key=' + apiKey;

    console.log(url);

    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200 ) {
                renderGifs([JSON.parse(xhr.response).data]);
            }else if(xhr.status === 400) {
                console.error('failed api request');
            }
        }
    }
    
    xhr.open('GET', url);
    xhr.responseType = "text";
    xhr.send();
}

function renderGifs(gifData) {
    let gifHolder = document.getElementById('gif-holder');

    if(gifData.length === 1) {
        while (gifHolder.firstChild) {
            gifHolder.removeChild(gifHolder.firstChild);
        }
    }

    gifData.forEach((e) => {
        let gifContainer = document.createElement('div');
        
        gifContainer.classList.add('gif-container');

        let favorite = document.createElement('button');
        favorite.classList.add('favorite-button');
        favorite.setAttribute('data-id', e.id);
        favorite.setAttribute('data-title', e.title);
        favorite.textContent = 'Favorite';
        favorite.addEventListener('click', toggleFavorite);
        gifContainer.appendChild(favorite);

        let title = document.createElement('h4');
        title.classList.add('gif-title');
        title.textContent = 'Title: ' + e.title;
        gifContainer.appendChild(title);

        let rating = document.createElement('h4');
        rating.classList.add('gif-rating');
        rating.textContent = 'Rating: ' + e.rating;
        gifContainer.appendChild(rating);

        let image = document.createElement('img');
        image.classList.add('gif-image');
        image.setAttribute('src', e.images.original_still.url);
        image.setAttribute('data-animate', e.images.original.url);
        image.setAttribute('data-still', e.images.original_still.url);
        image.setAttribute('data-state', 'still');
        image.addEventListener('click', toggleAnimation);
        gifContainer.appendChild(image);

        gifHolder.prepend(gifContainer);
    });
}

function renderFavorites() {
    const list = document.getElementById('favorites-list');

    //remove all elements before rewritting
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    for(let i = 0; i < favorites.length; i++) {
        let favorite = favorites[i];

        let listItem = document.createElement('li');
        let title = document.createElement('h5');
        title.classList.add('favorite-title');
        title.setAttribute('data-id', favorite.id);
        title.textContent = favorite.title;
        title.addEventListener('click', getFavorite);
        listItem.appendChild(title);

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('favorite-delete');
        deleteButton.setAttribute('data-id', favorite.id);
        deleteButton.textContent = "X";
        deleteButton.addEventListener('click', toggleFavorite);
        listItem.appendChild(deleteButton);

        list.appendChild(listItem);
    }
}

function toggleAnimation() {
    let state = this.getAttribute('data-state');

    if(state === 'still') {
        this.setAttribute('src', this.getAttribute('data-animate'));
        this.setAttribute('data-state', 'animate');
    } else if (state === 'animate') {
        this.setAttribute('src', this.getAttribute('data-still'));
        this.setAttribute('data-state', 'still');
    }

}

function toggleFavorite() {
    console.log(this);
    let newFavorite = {id: this.getAttribute('data-id'), title: this.getAttribute('data-title')};
    let pos = favorites.map((e) => e.id).indexOf(newFavorite.id);
    if ( pos === -1) {
        favorites.push(newFavorite);
    } else {
        favorites.splice(pos, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

function addAnimal() {
    let animalName = document.getElementById('new-animal-input').value;
    if(!animalName) return;

    animals.push(animalName);
    renderButtons();
}