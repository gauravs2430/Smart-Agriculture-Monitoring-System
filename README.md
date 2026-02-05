# Smart Agriculture Monitoring & Decision Support System

## Overview
This project is an advanced web-based **"Smart Agriculture Monitoring and Decision Support System"** designed to modernize farming through IoT and data analytics. It simulates a real-time environment where soil conditions (Moisture, pH, NPK, Temperature, Humidity) are monitored and analyzed against scientific crop requirements.

The system features a **Regional Intelligence Engine** that pre-loads soil profiles for specific Indian states, ensuring that recommendations are context-aware and accurate. It helps farmers and researchers make informed decisions on irrigation and fertilization to maximize yield and sustainability.

## Key Features
- **🌍 Regional Context Intelligence**: 
  - Simply select your state (e.g., Punjab, Maharashtra, Kerala) to auto-calibrate the system with typical local soil and climate profiles.
  - Covers all Indian States and Union Territories.
- **🧠 Advanced Decision Engine**: 
  - Rule-based logic for **13+ major crops** including Cotton, Wheat, Rice, Sugarcane, Tea, Coffee, and more.
  - Compares real-time sensor data against specific scientific thresholds (pH, Temp, Moisture, etc.).
- **📊 Real-time Dashboard**: 
  - Visualizes live sensor data with dynamic charts and indicators.
  - Tracks trends over time for Temperature, Humidity, and Moisture.
- **💡 Smart Recommendations**: 
  - Generates actionable advice such as *"Irrigation Required"*, *"Add Nitrogen Fertilizer"*, or *"Soil Too Acidic - Add Lime"*.
- **🧪 Data Simulation Tool**: 
  - Built-in simulator to manually input or randomize sensor readings for testing various scenarios without physical hardware.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Lucide React (Icons), Chart.js (Visualizations).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Stores State Profiles, Crop Rules, and Sensor Logs).
- **Architecture**: RESTful API with distinct Client/Server separation.

## Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or an Atlas connection string)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Crop soil Project"
```

### 2. Backend Setup
Navigate to the server directory, install dependencies, and seed the database.
```bash
cd server
npm install
```

**Configuration**:
Create a `.env` file in the `server` directory with:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/crop_monitoring
```
*(Replace `MONGO_URI` if using MongoDB Atlas)*

**🌱 Important: Seed the Database**
Run this command to populate the database with State Profiles and Crop Rules:
```bash
node seedData.js
```
*You should see a message confirming that State Profiles and Crop Rules have been seeded.*

**Start the Server**:
```bash
npm run start
```
*Server runs on http://localhost:5000*

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and start the UI.
```bash
cd ../client
npm install
npm run dev
```
*Client runs on http://localhost:5173 (or similar)*

## Usage Guide
1. **Select Region**: On the landing page, search for and select your State/UT (e.g., "Gujarat"). The system loads the typical soil profile for that region.
2. **Monitor Dashboard**: View the simulated "Live" data based on your region.
3. **Simulate Scenarios**: 
   - Use the **"Reading Simulator"** panel at the bottom.
   - Adjust values (e.g., lower the moisture to 10%).
   - Click "Simulate Reading".
4. **Get Recommendations**: 
   - The **"Decision Support"** panel will instantly update.
   - Example: If moisture is low, it will recommend "Irrigation Needed".

## Project Structure
- `client/`: React frontend (UI, Components, Pages).
- `server/`: Node.js backend (API Routes, Models, Logic).
- `server/seedData.js`: Script to populate the database with agricultural knowledge.
- `server/models/`: Database schemas for `StateProfile`, `CropRule`, etc.

## API Endpoints (Key Routes)
- `GET /api/data/states`: Fetch all available regional profiles.
- `POST /api/readings`: Submit new sensor data (from hardware or simulator).
- `GET /api/readings`: Retrieve historical sensor data.
- `GET /api/stats`: Analytics for the dashboard.
