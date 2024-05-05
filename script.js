// Claus
const keys = {
    api_key: 'your_api_key', // Fill in your API key here
    session_id: 'your_session_id', // Fill in your session ID here
    account_id: 'your_account_id', // Fill in your account ID here
    bearer_id: 'your_bearer_id' // Fill in your bearer ID here
}

let moviesResult = document.getElementById("moviesResult");
let total_pages = 0;
let current_page = 1;

// Funció per marcar/desmarcar com a favorit
async function setFav(id, favBool) {
    moviesResult.innerHTML = "";
    showFavs();
}

// Funció per mostrar les pel·lícules marcades com a favorits
async function showFavs() {
    fetch(`https://api.themoviedb.org/3/account/${keys.account_id}/favorite/movies?api_key=${keys.api_key}&page=${current_page}`, {
        headers: {
            Authorization: `Bearer ${keys.bearer_id}`
        }
    })
        .then(response => response.json())
        .then(data => {
            moviesResult.innerHTML = "";
            data.results.forEach(movie => {
                printMovie(movie, true, false);
            });
            total_pages = data.total_pages; 
            current_page++; 
        })
        .catch(error => {
            console.error('Error fetching favorite movies:', error);
        });
}

// Funció per cercar pel·lícules
async function searchMovies(query) {
    clearInput();
    removeActive();
}

/* FUNCIONS D'INTERACCIÓ AMB EL DOM */

// Funció per detectar el scroll infinit
window.addEventListener('scroll', async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && current_page < total_pages) {
        // Show loading gif
        document.getElementById('loading').style.display = 'block';

        await showFavs(); 

        // Hide loading gif
        document.getElementById('loading').style.display = 'none';
    }
});

// Click Favorites
document.getElementById("showFavs").addEventListener("click", async function () {
    removeActive();
    this.classList.add("active");

    await showFavs();
});

// Click Watchlist
document.getElementById("showWatch").addEventListener("click", function () {
    removeActive();
    this.classList.add("active");

    //showWatch();
})

// Intro a l'input
document.getElementById("search").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchMovies(this.value);
    }
});

// Click a la lupa
document.querySelector(".searchBar i").addEventListener("click", () => searchMovies(document.getElementById("search").value));

// Netejar l'input
document.getElementById("search").addEventListener('click', () => clearInput());

function clearInput() {
    document.getElementById("search").value = "";
}

// Elimina l'atribut active del menú
function removeActive() {
    document.querySelectorAll(".menu li a").forEach(el => el.classList.remove("active"));
}

/* Funció per printar les pel·lícules */
function printMovie(movie, fav, watch) {

    let favIcon = fav ? 'iconActive' : 'iconNoActive';
    let watchIcon = watch ? 'iconActive' : 'iconNoActive';

    moviesResult.innerHTML += `<div class="movie">
                                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}">
                                    <h3>${movie.original_title}</h3>
                                    <div class="buttons">
                                        <a id="fav" onClick="setFav(${movie.id}, ${!fav})"><i class="fa-solid fa-heart ${favIcon}"></i></a>
                                        <a id="watch" onClick="setWatch(${movie.id}, ${!watch})"><i class="fa-solid fa-eye ${watchIcon}"></i></a>
                                    </div>`;
}
