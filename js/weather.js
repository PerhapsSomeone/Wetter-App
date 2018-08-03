const APIKEY = "fd6ed0fcf0dc063c09e9ba57b0eef174";

const weathericons = {
	"Thunderstorm": "<i class=\"fas fa-bolt\"></i>",
	"Rain": "<i class=\"fas fa-tint\"></i>",
	"Sun": "<i class=\"fas fa-sun\"></i>",
	"Snow": "<i class=\"fas fa-snowflake\"></i>",
	"Clouds": "<i class=\"fas fa-cloud\"></i>",
	"Clear": "<i class=\"fas fa-sun\"></i>",
	"Drizzle": "<i class=\"fas fa-tint\"></i>", 
	"Atmosphere": "" //Nebel
};

const weathernames = {
	"Rain": "Regen",
	"Thunderstorm": "Gewitter"
};

const days = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];

const compass = ["N","NNE","NE","ENE","E","ESE", "SE",
	"SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];

let currentweather;
let forecast;
let forecastdivisor;

let currentweatherres;
let currenttemp;
let forecastres;

document.getElementById("city").addEventListener("keyup", function(event) {
	if (event.key === "Enter") {
		updateWeather();
	}
});


function updateWeather() {

	//Current weather update function
	fetch("https://api.openweathermap.org/data/2.5/weather?lang=de&&units=metric&q=" + document.getElementById("city").value + "&APPID=" + APIKEY, function (xhr) {
		//document.getElementById("res").innerHTML = xhr.responseText;

		currentweatherres = JSON.parse(xhr.responseText);

		document.getElementById("currentTemp").innerHTML = currentweatherres["main"]["temp"].toFixed(1);

		document.getElementById("weathericon").innerHTML = weathericons[currentweatherres["weather"][0]["main"]] + " ";

		document.getElementById("weatherdescription").innerHTML = currentweatherres["weather"][0]["description"];

		document.getElementById("currentpressure").innerHTML = currentweatherres["main"]["humidity"];

		document.getElementById("currentwindspeed").innerHTML = currentweatherres["wind"]["speed"];

		document.getElementById("currentwinddirection").innerHTML = degToCompass(currentweatherres["wind"]["deg"]);
	});


	fetch("https://api.openweathermap.org/data/2.5/forecast?lang=de&&units=metric&q=" + document.getElementById("city").value + "&APPID=" + APIKEY, function (xhr) {
		//document.getElementById("res").innerHTML = xhr.responseText;

		forecastres = JSON.parse(xhr.responseText);

		forecastdivisor = Math.round(forecastres["cnt"] / 5);


		document.getElementById("onedayicon").innerHTML = weathericons[forecastres["list"][8]["weather"][0]["main"]];
		document.getElementById("twodaysicon").innerHTML = weathericons[forecastres["list"][8 * 2]["weather"][0]["main"]];
		document.getElementById("threedaysicon").innerHTML = weathericons[forecastres["list"][8 * 3]["weather"][0]["main"]];


		document.getElementById("onedaydesc").innerHTML = forecastres["list"][8]["weather"][0]["description"];
		document.getElementById("twodaysdesc").innerHTML = forecastres["list"][8 * 2]["weather"][0]["description"];
		document.getElementById("threedaysdesc").innerHTML = forecastres["list"][8 * 3]["weather"][0]["description"];


		document.getElementById("onedaytemp").innerHTML = forecastres["list"][8]["main"]["temp"].toFixed(1);
		document.getElementById("twodaystemp").innerHTML = forecastres["list"][8 * 2]["main"]["temp"].toFixed(1);
		document.getElementById("threedaystemp").innerHTML = forecastres["list"][8 * 3]["main"]["temp"].toFixed(1);

		document.getElementById("onedayhumidity").innerHTML = forecastres["list"][8]["main"]["humidity"];
		document.getElementById("twodayshumidity").innerHTML = forecastres["list"][8 * 2]["main"]["humidity"];
		document.getElementById("threedayshumidity").innerHTML = forecastres["list"][8 * 3]["main"]["humidity"];

		// Fade in results after finishing up.
		document.getElementById("currentdiv").classList.remove("is-paused");
		document.getElementById("forecastdiv").classList.remove("is-paused");
	});

}

function fetch(url, callback) { // Fetch the services async so we dont cause a loading indicator.
	let xhr = createCORSRequest('GET', url); // Create CORS compliant request or it will fail.
	if (!xhr) {
		alert('CORS not supported');
		return;
	}

	xhr.onload = function () {
		return callback(xhr);
	};

	xhr.onerror = function () {
		console.log('Woops, there was an error making the request.');
	};

	xhr.send();
}


function createCORSRequest(method, url) {
	let xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {

		// Check if the XMLHttpRequest object has a "withCredentials" property.
		// "withCredentials" only exists on XMLHTTPRequest2 objects.
		xhr.open(method, url, true);

	} else if (typeof XDomainRequest !== "undefined") {

		// Otherwise, check if XDomainRequest.
		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		xhr = new XDomainRequest();
		xhr.open(method, url);

	} else {
		// Otherwise, CORS is not supported by the browser.
		xhr = null;
	}
	return xhr;
}

function degToCompass(num) {
	var val = Math.floor((num / 22.5) + 0.5);

	return compass[(val % 16)];
}