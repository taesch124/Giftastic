const animals = ['turtle', 'dog', 'cat', 'panda'];
const gifLimit = 10;

document.addEventListener('DOMContentLoaded', function() {
    renderButtons();

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
                //getQuestions(difficultySelector.value, categorySelector.value, sessionToken);
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

    gifData.forEach((e) => {
        let gifContainer = document.createElement('div');
        
        gifContainer.classList.add('gif-container');

        let rating = document.createElement('h4');
        rating.textContent = 'Rating: ' + e.rating;
        gifContainer.appendChild(rating);

        let image = document.createElement('img');
        image.setAttribute('src', e.images.original_still.url);
        image.setAttribute('data-animate', e.images.original.url);
        image.setAttribute('data-still', e.images.original_still.url);
        image.setAttribute('data-state', 'still');
        image.addEventListener('click', toggleAnimation);
        gifContainer.appendChild(image);

        gifHolder.prepend(gifContainer);
    });
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

function addAnimal() {
    let animalName = document.getElementById('new-animal-input').value;
    if(!animalName) return;

    animals.push(animalName);
    renderButtons();
}