const API = "T-SjguE8Kty3cVRNzp2IbdePc7PMKbZ9RYOF_U-m8iZWq2cdY_wKniY5mlZ7lbwUdnrFzQebI5zWkIhiJfpQiZuyIXnuxhXyJnZZensCwfWl7rehqqLyRxugkBzjY3Yx";
const previousButton = document.querySelector("#previousButton");

previousButton.addEventListener("click", async () => {
    offset -= 4;
    const location = searchTerm.value;
    let term = "dog+friendly+";
    if (!dogFriendlyCheckbox.checked) {
        term = "";
    }
    term += category.value;

    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&offset=${offset}&limit=4`, {
        headers: {
            Authorization: `Bearer ${API}`
        }
    });

    const data = await response.json();

    results.innerHTML = "";
    data.businesses.forEach(business => {
        const li = document.createElement("li");
        let description = "N/A";
        if (business.description) {
            description = business.description;
        }
        li.innerHTML = `<h3>${business.name}</h3><p>${business.location.address}</p><p>${business.location.city}</p><p>${business.location.state}</p><p>${business.location.zip_code}</p><p>${category.value}</p><p>${description}</p>`;
        results.appendChild(li);
    });

    let bounds = L.latLngBounds();
    data.businesses.forEach(business => {
        bounds.extend([business.coordinates.latitude, business.coordinates.longitude]);
    });
    map.fitBounds(bounds);

    data.businesses.forEach(business => {
        let description = "N/A";
        if (business.description) {
            description = business.description;
        }
        const marker = L.marker([business.coordinates.latitude, business.coordinates.longitude])
            .addTo(map)
            .bindPopup(`<h3>${business.name}</h3><p>${business.location.address}</p><p>${business.location.city}</p><p>${business.location.state}</p><p>${business.location.zip_code}</p><p>${category.value}</p><p>${description}</p>`);
    });
});
