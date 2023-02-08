var searchFormEl = document.querySelector('#search-form');
var locationInputEl = document.querySelector('#location');
var yelpResultsEl = document.querySelector('#yelp-results');
var typeSelectEl = document.querySelector('#business-types');
var dogsAllowEl = document.querySelector('#dogs-allow');

const mapApiKey = 'AIzaSyAncO5NvmJjQTP7fjUWTPkITFbl4yQ-woo';
const yelpApiKey = 's3OmpjFPf2Goy3D8nxXzJo5scmyapd4SxRmwIvYdEohTuwQGh776xUO8mmz5TWvVgukzLej0H4NRbzXZ8r0t28Bi0cyWykigznWY_UTD0G-IZbyCgUQ7dlM9fNjhY3Yx';

// Initialize and add the map

  function initMap() {
    // The location of Seattle
    const seattle = { lat: 47.608013, lng: -122.335167 };
    // The map, centered at Seattle
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 11,
      center: seattle,
    });
    // The marker, positioned at Seattle
    const marker = new google.maps.Marker({
      position: seattle,
      map: map,
    });
  }
  
  window.initMap = initMap;

function searchYelp(location) {
  var yelpUrl = "https://api.yelp.com/v3/businesses/search?term=restaurants&location=" + location;
  fetch(yelpUrl, {
    headers: {
      "Authorization": "Bearer " + yelpApiKey
    }
  })
  .then(response => response.json())
  .then(data => {
    data.businesses.forEach(business => {
      var marker = new google.maps.Marker({
        position: {lat: business.coordinates.latitude, lng: business.coordinates.longitude},
        map: map,
        title: business.name
      });
    });
  });
}

searchFormEl.addEventListener('submit', searchYelp);