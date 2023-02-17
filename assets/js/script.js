const API_KEY = "T-SjguE8Kty3cVRNzp2IbdePc7PMKbZ9RYOF_U-m8iZWq2cdY_wKniY5mlZ7lbwUdnrFzQebI5zWkIhiJfpQiZuyIXnuxhXyJnZZensCwfWl7rehqqLyRxugkBzjY3Yx";
const searchTerm = document.querySelector("#searchTerm");
const searchButton = document.querySelector("#searchButton");
const results = document.querySelector("#yelp-results");
const map = L.map("map").setView([47.6062, -122.3321], 11);
const category = document.querySelector("#business-types");
const dogFriendlyCheckbox = document.querySelector("#dogs-allowed");
const url = "https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&offset=${offset}&limit=4`";
let offset = 0;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
}).addTo(map);

document.querySelector("#map").style.display = "none";

// Search button that calls the Yelp Fusion API and returns businesses that are dog friendly.
// Added dogFriendlyCheckbox for a user to select if they want to add dog friendly businesses or not
// Search button that calls the Yelp Fusion API and returns businesses that are dog friendly.
// Added dogFriendlyCheckbox for a user to select if they want to add dog friendly businesses or not

// Displays search results and a map of the businesses that are dog friendly

searchButton.addEventListener("click", async () => {
  document.querySelector("#map").style.display = "block";
  document.querySelector("#nextButton").style.display = "block";
  document.querySelector("#previousButton").style.display = "block";
  document.querySelector("#results").style.display = "block";

  const location = searchTerm.value.trim();
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
    div.classList.add("max-w-md", "rounded-md", "overflow-hidden", "shadow-lg", "bg-black", "mt-6", "mx-auto", "p-4");

    let description = "N/A";
    if (business.description) {
      description = business.description;
    }

    div.innerHTML = `
      <div class="relative h-48">
        <img class="w-full h-full object-cover object-center business-image" src="${business.image_url}" alt="${business.name}">
      </div>
      <div class="text-center mt-4">
        <h2 class="text-3xl text-blue-300 font-bold">${business.name}</h2>
        <p class="text-blue-200">${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}</p>
        <p class="text-blue-200">${category.value}</p>
        <p class="text-blue-200">Price: ${business.price}</p>
        <p class="text-blue-200">Rating: ${business.rating} stars</p>
        <a href="${business.url}" target="_blank" class="inline-block bg-black text-purple-300 py-2 px-4 rounded-full mt-4 hover:bg-gray-800" style="background-color: #725fgb;">Visit Website</a>
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
    markers.push(marker);
  });
});


// Saves the location a user searches for in local storage
function saveLocation(location) {
  if (location !== "") {
    let locations = JSON.parse(localStorage.getItem("locations")) || [];
    locations.push(location);
    localStorage.setItem("locations", JSON.stringify(locations));
    updateLocationButtons();
  }
}

// Updates the location buttons
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
    button.classList.add("w-full", "text-center", "border", "bg-transparent", "py-2", "mb-2");
    locationContainer.appendChild(button);
  }
}

// Displays the results of a location search
function displayResults(location, businessType, dogsAllowed) {
  searchTerm.value = location;
  searchButton.click();
}

// Calls the updateLocationButtons function when the page is loaded
updateLocationButtons();