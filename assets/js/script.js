
const API_KEY = "T-SjguE8Kty3cVRNzp2IbdePc7PMKbZ9RYOF_U-m8iZWq2cdY_wKniY5mlZ7lbwUdnrFzQebI5zWkIhiJfpQiZuyIXnuxhXyJnZZensCwfWl7rehqqLyRxugkBzjY3Yx";
const searchTerm = document.querySelector("#searchTerm");
const searchButton = document.querySelector("#searchButton");
const results = document.querySelector("#yelp-results");
const map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
}).addTo(map);

searchButton.addEventListener("click", async () => {
  const location = searchTerm.value;
  const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=dog+friendly&location=${location}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`
    }
  });
  const data = await response.json();

  results.innerHTML = "";
  data.businesses.forEach(business => {
    const li = document.createElement("li");
    li.innerHTML = `<h3>${business.name}</h3><p>${business.location.address}</p>`;
    results.appendChild(li);
    const marker = L.marker([business.coordinates.latitude, business.coordinates.longitude]).addTo(map);
    marker.bindPopup(`<h3>${business.name}</h3><p>${business.location.address}</p>`);
  });
});