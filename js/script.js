async function get(url) {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (err) {
        console.log(err);
    }
};

async function displayBestMovie() {
    const page = await get("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score");
    const bestMovie = await get("http://localhost:8000/api/v1/titles/" + page.results[0].id);
    document.getElementById("best-movie_title").innerText = bestMovie.title;
    document.getElementById("best-movie_description").innerText = bestMovie.description;
    document.getElementById("best-movie_pic").setAttribute("src", formatImageUrl(bestMovie.image_url));
};

function formatImageUrl(img_url) {
    return img_url.split('_CR')[0].replace('268', '5000');
};

async function displayCarrousel(category) {
    var movies = [];
    var page = await get(url(category));
    for (i=0;i<5;i++) {
        movies.push(page.results[i])
    }
    page = await get(page.next)
    for (i=0;i<3;i++) {
        movies.push(page.results[i])
    }
    if (category == "best-movies") {
        movies.shift();
    } else {
        movies.pop();
    }
    var container = document.getElementById(category + "_container");
    var carrousel = document.getElementById(category + "_carrousel");
    container.style.width = (carrousel.offsetWidth*10/3) + "px"
    createDiv(movies[movies.length-2], container);
    createDiv(movies[movies.length-1], container);
    for(i=0;i<movies.length;i++) {
        createDiv(movies[i], container);
    }
    p = 0;
};

function url(category) {
    if (category == "best-movies") {
        return "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    } else if (category == "sci-fi") {
        return "http://localhost:8000/api/v1/titles/?genre=Sci-Fi&sort_by=-imdb_score";
    } else if (category == "animation") {
        return "http://localhost:8000/api/v1/titles/?genre=Animation&sort_by=-imdb_score";
    } else if (category == "comedy") {
        return "http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score";
    }
}

function createDiv(movie, container) {
    var div = document.createElement("div");
    div.className = "image";
    div.style.backgroundImage = "url('" + formatImageUrl(movie.image_url) + "')";
    div.onmouseover = function() {
        this.style.transform = "scale(1.05)";
        this.style.cursor = "pointer";
    }
    div.onmouseout= function() {
        this.style.transform = "scale(1)"
    }
    container.appendChild(div);
}

function translateLeft(category) {
    p++;
    if (p > 2) {
        p = -4;
    }
    document.getElementById(category + "_container").style.transform="translate(" + (p*17-33.5) + "vw)"
};

function translateRight(category) {
    p--;
    if (p < -4) {
        p = 2;
    }
    document.getElementById(category + "_container").style.transform="translate(" + (p*17-33.5) + "vw)"
};

displayBestMovie();
displayCarrousel("best-movies");
displayCarrousel("sci-fi");
displayCarrousel("animation");
displayCarrousel("comedy");

