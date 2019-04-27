require("dotenv").config();
let axios = require("axios");
let moment = require("moment");
let Spotify = require("node-spotify-api");
let keys = require("./keys.js");

let bit = keys.bit.key;

let omdb = keys.omdb.key;

let spotify = new Spotify(keys.spotify);


function firstRun() {
    let searchCommand = process.argv[2];
    let search = process.argv[3];
    searchDatabase(searchCommand, search)
}


function searchDatabase(searchCommand, search) {
    switch (searchCommand) {
        case "spotify-this-song":
            {
                searchSpotify(search);
            }
            break;

        case "concert-this":
            {
                searchBands(search)
            }
            break;

        case "movie-this":
            {
                searchOMDB(search)
            }
            break;

        case "do-what-it-says":
            {
                sayWhat(search);
            }
            break;

        default:
            {
                console.log("no action found")
            }
    }
}


function searchSpotify(search) {
    spotify.search({
        type: "track",
        query: search
    }, function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }
        let response = data.tracks.items[0];
        console.log("Artist: " + response.artists[0].name);
        console.log("Song Name: " + response.name);
        console.log("URL: " + response.preview_url);
        console.log("Album: " + response.album.name);
    });
}

function searchBands(search) {
    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=" + keys.bit.key)
        .then(function (response) {
            response = response.data;
            for (i = 0; i < response.length; i++) {
                console.log("Venue: " + response[i].venue.name);
                console.log("Location: " + response[i].venue.city);
                let convertedDate = moment(response[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY")
                console.log("Date: " + convertedDate);
                console.log("______________________");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function searchOMDB(search) {
    axios.get("http://www.omdbapi.com/?apikey=" + keys.omdb.key + "&t=" + search)
        .then(function (response) {
            if (search = "") {
                search = "Mr. Nobody"
            }
            response = response.data;
            console.log("Title: " + response.Title);
            console.log("Release Year: " + response.Year);
            console.log("IMDB Rating: " + response.Ratings[0].Value);
            console.log("Rotten Tomatoes: " + response.Ratings[1].Value);
            console.log("Filmed in Country: " + response.Country);
            console.log("Film Language: " + response.Language);
            console.log("Plot: " + response.Plot);
            console.log("Actors: " + response.Actors);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function sayWhat() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        let dataArr = data.split(",");
        let searchCommand = dataArr[0];
        let search = dataArr[1];
        searchDatabase(searchCommand, search)
    })
    console.log(sayWhat);
}

firstRun()