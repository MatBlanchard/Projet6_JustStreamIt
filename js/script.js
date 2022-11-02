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
    var page = await get("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score");
    var bestMovie = await get("http://localhost:8000/api/v1/titles/" + page.results[0].id);
    document.getElementById("best-movie_title").innerText = bestMovie.title;
    document.getElementById("best-movie_description").innerText = bestMovie.description;
    document.getElementById("best-movie_pic").setAttribute("src", formatImageUrl(bestMovie.image_url));
}

function formatImageUrl(img_url) {
    return img_url.split('_CR')[0].replace('268', '5000');
}

displayBestMovie();

