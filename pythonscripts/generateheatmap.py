import pandas as pd
import folium
from folium.plugins import HeatMap

# Load the CSV data
data = pd.read_csv("E:/women/data/delhi_crime_data.csv")

# Initialize the base map centered around Delhi
m = folium.Map(location=[28.6139, 77.2090], zoom_start=11)

# Prepare data for HeatMap, with weighting by severity
# Normalize severity to be between 0 and 1 for the gradient
data['normalized_severity'] = data['severity'] / 10

# Separate data for crime hotspots and safe zones
hotspot_data = data[data['severity'] > 1]  # Crimes and fading areas
safe_zone_data = data[data['severity'] <= 3]  # Safe zones with severity 1

# Prepare data for heatmap with fading effect
heat_data_hotspots = [[row['latitude'], row['longitude'], row['normalized_severity']] for index, row in hotspot_data.iterrows()]
heat_data_safe = [[row['latitude'], row['longitude'], 0.1] for index, row in safe_zone_data.iterrows()]  # Safe zones green tint

# Custom gradient
custom_gradient = {
    0.0: '#48d1d9',    # Light Cyan (Start of Blue)
    0.1: '#3399ff',    # Soft Blue
    0.2: '#1e90ff',    # Dodger Blue
    0.3: '#00ff00',    # Deep Sky Blue
    0.4: '#00ff00',    # Turquoise transitioning toward green
    0.5: '#00ff00',    # Green
    0.6: '#9ACD32',    # Green-Yellow
    0.7: '#ffff00',    # Yellow
    0.8: '#ffff00',    # Dark Orange
    0.9: '#ff0000',    # Orange-Red
    1.0: '#ff0000'     # Red (High Severity)
}

# Add the heat map layer for hotspots with custom gradient
HeatMap(
    heat_data_hotspots,
    radius=15,
    max_zoom=13,
    gradient=custom_gradient,
    opacity=0.04
).add_to(m)

# Save the map as an HTML file
m.save("delhi_crime_heatmap_with_fading_clusters.html")

print("Heat map with fading clusters and safe zones saved as 'delhi_crime_heatmap_with_fading_clusters.html'. Open this file in a web browser to view the map.")
