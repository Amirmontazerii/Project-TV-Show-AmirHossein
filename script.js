const showsApiUrl = "https://api.tvmaze.com/shows";
let allShows = [];
let allEpisodes = {};
let currentShowId = null;

document.addEventListener("DOMContentLoaded", () => {
  fetchShows();
  setupEventListeners();
});

async function fetchShows() {
  try {
    const response = await fetch(showsApiUrl);
    if (!response.ok) throw new Error("Failed to fetch shows");

    allShows = await response.json();
    allShows.sort((a, b) => a.name.localeCompare(b.name));
    displayShows(allShows);
  } catch (error) {
    console.error("Error fetching shows:", error);
  }
}

function displayShows(shows) {
  currentShowId = null; // Reset current show view
  document.getElementById("backToShows").style.display = "none";
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = shows.map(show => `
      <div class="show-card" data-show-id="${show.id}">
        <h3>${show.name}</h3>
        <img src="${show.image ? show.image.medium : 'https://via.placeholder.com/210'}" alt="${show.name}">
        <p>${show.summary || "No description available."}</p>
        <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
        <p><strong>Status:</strong> ${show.status}</p>
        <p><strong>Rating:</strong> ${show.rating.average || "N/A"}</p>
        <p><strong>Runtime:</strong> ${show.runtime || "Unknown"} min</p>
      </div>
    `).join("");
}

async function fetchEpisodes(showId) {
  if (allEpisodes[showId]) {
    displayEpisodes(showId, allEpisodes[showId]);
    return;
  }

  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    if (!response.ok) throw new Error("Failed to fetch episodes");

    allEpisodes[showId] = await response.json();
    displayEpisodes(showId, allEpisodes[showId]);
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
}

function displayEpisodes(showId, episodes) {
  currentShowId = showId;
  document.getElementById("backToShows").style.display = "block";
  
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `
    <button id="backToShows">Back to Shows</button>
    <input type="text" id="episodeSearch" placeholder="Search episodes...">
    <select id="episodeSelector">
      <option value="all">Show All Episodes</option>
      ${episodes.map(ep => `<option value="${ep.id}">${formatEpisodeTitle(ep)}</option>`).join("")}
    </select>
    <div id="episodesContainer">
      ${episodes.map(episode => createEpisodeCard(episode)).join("")}
    </div>
  `;
}

function createEpisodeCard(episode) {
  return `
    <div class="episode-card">
      <h3>${formatEpisodeTitle(episode)}</h3>
      <img src="${episode.image ? episode.image.medium : 'https://via.placeholder.com/210'}" alt="${episode.name}">
      <p>${episode.summary || "No description available."}</p>
    </div>
  `;
}

function formatEpisodeTitle(episode) {
  return `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
}

function setupEventListeners() {
  document.getElementById("root").addEventListener("click", (event) => {
    if (event.target.closest(".show-card")) {
      const showId = event.target.closest(".show-card").dataset.showId;
      fetchEpisodes(showId);
    }
    if (event.target.id === "backToShows") {
      displayShows(allShows);
    }
  });

  document.getElementById("globalShowSearch").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredShows = allShows.filter(show =>
      show.name.toLowerCase().includes(query) ||
      show.genres.some(genre => genre.toLowerCase().includes(query)) ||
      (show.summary && show.summary.toLowerCase().includes(query))
    );
    displayShows(filteredShows);
  });

  document.getElementById("root").addEventListener("input", (event) => {
    if (event.target.id === "episodeSearch") {
      const query = event.target.value.toLowerCase();
      const episodes = allEpisodes[currentShowId];
      const filteredEpisodes = episodes.filter(ep =>
        ep.name.toLowerCase().includes(query) || 
        (ep.summary && ep.summary.toLowerCase().includes(query))
      );
      document.getElementById("episodesContainer").innerHTML = filteredEpisodes.map(createEpisodeCard).join("");
    }

    if (event.target.id === "episodeSelector") {
      const selectedId = event.target.value;
      const episodes = allEpisodes[currentShowId];
      if (selectedId === "all") {
        document.getElementById("episodesContainer").innerHTML = episodes.map(createEpisodeCard).join("");
      } else {
        const selectedEpisode = episodes.find(ep => ep.id == selectedId);
        document.getElementById("episodesContainer").innerHTML = createEpisodeCard(selectedEpisode);
      }
    }
  });
}

// Initialize application
window.onload = fetchShows;
