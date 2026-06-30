/*             Feel free to use this skeleton I have provided or delete everything and do your own thing!             */

//If you would like to, you can create a variable to store the API_URL here.
//This is optional. if you do not want to, skip this and move on.

/////////////////////////////
/*This looks like a good place to declare any state or global variables you might need*/
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2605-DYLAN";
const RESOURCE = "/players";
const API = BASE + COHORT + RESOURCE;

let players = [];
let selectedPlayer = null;

////////////////////////////

/**
 * Fetches all players from the API.
 * This function should not be doing any rendering
 * Instead, this function should be keeping our state up to date
 */
async function getPlayers() {
  try {
    const response = await fetch(API);
    const result = await response.json();

    players = result.data.players;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Fetches a single player from the API.
 * This function should not be doing any rendering
 * Instead, this function should be keeping our state up to date
 * @param {number} playerId
 */
/**
 * Note: In order to call fetchSinglePlayer() a player's id is required.
 * Unless we know the id of the player we are trying to fetch, we cannot call fetchSinglePlayer()
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API}/${playerId}`);
    const result = await response.json();

    selectedPlayer = result.data.player;

    render();
  } catch (error) {
    console.error("Error fetching player:", error);
  }
};

/**
 * Adds a new player to the roster via the API.
 * Once a player is added to the database, the new player
 * should appear in the all players page without having to refresh
 * @param {Object} newPlayer the player to add
 */
/* Note: we need data from our user to be able to add a new player
 * What does that sound like we need?
 */
/**
 * Note#2: addNewPlayer() expects you to pass in a
 * new player object when you call it. How can we
 * create a new player object and then pass it to addNewPlayer()?
 */

const addNewPlayer = async (newPlayer) => {
  try {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlayer),
    });

    await getPlayers();
    render();
  } catch (error) {
    console.error("Error adding player:", error);
  }
};

/**
 * Removes a player from the roster via the API.
 * Once the player is removed from the database,
 * the player should also be removed from our view without refreshing
 * @param {number} playerId the ID of the player to remove
 */
/**
 * Note: In order to call removePlayer() a player's id is required.
 * Unless we know the id of the player we are trying to remove, we cannot call removePlayer()
 */

const removePlayer = async (playerId) => {
  try {
    await fetch(`${API}/${playerId}`, {
      method: "DELETE",
    });

    selectedPlayer = null;

    await getPlayers();
    render();
  } catch (error) {
    console.error(error);
  }
};

/**
 * Updates html to display a list of all players or a single player page.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player in the all player list is displayed with the following information:
 * - name
 * - image (with alt text of the player's name)
 *
 * Additionally, for each player we should be able to:
 * - See details of a single player. The page should show
 *    specific details about the player clicked such as: name, id, breed, status, image, and team or unassigned if no team
 * - Remove from roster. When a button is clicked, should remove the player
 *    from the database and our current view without having to refresh
 *
 */
////////////////////////////

function PlayerListItem(player) {
  const $li = document.createElement("li");

  $li.innerHTML = `
    <img src="${player.imageUrl}" alt="${player.name}" width="50" />
    <span>${player.name}</span>
  `;

  $li.addEventListener("click", () => {
    console.log("Clicked player:", player.id);

    fetchSinglePlayer(player.id);
  });

  return $li;
}

function PlayerList() {
  if (players.length === 0) {
    const $p = document.createElement("p");
    $p.textContent = "No puppies found.";
    return $p;
  }

  const $ul = document.createElement("ul");
  $ul.classList.add("players");

  const $players = players.map(PlayerListItem);
  $ul.replaceChildren(...$players);

  return $ul;
}

function SelectedPlayerView() {
  if (!selectedPlayer) {
    const $p = document.createElement("p");
    $p.textContent = "Select a puppy to view details.";
    return $p;
  }

  const $section = document.createElement("section");

  $section.innerHTML = `
    <h2>${selectedPlayer.name}</h2>
    <img src="${selectedPlayer.imageUrl}" alt="${selectedPlayer.name}" width="250" />
    <p><strong>ID:</strong> ${selectedPlayer.id}</p>
    <p><strong>Breed:</strong> ${selectedPlayer.breed}</p>
    <p><strong>Status:</strong> ${selectedPlayer.status}</p>
    <p><strong>Team:</strong> ${
      selectedPlayer.team ? selectedPlayer.team.name : "Unassigned"
    }</p>
    <button id="remove-player">Remove from roster</button>
  `;

  $section.querySelector("#remove-player").addEventListener("click", () => {
    removePlayer(selectedPlayer.id);
  });

  return $section;
}

function PlayerForm() {
  const $form = document.createElement("form");

  $form.innerHTML = `
    <h2>Invite a puppy</h2>

    <label>Name</label>
    <input name="name" required />

    <label>Breed</label>
    <input name="breed" required />

    <button>Add Puppy</button>
  `;

  $form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData($form);

    const newPlayer = {
      name: formData.get("name"),
      breed: formData.get("breed"),
    };

    await addNewPlayer(newPlayer);

    $form.reset();
  });

  return $form;
}

const render = () => {
  const $app = document.querySelector("#app");

  $app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
      <section id="roster"></section>
      <section id="details"></section>
      <section id="form"></section>
    </main>
  `;

  document.querySelector("#roster").appendChild(PlayerList());
  document.querySelector("#details").appendChild(SelectedPlayerView());
  document.querySelector("#form").appendChild(PlayerForm());
};

/**
 * Initializes the app by calling render
 * HOWEVER....
 */
const init = async () => {
  await getPlayers();

  render();
};

init();
