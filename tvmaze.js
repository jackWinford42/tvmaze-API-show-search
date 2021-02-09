/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default image if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const response = await axios.get("http://api.tvmaze.com/search/shows", {
    params: {
        q: query
    }
  });
  let returnArr = [];
  for (let i = 0; i < response.data.length; i++) {
    returnArr[i] = {
      'id': response.data[i].show.id,
      'name': response.data[i].show.name,
      'summary': response.data[i].show.summary
    }
    if (response.data[i].show.image !== null) {
      returnArr[i].image = response.data[i].show.image.medium;
    } else {
      returnArr[i].image = "https://tinyurl.com/tv-missing";
    }
  }
  return returnArr;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  const showsList = document.getElementById("shows-list");

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
          <div class="card" data-show-id="${show.id}">
            <img class="card-img-top" src="${show.image}">
            <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <p class="card-text">${show.summary}</p>
            </div>
            <button type="submit" class="btn btn-info" id="episodes">Episodes</button>
          </div>
      </div>
      `);
    $showsList.append($item);
    console.log(showsList.children)
    showsList.children[showsList.children.length-1].querySelector("button").addEventListener("click", handleEpisodes)
  }
  
  showsList.children[0].querySelector("button").addEventListener("click", handleEpisodes)
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  // TODO: return array-of-episode-info, as described in docstring above
  let returnArr = [];
  //console.log(episodes);
  for (let i = 0; i < episodes.data.length; i++) {
    returnArr[i] = {
      'id': episodes.data[i].id,
      'name': episodes.data[i].name,
      'season': episodes.data[i].season,
      'number': episodes.data[i].number
    }
  }
  return returnArr;
}

// Provided with an array of episodes info, this function populates that info
// into the #episodes-list part of the DOM
function populateEpisodes(episodes) {
  for (let episode of episodes) {
    let $item = $(`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`);
    $("#episodes-area").append($item);
  }
  $("#episodes-area").show();
}

// This function handles the event of a click on the button of a 
// show card and gets the event for that show 
async function handleEpisodes(evt) {
  //closest traverses up the DOM to get the parent div
  let $showId = $(this).closest("div");
  $showId = $showId.data("show-id");
  const $episodes = await getEpisodes($showId);
  populateEpisodes($episodes);
}