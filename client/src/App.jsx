import React, { useState } from 'react';
import { LayoutDashboard, Leaf, Activity, Sprout, ClipboardList, MapPin, User } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import RegionSelection from './components/RegionSelection';
import Recommendations from './components/Recommendations';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // State to hold latest sensor readings shared between Dashboard and Recommendations
  const [latestReadings, setLatestReadings] = useState(null);

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  // Flow: Landing -> RegionSelection -> Main App
  if (!selectedRegion) {
    return <RegionSelection onSelect={(region) => setSelectedRegion(region)} />;
  }

  // Full Screen Recommendations Page
  if (activeTab === 'recommendations') {
    return (
      <Recommendations
        readings={latestReadings}
        onBack={() => setActiveTab('dashboard')}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sprout /> AgroSmart
          </h1>
          <p className="text-sm text-green-200 mt-1">IoT Monitoring System</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'dashboard' ? 'bg-green-800' : 'hover:bg-green-800/50'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'recommendations' ? 'bg-green-800' : 'hover:bg-green-800/50'}`}
          >
            <Sprout size={20} /> Advisory
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'history' ? 'bg-green-800' : 'hover:bg-green-800/50'}`}
          >
            <ClipboardList size={20} /> History
          </button>
        </nav>

        <div className="p-4 border-t border-green-800">
          <button
            onClick={() => setSelectedRegion(null)}
            className="w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 hover:bg-green-800/50 text-green-200 text-sm mb-4"
          >
            <MapPin size={16} /> Change Region
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">Farmer</p>
              <p className="text-xs text-green-300">View Profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            {selectedRegion && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 border border-green-200">
                <MapPin size={12} /> {selectedRegion.name}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">Welcome, Farmer</div>
        </header>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              selectedRegion={selectedRegion}
              onDataUpdate={setLatestReadings}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === 'history' && <div className="text-center text-gray-500 mt-10">History Import Logic Coming Soon</div>}
        </div>
      </main>
    </div>
  );
}

export default App;
