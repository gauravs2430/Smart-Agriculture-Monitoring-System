import React, { useState, useEffect } from 'react';
import { Sprout, Droplets, Thermometer, Wind, ArrowLeft, Loader2, AlertTriangle, CheckCircle, FileDown } from 'lucide-react';
import axios from 'axios';
import { Leaf } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


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

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.setTextColor(22, 101, 52); // green-800
        doc.text("AgroSmart Soil Health Report", 14, 22);

        // Meta Data
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.text(`Soil Type: ${readings.soilType || 'Loam'}`, 14, 35);

        // Section 1: Soil Readings
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Current Soil Status", 14, 45);

        const soilData = [
            ['Parameter', 'Value', 'Status'],
            ['Temperature', `${readings.temperature}°C`, 'Recorded'],
            ['Moisture', `${readings.moisture}%`, readings.moisture < 30 ? 'Low' : 'Adequate'],
            ['pH Level', readings.ph, readings.ph < 6 ? 'Acidic' : readings.ph > 7.5 ? 'Alkaline' : 'Neutral'],
            ['Nitrogen', `${readings.nitrogen} mg/kg`, '-'],
            ['Phosphorus', `${readings.phosphorus} mg/kg`, '-'],
            ['Potassium', `${readings.potassium} mg/kg`, '-'],
        ];

        autoTable(doc, {
            startY: 50,
            head: [soilData[0]],
            body: soilData.slice(1),
            theme: 'grid',
            headStyles: { fillColor: [22, 163, 74] }, // green-600
        });

        // Section 2: Recommendations
        const finalY = doc.lastAutoTable.finalY || 100;
        doc.setFontSize(14);
        doc.text("Crop Recommendations", 14, finalY + 15);

        const cropRows = [];
        if (recommendations?.primary?.length) {
            recommendations.primary.forEach(crop => {
                cropRows.push([crop.name, 'Primary', crop.fertilizers.join(', ')]);
            });
        }
        if (recommendations?.secondary?.length) {
            recommendations.secondary.forEach(crop => {
                cropRows.push([crop.name, 'Secondary', `Requires: ${crop.fertilizers[0]} + Irrigation`]);
            });
        }

        autoTable(doc, {
            startY: finalY + 20,
            head: [['Crop Name', 'Type', 'Notes / Fertilizers']],
            body: cropRows,
            theme: 'striped',
            headStyles: { fillColor: [22, 163, 74] },
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text('AgroSmart - Intelligent Agriculture Monitoring System', 14, doc.internal.pageSize.height - 10);
        }

        doc.save(`AgroSmart_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

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
                        <p className="text-gray-500">Recommendations based on regional soil analysis</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="hidden md:flex items-center gap-2 bg-white text-green-700 border border-green-200 px-4 py-2 rounded-lg hover:bg-green-50 shadow-sm transition-all font-semibold"
                    >
                        <FileDown size={20} /> Download Report
                    </button>
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

            {/* Soil Insights Section */}
            {readings && (
                <div className="mt-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Leaf className="text-amber-600" /> Soil Characteristics & Know-How
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">About {readings.soilType || 'Loam'}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {SOIL_INSIGHTS[readings.soilType]?.description || SOIL_INSIGHTS['Loam'].description}
                            </p>

                            <div className="mt-6">
                                <h4 className="font-bold text-gray-800 mb-2">Key Characteristics</h4>
                                <ul className="space-y-2">
                                    {(SOIL_INSIGHTS[readings.soilType]?.characteristics || SOIL_INSIGHTS['Loam'].characteristics).map((char, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                            {char}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-amber-900 mb-4">Management & Care Tips</h3>
                            <ul className="space-y-3">
                                {(SOIL_INSIGHTS[readings.soilType]?.care || SOIL_INSIGHTS['Loam'].care).map((tip, i) => (
                                    <li key={i} className="flex items-start gap-3 text-amber-800">
                                        <CheckCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                                        <span className="text-sm">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

const SOIL_INSIGHTS = {
    "Alluvial Soil": {
        description: "Formed by river deposits, this is significantly fertile and occupies the largest land area in India. It is highly suitable for agriculture due to its rich mineral content.",
        characteristics: [
            "Rich in Potash and Lime.",
            "loamy to sandy-loam texture.",
            "Generally poor in Nitrogen and Phosphorus.",
            "High water retention capacity in river valleys."
        ],
        care: [
            "Regular nitrogen-based fertilization is recommended.",
            "Suitable for a wide variety of crops including Rice, Wheat, and Sugarcane.",
            "Maintain proper drainage to prevent waterlogging."
        ]
    },
    "Black Soil": {
        description: "Also known as Regur soil, it is volcanic in origin and ideal for cotton cultivation. It has unique self-ploughing characteristics.",
        characteristics: [
            "Clayey texture with high water retention.",
            "Deep cracks develop during dry seasons (self-aeration).",
            "Rich in Calcium Carbonate, Magnesium, and Potash.",
            "Poor in Nitrogen and Phosphorus."
        ],
        care: [
            "Avoid working on wet soil as it becomes sticky.",
            "Apply phosphatic fertilizers for balance.",
            "Ideal for rainfed crops due to moisture holding capacity.",
            "Great for Cotton, Soybean, and Millets."
        ]
    },
    "Red Soil": {
        description: "Develops on crystalline igneous rocks in low rainfall areas. The reddish color comes from iron diffusion.",
        characteristics: [
            "Porous and friable structure.",
            "Generally acidic with low moisture retention.",
            "Rich in Iron and Potash.",
            "Deficient in Nitrogen, Lime, and Humus."
        ],
        care: [
            "Requires frequent irrigation as it does not hold water well.",
            "Application of organic manure and lime is beneficial.",
            "Good for Pulses, Groundnut, and Tobacco.",
            "Correct acidity with liming if pH drops too low."
        ]
    },
    "Laterite Soil": {
        description: "Formed under conditions of high temperature and heavy rainfall with alternate wet and dry periods. Intense leaching results in low fertility.",
        characteristics: [
            "Acidic in nature.",
            "Rich in Iron oxide and Aluminum.",
            "Poor in Nitrogen, Potash, and Lime.",
            "Hardens like brick when exposed to air."
        ],
        care: [
            "Heavy application of manure and fertilizers is required.",
            "Terracing is recommended for hilly areas.",
            "Suitable for plantation crops like Tea, Coffee, and Cashew.",
            "Lime application helps neutralize acidity."
        ]
    },
    "Desert Soil": {
        description: "Found in arid and semi-arid regions. It is sandy with low organic matter but high salt content.",
        characteristics: [
            "Sandy texture, 90-95% sand.",
            "High soluble salt content.",
            "Low moisture and humus.",
            "Phosphate content is generally normal."
        ],
        care: [
            "Drip irrigation is highly recommended to conserve water.",
            "Gypsum can help reduce soil salinity.",
            "Introduction of drought-resistant cover crops adds organic matter.",
            "Suitable for Bajra, Pulses, and Guar with irrigation."
        ]
    },
    "Loam": {
        description: "A balanced mixture of sand, silt, and clay. Ideally considered the best soil for gardening and general agriculture.",
        characteristics: [
            "Balanced drainage and retention.",
            "Good aeration for root growth.",
            "Moderate nutrient levels.",
            "Easy to work with."
        ],
        care: [
            "Maintain organic matter with compost.",
            "Suitable for almost all types of crops.",
            "Regular soil testing ensures nutrient balance."
        ]
    }
};

export default Recommendations;
