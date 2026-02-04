// Decision Engine for Smart Agriculture
// Rules are based on general agricultural thresholds.
// Adjust thresholds based on specific crop research.

/**
 * Determine recommendation based on crop, soil, and sensor data.
 * @param {Object} data - Sensor data (moisture, ph, NPK, etc.)
 * @returns {String} - Recommendation
 */
const getRecommendation = (data) => {
    const { moisture, nitrogen, phosphorus, potassium, cropType, soilType } = data;

    let waterNeeded = false;
    let fertilizerNeeded = false;

    // --- Moisture Logic ---
    // Thresholds might vary by soil type (Clay retains more water, Sandy less)
    // Simplify: Use moisture % thresholds adjusted by crop.

    // Limits (Lower bounds for healthy crops)
    const moistureThresholds = {
        'Tomato': 50,
        'Rice': 70, // Rice needs lots of water
        'Bell Pepper': 60
    };

    // Soil Factor: Sandy dries fast (increase threshold?), Clay holds (decrease?)
    // This is a simplification. Soil type affects irrigation frequency more than threshold.
    // For this engine, we check current level against MINIMUM required.

    let minMoisture = moistureThresholds[cropType] || 50;

    if (soilType === 'Sandy') minMoisture += 5; // Needs higher maintained moisture reading
    if (soilType === 'Clay') minMoisture -= 5;

    if (moisture < minMoisture) {
        waterNeeded = true;
    }

    // --- Fertilizer Logic (NPK) ---
    // Standard targets (ppm or kg/ha - here treating as raw index 0-100 or ppm)
    // Example: Ideal NPK
    const idealNPK = {
        'Tomato': { N: 50, P: 40, K: 60 },
        'Rice': { N: 60, P: 30, K: 30 },
        'Bell Pepper': { N: 55, P: 45, K: 55 }
    };

    const target = idealNPK[cropType];

    // Check if nutrients are significantly low (e.g., < 80% of target)
    if (nitrogen < target.N * 0.8 || phosphorus < target.P * 0.8 || potassium < target.K * 0.8) {
        fertilizerNeeded = true;
    }

    // --- Final Decision ---
    if (waterNeeded && fertilizerNeeded) return "Water + Fertilizer";
    if (waterNeeded) return "Water Only";
    if (fertilizerNeeded) return "Fertilizer Only";
    return "No Action Required";
};

module.exports = { getRecommendation };
