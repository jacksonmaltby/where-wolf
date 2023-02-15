var API = "T-SjguE8Kty3cVRNzp2IbdePc7PMKbZ9RYOF_U-m8iZWq2cdY_wKniY5mlZ7lbwUdnrFzQebI5zWkIhiJfpQiZuyIXnuxhXyJnZZensCwfWl7rehqqLyRxugkBzjY3Yx";
var previousButton = document.querySelector("#previousButton");

previousButton.addEventListener("click", async () => {
  offset -= 4;
  var location = searchTerm.value;
  let term = "dog+friendly+";
  if (!dogFriendlyCheckbox.checked) {
    term = "";
  }
  term += category.value;

  var response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&offset=${offset}&limit=4`, {
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
        <img class="w-full h-full object-cover object-center business-image" src="${business.image_url}" alt="${business.name}">
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

  // Remove the previous markers
  markers.forEach(marker => {
    marker.remove();
  });
  markers = [];

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
