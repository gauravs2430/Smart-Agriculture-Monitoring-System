const mongoose = require('mongoose');
const dotenv = require('dotenv');
const StateProfile = require('./models/StateProfile');
const CropRule = require('./models/CropRule');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crop_monitoring';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing data
        await StateProfile.deleteMany({});
        await CropRule.deleteMany({});
        console.log('Cleared existing State Profiles and Crop Rules.');

        // --- 1. State Profiles (All Indian States & UTs) ---
        const states = [
            // North India
            { name: "Jammu and Kashmir", soilType: "Mountain Soil", avgTemp: 15, avgMoisture: 50, avgHumidity: 60, nitrogen: 100, phosphorus: 40, potassium: 150, ph: 6.5 },
            { name: "Himachal Pradesh", soilType: "Mountain Soil", avgTemp: 18, avgMoisture: 55, avgHumidity: 65, nitrogen: 110, phosphorus: 45, potassium: 160, ph: 6.2 },
            { name: "Punjab", soilType: "Alluvial Soil", avgTemp: 28, avgMoisture: 60, avgHumidity: 65, nitrogen: 160, phosphorus: 50, potassium: 180, ph: 7.2 },
            { name: "Haryana", soilType: "Alluvial Soil", avgTemp: 29, avgMoisture: 55, avgHumidity: 60, nitrogen: 150, phosphorus: 55, potassium: 200, ph: 7.5 },
            { name: "Uttarakhand", soilType: "Mountain Soil", avgTemp: 20, avgMoisture: 60, avgHumidity: 70, nitrogen: 120, phosphorus: 40, potassium: 140, ph: 6.0 },
            { name: "Delhi", soilType: "Alluvial Soil", avgTemp: 30, avgMoisture: 40, avgHumidity: 50, nitrogen: 130, phosphorus: 40, potassium: 180, ph: 7.0 },
            { name: "Uttar Pradesh", soilType: "Alluvial Soil", avgTemp: 29, avgMoisture: 55, avgHumidity: 70, nitrogen: 150, phosphorus: 55, potassium: 160, ph: 7.4 },
            { name: "Chandigarh", soilType: "Alluvial Soil", avgTemp: 28, avgMoisture: 50, avgHumidity: 60, nitrogen: 140, phosphorus: 50, potassium: 170, ph: 7.1 },
            { name: "Ladakh", soilType: "Sandy/Mountain", avgTemp: 10, avgMoisture: 20, avgHumidity: 30, nitrogen: 80, phosphorus: 30, potassium: 100, ph: 7.0 },

            // West India
            { name: "Rajasthan", soilType: "Sandy Soil", avgTemp: 35, avgMoisture: 20, avgHumidity: 30, nitrogen: 80, phosphorus: 30, potassium: 250, ph: 8.0 },
            { name: "Gujarat", soilType: "Black Soil", avgTemp: 32, avgMoisture: 40, avgHumidity: 55, nitrogen: 120, phosphorus: 40, potassium: 200, ph: 7.5 },
            { name: "Maharashtra", soilType: "Black Soil", avgTemp: 30, avgMoisture: 45, avgHumidity: 60, nitrogen: 140, phosphorus: 45, potassium: 220, ph: 7.0 },
            { name: "Goa", soilType: "Laterite Soil", avgTemp: 28, avgMoisture: 70, avgHumidity: 80, nitrogen: 110, phosphorus: 35, potassium: 140, ph: 5.5 },

            // Central India
            { name: "Madhya Pradesh", soilType: "Black Soil", avgTemp: 30, avgMoisture: 45, avgHumidity: 55, nitrogen: 130, phosphorus: 45, potassium: 190, ph: 7.2 },
            { name: "Chhattisgarh", soilType: "Red & Yellow Soil", avgTemp: 31, avgMoisture: 55, avgHumidity: 65, nitrogen: 120, phosphorus: 40, potassium: 160, ph: 6.8 },

            // East India
            { name: "Bihar", soilType: "Alluvial Soil", avgTemp: 28, avgMoisture: 60, avgHumidity: 70, nitrogen: 140, phosphorus: 50, potassium: 170, ph: 7.0 },
            { name: "Jharkhand", soilType: "Red Soil", avgTemp: 27, avgMoisture: 50, avgHumidity: 65, nitrogen: 110, phosphorus: 35, potassium: 150, ph: 6.5 },
            { name: "West Bengal", soilType: "Alluvial Soil", avgTemp: 29, avgMoisture: 70, avgHumidity: 80, nitrogen: 150, phosphorus: 55, potassium: 180, ph: 6.8 },
            { name: "Odisha", soilType: "Red/Yellow Soil", avgTemp: 30, avgMoisture: 65, avgHumidity: 75, nitrogen: 130, phosphorus: 40, potassium: 160, ph: 6.5 },

            // South India
            { name: "Andhra Pradesh", soilType: "Red Soil", avgTemp: 32, avgMoisture: 45, avgHumidity: 60, nitrogen: 120, phosphorus: 40, potassium: 180, ph: 7.0 },
            { name: "Telangana", soilType: "Red/Black Soil", avgTemp: 31, avgMoisture: 40, avgHumidity: 55, nitrogen: 115, phosphorus: 35, potassium: 175, ph: 7.2 },
            { name: "Karnataka", soilType: "Red/Black Soil", avgTemp: 28, avgMoisture: 50, avgHumidity: 65, nitrogen: 130, phosphorus: 45, potassium: 200, ph: 6.8 },
            { name: "Kerala", soilType: "Laterite Soil", avgTemp: 28, avgMoisture: 75, avgHumidity: 85, nitrogen: 100, phosphorus: 30, potassium: 140, ph: 5.5 },
            { name: "Tamil Nadu", soilType: "Red Soil", avgTemp: 34, avgMoisture: 35, avgHumidity: 60, nitrogen: 100, phosphorus: 35, potassium: 150, ph: 6.5 },
            { name: "Puducherry", soilType: "Alluvial Soil", avgTemp: 30, avgMoisture: 65, avgHumidity: 75, nitrogen: 130, phosphorus: 45, potassium: 160, ph: 7.0 },

            // North East India
            { name: "Assam", soilType: "Alluvial Soil", avgTemp: 26, avgMoisture: 70, avgHumidity: 80, nitrogen: 140, phosphorus: 50, potassium: 160, ph: 6.8 },
            { name: "Arunachal Pradesh", soilType: "Mountain Soil", avgTemp: 20, avgMoisture: 65, avgHumidity: 75, nitrogen: 120, phosphorus: 40, potassium: 130, ph: 6.0 },
            { name: "Manipur", soilType: "Laterite Soil", avgTemp: 22, avgMoisture: 60, avgHumidity: 70, nitrogen: 110, phosphorus: 35, potassium: 140, ph: 5.8 },
            { name: "Meghalaya", soilType: "Laterite Soil", avgTemp: 20, avgMoisture: 80, avgHumidity: 85, nitrogen: 100, phosphorus: 30, potassium: 120, ph: 5.5 },
            { name: "Mizoram", soilType: "Red/Mountain", avgTemp: 22, avgMoisture: 65, avgHumidity: 75, nitrogen: 110, phosphorus: 35, potassium: 130, ph: 6.0 },
            { name: "Nagaland", soilType: "Red/Mountain", avgTemp: 21, avgMoisture: 60, avgHumidity: 70, nitrogen: 115, phosphorus: 40, potassium: 135, ph: 6.2 },
            { name: "Sikkim", soilType: "Mountain Soil", avgTemp: 18, avgMoisture: 70, avgHumidity: 80, nitrogen: 130, phosphorus: 45, potassium: 150, ph: 6.0 },
            { name: "Tripura", soilType: "Red/Laterite", avgTemp: 25, avgMoisture: 65, avgHumidity: 75, nitrogen: 125, phosphorus: 40, potassium: 145, ph: 6.5 },

            // Islands
            { name: "Andaman and Nicobar Islands", soilType: "Sandy/Loam", avgTemp: 29, avgMoisture: 75, avgHumidity: 80, nitrogen: 110, phosphorus: 35, potassium: 140, ph: 6.0 },
            { name: "Lakshadweep", soilType: "Sandy Soil", avgTemp: 30, avgMoisture: 70, avgHumidity: 75, nitrogen: 90, phosphorus: 30, potassium: 120, ph: 7.5 },
            { name: "Dadra and Nagar Haveli and Daman and Diu", soilType: "Black Soil", avgTemp: 30, avgMoisture: 50, avgHumidity: 65, nitrogen: 130, phosphorus: 45, potassium: 200, ph: 7.2 }
        ];

        await StateProfile.insertMany(states);
        console.log(`Seeded ${states.length} State Profiles.`);

        // --- 2. Crop Rules (Scientific Requirements) ---
        const crops = [
            {
                name: "Cotton",
                type: "Primary",
                soilTypes: ["Black Soil", "Alluvial Soil", "Red/Black Soil"],
                minTemp: 25,
                maxTemp: 40,
                minPh: 6.0,
                maxPh: 8.5,
                minMoisture: 30,
                fertilizers: ["Urea", "Potash", "Organic Manure"]
            },
            {
                name: "Wheat",
                type: "Primary",
                soilTypes: ["Alluvial Soil", "Loam"],
                minTemp: 10,
                maxTemp: 25,
                minPh: 6.0,
                maxPh: 7.5,
                minMoisture: 45,
                fertilizers: ["DAP (Di-ammonium Phosphate)", "Zinc Sulfate"]
            },
            {
                name: "Rice",
                type: "Primary",
                soilTypes: ["Clay", "Alluvial Soil", "Loam"],
                minTemp: 20,
                maxTemp: 35,
                minPh: 5.5,
                maxPh: 7.5,
                minMoisture: 60, // High water
                fertilizers: ["Urea", "NPK 15-15-15", "Green Manure"]
            },
            {
                name: "Sugarcane",
                type: "Primary",
                soilTypes: ["Alluvial Soil", "Black Soil"],
                minTemp: 20,
                maxTemp: 35,
                minPh: 6.5,
                maxPh: 8.0,
                minMoisture: 60,
                fertilizers: ["Urea", "DAP", "MOP (Muriate of Potash)"]
            },
            {
                name: "Groundnut",
                type: "Secondary",
                soilTypes: ["Sandy Loam", "Red Soil", "Black Soil", "Sandy Soil"],
                minTemp: 25,
                maxTemp: 35,
                minPh: 6.0,
                maxPh: 7.5,
                minMoisture: 30,
                fertilizers: ["Gypsum", "Single Super Phosphate", "Ammonium Sulfate"]
            },
            {
                name: "Bajra (Pearl Millet)",
                type: "Secondary",
                soilTypes: ["Sandy Soil", "Red Soil", "Black Soil", "Sandy/Desert"],
                minTemp: 25,
                maxTemp: 40,
                minPh: 6.5,
                maxPh: 8.0,
                minMoisture: 15, // Drought hardy
                fertilizers: ["Urea", "FYM (Farm Yard Manure)"]
            },
            {
                name: "Maize",
                type: "Primary",
                soilTypes: ["Alluvial Soil", "Red Soil", "Loam"],
                minTemp: 18,
                maxTemp: 30,
                minPh: 5.5,
                maxPh: 7.5,
                minMoisture: 50,
                fertilizers: ["Nitrogen", "Phosphorus", "Potassium"]
            },
            {
                name: "Mustard",
                type: "Secondary",
                soilTypes: ["Sandy Loam", "Alluvial Soil"],
                minTemp: 10,
                maxTemp: 25,
                minPh: 6.0,
                maxPh: 7.5,
                minMoisture: 30,
                fertilizers: ["Sulfur", "Nitrogen"]
            },
            {
                name: "Tea",
                type: "Primary",
                soilTypes: ["Laterite Soil", "Mountain Soil"],
                minTemp: 15,
                maxTemp: 25,
                minPh: 4.5,
                maxPh: 5.5, // Acidic
                minMoisture: 70,
                fertilizers: ["Ammonium Sulfate", "Potash", "Urea"]
            },
            {
                name: "Coffee",
                type: "Primary",
                soilTypes: ["Laterite Soil", "Red Soil"],
                minTemp: 15,
                maxTemp: 28,
                minPh: 5.0,
                maxPh: 6.5,
                minMoisture: 60,
                fertilizers: ["NPK 17:17:17", "Lime"]
            },
            {
                name: "Jute",
                type: "Primary",
                soilTypes: ["Alluvial Soil"],
                minTemp: 24,
                maxTemp: 35,
                minPh: 6.0,
                maxPh: 7.5,
                minMoisture: 70,
                fertilizers: ["Urea", "Phosphorus"]
            },
            {
                name: "Rubber",
                type: "Primary",
                soilTypes: ["Laterite Soil"],
                minTemp: 20,
                maxTemp: 30,
                minPh: 5.0,
                maxPh: 6.5,
                minMoisture: 80,
                fertilizers: ["NPK 10:10:10", "Dolomite"]
            },
            {
                name: "Apple",
                type: "Primary",
                soilTypes: ["Mountain Soil", "Loam"],
                minTemp: -5,
                maxTemp: 25,
                minPh: 6.0,
                maxPh: 7.0,
                minMoisture: 50,
                fertilizers: ["FYM", "Super Phosphate", "Potash"]
            },
            {
                name: "Soybean",
                type: "Primary",
                soilTypes: ["Loam", "Black Soil"],
                minTemp: 20,
                maxTemp: 35,
                minPh: 6.0,
                maxPh: 7.0,
                minMoisture: 45,
                fertilizers: ["Nitrogen", "Phosphorus", "Potassium"]
            },
            {
                name: "Potato",
                type: "Primary",
                soilTypes: ["Loose Loam", "Sandy Loam"],
                minTemp: 15,
                maxTemp: 25,
                minPh: 4.8,
                maxPh: 6.5,
                minMoisture: 60,
                fertilizers: ["Nitrogen", "Phosphorus", "Potassium"]
            },
            {
                name: "Onion",
                type: "Primary",
                soilTypes: ["Sandy Loam", "Clay Loam", "Loam"],
                minTemp: 13,
                maxTemp: 24,
                minPh: 6.0,
                maxPh: 7.5,
                minMoisture: 55,
                fertilizers: ["Nitrogen", "Phosphorus", "Potassium", "Sulfur"]
            },
            {
                name: "Barley",
                type: "Secondary",
                soilTypes: ["Sandy Loam", "Loam", "Saline Soil"],
                minTemp: 12,
                maxTemp: 25,
                minPh: 6.0,
                maxPh: 8.5,
                minMoisture: 40,
                fertilizers: ["Nitrogen", "Phosphorus", "Potassium"]
            },
            {
                name: "Chickpea (Gram)",
                type: "Primary",
                soilTypes: ["Sandy Loam", "Clay Loam"],
                minTemp: 15,
                maxTemp: 25,
                minPh: 6.0,
                maxPh: 7.5,
                minMoisture: 35,
                fertilizers: ["Phosphorus", "Potassium"]
            },
            {
                name: "Sunflower",
                type: "Secondary",
                soilTypes: ["Loam", "Black Soil", "Sandy Loam"],
                minTemp: 20,
                maxTemp: 28,
                minPh: 6.0,
                maxPh: 7.5,
                minMoisture: 45,
                fertilizers: ["Nitrogen", "Phosphorus", "Potassium"]
            },
            {
                name: "Turmeric",
                type: "Secondary",
                soilTypes: ["Loamy Soil", "Alluvial Soil"],
                minTemp: 20,
                maxTemp: 30,
                minPh: 4.5,
                maxPh: 7.5,
                minMoisture: 70,
                fertilizers: ["FYM", "Nitrogen", "Phosphorus", "Potassium"]
            }
        ];

        await CropRule.insertMany(crops);
        console.log(`Seeded ${crops.length} Crop Rules.`);

        console.log('Seeding Completed Successfully.');
        process.exit();

    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
