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
      alert('Movie not found.');
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
document.addEventListener('modal-js-example', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});