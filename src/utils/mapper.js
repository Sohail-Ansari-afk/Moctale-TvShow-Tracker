export const mapTMDBToAppSchema = (item) => {
  const isMovie = item.title || item.original_title; // Movies have 'title', TV has 'name'
  const type = isMovie ? 'movie' : 'webseries'; // Defaulting TV to webseries for now, could detect drama based on genres
  
  // Genres Logic (Optional refinement)
  // 18 = Drama, 10765 = Sci-Fi/Fantasy, 35 = Comedy
  let refinedType = type;
  
  if (!isMovie) {
    // Check Language for Asian Drama categorization
    const lang = item.original_language;
    if (['ko', 'zh', 'cn', 'ja', 'th'].includes(lang)) {
      refinedType = 'drama'; // Asian shows = Dramas
    }
    // Western shows stay as 'webseries' regardless of genre
  }

  // Image
  const image = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Image';

  // Logic for Timer and Episode info
  let releaseDate = null;
  let episodeInfo = null;
  let episodeTitle = null;

  if (isMovie) {
    releaseDate = item.release_date ? new Date(item.release_date).toISOString() : null;
    episodeInfo = "Theatrical Release";
  } else {
    // For TV, use next_episode_to_air if available
    const nextEp = item.next_episode_to_air;
    if (nextEp) {
      // TMDB dates are often YYYY-MM-DD (midnight UTC).
      // If airing TODAY, it consumes as "past" (00:00) -> LIVE.
      // Fix: Add a default time of 20:00 (8 PM) UTC if it's just a date.
      let dateStr = nextEp.air_date;
      if (dateStr && dateStr.length === 10) {
        dateStr += 'T20:00:00Z'; // Assume 8 PM release
      }
      
      releaseDate = dateStr ? new Date(dateStr).toISOString() : null;
      episodeInfo = `S${nextEp.season_number} E${nextEp.episode_number}`;
      episodeTitle = nextEp.name;
      episodeTitle = nextEp.name;
    } else {
      // Show might be ended or on break
      let dateStr = item.last_air_date;
      if (dateStr && dateStr.length === 10) {
         dateStr += 'T20:00:00Z'; // Assume 8 PM release for last episode too
      }
      
      releaseDate = dateStr ? new Date(dateStr).toISOString() : null;
      // Do NOT set releaseDate if we want to avoid "LIVE" badge for ended shows unless we handle it in ShowCard
      // But user wants "Live now" ONLY for movies.
      // So for TV, if no next episode, let's kill the releaseDate so timer logic fails/hides?
      // Or set a specific flag?
      // Better: Keep releaseDate for sorting, but semantic text changed.
      episodeInfo = "Season Finale (Aired)";
      if (item.status === 'Ended') {
        episodeInfo = "Completed";
      }
    }
  }

  // Filter out items without valid dates if we want strictly upcoming?
  // Or keep them for "Recent".
  // For now, return object.

  return {
    id: item.id,
    title: item.title || item.name,
    type: refinedType,
    image,
    description: item.overview,
    releaseDate, // Can be null
    episode: episodeInfo,
    rawDate: releaseDate, // For sorting
    isFinished: !isMovie && !item.next_episode_to_air && ['Ended', 'Canceled'].includes(item.status)
  };
};

export const mergeAndSortContent = (movies, series) => {
  const mappedMovies = movies.map(mapTMDBToAppSchema);
  const mappedSeries = series.map(mapTMDBToAppSchema);
  
  const all = [...mappedMovies, ...mappedSeries];
  
  // Filter out items with no release date or dates in the past (if strict countdown)
  // For this app, let's keep everything but sort by "Nearest Future Date" then "Recent Past"
  
  const now = new Date();
  
  return all.sort((a, b) => {
    const dateA = new Date(a.releaseDate || 0);
    const dateB = new Date(b.releaseDate || 0);
    
    // Sort logic: 
    // If both are future, closest first.
    // If one future, one past, future wins.
    // If both past, most recent first.
    
    const aIsFuture = dateA > now;
    const bIsFuture = dateB > now;
    
    if (aIsFuture && bIsFuture) return dateA - dateB;
    if (aIsFuture && !bIsFuture) return -1;
    if (!aIsFuture && bIsFuture) return 1;
    return dateB - dateA;
  });
};
