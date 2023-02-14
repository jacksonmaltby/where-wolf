const API_KEY = "T-SjguE8Kty3cVRNzp2IbdePc7PMKbZ9RYOF_U-m8iZWq2cdY_wKniY5mlZ7lbwUdnrFzQebI5zWkIhiJfpQiZuyIXnuxhXyJnZZensCwfWl7rehqqLyRxugkBzjY3Yx";
const searchTerm = document.querySelector("#searchTerm");
const searchButton = document.querySelector("#searchButton");
const results = document.querySelector("#yelp-results");
const map = L.map("map").setView([47.6062, -122.3321], 11);
const category = document.querySelector("#business-types");
const dogFriendlyCheckbox = document.querySelector("#dogs-allowed");

// The map that displays on the right side of the page

const url = "https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&offset=${offset}&limit=4`"
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
}).addTo(map);

let offset = 0;
document.querySelector("#map").style.display = "none";
// Search button that calls the Yelp Fusion API and returns businesses that are dog friendly.
// Added dogFriendlyCheckbox for a user to select if they want to add dog friendly businesses or not
searchButton.addEventListener("click", async () => {
  document.querySelector("#map").style.display = "block";
  var location = searchTerm.value;
  saveLocation(location);
  let term = "dog+friendly+";
  if (!dogFriendlyCheckbox.checked) {
    term = "";
  }
  term += category.value;
  const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&offset=${offset}&limit=4`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`

    }

  });

  const data = await response.json();
  console.log(data)
  results.innerHTML = "";
  data.businesses.forEach(business => {
    const div = document.createElement("div");
    div.classList.add("card");
    let description = "N/A";
    if (business.description) {
      description = business.description;
    }
    // Console log line 38 to retrive the business data and implemented into line 48. fixed business.location.address into business.location.address1
    business.location
    div.innerHTML = `<h3 class="">${business.name}</h3><p class="">${business.location.address1}</p><p class="">${business.location.city}</p><p class="">${business.location.state}</p><p class="">${business.location.zip_code}</p><p class="">${category.value}</p><p class="">${business.price}</p <p class="">${business.rating}</p> <p class="">${business.phone}</p <a class="">${business.url}</a`;
    results.appendChild(div);
  });

  let bounds = L.latLngBounds();
  data.businesses.forEach(business => {
    bounds.extend([business.coordinates.latitude, business.coordinates.longitude]);
  });
  map.fitBounds(bounds);

  // Creates a marker for each business

  data.businesses.forEach(business => {
    const marker = L.marker([business.coordinates.latitude, business.coordinates.longitude]).addTo(map);
    marker.bindPopup(`<h3>${business.name}</h3>`);
  });
});

function saveLocation(location) {
  let locations = JSON.parse(localStorage.getItem("locations")) || [];
  locations.push(location);
  localStorage.setItem("locations", JSON.stringify(locations));
  updateLocationButtons();
}

function updateLocationButtons() {
  let locations = JSON.parse(localStorage.getItem("locations")) || [];
  let locationContainer = document.getElementById("location-container");
  locationContainer.innerHTML = "";
  let uniqueLocations = Array.from(new Set(locations));

  for (let i = 0; i < uniqueLocations.length; i++) {
    let location = uniqueLocations[i];
    let button = document.createElement("button");
    button.innerHTML = location;
    button.addEventListener("click", function () {
      displayResults(location);
    });
    locationContainer.appendChild(button);
  }
}

function displayResults(location) {
  searchTerm.value = location;
  searchButton.click();
}

updateLocationButtons();