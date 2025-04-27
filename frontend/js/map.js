let map;
let userMarker;
let userLat;
let userLng;

let directionsService;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;

      const userLocation = new google.maps.LatLng(userLat, userLng);

      map.setCenter(userLocation);

      userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
      });

    }, () => {
      handleLocationError(true, map.getCenter());
    });
  } else {
    handleLocationError(false, map.getCenter());
  }

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

}

function handleLocationError(browserHasGeolocation, pos) {
  const infoWindow = new google.maps.InfoWindow({
    map: map,
  });

  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
}

// 🆕 findNearestPoliceStation stays the same
function findNearestPoliceStation(map, latitude, longitude) {
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: new google.maps.LatLng(latitude, longitude),
      radius: 5000,
      type: 'police'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const policeStations = results.map(place => ({
          name: place.name,
          address: place.vicinity,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }));
        resolve(policeStations);
      } else {
        console.error('PlacesService failed:', status);
        reject('No police stations found or PlacesService failed');
      }
    });
  });
}

// 🆕 Totally new function to search when button clicked
async function searchAndDisplayPoliceStations() {
  if (!userLat || !userLng) {
    console.error("User location not available yet!");
    return;
  }

  try {
    const policeStations = await findNearestPoliceStation(map, userLat, userLng);

    policeStations.forEach((station) => {
      const marker = new google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map: map,
        title: station.name,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        }
      });
      marker.setAnimation(google.maps.Animation.BOUNCE);
      // 🆕 Now, inside the forEach loop, attach click listener to each marker
      marker.addListener('click', () => {
        const destination = new google.maps.LatLng(station.lat, station.lng);
        const origin = new google.maps.LatLng(userLat, userLng);

        const request = {
          origin: origin,
          destination: destination,
          travelMode: 'WALKING' // You can change to 'WALKING' if you want
        };

        directionsService.route(request, (result, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        });
      });

    });

  } catch (error) {
    console.error("Error finding police stations:", error);
  }
}