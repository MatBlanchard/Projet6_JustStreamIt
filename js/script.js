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

async function displayBestMovieCarrousel() {
    movies = [];
    page = await get("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score");
    for (i=1;i<5;i++) {
        movies.push(page.results[i])
    }
    page = await get(page.next)
    for (i=0;i<3;i++) {
        movies.push(page.results[i])
    }
    console.log(movies);
    container = document.getElementById("container");
    carrousel = document.getElementById("carrousel");
    container.style.width = (carrousel.offsetWidth*8/3) + "px"
    for(i=0;i<movies.length;i++) {
        div = document.createElement("div");
        div.className = "image";
        div.style.backgroundImage = "url('" + formatImageUrl(movies[i].image_url) + "')";
        container.appendChild(div);
    }
    p = 0;
};

function translateLeft() {
    p++;
    if (p > 0) {
        p = -4;
    }
    container.style.transform="translate(" + (p*17+0.5) + "vw)"
};

function translateRight() {
    p--;
    if (p < -4) {
        p = 0;
    }
    container.style.transform="translate(" + (p*17+0.5) + "vw)"
};

displayBestMovie();
displayBestMovieCarrousel();

