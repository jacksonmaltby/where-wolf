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



var form = document.getElementById("search-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  var location = document.getElementById("location").value;
  searchYelp(location);
});

function searchYelp(location) {
  var yelpApiKey = "T-SjguE8Kty3cVRNzp2IbdePc7PMKbZ9RYOF_U-m8iZWq2cdY_wKniY5mlZ7lbwUdnrFzQebI5zWkIhiJfpQiZuyIXnuxhXyJnZZensCwfWl7rehqqLyRxugkBzjY3Yx";
  var yelpUrl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=business&location=" + location;

  fetch(yelpUrl, {
    headers: {
      "Authorization": "Bearer " + yelpApiKey
    }
  })
    .then(response => response.json())
    .then(data => {
      displayBusinesses(data.businesses);
    });
}

function displayBusinesses(businesses) {
  var list = document.getElementById("yelp-results");
  list.innerHTML = "";
  businesses.forEach(business => {
    var item = document.createElement("li");
    item.textContent = business.name;
    list.appendChild(item);
  });
}
