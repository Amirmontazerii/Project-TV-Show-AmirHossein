function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

// Function to format episode code (e.g., S02E07)
function formatEpisodeCode(season, episode) {
  return `S${String(season).padStart(2, "0")}E${String(episode).padStart(2, "0")}`;
}

// Function to create and display episode cards
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous content

  // Display number of episodes
  const episodeCount = document.createElement("p");
  episodeCount.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.appendChild(episodeCount);

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");

    episodeCard.innerHTML = `
      <h2>${episode.name} (${formatEpisodeCode(episode.season, episode.number)})</h2>
      <img src="${episode.image?.medium || "placeholder.jpg"}" alt="${episode.name}">
      <p>${episode.summary || "No summary available."}</p>
      <a href="${episode.url}" target="_blank">More on TVMaze</a>
    `;

    rootElem.appendChild(episodeCard);
  });
}

window.onload = setup;
