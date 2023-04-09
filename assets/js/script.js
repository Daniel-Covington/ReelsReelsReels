const YouTubeapiKey = 'AIzaSyA_uglFhReUs61gcPEwXhfwwFsb31sfVhM';

// Elements for the Modal Y'all //
var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";

  }
};

async function searchMovie() {
  const searchInput = document.getElementById("search-input");
  const movieTitle = searchInput.value;
  const omdbUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(
    movieTitle
  )}&apikey=a23c4e83`;
  const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=03&type=video&q=${encodeURIComponent(
    movieTitle
  )}%20trailer&key=${YouTubeapiKey}`;

  try {
    const omdbResponse = await fetch(omdbUrl);
    const omdbData = await omdbResponse.json();

    if (omdbData.Response === "True") {
      displayMovieDetails(omdbData);

      const youtubeResponse = await fetch(youtubeUrl);
      const youtubeData = await youtubeResponse.json();
      const videoId = youtubeData.items[0].id.videoId;
      displayTrailer(videoId);
    } else {
      modal.style.display = "block";
    }
    const youtubeResponse = await fetch(youtubeUrl);
    const youtubeData = await youtubeResponse.json();
    displaySearchResults(youtubeData.items);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  saveSearchHistory(movieTitle);
  updateSearchHistoryDatalist();
}

//Save search history function
function saveSearchHistory(searchTerm) {
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!searchHistory.includes(searchTerm)) {
    searchHistory.push(searchTerm);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }
}

function updateSearchHistoryDatalist() {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  const searchHistoryDatalist = document.getElementById("search-history");
  let searchHistoryOptions = "";

  searchHistory.forEach((term) => {
    searchHistoryOptions += `<option value="${term}">`;
  });

  searchHistoryDatalist.innerHTML = searchHistoryOptions;
}

function updateSearchHistory() {
  const searchHistory = JSON.parse(
    localStorage.getItem("searchHistory") || "[]"
  );
  const searchHistoryDatalist = document.getElementById("search-history");
  searchHistoryDatalist.innerHTML = "";

  searchHistory.forEach((term) => {
    const option = document.createElement("option");
    option.value = term;
    searchHistoryDatalist.appendChild(option);
  });
}

// Call updateSearchHistory function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  updateSearchHistory();
});

//display related search results to user sumbitted movie title function
function displaySearchResults(searchResults) {
  const searchResultsContainer = document.getElementById("search-results");
  let searchResultThumbnails = "";

  searchResults.forEach((result) => {
    searchResultThumbnails += `
      <div style="display: inline-block; margin: 20px;">
        <a href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">
          <img class="trailer-thumbnail" src="${result.snippet.thumbnails.medium.url}" alt="${result.snippet.title}">
        </a>
      </div>
    `;
  });

  searchResultsContainer.innerHTML = searchResultThumbnails;
}

//display details from omdb API function
function displayMovieDetails(movieData) {
  const movieDetails = document.getElementById("movie-details");
  movieDetails.innerHTML = `
    <h2 class= "titles-0" >${movieData.Title} (${movieData.Year})</h2>
    <p class= "titles-1">
    <span class= "titles-2">Director:</span> ${movieData.Director}
    </p>
    <p class= "titles-1">
    <span class= "titles-2">Actors:</span> ${movieData.Actors}
    </p>
    <p class= "titles-1">
    <span class= "titles-2">Plot:</span> ${movieData.Plot}
    </p>
  `;
}
//display searched trailer with embedded video function
function displayTrailer(videoId) {
  const movieTrailer = document.getElementById("movie-trailer");
  movieTrailer.innerHTML = `
    <h2 class= "texttrailer">Trailer</h2>
    <iframe class="responsive-iframe" width="1200" height="620" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <h2 class= "texttrailer">Related Trailers</h2>
  `;
}

// Load in top current trailers at page load
async function fetchPopularTrailers() {
  const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=06&type=video&q=official%20trailer&order=viewCount&videoDefinition=high&publishedAfter=2022-01-01T00:00:00Z&key=${YouTubeapiKey}`;

  try {
    const youtubeResponse = await fetch(youtubeUrl);
    const youtubeData = await youtubeResponse.json();
    displayPopularTrailers(youtubeData.items);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Display trailers as thumbnails function
function displayPopularTrailers(trailers) {
  const trailersContainer = document.getElementById("trailers-container");
  let trailerThumbnails = "";

  trailers.forEach((trailer) => {
    trailerThumbnails += `
      <div style="display: inline-block; margin: 20px;">
        <a href="https://www.youtube.com/watch?v=${trailer.id.videoId}" target="_blank">
          <img class="trailer-thumbnail" src="${trailer.snippet.thumbnails.medium.url}" alt="${trailer.snippet.title}">
        </a>
      </div>
    `;
  });

  trailersContainer.innerHTML = trailerThumbnails;
}
