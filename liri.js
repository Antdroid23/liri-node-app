require("dotenv").config();

var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs")
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var searchterm = process.argv.slice(3).join(" ");


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

// Concert This
function bands() {
    var queryURL = "https://rest.bandsintown.com/artists/" + searchterm + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(function(response){
        if (!response.data.length){
            console.log("no concerts found.");
            return;
        }
            console.log("upcoming concerts for " + searchterm);
            console.log("\n-------------------------\n");

        for (var i = 0; i <= 9; i++){
            var concert = response.data[i];
            console.log(concert.venue.name);
            console.log(concert.venue.city + ", " + (concert.venue.region || concert.venue.country)); 
            console.log(moment(concert.datetime).format("MM/DD/YYYY"))
            console.log("\n-------------------------\n");
        };
    }) 
};




// Spotify this song
function song() {
     if (!searchterm) {
         console.log("Oops, looks like you forgot to enter a song but dont worry, I got you. Check this out!")
         searchterm = "The Sign Ace of Base";
    }

        spotify.search({type: "track", query: searchterm}, function(error, data) {
            if (error) {
                console.log("Did you forgot the name of the song? Or maybe you mispelled the song name or the artist? Double check and try again.");
                return console.log("Error occurred: " + error);
            }

        console.log("\n-------------------------\n");
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
        console.log("Albulm Name: " + data.tracks.items[0].album.name);
        console.log("Song Preview: " + data.tracks.items[0].preview_url);
        console.log("\n-------------------------\n");
        
    });
} 




// Movie This
function movie() {
    
    if (!searchterm) {
        console.log("If you haven't watched Mr Nobody, then you should. Its on Netflix!");
        searchterm = "Mr. Nobody";
    }

    var queryURL = "http://www.omdbapi.com/?t=" + searchterm + "&y=&plot=short&apikey=trilogy";
        axios.get(queryURL).then(
        function(response) {

            var movies = response.data;
            console.log("\n-------------------------\n");
            console.log("Movie Title: " + movies.Title);
            console.log("Release Year: " + movies.Year);
            console.log("IMBD Rating: " + movies.Ratings[0].Value);
            console.log("Rotten Tomatoes Raiting: " + movies.Ratings[1].Value);
            console.log("Country: " + movies.Country);
            console.log("Language: " + movies.Language);
            console.log("Plot: " + movies.Plot);
            console.log("Actors: " + movies.Actors);
            console.log("\n-------------------------\n");
        }
    )};




// Do what it says
function random() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
        return console.log(error);
        }

        console.log("command from random.txt file")

        var array = data.split(",");
            command = array[0];
            searchterm = array[1];

        runApp(command, searchterm);
    });
}