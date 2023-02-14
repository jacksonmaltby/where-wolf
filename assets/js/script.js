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
  document.querySelector("#nextButton").style.display = "block";
  document.querySelector("#previousButton").style.display = "block";
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
  const container = document.createElement("div");
  container.classList.add("flex", "flex-col");
  data.businesses.forEach(business => {
    const div = document.createElement("div");
    div.classList.add("max-w-md", "rounded-md", "overflow-hidden", "shadow-lg", "bg-gray-900", "mt-6", "mx-auto", "p-4");

    let description = "N/A";
    if (business.description) {
      description = business.description;
    }
    div.innerHTML = `
      <div class="relative h-48">
        <img class="w-full h-full object-cover object-center" src="${business.image_url}" alt="${business.name}">
      </div>
      <div class="text-center mt-4">
        <h2 class="text-3xl text-white font-bold">${business.name}</h2>
        <p class="text-gray-600">${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}</p>
        <p class="text-gray-600">${category.value}</p>
        <p class="text-gray-600">Price: ${business.price}</p>
        <p class="text-gray-600">Rating: ${business.rating} stars</p>
        <a href="${business.url}" target="_blank" class="inline-block bg-gray-900 text-white py-2 px-4 rounded-full mt-4 hover:bg-gray-800" style="background-color: #E53E3E;">Visit Website</a>
      </div>
    `;
    container.appendChild(div);
  });
  results.appendChild(container);
  let bounds = L.latLngBounds();
  data.businesses.forEach(business => {
    bounds.extend([business.coordinates.latitude, business.coordinates.longitude]);
  });
  map.fitBounds(bounds);

  // Creates a marker for each business
  data.businesses.forEach(business => {
    const marker = L.marker([business.coordinates.latitude, business.coordinates.longitude]).addTo(map);
    marker.bindPopup("<h3>" + business.name + "</h3>");
  });
});

function saveLocation(location) {
  if (location.trim() !== "") {
    let locations = JSON.parse(localStorage.getItem("locations")) || [];
    locations.push(location);
    localStorage.setItem("locations", JSON.stringify(locations));
    updateLocationButtons();
  }
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
    button.classList.add("w-full", "text-center", "border", "bg-gray-800", "py-2", "mb-2");
    locationContainer.appendChild(button);
  }
}

function displayResults(location) {
  searchTerm.value = location;
  searchButton.click();
}

updateLocationButtons();
