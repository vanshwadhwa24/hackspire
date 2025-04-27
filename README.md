# PathSafe 🚨🛡️

**PathSafe** is a women's safety application designed to empower users to navigate cities with confidence, especially during late hours.  
Using real-time crime heatmaps, geofencing alerts, and safe route planning, PathSafe acts like a protective friend by your side — always watching, always alert.

---

## 🚀 Features

- **Crime Heatmap**  
  Visualizes women-related crime hotspots across your locality and city using real crime data.

- **Safe Route Planning**  
  Suggests alternative paths avoiding high-risk areas.

- **Geofencing Alerts**  
  Push notifications when users approach a crime-prone zone.

- **SOS Distress Button**  
  Instant emergency alerts sent to predefined contacts or authorities.

- **Navigate to Nearest Safe Zone**  
  Quickly find and navigate to the nearest safe location (police station, hospital, etc.).

---

## 📦 Tech Stack

| Frontend | Backend | Others |
| :--- | :--- | :--- |
| HTML, CSS, JavaScript | Node.js, Express.js | Folium (Python), Pandas |
| Leaflet.js (maps) | REST APIs | Geolocation APIs |
| Google Maps API | MongoDB (optional) | |

---

## 🛠️ Folder Structure

```
├───backend
│   ├───routes        # API Endpoints for user requests
│   └───services      # Business logic and geofencing utilities
├───data
│   └───delhi_crime_data.csv  # Crime data (example)
├───frontend
│   ├───assets        # Images, icons, etc.
│   └───js            # JavaScript scripts for frontend logic
├───pythonscripts
│   └───generateheatmap.py    # Script to generate dynamic heatmaps
├───.env              # Environment variables
├───.gitignore        # Node modules and other ignored files
└───README.md         # You're here ;)
```

---

## 📍 How it Works

1. **Crime data** is preloaded and visualized via a **heatmap** using a Python script (`generateheatmap.py`).
2. **Frontend** shows the heatmap and provides the user interface for safe route planning and SOS activation.
3. **Backend** handles SOS alerts, safe zone suggestions, and geofencing warnings through APIs.
4. **Geofencing** detects when users are near dangerous areas and sends timely alerts.
5. **SOS button** sends the user’s real-time location to emergency contacts for immediate help.

---

## 🧩 Setup Instructions

1. Clone this repo:
   ```bash
   git clone https://github.com/your-username/hackspire.git
   cd hackspire
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Setup your `.env` file with required API keys and configurations:
   ```
   GOOGLE_MAPS_API_KEY=your_key_here
   ```

4. Generate the heatmap HTML:
   ```bash
   cd pythonscripts
   python generateheatmap.py
   ```

5. Launch backend server:
   ```bash
   npm run dev
   ```

6. Open `frontend/index.html` in your browser and start exploring!

---

## 🧠 Inspiration

> "Every woman deserves to feel safe in every step she takes — PathSafe isn't just an app, it's a promise."

---

## ✨ Future Enhancements

- Real-time crowd-sourced crime reporting
- Smart AI-based hotspot prediction
- Partnership with local police stations for faster response
- Panic voice activation without needing to unlock the phone

---

## 💬 License

This project is open-source and free to use. Made with ❤️ and a mission to create safer cities.

---

# PathSafe: Your path to safety 🛡️🚶‍♀️🌙

