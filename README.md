# Smart Agriculture Monitoring & Decision Support System

## Overview
This project is a web-based "Smart Agriculture Monitoring and Decision Support System" designed to simulate an IoT-based soil and crop management environment. It helps farmers or researchers monitor soil conditions (Moisture, pH, NPK, Temperature, Humidity) and receive automated irrigation and fertilizer recommendations based on specific crop requirements.

## Features
- **Real-time Monitoring**: Dashboard displaying live sensor data.
- **Decision Engine**: Rule-based logic for **Tomato**, **Rice**, and **Bell Pepper** crops.
- **Recommendations**: Auto-generates advice (e.g., "Water Only", "Water + Fertilizer").
- **Visual Analytics**: Interactive charts showing trends over time.
- **Soil Intelligence**: Adjusts logic based on soil type (Sandy, Clay, Loam).
- **Data Simulation**: Built-in tool to manually input/simulate sensor readings for testing.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Chart.js, Lucide React.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Local or Atlas).

## Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or an Atlas connection string)

## Installation & Setup

### 1. Clone/Navigate to Repository
```bash
cd "/path/to/project"
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```
**Configuration**:
Create a `.env` file in the `server` directory (if not exists) with:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/crop_monitoring
```
*Note: Replace `MONGO_URI` with your MongoDB Atlas connection string if using cloud storage.*

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

## Running the Application

### Start the Backend
```bash
cd server
npm run start
```
*The server will run on http://localhost:5000*

### Start the Frontend
In a new terminal window:
```bash
cd client
npm run dev
```
*The client will run on http://localhost:5173 (or similar)*

## Usage Guide
1. **Open Dashboard**: Go to the client URL in your browser.
2. **Simulate Data**: Use the "Reading Simulator" panel at the bottom of the dashboard.
   - Select a Crop (e.g., Tomato).
   - Enter soil values (Moisture, NPK, etc.).
   - Click "Simulate Sensor Reading".
3. **View Results**: 
   - The "Decision Support" panel will update with a recommendation (e.g., "Water Needed").
   - The "Live Trends" chart will interpret the new data point.

## API Endpoints
- **POST** `/api/readings`: Submit new sensor data.
- **GET** `/api/readings`: Get historical data.
- **GET** `/api/stats`: Get dashboard statistics.

## Project Structure
- `client/`: React frontend application.
- `server/`: Node.js API and logic.
- `server/utils/decisionEngine.js`: Contains the logic for farming recommendations.
