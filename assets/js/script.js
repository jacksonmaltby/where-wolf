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
