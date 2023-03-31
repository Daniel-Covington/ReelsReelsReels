async function searchMovie() {
    const searchInput = document.getElementById('search-input');
    const movieTitle = searchInput.value;
    const omdbUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=a23c4e83`;
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=${encodeURIComponent(movieTitle)}%20trailer&key=AIzaSyB5rvZMTGTsNN0LtOiGn_vGJMd1_n7VLV0`;
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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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