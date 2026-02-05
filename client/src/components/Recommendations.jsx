import React from 'react';
import { ArrowLeft, Sprout, Droplets, Leaf, Info, Zap } from 'lucide-react';

const Recommendations = ({ readings, onBack }) => {
    // If no readings, use mock data or empty state
    const data = readings || {
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        moisture: 0,
        ph: 7,
        temperature: 25
    };

    // --- Decision Logic ---
    const getRecommendations = (d) => {
        let primaryCrop = [];
        let secondaryCrop = [];
        let fertilizers = [];
        let advice = [];

        // Nitrogen Logic
        if (d.nitrogen < 40) {
            fertilizers.push("Urea (High Nitrogen)");
            advice.push("Soil is nitrogen deficient. Add Urea.");
        } else if (d.nitrogen > 80) {
            advice.push("Nitrogen levels are high. Avoid adding nitrogen-rich fertilizers.");
        }

        // Phosphorus Logic
        if (d.phosphorus < 20) {
            fertilizers.push("DAP (Di-ammonium Phosphate)");
            advice.push("Low Phosphorus detected. Use DAP.");
        }

        // Potassium Logic
        if (d.potassium < 150) {
            fertilizers.push("MOP (Muriate of Potash)");
            advice.push("Potassium is low. Apply Potash.");
        }

        // Moisture Logic
        if (d.moisture > 60) {
            primaryCrop.push("Rice", "Sugarcane", "Jute");
            secondaryCrop.push("Lentils (Post-Harvest)");
        } else if (d.moisture < 30) {
            primaryCrop.push("Millets", "Sorghum", "Groundnut");
            secondaryCrop.push("Mustard");
            advice.push("Low moisture. Consider drip irrigation.");
        } else {
            primaryCrop.push("Wheat", "Maize", "Cotton");
            secondaryCrop.push("Chickpea");
        }

        // pH Logic
        if (d.ph < 5.5) {
            advice.push("Soil is Acidic. Add Lime to neutralize.");
        } else if (d.ph > 7.5) {
            advice.push("Soil is Alkaline. Add Gypsum or Sulfur.");
        }

        return { primaryCrop, secondaryCrop, fertilizers, advice };
    };

    const recs = getRecommendations(data);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Crop Health & Advisory</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">

                {/* Primary Recommendation Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
                    <div className="bg-green-600 p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <Sprout size={28} />
                            <h2 className="text-xl font-bold">Recommended Primary Crops</h2>
                        </div>
                        <p className="text-green-100 text-sm">Best suited for current soil conditions</p>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-3">
                            {recs.primaryCrop.map((crop, i) => (
                                <span key={i} className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-lg font-semibold border border-green-200">
                                    {crop}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Secondary Recommendation Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                    <div className="bg-blue-600 p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <Leaf size={28} />
                            <h2 className="text-xl font-bold">Secondary / Intercropping</h2>
                        </div>
                        <p className="text-blue-100 text-sm">For rotation or mixed farming</p>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-3">
                            {recs.secondaryCrop.map((crop, i) => (
                                <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-lg font-semibold border border-blue-200">
                                    {crop}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fertilizer Advisory */}
                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden md:col-span-2">
                    <div className="bg-orange-500 p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap size={28} />
                            <h2 className="text-xl font-bold">Fertilizer & Soil Treatment</h2>
                        </div>
                        <p className="text-orange-100 text-sm">Required to optimize nutrient balance</p>
                    </div>
                    <div className="p-6">
                        {recs.fertilizers.length > 0 ? (
                            <div className="flex flex-wrap gap-3 mb-6">
                                {recs.fertilizers.map((item, i) => (
                                    <span key={i} className="px-4 py-2 bg-orange-50 text-orange-800 rounded-lg font-medium border border-orange-200">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic mb-6">No specific fertilizers required at this time.</p>
                        )}

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-3">
                                <Info size={18} className="text-blue-500" /> Detailed Advisory
                            </h3>
                            <ul className="space-y-2">
                                {recs.advice.map((line, i) => (
                                    <li key={i} className="text-gray-600 flex items-start gap-2 text-sm">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Recommendations;
