require("dotenv").config();

var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs")
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2]
var searchterm = process.argv.slice(3).join(" ") // .join(" ") turns an array into a string
// look up.slice and .join - array methods in general

console.log(command)
console.log(searchterm)

// look at the command that the user enters and figure out which function to run.
// need function to search the BandsInTown API for what the user selected (bands)
// need function to search Spotify for Song user selects
// need function to search OMBD for users movie
// need function to read random .Text file and do what it says

function runApp(){
    switch (command) {
        case "concert-this":
            bands();
            break;
        case "spotify-this-song":
            song();
            break;
        case "movie-this":
            movie();
            break;
        case "do-what-it-says":
            random();
            break;

        default: console.log("command not found. Try again");
    }
}

runApp()

//Concert This
function bands() {
    var queryURL = "https://rest.bandsintown.com/artists/" + searchterm + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(function(response){
        if (!response.data.length){
            console.log("no concerts found.");
            return;
        }
        console.log("upcoming concerts for " + searchterm);
        console.log("-------------------------");
        for (var i = 0; i <= 9; i++){
            var concert = response.data[i];
            console.log(concert.venue.name);
            console.log(concert.venue.city + ", " + (concert.venue.region || concert.venue.country)); 
            console.log(moment(concert.datetime).format("MM/DD/YYYY"))
            console.log("-------------------------\n");
        };
    }) 
};


//Spotify this song
function song() {
    // if (!searchterm) {
    //     searchterm = "The Sign Ace of Base";
    // }

    spotify.search({type: "track", query: song}, function(error, data) {
        if (error) {
            return console.log("Error occurred: " + error);
        }
        console.log(data.items)
    });
} 




//Movie This
function movie() {
    
    if (!searchterm) {
        console.log("If you haven't watched Mr Nobody, then you should. Its on Netflix!");
        searchterm = "Mr. Nobody";
    }

    var queryURL = "http://www.omdbapi.com/?t=" + searchterm + "&y=&plot=short&apikey=trilogy";
        axios.get(queryURL).then(
        function(response) {

            var movies = response.data;
            console.log("-------------------------\n");
            console.log("Movie Title: " + movies.Title);
            console.log("Release Year: " + movies.Year);
            console.log("IMBD Rating: " + movies.Ratings[0].Value);
            console.log("Rotten Tomatoes Raiting: " + movies.Ratings[1].Value);
            console.log("Country: " + movies.Country);
            console.log("Language: " + movies.Language);
            console.log("Plot: " + movies.Plot);
            console.log("Actors: " + movies.Actors);
        }
    )};