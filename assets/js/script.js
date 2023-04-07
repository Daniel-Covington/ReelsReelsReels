// local storage //

var history = [];

// Store the object into storage

function showSearchHistory() {

  localStorage.setItem("history", JSON.stringify(history));

  var localHistory = localStorage.getItem("history");
  
}

// End Local Storage //



// Elements for the Modal Y'all //

var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// End elements for the Modal Y'all //

async function searchMovie() {
  const searchInput = document.getElementById('search-input');
  const movieTitle = searchInput.value;
  const omdbUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=a23c4e83`;
  const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&type=video&q=${encodeURIComponent(movieTitle)}%20trailer&key=AIzaSyB5rvZMTGTsNN0LtOiGn_vGJMd1_n7VLV0`;
  try {
    const omdbResponse = await fetch(omdbUrl);
    const omdbData = await omdbResponse.json();

    if (omdbData.Response === 'True') {
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
    console.error('Error fetching data:', error);
  }
}

function displaySearchResults(searchResults) {
  const searchResultsContainer = document.getElementById('search-results');
  let searchResultThumbnails = '';

  searchResults.forEach(result => {
    searchResultThumbnails += `
      <div style="display: inline-block; margin: 5px;">
        <a href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">
          <img src="${result.snippet.thumbnails.medium.url}" alt="${result.snippet.title}">
          
        </a>
      </div>
    `;
  });

  searchResultsContainer.innerHTML = searchResultThumbnails;
}


function displayMovieDetails(movieData) {
  const movieDetails = document.getElementById('movie-details');
  movieDetails.innerHTML = `
    <h2>${movieData.Title} (${movieData.Year})</h2>
    <p>Director: ${movieData.Director}</p>
    <p>Actors: ${movieData.Actors}</p>
    <p>Plot: ${movieData.Plot}</p>
  `;
}


function displayTrailer(videoId) {
  const movieTrailer = document.getElementById('movie-trailer');
  movieTrailer.innerHTML = `
    <h2>Trailer</h2>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  `;
}

// Load in top current trailers at page load
async function fetchPopularTrailers() {
  const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&type=video&q=official%20trailer&order=viewCount&videoDefinition=high&publishedAfter=2022-01-01T00:00:00Z&key=AIzaSyB5rvZMTGTsNN0LtOiGn_vGJMd1_n7VLV0`;

  try {
    const youtubeResponse = await fetch(youtubeUrl);
    const youtubeData = await youtubeResponse.json();
    displayPopularTrailers(youtubeData.items);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayPopularTrailers(trailers) {
  const trailersContainer = document.getElementById('trailers-container');
  let trailerThumbnails = '';

  trailers.forEach(trailer => {
    trailerThumbnails += `
      <div style="display: inline-block; margin: 5px;">
        <a href="https://www.youtube.com/watch?v=${trailer.id}" target="_blank">
          <img src="${trailer.snippet.thumbnails.medium.url}" alt="${trailer.snippet.title}">
        </a>
      </div>
    `;
  });

  trailersContainer.innerHTML = trailerThumbnails;
}




