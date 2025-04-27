import pandas as pd
import random

# Load the hotspot centers from locations_coordinates.csv
locations = pd.read_csv('locations_coordinates.csv')  # Assume columns 'Location', 'Latitude', 'Longitude'

# Define crime types and severity for hotspots
crime_data = [
    {"crime_type": "Rape", "severity": 10},
    {"crime_type": "Acid Attacks", "severity": 9},
    {"crime_type": "Kidnapping", "severity": 8},
    {"crime_type": "Sexual Assault", "severity": 7},
    {"crime_type": "Robbery with Assault", "severity": 6},
    {"crime_type": "Sexual Exploitation", "severity": 7},
    {"crime_type": "Street Harassment", "severity": 4},
    {"crime_type": "Threats", "severity": 2},
    {"crime_type": "Molestation", "severity": 6},
    {"crime_type": "Touching", "severity": 3},
    # Safe (fake) crimes
    {"crime_type": "Safe1", "severity": 0},
    {"crime_type": "Safe1", "severity": 0},
    {"crime_type": "Safe1", "severity": 2},
    {"crime_type": "Safe2", "severity": 3},
    {"crime_type": "Safe2", "severity": 1},
]
#  Parameters for generating hotspot rings
num_rings = 5          # Number of concentric rings
points_per_ring = 7    # Number of points per ring
severity_start = 10.0  # Starting severity level for the central point
severity_step = -2.0   # Severity decrease per ring (negative to reduce outward)
max_radius = 0.01      # Maximum radius for the outermost ring in degrees (approx ~1 km)

# Function to generate a latitude and longitude with fading severity around a hotspot
def generate_fading_lat_long(center, max_radius=0.05, severity_start=10, severity_step=-2):
    lat, long = center
    num_rings = severity_start // abs(severity_step)
    
    locations = []
    for i in range(num_rings):
        severity = max(severity_start + (severity_step * i), 1)
        radius = max_radius * ((num_rings - i) / num_rings)
        for _ in range(5):  # Generate multiple points per ring
            latitude = lat + random.uniform(-radius, radius)
            longitude = long + random.uniform(-radius, radius)
            locations.append({
                "crime_type": "High Severity Area",
                "severity": severity,
                "latitude": round(latitude, 6),
                "longitude": round(longitude, 6)
            })
    return locations

# Generate synthetic data with fading severity for each hotspot region
data = []
for _, row in locations.iterrows():
    center = (row['latitude'], row['longitude'])  # Using coordinates from CSV
    data += generate_fading_lat_long(center)



# Create a DataFrame and save it as CSV
df = pd.DataFrame(data)
df.to_csv("delhi_crime_data.csv", index=False)

print("CSV file 'delhi_crime_data.csv' has been created successfully with fading hotspots and safe zones.")
