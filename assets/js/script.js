var searchFormEl = document.querySelector('#search-form');
var locationInputEl = document.querySelector('#location');
var yelpResultsEl = document.querySelector('#yelp-results');
var typeSelectEl = document.querySelector('#business-types');
var dogsAllowEl = document.querySelector('#dogs-allow');

let map;
let markers = [];

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

// Add click event for search
$('button').click((e) => {
  e.preventDefault();
  
  // Get input text to use for search
  window.searchText = $('#location').val();

  // Define the settings for the API call
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=dog+friendly&categories=restaurants,bars&open_now=true&sort_by=distance&location=${window.searchText}`,
    "method": "GET",
    "headers": {
      "authorization": "Bearer 80LIgTKphcU7oWrMtt4e9TahnIrn-P3sMkhDw1B3CW25GdSHZB4-PU-dM_hRIwx3AzT3SUPoXo0fRtNadtudHoxBrjGTZr_Wgavv6fqQ5ZRoH79m9HaXPBjrnX-pWXYx",
      "cache-control": "no-cache",
      "postman-token": "3f23d8c3-ce48-a224-50c0-14b9094948fc"
    }
  }

  // Use AJAX to perform Yelp API call
  $.ajax(settings).done(function (response) {
    let results = response.businesses;

    // Create div to hold all search results
    let resultsDiv = document.createElement('div');
    $(resultsDiv).addClass('searchResults');
    $('main').append(resultsDiv);

    // Display results
    results.forEach(function(business) {
      // Create each business result div
      let businessInfo = document.createElement('div');
      let businessName = business.name;
      let businessAddress = `${business.location.display_address[0]}, ${business.location.display_address[1]}`;
      businessInfo.innerHTML = `<h4>${businessName}</h4><p>${businessAddress}</p>`;
      $(businessInfo).addClass('result col-md-6');

      // Create each details div
      let details = document.createElement('div');
      let businessImg = business.image_url;
      let category = business.categories[0].title;
      let phone = business.display_phone;
      let price = business.price;
      let geo = {lat: business.coordinates.latitude, lng: business.coordinates.longitude};
      let mapDiv = document.createElement('div');
      details.innerHTML = `<img src=${businessImg} style='width: auto; height: auto; max-width: 150px; max-height: 100px'><p>Category: ${category}<br>Phone number: ${phone}<br>Average price: ${price}</p>`;
      $(details).addClass('detail');
      $(mapDiv).attr({id: businessName, class: 'map'});

      // Add map div to details
      $(details).append(mapDiv);

      // Add divs to DOM
      $(businessInfo).append(details);
      $('.searchResults').append(businessInfo);
      // Hide details
      $(details).hide();
      })
    })
  })


