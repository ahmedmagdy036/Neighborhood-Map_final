function initMap() {
	var bounds = new google.maps.LatLngBounds();
	var mapOptions = {
		center: {
			lat: 30.035278,
			lng: 31.231112
		},
		zoom: 8
	};

	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	addMarkers(markers);

	function addMarkers() {
		for (i = 0; i < markers.length; i++) {
			var location = markers[i];
			var position = new google.maps.LatLng(location.lat, location.lng);
			bounds.extend(position);
			var marker = new google.maps.Marker({
				position: position,
				map: map,
				animation: google.maps.Animation.DROP,

			});
			location.marker = marker;
			map.fitBounds(bounds);
			google.maps.event.addListener(marker, 'click', Animation(marker, i));

		}

		infoWindow = new google.maps.InfoWindow();
		var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function (event) {
			this.setZoom(8);
			google.maps.event.removeListener(boundsListener);
		});

	}
	Load_map = true;

}
// markers on the map 
var markers = [{
		title: "Alex",
		lat: 31.205753,
		lng: 29.924526,
		information: "is the best way to travell and speend the time"
	},
	{
		title: "Suez",
		lat: 29.97371,
		lng: 32.52627,
		information: "is a global expert in the water and waste sectors, Suez helps cities and industries in the circular economy to preserve"
	},
	{
		title: "6th of October",
		lat: 30.056021,
		lng: 30.976639,
		information: " is a city in Giza Governorate, a satellite town and part of the urban area of Cairo, Egypt, 32 km (20 miles) outside the city"
	},
	{
		title: "Port Said",
		lat: 31.25654,
		lng: 32.28411,
		information: "is a city that lies in north east Egypt extending about 30 kilometres"
	},
	{
		title: "El-Mansoura",
		lat: 31.032955,
		lng: 31.391224,
		information: "is a city in Egypt, with a population of 960,423"
	},
];

//function to show the title and information 
function Content(location) {
	return ('<h3>' + location.title + '</h3>' + '<p>' + location.information + '</p>');
}

var map;
var Load_map = false;

//Animationfunction
function Animation(marker, i) {
	return function () {
		infoWindow.setContent(Content(markers[i]));
		infoWindow.open(map, marker);
		marker.setAnimation(google.maps.Animation.BOUNCE);
		viewModel.loadData(markers[i]);
	};
}

//filter the marker
var ViewModel = function () {
	var self = this;
	self.markers = ko.observableArray(markers);
	self.query = ko.observable('');
	self.visibleLists = ko.observable(false);
	// toggleShow
	self.toggleShow = function () {
		self.visibleLists(!self.visibleLists());
	};
	self.Results = ko.computed(function () {
		var q = self.query();
		var filteredmarkers = self.markers().filter(function (location) {
			return location.title.toLowerCase().indexOf(q) >= 0;
		});
		if (Load_map) {
			for (var i = 0; i < markers.length; i++) {
				markers[i].marker.setVisible(false);
			}
			for (i = 0; i < filteredmarkers.length; i++) {
				filteredmarkers[i].marker.setVisible(true);
			}
		}
		return filteredmarkers;
	});
};
var viewModel = new ViewModel();
ko.applyBindings(viewModel);


//secand api weather
var openWeatherAppId = '6bc64b20e18af1e2c81480152e4b9289',
	openWeatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';
var prepareData = function (units) {
	var cityName = $('#city-name').val();
	// Make ajax call, callback
	if (cityName && cityName !== '') {
		cityName = cityName.trim();
		getData(openWeatherUrl, cityName, openWeatherAppId, units);
	} else {
		alert('Please enter the city name');
	}
};
$(document).ready(function () {
	$('.btn-metric').click(function () {
		prepareData('metric');
	});
	$('.btn-imperial').click(function () {
		prepareData('imperial');
	});
});

function getData(url, cityName, appId, units) {
	var request = $.ajax({
		url: url,
		dataType: "jsonp",
		data: {
			q: cityName,
			appid: appId,
			units: units
		},
		jsonpCallback: "fetchData",
		type: "GET"
	}).fail(function (error) {
		alert('Error sending request');
	});
}

function fetchData(forecast) {
	var html = '',
		cityName = forecast.city.name;
	country = forecast.city.country;
	html += '<h3> Weather Forecast for ' + cityName + ', ' + country + '</h3>';

	forecast.list.forEach(function (forecastEntry, index, list) {
		html += '<p>' + forecastEntry.dt_txt + ': ' + forecastEntry.main.temp + '</p>';
	});
	$('#log').html(html);
	console.log(forecast);
}