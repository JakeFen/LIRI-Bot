// Setting an enviroment variable with dotenv package
require("dotenv").config();

// import the keys.js file and store it in a variable
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
