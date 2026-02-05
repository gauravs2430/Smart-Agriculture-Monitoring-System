import React, { useState, useEffect } from 'react';
import { Sprout, Droplets, Thermometer, Wind, ArrowLeft, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Leaf } from "lucide-react";


const Recommendations = ({ readings, onBack }) => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!readings) {
                setLoading(false);
                return;
            }

            try {
                // Send current sensor data to backend analysis engine
                const res = await axios.post('/api/data/recommend', {
                    temp: readings.temperature,
                    ph: readings.ph,
                    moisture: readings.moisture,
                    soilType: readings.soilType || 'Loam' // Default if not simulating
                });

                if (res.data.success) {
                    setRecommendations(res.data.recommendations);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching recommendations", err);
                setError("Could not analyze crop data at this time.");
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [readings]);

    if (!readings) {
        return (
            <div className="p-10 text-center flex flex-col items-center justify-center h-full text-gray-500">
                <AlertTriangle size={48} className="mb-4 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-700">No Sensor Data Available</h2>
                <p>Please simulate sensing data on the dashboard first.</p>
                <button onClick={onBack} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <Sprout className="text-green-600" size={32} /> Smart Crop Advisory
                        </h1>
                        <p className="text-gray-500">AI-Powered Recommendations based on regional soil analysis</p>
                    </div>
                </div>

                {/* Soil Type Badge */}
                <div className="hidden md:flex items-center gap-3 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                        <Wind size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Soil Type Profile</p>
                        <p className="text-lg font-bold text-gray-800">{readings.soilType || 'General Loam'}</p>
                    </div>
                </div>
            </div>

            {/* Recommendations Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-green-600">
                    <Loader2 size={48} className="animate-spin mb-4" />
                    <p>Analyzing soil composition against agricultural database...</p>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-10">{error}</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Primary Crops */}
                    <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sprout size={120} className="text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                            <CheckCircle size={20} /> Top Recommended Crops
                        </h2>

                        <div className="space-y-4">
                            {recommendations?.primary?.length > 0 ? (
                                recommendations.primary.map((crop, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-800">{crop.name}</h3>
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Best Match</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600"><span className="font-semibold">Fertilizers:</span> {crop.fertilizers.join(', ')}</p>
                                            <p className="text-xs text-gray-500">Matches soil type and temperature profile exactly.</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No primary crops found for these specific extreme conditions.</p>
                            )}
                        </div>
                    </div>

                    {/* Secondary Crops */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            Alternative Options
                        </h2>
                        <div className="space-y-4">
                            {recommendations?.secondary?.length > 0 ? (
                                recommendations.secondary.map((crop, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                                        <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                                            <Leaf size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{crop.name}</h3>
                                            <p className="text-sm text-gray-600">Requires: {crop.fertilizers[0]} + Irrigation</p>
                                            {crop.note && <span className="text-xs text-red-500 font-bold">{crop.note}</span>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No alternative crops found.</p>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Recommendations;
