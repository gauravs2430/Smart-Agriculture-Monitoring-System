import React, { useState, useEffect } from 'react';
import { Line, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Droplets, Thermometer, Wind, FlaskConical, Sprout, AlertCircle, Activity, ShieldCheck, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale);

const API_URL = '/api';

const StatCard = ({ title, value, unit, icon: Icon, color }) => (
    <div className={`bg-white/95 hover:bg-white backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 hover:border-${color}-200 transition-all duration-300 group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1`}>
        <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm ring-1 ring-${color}-100`}>
                <Icon size={26} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{title}</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-extrabold text-gray-800 tracking-tight">{value}</p>
                    <span className="text-sm font-semibold text-gray-400">{unit}</span>
                </div>
            </div>
        </div>
    </div>
);

const Dashboard = ({ selectedRegion, onDataUpdate, onNavigate }) => {
    const [readings, setReadings] = useState([]);
    const [latest, setLatest] = useState(null);

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
        // Fetch Real State Data if region is selected
        const fetchStateProfile = async () => {
            if (selectedRegion?.name) {
                try {
                    const res = await axios.get(`${API_URL}/data/state/${selectedRegion.name}`);
                    if (res.data.success) {
                        const profile = res.data.data;

                        // Also set as "Latest" reading if no sensor data exists yet
                        if (!latest) {
                            const initialData = {
                                moisture: profile.avgMoisture,
                                temperature: profile.avgTemp,
                                humidity: profile.avgHumidity,
                                ph: profile.ph,
                                nitrogen: profile.nitrogen,
                                phosphorus: profile.phosphorus,
                                potassium: profile.potassium,
                                soilType: profile.soilType,
                                timestamp: new Date()
                            };
                            setLatest(initialData);
                            // FIX: Propagate to App.jsx so Recommendations has data
                            if (onDataUpdate) onDataUpdate(initialData);
                        }
                    }
                } catch (err) {
                    console.error("Failed to load state profile", err);
                }
            }
        };

        fetchStateProfile();
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [selectedRegion]);

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
        <div className="space-y-6 h-full flex flex-col">
            {/* Top Stats - Premium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Soil Moisture"
                    value={latest?.moisture || '--'}
                    unit="%"
                    icon={Droplets}
                    color="blue"
                />
                <StatCard
                    title="Temperature"
                    value={latest?.temperature || '--'}
                    unit="°C"
                    icon={Thermometer}
                    color="orange"
                />
                <StatCard
                    title="Humidity"
                    value={latest?.humidity || '--'}
                    unit="%"
                    icon={Wind}
                    color="teal"
                />
                <StatCard
                    title="Soil pH"
                    value={latest?.ph || '--'}
                    unit="pH"
                    icon={FlaskConical}
                    color="purple"
                />
            </div>

            {/* Main Content Area - Vertical Stack */}
            <div className="flex flex-col gap-6 flex-grow">

                {/* Top Row: Detailed Soil Analysis & Radar Chart (Full Width) */}
                {/* Top Row: Detailed Soil Analysis & Radar Chart (Full Width) */}
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.04)] border border-white/50 flex flex-col flex-grow relative overflow-hidden ring-1 ring-black/5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-70"></div>

                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-2xl font-bold flex items-center gap-3 text-gray-900 tracking-tight">
                            <div className="p-2.5 bg-emerald-100/50 text-emerald-700 rounded-xl backdrop-blur-sm">
                                <FlaskConical size={22} strokeWidth={2.5} />
                            </div>
                            Soil Nutrient Matrix
                        </h3>
                        <span className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full font-bold animate-pulse border border-green-100 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            {latest ? 'Live Data Feed' : 'Connecting...'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-grow items-center relative z-10">
                        {/* Progress Bars (Wider - 66%) */}
                        <div className="lg:col-span-8 space-y-8 w-full">
                            {/* Nitrogen (N) */}
                            <div className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-gray-500 text-sm font-medium group-hover:text-blue-600 transition-colors">Nitrogen (N)</span>
                                    <span className="font-bold text-gray-800 text-lg">{latest?.nitrogen || 0} <span className="text-xs text-gray-400 font-normal">mg/kg</span></span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200/50 shadow-inner">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full shadow-[0_2px_10px_rgba(59,130,246,0.4)] transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${Math.min(latest?.nitrogen || 0, 100)}%` }}>
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Phosphorus (P) */}
                            <div className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-gray-500 text-sm font-medium group-hover:text-orange-600 transition-colors">Phosphorus (P)</span>
                                    <span className="font-bold text-gray-800 text-lg">{latest?.phosphorus || 0} <span className="text-xs text-gray-400 font-normal">mg/kg</span></span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200/50 shadow-inner">
                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full shadow-[0_2px_10px_rgba(249,115,22,0.4)] transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${Math.min(latest?.phosphorus || 0, 100)}%` }}>
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Potassium (K) */}
                            <div className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-gray-500 text-sm font-medium group-hover:text-purple-600 transition-colors">Potassium (K)</span>
                                    <span className="font-bold text-gray-800 text-lg">{latest?.potassium || 0} <span className="text-xs text-gray-400 font-normal">mg/kg</span></span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200/50 shadow-inner">
                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full shadow-[0_2px_10px_rgba(168,85,247,0.4)] transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${Math.min(latest?.potassium || 0, 100)}%` }}>
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                                    </div>
                                </div>
                            </div>

                            {/* pH Level */}
                            <div className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-gray-500 text-sm font-medium group-hover:text-teal-600 transition-colors">pH Level</span>
                                    <span className="font-bold text-gray-800 text-lg">{latest?.ph || 0}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative shadow-inner border border-gray-200/50">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-emerald-400 to-blue-500 opacity-50"></div>
                                    <div className="absolute top-0 bottom-0 w-2 bg-white border-2 border-gray-700 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-all duration-1000 z-10 hover:scale-125" style={{ left: `${((latest?.ph || 7) / 14) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Radar Chart (Narrower - 33%) */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-center h-full min-h-[300px]">
                            <div className="w-full h-full">
                                <Radar
                                    data={{
                                        labels: ['Nitrogen', 'Phosphorus', 'Potassium', 'Moisture', 'pH'],
                                        datasets: [{
                                            label: 'Nutrient Profile',
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
                                            pointBorderColor: '#fff',
                                            pointHoverBackgroundColor: '#fff',
                                            pointHoverBorderColor: 'rgba(34, 197, 94, 1)'
                                        }]
                                    }}
                                    options={{
                                        scales: {
                                            r: {
                                                angleLines: { color: 'rgba(0,0,0,0.05)' },
                                                grid: { color: 'rgba(0,0,0,0.05)' },
                                                suggestedMin: 0,
                                                suggestedMax: 100,
                                                ticks: { display: false, backdropColor: 'transparent' },
                                                pointLabels: {
                                                    font: { size: 12, weight: 'bold' },
                                                    color: '#6b7280'
                                                }
                                            }
                                        },
                                        plugins: { legend: { display: false } },
                                        maintainAspectRatio: false
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Smart Advisory Compact Banner */}
                <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-700 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between relative overflow-hidden group">

                    {/* Decorative element */}
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>

                    <div className="flex items-center gap-6 z-10">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner shrink-0">
                            <Sprout size={28} className="text-green-300" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-1 leading-tight">
                                Crop Intelligence
                            </h3>
                            <p className="text-green-100/90 text-sm max-w-lg">
                                Analysis of {selectedRegion?.name ? `soil in ${selectedRegion.name}` : 'sensor readings'} is ready. View your precision farming plan.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => onNavigate && onNavigate('recommendations')}
                        className="mt-4 sm:mt-0 bg-white text-green-900 px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group-hover:bg-green-50 shrink-0 z-10"
                    >
                        View Recommendations
                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </button>
                </div>

            </div>
        </div >
    );
};

export default Dashboard;
