// Setting an enviroment variable with dotenv package
require("dotenv").config();
const axios = require("axios");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var moment = require("moment");

var action = process.argv[2];
var artist = process.argv.slice(3).join(" ") || "";

fs.appendFile("log.txt", ", " + action + artist, function(error) {
  if (error) {
    return console.log(error);
  }
});

function bandsAPI(artist) {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        artist.trim() +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      for (var i = 0; i < 5; i++) {
        var venueDate = response.data[i].datatime;
        var convertTime = moment(venueDate).format("MM/DD/YYYY");
        console.log(`
----------------- 

${response.data[i].venue.name}
${response.data[i].venue.city}
${convertTime}         

-----------------
`);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

function spotifyAPI(artist) {
  spotify.search({ type: "track", query: artist }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    console.log(`
-----------------

${data.tracks.items[0].artists[0].name}
${data.tracks.items[0].name}
${data.tracks.items[0].external_urls.spotify}
${data.tracks.items[0].album.name}

-----------------
    `);
  });
}

function imdbAPI(artist) {
  axios
    .get("http://www.omdbapi.com/?apikey=trilogy&t=" + artist)
    .then(function(response) {
      console.log(`
-----------------

Title: ${response.data.Title}
Year: ${response.data.Year}
Rating: ${response.data.Rated}
Rotten Tomatoes: ${response.data.Ratings[1].Value}
Country: ${response.data.Country}
Language: ${response.data.Language}
Plot: ${response.data.Plot}
Actors: ${response.data.Actors}

-----------------
`);
    })
    .catch(function(error) {
      console.log(error);
    });

  // * Language of the movie.
  // * Plot of the movie.
  // * Actors in the movie.
}

switch (action) {
  case "concert-this":
    bandsAPI(artist);
    break;
  case "spotify-this-song":
    if (artist === "") {
      artist = "The Sign";
      spotifyAPI(artist);
    } else {
      spotifyAPI(artist);
    }
    break;
  case "movie-this":
    if (artist === "") {
      artist = "Mr. Nobody";
      imdbAPI(artist);
    } else {
      imdbAPI(artist);
    }
    break;
  case "do-what-it-says":
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }

      dataArr = data.split(",");
      var artist = dataArr[1];

      switch (dataArr[0]) {
        case "concert-this":
          bandsAPI(artist);
          break;
        case "spotify-this-song":
          spotifyAPI(artist);
          break;
        case "movie-this":
          imdbAPI(artist);
          break;
      }
    });

    break;
}
