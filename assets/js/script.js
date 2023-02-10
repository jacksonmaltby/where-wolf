const API_KEY = "T-SjguE8Kty3cVRNzp2IbdePc7PMKbZ9RYOF_U-m8iZWq2cdY_wKniY5mlZ7lbwUdnrFzQebI5zWkIhiJfpQiZuyIXnuxhXyJnZZensCwfWl7rehqqLyRxugkBzjY3Yx";
const searchTerm = document.querySelector("#searchTerm");
const searchButton = document.querySelector("#searchButton");
const results = document.querySelector("#yelp-results");
const map = L.map("map").setView([47.6062, -122.3321], 11);
const category = document.querySelector("#business-types");
const dogFriendlyCheckbox = document.querySelector("#dogs-allowed");

// The map that displays on the right side of the page

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
}).addTo(map);

let offset = 0;

searchButton.addEventListener("click", async () => {
  const location = searchTerm.value;
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

  results.innerHTML = "";
  data.businesses.forEach(business => {
    const div = document.createElement("div");
    div.classList.add("card");
    let description = "N/A";
    if (business.description) {
      description = business.description;
    }
    div.innerHTML = `<h3 class="">${business.name}</h3><p class="">${business.location.address}</p><p class="">${business.location.city}</p><p class="">${business.location.state}</p><p class="">${business.location.zip_code}</p><p class="">${category.value}</p><p class="">${description}</p>`;
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