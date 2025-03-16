document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.tvmaze.com/shows/82/episodes";
  const root = document.getElementById("root");
  const searchBar = document.getElementById("searchBar");
  const episodeSelector = document.getElementById("episodeSelector");
  const episodeCount = document.getElementById("episodeCount");

  let episodes = []; // Store episodes to prevent multiple fetches

  // Function to fetch episodes from API
  async function fetchEpisodes() {
    try {
      root.innerHTML = "<p class='loading'>Loading episodes...</p>"; // Show loading message

      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch episodes.");

      episodes = await response.json();
      displayEpisodes(episodes);
      populateDropdown(episodes);
    } catch (error) {
      root.innerHTML = `<p class='error'>Error loading episodes. Please try again later.</p>`;
      console.error("Fetch Error:", error);
    }
  }

  // Function to display episodes
  function displayEpisodes(episodeList) {
    root.innerHTML = ""; // Clear previous content
    if (episodeList.length === 0) {
      root.innerHTML = "<p>No episodes found.</p>";
      return;
    }

    episodeList.forEach((episode) => {
      const episodeCard = document.createElement("div");
      episodeCard.className = "episode-card";
      episodeCard.innerHTML = `
        <h3>${formatEpisodeTitle(episode)}</h3>
        <img src="${episode.image ? episode.image.medium : 'https://via.placeholder.com/250'}" alt="${episode.name}">
        <p>${episode.summary || "No summary available."}</p>
        <a href="${episode.url}" target="_blank">More info</a>
      `;
      root.appendChild(episodeCard);
    });

    episodeCount.textContent = `Displaying ${episodeList.length} / ${episodes.length} episodes`;
  }

  // Function to format episode title
  function formatEpisodeTitle(episode) {
    const season = episode.season.toString().padStart(2, "0");
    const number = episode.number.toString().padStart(2, "0");
    return `S${season}E${number} - ${episode.name}`;
  }

  // Function to populate dropdown menu
  function populateDropdown(episodeList) {
    episodeSelector.innerHTML = '<option value="all">Show All Episodes</option>';
    episodeList.forEach((episode) => {
      const option = document.createElement("option");
      option.value = episode.id;
      option.textContent = formatEpisodeTitle(episode);
      episodeSelector.appendChild(option);
    });
  }

  // Event listener for search
  searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    const filteredEpisodes = episodes.filter((episode) =>
      episode.name.toLowerCase().includes(query) ||
      (episode.summary && episode.summary.toLowerCase().includes(query))
    );
    displayEpisodes(filteredEpisodes);
  });

  // Event listener for dropdown selection
  episodeSelector.addEventListener("change", () => {
    const selectedId = episodeSelector.value;
    if (selectedId === "all") {
      displayEpisodes(episodes);
    } else {
      const selectedEpisode = episodes.find((ep) => ep.id == selectedId);
      displayEpisodes(selectedEpisode ? [selectedEpisode] : []);
    }
  });

  fetchEpisodes(); // Fetch data on page load
});
