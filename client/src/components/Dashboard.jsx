import React, { useState, useEffect } from 'react';
import { Line, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Droplets, Thermometer, Wind, FlaskConical, Sprout, AlertCircle } from 'lucide-react';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale);

const API_URL = '/api';

const StatCard = ({ title, value, unit, icon: Icon, color }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-3 rounded-full ${color} text-white`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value} <span className="text-sm font-normal text-gray-400">{unit}</span></p>
        </div>
    </div>
);

const Dashboard = ({ selectedRegion, onDataUpdate, onNavigate }) => {
    const [readings, setReadings] = useState([]);
    const [latest, setLatest] = useState(null);

    // Simulation Form State
    const [formData, setFormData] = useState({
        moisture: 45,
        temperature: 28,
        humidity: 65,
        ph: 6.5,
        nitrogen: 40,
        phosphorus: 30,
        potassium: 40,
        cropType: 'Tomato',
        soilType: 'Loam'
    });

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/readings`);
            if (res.data.success) {
                setReadings(res.data.data.reverse());
                if (res.data.data.length > 0) {
                    const newest = res.data.data[0];
                    setLatest(newest);
                    // Share data with parent for Recommendations page
                    if (onDataUpdate) onDataUpdate(newest);
                }
            }
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSimulate = async () => {
        try {
            await axios.post(`${API_URL}/readings`, formData);
            fetchData();
            alert("Reading Simulated Successfully!");
        } catch (err) {
            alert("Error simulating reading");
            console.error(err);
        }
    };

    // Prepare Chart Data
    const chartData = {
        labels: readings.slice(0, 10).reverse().map(r => new Date(r.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: 'Moisture (%)',
                data: readings.slice(0, 10).reverse().map(r => r.moisture),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
            {
                label: 'Temperature (°C)',
                data: readings.slice(0, 10).reverse().map(r => r.temperature),
                borderColor: 'rgb(249, 115, 22)',
                backgroundColor: 'rgba(249, 115, 22, 0.5)',
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Soil Moisture"
                    value={latest?.moisture || '--'}
                    unit="%"
                    icon={Droplets}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Temperature"
                    value={latest?.temperature || '--'}
                    unit="°C"
                    icon={Thermometer}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Humidity"
                    value={latest?.humidity || '--'}
                    unit="%"
                    icon={Wind}
                    color="bg-teal-500"
                />
                <StatCard
                    title="Soil pH"
                    value={latest?.ph || '--'}
                    unit="pH"
                    icon={FlaskConical}
                    color="bg-purple-500"
                />
            </div>

            {/* Smart Advisory Section */}
            <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                        <Sprout className="text-green-300" /> Smart Crop Advisory
                    </h3>
                    <p className="text-green-100 max-w-xl">
                        Based on the current sensor readings from <span className="font-bold text-white">{selectedRegion?.name || 'your region'}</span>,
                        our AI engine has generated optimized crop and fertilizer recommendations.
                    </p>
                </div>
                <button
                    onClick={() => onNavigate && onNavigate('recommendations')}
                    className="bg-white text-green-800 px-6 py-3 rounded-lg font-bold shadow-md hover:scale-105 transition-transform whitespace-nowrap"
                >
                    View Recommendations
                </button>
            </div>

            {/* Nutrient Levels & Soil Simulation */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <FlaskConical className="text-green-600" /> Soil Nutrient Analysis
                    </h3>
                    <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                        {latest ? 'Live Sensor Data' : 'Waiting for Updates...'}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Left Column: Progress Bars */}
                    <div className="space-y-6">
                        {/* Nitrogen (N) */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 font-medium">Nitrogen (N)</span>
                                <span className="font-bold text-blue-600">{latest?.nitrogen || 0} mg/kg</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min(latest?.nitrogen || 0, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 text-right">Ideal Range: 40-60 mg/kg</p>
                        </div>

                        {/* Phosphorus (P) */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 font-medium">Phosphorus (P)</span>
                                <span className="font-bold text-orange-600">{latest?.phosphorus || 0} mg/kg</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min(latest?.phosphorus || 0, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 text-right">Ideal Range: 20-40 mg/kg</p>
                        </div>

                        {/* Potassium (K) */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 font-medium">Potassium (K)</span>
                                <span className="font-bold text-purple-600">{latest?.potassium || 0} mg/kg</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min(latest?.potassium || 0, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 text-right">Ideal Range: 150-250 mg/kg</p>
                        </div>

                        {/* pH Level */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 font-medium">pH Level</span>
                                <span className="font-bold text-teal-600">{latest?.ph || 0}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden relative">
                                {/* Gradient for pH scale */}
                                <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-green-400 to-blue-400 opacity-30"></div>
                                <div
                                    className="absolute top-0 bottom-0 w-1 bg-gray-800 border block shadow-lg"
                                    style={{ left: `${((latest?.ph || 7) / 14) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Acidic (0)</span>
                                <span>Neutral (7)</span>
                                <span>Alkaline (14)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Radar Chart for Nutrient Balance */}
                    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase">Nutrient Balance</h4>
                        <div className="w-full h-64">
                            <Radar
                                data={{
                                    labels: ['Nitrogen', 'Phosphorus', 'Potassium', 'Moisture', 'pH (Scaled 0-10)'],
                                    datasets: [{
                                        label: 'Current Levels',
                                        data: [
                                            latest?.nitrogen || 0,
                                            latest?.phosphorus || 0,
                                            latest?.potassium || 0,
                                            latest?.moisture || 0,
                                            (latest?.ph || 0) * 10
                                        ],
                                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                        borderColor: 'rgba(34, 197, 94, 1)',
                                        borderWidth: 2,
                                        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                                    }]
                                }}
                                options={{
                                    scales: {
                                        r: {
                                            angleLines: { color: 'rgba(0,0,0,0.1)' },
                                            grid: { color: 'rgba(0,0,0,0.1)' },
                                            suggestedMin: 0,
                                            suggestedMax: 100,
                                            ticks: { display: false } // Hide numbers for cleaner look
                                        }
                                    },
                                    plugins: {
                                        legend: { display: false }
                                    },
                                    maintainAspectRatio: false
                                }}
                            />
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-4">
                            Visual representation of soil health balance. An even shape indicates balanced nutrition.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
