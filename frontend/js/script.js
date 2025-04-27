// Function to check if user is inside or outside the geofence
async function checkGeofence() {
  if ("geolocation" in navigator) {
    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Current Coordinates:");
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        // Define geofence radius (in meters)
        const radius = 1000; // Example: 5km radius

        // Get the distance between the user's current location and the geofence center (user's location)
        const isInsideGeofence = await isLocationInsideGeofence(
          latitude,
          longitude,
          latitude,
          longitude,
          radius
        );

        if (isInsideGeofence) {
          console.log("You are away from hotspot.");
          // Optionally, trigger some action like sending an SOS or notifying the user
        } else {
          console.log("Be alert! you have entered a hotspot");
          // Optionally, trigger an action like alerting authorities or sending an alert
        }
      },
      (error) => {
        console.error("Error fetching location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Helper function to calculate if the point is inside the geofence using Haversine formula
function isLocationInsideGeofence(
  userLat,
  userLng,
  geofenceLat,
  geofenceLng,
  radius
) {
  // Haversine formula to calculate the distance between two points on the Earth's surface
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371; // Earth radius in km

  const lat1 = toRad(userLat);
  const lon1 = toRad(userLng);
  const lat2 = toRad(geofenceLat);
  const lon2 = toRad(geofenceLng);

  const deltaLat = lat2 - lat1;
  const deltaLng = lon2 - lon1;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c * 1000; // Distance in meters
  return distance <= radius; // Check if the distance is within the geofence radius
}

function sendSos(){
  alert("SOS button clicked! Sending SOS message...");
}

// Continuously track the user's location
function startGeofencing() {
  checkGeofence(); // Start the geofence check when the page loads
  setInterval(checkGeofence, 5000); // Check every minute (or adjust as needed)
}
document.addEventListener("DOMContentLoaded", () => {
  startGeofencing();
  // SOS Button Event Listener
  const sosButton = document.getElementById("sosButton");
  if (sosButton) {
    sosButton.addEventListener("click", async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const sosData = {
              recipientPhoneNumber: "+919996063833", // Replace with the recipient's number
              messageBody: "Emergency! Need help.",
              latitude: latitude, // Use live location latitude
              longitude: longitude, // Use live location longitude
            };

            try {
              const response = await fetch("/api/sos/send-sos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sosData),
              });

              if (response.ok) {
                const result = await response.json();
                alert(result.message);
              } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
              }
            } catch (err) {
              alert("Failed to send SOS message.");
              console.error(err);
            }
          },
          (error) => {
            alert(
              "Failed to get live location. Please enable location services."
            );
            console.error("Geolocation error:", error);
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    });
  }

  // Heatmap Button Event Listener
  const viewHeatmapButton = document.getElementById("viewHeatmapButton");
  if (viewHeatmapButton) {
    viewHeatmapButton.addEventListener("click", () => {
      window.location.href = "/delhi_crime_heatmap_with_fading_clusters.html";
    });
  }
  const navigateSafeZoneButton = document.getElementById(
    "navigateSafeZoneButton"
  );
  if (navigateSafeZoneButton) {
    navigateSafeZoneButton.addEventListener("click", () => {
      window.location.href = "/navigation.html";
    });
  }

  // Geofence Check
  const checkGeofenceButton = document.getElementById("checkGeofenceButton");
  if (checkGeofenceButton) {
    checkGeofenceButton.addEventListener("click", async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const geofenceLat = 28.6139;
          const geofenceLng = 77.209;
          const radius = 5000;

          try {
            const response = await fetch("/api/sos/check-geofence", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lat: latitude,
                lng: longitude,
                geofenceLat: geofenceLat,
                geofenceLng: geofenceLng,
                radius: radius,
              }),
            });

            const data = await response.json();
            alert(
              data.isInside
                ? "You are inside the geofence."
                : "You are outside the geofence."
            );
          } catch (error) {
            console.error("Error checking geofence:", error);
            alert("Error checking geofence.");
          }
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    });
  }
});
