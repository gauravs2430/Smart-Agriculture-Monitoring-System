import React, { useState } from 'react';
import { LayoutDashboard, Leaf, Activity, Droplets, Thermometer, Wind } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import RegionSelection from './components/RegionSelection';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null); // New State
  const [activeTab, setActiveTab] = useState('dashboard');

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  // New Flow: Landing -> RegionSelection -> Dashboard
  if (!selectedRegion) {
    return <RegionSelection onSelect={(region) => setSelectedRegion(region)} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Leaf /> AgriSmart
          </h1>
          <p className="text-sm text-green-200 mt-1">IoT Monitoring System</p>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-green-700 transition ${activeTab === 'dashboard' ? 'bg-green-700' : ''}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-green-700 transition ${activeTab === 'history' ? 'bg-green-700' : ''}`}
          >
            <Activity size={20} /> History
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            {/* Display Selected Region */}
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
              {selectedRegion.name}
            </span>
          </div>
          <div className="text-sm text-gray-500">Welcome, Farmer</div>
        </header>

        <div className="p-6">
          {activeTab === 'dashboard' && <Dashboard selectedRegion={selectedRegion} />}
          {activeTab === 'history' && <div className="text-center text-gray-500 mt-10">History Import Logic Coming Soon</div>}
        </div>
      </main>
    </div>
  );
}

export default App;
