import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Droplets, Thermometer, Wind, FlaskConical, Sprout, AlertCircle } from 'lucide-react';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api';

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

const Dashboard = () => {
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
                setReadings(res.data.data.reverse()); // Reverse to show oldest to newest on graph? Actually API sorts desc.
                // Wait, API sort is {timestamp: -1} (Newest first).
                // Chart needs Oldest -> Newest (Left to Right).
                // So we reverse it for chart.
                setLatest(res.data.data[res.data.data.length - 1] || res.data.data[0]);
                // Wait, if API returns [Newest, ..., Oldest]
                // The [0] is Newest.
                if (res.data.data.length > 0) {
                    setLatest(res.data.data[0]);
                }
            }
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Polling every 5s
        return () => clearInterval(interval);
    }, []);

    const handleSimulate = async () => {
        try {
            await axios.post(`${API_URL}/readings`, formData);
            fetchData(); // Refresh immediately
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">Live Trends</h3>
                    <div className="h-64">
                        <Line options={{ maintainAspectRatio: false }} data={chartData} />
                    </div>
                </div>

                {/* Recommendation Panel */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Sprout className="text-green-600" /> Decision Support
                        </h3>

                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Current Crop</p>
                            <p className="text-xl font-semibold">{latest?.cropType || 'N/A'}</p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-sm text-green-700 font-bold mb-1">Recommendation</p>
                            <p className="text-lg text-green-900 font-extrabold flex items-center gap-2">
                                {latest?.recommendation === 'Water + Fertilizer' && <AlertCircle className="text-red-500" />}
                                {latest?.recommendation || 'Waiting for Data...'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Nutrient Status</h4>
                        <div className="flex justify-between text-sm">
                            <span>N: <span className="font-bold">{latest?.nitrogen || '-'}</span></span>
                            <span>P: <span className="font-bold">{latest?.phosphorus || '-'}</span></span>
                            <span>K: <span className="font-bold">{latest?.potassium || '-'}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulation / Data Entry */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Reading Simulator (Data Entry)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="text-xs text-gray-500">Moisture (%)</label>
                        <input type="number"
                            value={formData.moisture}
                            onChange={e => setFormData({ ...formData, moisture: e.target.value })}
                            className="w-full border rounded p-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Temperature (°C)</label>
                        <input type="number"
                            value={formData.temperature}
                            onChange={e => setFormData({ ...formData, temperature: e.target.value })}
                            className="w-full border rounded p-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Humidity (%)</label>
                        <input type="number"
                            value={formData.humidity}
                            onChange={e => setFormData({ ...formData, humidity: e.target.value })}
                            className="w-full border rounded p-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">pH Level</label>
                        <input type="number" step="0.1"
                            value={formData.ph}
                            onChange={e => setFormData({ ...formData, ph: e.target.value })}
                            className="w-full border rounded p-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Nitrogen (N)</label>
                        <input type="number"
                            value={formData.nitrogen}
                            onChange={e => setFormData({ ...formData, nitrogen: e.target.value })}
                            className="w-full border rounded p-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Phosphorus (P)</label>
                        <input type="number"
                            value={formData.phosphorus}
                            onChange={e => setFormData({ ...formData, phosphorus: e.target.value })}
                            className="w-full border rounded p-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Potassium (K)</label>
                        <input type="number"
                            value={formData.potassium}
                            onChange={e => setFormData({ ...formData, potassium: e.target.value })}
                            className="w-full border rounded p-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Crop Type</label>
                        <select
                            value={formData.cropType}
                            onChange={e => setFormData({ ...formData, cropType: e.target.value })}
                            className="w-full border rounded p-2 text-sm"
                        >
                            <option>Tomato</option>
                            <option>Rice</option>
                            <option>Bell Pepper</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Soil Type</label>
                        <select
                            value={formData.soilType}
                            onChange={e => setFormData({ ...formData, soilType: e.target.value })}
                            className="w-full border rounded p-2 text-sm"
                        >
                            <option>Loam</option>
                            <option>Sandy</option>
                            <option>Clay</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleSimulate}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full md:w-auto"
                >
                    Simulate Sensor Reading
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
