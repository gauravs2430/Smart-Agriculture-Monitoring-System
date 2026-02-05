import React, { useState } from 'react';
import { MapPin, ArrowRight, Search, CheckCircle } from 'lucide-react';

const STATES = [
    { name: "Punjab", type: "Alluvial", fertility: "High" },
    { name: "Haryana", type: "Alluvial/Loam", fertility: "High" },
    { name: "Uttar Pradesh", type: "Alluvial", fertility: "Medium-High" },
    { name: "Maharashtra", type: "Black Soil", fertility: "High" },
    { name: "Madhya Pradesh", type: "Black/Red", fertility: "Medium" },
    { name: "Rajasthan", type: "Sandy/Desert", fertility: "Low" },
    { name: "West Bengal", type: "Alluvial", fertility: "High" },
    { name: "Karnataka", type: "Red/Black", fertility: "Medium" },
    { name: "Tamil Nadu", type: "Red/Loam", fertility: "Medium" },
    { name: "Gujarat", type: "Black/Alluvial", fertility: "Medium-High" }
];

const RegionSelection = ({ onSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState(null);

    const filteredStates = STATES.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleContinue = () => {
        if (selected) {
            onSelect(selected);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">

            <div className="text-center max-w-2xl mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Select Your Region</h2>
                <p className="text-gray-600">
                    Soil conditions vary by location. Select your state to load the appropriate soil profile and agricultural datasets.
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-md mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={20} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search for your state..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mb-12">
                {filteredStates.map((state) => (
                    <div
                        key={state.name}
                        onClick={() => setSelected(state)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
              ${selected === state ? 'border-green-500 bg-green-50 shadow-md' : 'border-white bg-white hover:border-green-200 shadow-sm'}
            `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${selected === state ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-500 group-hover:bg-green-50 group-hover:text-green-600'}`}>
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className={`font-semibold ${selected === state ? 'text-green-900' : 'text-gray-800'}`}>{state.name}</h3>
                                <p className="text-xs text-gray-500 font-medium">{state.type}</p>
                            </div>
                        </div>
                        {selected === state && <CheckCircle className="text-green-500" size={20} />}
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-center md:static md:bg-transparent md:border-t-0">
                <button
                    disabled={!selected}
                    onClick={handleContinue}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all
              ${selected ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
                >
                    Continue to Dashboard <ArrowRight size={20} />
                </button>
            </div>

        </div>
    );
};

export default RegionSelection;
