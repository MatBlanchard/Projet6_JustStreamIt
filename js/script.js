positions = new Map();
positions.set('best-movies', 0)
positions.set('sci-fi', 0)
positions.set('animation', 0)
positions.set('comedy', 0)

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
    bestMovie = await get("http://localhost:8000/api/v1/titles/" + page.results[0].id);
    document.getElementById("best-movie_title").innerText = bestMovie.title;
    document.getElementById("best-movie_description").innerText = bestMovie.description;
    document.getElementById("best-movie_pic").setAttribute("src", formatImageUrl(bestMovie.image_url));
};

function formatImageUrl(img_url) {
    return img_url.split('_CR')[0].replace('268', '5000');
};

function formatDate(date) {
    return new Date(date).toLocaleDateString();
};

async function displayCarrousel(category) {
    var movies_url = [];
    var page = await get(url(category));
    for (i=0;i<5;i++) {
        movies_url.push(page.results[i].url)
    };
    page = await get(page.next)
    for (i=0;i<3;i++) {
        movies_url.push(page.results[i].url)
    };
    if (category == "best-movies") {
        movies_url.shift();
    } else {
        movies_url.pop();
    };
    var container = document.getElementById(category + "_container");
    var carrousel = document.getElementById(category + "_carrousel");
    container.style.width = (carrousel.offsetWidth*10/3) + "px"
    await createDiv(movies_url[movies_url.length-2], container);
    await createDiv(movies_url[movies_url.length-1], container);
    for (movie_url of movies_url) {
       await createDiv(movie_url, container);
    };
};

function url(category) {
    if (category == "best-movies") {
        return "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    } else {
        return "http://localhost:8000/api/v1/titles/?genre=" + category + "&sort_by=-imdb_score";
    };
}

async function createDiv(movie_url, container) {
    var movie = await get(movie_url);
    var div = document.createElement("div");
    div.className = "image";
    div.style.backgroundImage = "url('" + formatImageUrl(movie.image_url) + "')";
    div.onmouseover = function() {
        this.style.transform = "scale(1.05)";
        this.style.cursor = "pointer";
    }
    div.onmouseout = function() {
        this.style.transform = "scale(1)"
    }
    div.onclick = function() {
        toggleModal(movie);
    }
    container.appendChild(div);
}

function updatePosition(category, direction) {
    positions.set(category, positions.get(category) + direction);
    if (positions.get(category) > 2) {
        positions.set(category, -4);
    } else if (positions.get(category) < -4) {
        positions.set(category, 2);
    }
    document.getElementById(category + "_container").style.transform="translate(" + (positions.get(category)*17-33.5) + "vw)";
};

function toggleModal(movie) {
    if (movie == "best-movie") {
        movie = bestMovie;
    };
    document.getElementById("modal_title").innerText = movie.title;
    document.getElementById("modal_category").innerText = movie.genres;
    document.getElementById("modal_date").innerText = formatDate(movie.date_published);
    document.getElementById("modal_rated").innerText = movie.rated;
    document.getElementById("modal_score").innerText = movie.imdb_score;
    if (movie.imdb_directors != undefined) {
        document.getElementById("modal_director").innerText = movie.imdb_directors;
    } else {
        document.getElementById("modal_director").innerText = "";
    }
    document.getElementById("modal_actor").innerText = movie.actors;
    if (movie.imdb_duration != undefined) {
        document.getElementById("modal_duration").innerText = movie.imdb_duration + "min";
    } else {
        document.getElementById("modal_duration").innerText = "";
    }
    document.getElementById("modal_country").innerText = movie.countries;
    if (movie.worldwide_gross_income != null) {
        document.getElementById("modal_box-office").innerText = movie.worldwide_gross_income.toLocaleString() + "$";
    } else {
        document.getElementById("modal_box-office").innerText = "";
    }
    document.getElementById("modal_description").innerText = movie.description;
    document.getElementById("modal_pic").setAttribute("src", formatImageUrl(movie.image_url));
    document.querySelector(".modal-container").classList.toggle("active");
}

function closeModal() {
    document.querySelector(".modal-container").classList.toggle("active");
}

document.querySelectorAll(".modal-trigger").forEach(trigger => trigger.addEventListener("click", closeModal))
displayBestMovie();
displayCarrousel("best-movies");
displayCarrousel("sci-fi");
displayCarrousel("animation");
displayCarrousel("comedy");

