import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Search, CheckCircle, Leaf, CloudRain } from 'lucide-react';
import axios from 'axios';

const RegionSelection = ({ onSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState(null);
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await axios.get('/api/data/states');
                if (res.data.success) {
                    setStates(res.data.data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to load states", err);
                setLoading(false);
            }
        };
        fetchStates();
    }, []);

    const filteredStates = states.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleContinue = () => {
        if (selected) {
            onSelect(selected);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 text-white flex flex-col items-center py-12 px-6 relative overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Leaf size={400} className="absolute -top-20 -left-20 animate-pulse text-green-300" />
                <CloudRain size={300} className="absolute bottom-40 right-10 text-blue-300" />
            </div>

            <div className="text-center max-w-2xl mb-12 z-10">
                <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
                    Select Your <span className="text-green-300">Region</span>
                </h2>
                <p className="text-green-100 text-lg font-light">
                    Soil conditions vary by location. Select your state to calibrate the system with real regional data.
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-md mb-8 z-10">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={20} className="text-green-200" />
                </div>
                <input
                    type="text"
                    placeholder="Search for your state..."
                    className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-green-200/70 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-xl transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mb-24 z-10 px-2 overflow-y-auto max-h-[60vh] scrollbar-hide py-2">
                {loading ? (
                    <div className="col-span-full text-center text-green-200 animate-pulse">Loading Regions from Database...</div>
                ) : filteredStates.length > 0 ? (
                    filteredStates.map((state) => (
                        <div
                            key={state._id || state.name}
                            onClick={() => setSelected(state)}
                            className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group backdrop-blur-sm
                  ${selected === state
                                    ? 'bg-green-500/20 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)] transform scale-[1.02]'
                                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10 hover:-translate-y-1 shadow-lg'}
                `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full transition-colors ${selected === state ? 'bg-green-400 text-green-900' : 'bg-white/10 text-green-300 group-hover:bg-green-400 group-hover:text-green-900'}`}>
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{state.name}</h3>
                                    {/* Display Soil Type stored in DB */}
                                    <p className="text-sm text-green-200/80 font-medium">
                                        {state.soilType || 'Typical Soil'}
                                    </p>
                                </div>
                            </div>
                            {selected === state && <CheckCircle className="text-green-400 animate-bounce" size={24} />}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-300">No region found</div>
                )}
            </div>

            {/* CTA */}
            <div className="fixed bottom-0 left-0 w-full p-6 flex justify-center z-20 bg-gradient-to-t from-green-900/90 to-transparent pointer-events-none">
                <button
                    disabled={!selected}
                    onClick={handleContinue}
                    className={`pointer-events-auto flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all duration-300 transform
              ${selected
                            ? 'bg-white text-green-900 hover:scale-110 hover:shadow-green-500/50'
                            : 'bg-gray-600/50 text-gray-400 cursor-not-allowed grayscale'}
            `}
                >
                    Continue to Dashboard <ArrowRight size={22} />
                </button>
            </div>

        </div>
    );
};

export default RegionSelection;
