const API_KEY = '3a639bd1ea3472d2b3e4dc3d46aebb25';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYTYzOWJkMWVhMzQ3MmQyYjNlNGRjM2Q0NmFlYmIyNSIsIm5iZiI6MTc1NjI2MjgwOC4zMDU5OTk4LCJzdWIiOiI2OGFlNzE5OGQ0MGE1NTc4ZDQ0ZWJhYjciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9tmN8Cwi3Y6zv2RKtngkra0uSQ2Mml_gMfnviEc9hf0';

const BASE_URL = 'https://api.themoviedb.org/3';

const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${ACCESS_TOKEN}`
};

export const fetchTrendingData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/trending/all/week?language=en-US`, { headers });
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching trending:", error);
    return [];
  }
};

export const fetchUpcomingMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/upcoming?language=en-US&page=1`, { headers });
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return [];
  }
};

export const fetchOnTheAirSeries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tv/on_the_air?language=en-US&page=1&timezone=UTC`, { headers });
    const data = await response.json();
    
    // For TV shows, we need details to get the REAL next episode time
    // The list endpoint only gives basic info.
    // We will do a refined fetch for the top 5-10 items to save bandwidth
    const detailedPromises = (data.results || []).slice(0, 10).map(async (show) => {
      try {
        const detailRes = await fetch(`${BASE_URL}/tv/${show.id}?language=en-US`, { headers });
        return await detailRes.json();
      } catch (e) {
        return show;
      }
    });

    return await Promise.all(detailedPromises);
  } catch (error) {
    console.error("Error fetching TV:", error);
    return [];
  }
};

export const fetchAsianSeries = async () => {
  try {
    // Discover TV shows from Korea, China, Japan, Thailand sorted by popularity
    // with_original_language: ko|zh|ja|th
    const response = await fetch(
      `${BASE_URL}/discover/tv?language=en-US&sort_by=popularity.desc&with_original_language=ko|zh|ja|th&without_genres=16&page=1`, 
      { headers }
    );
    const data = await response.json();
    
    // As with On The Air, we need details for next episode info
    const detailedPromises = (data.results || []).slice(0, 10).map(async (show) => {
      try {
        const detailRes = await fetch(`${BASE_URL}/tv/${show.id}?language=en-US`, { headers });
        return await detailRes.json();
      } catch (e) {
        return show;
      }
    });

    return await Promise.all(detailedPromises);
  } catch (error) {
    console.error("Error fetching Asian Series:", error);
    return [];
  }
};

export const searchMulti = async (query) => {
  if (!query) return [];
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`, 
      { headers }
    );
    const data = await response.json();
    
    // Enrich TV results with details to get next_episode_to_air
    const detailedPromises = (data.results || []).map(async (item) => {
      if (item.media_type === 'tv' || (!item.media_type && item.name)) {
        try {
          const detailRes = await fetch(`${BASE_URL}/tv/${item.id}?language=en-US`, { headers });
          const detailData = await detailRes.json();
          return { ...item, ...detailData }; // Merge detail data over basic data
        } catch (e) {
          return item;
        }
      }
      return item;
    });

    return await Promise.all(detailedPromises);
  } catch (error) {
    console.error("Error searching content:", error);
    return [];
  }
};
