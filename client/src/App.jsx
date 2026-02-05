import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Leaf, Activity, Sprout, ClipboardList, MapPin, User, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import RegionSelection from './components/RegionSelection';
import Recommendations from './components/Recommendations';
import Auth from './components/Auth';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // User state
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [latestReadings, setLatestReadings] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user'); // Retrieve saved user name if available
    if (token) {
      setIsAuthenticated(true);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Persist user data
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setSelectedRegion(null);
    setActiveTab('dashboard');
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode='wait'>
        <motion.div
          key="auth"
          initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
        >
          <Auth onLogin={handleLogin} />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!selectedRegion) {
    return (
      <AnimatePresence mode='wait'>
        <motion.div
          key="region"
          initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
        >
          <RegionSelection onSelect={(region) => setSelectedRegion(region)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Helper to render content based on activeTab
  const renderContent = () => {
    if (activeTab === 'recommendations') {
      return (
        <Recommendations
          readings={latestReadings}
          onBack={() => setActiveTab('dashboard')}
        />
      );
    }
    if (activeTab === 'dashboard') {
      return (
        <Dashboard
          selectedRegion={selectedRegion}
          onDataUpdate={setLatestReadings}
          onNavigate={setActiveTab}
        />
      );
    }
    if (activeTab === 'history') {
      return <div className="text-center text-gray-500 mt-10">History Import Logic Coming Soon</div>;
    }
    return null;
  };

  // Full Layout for authenticated App
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white hidden md:flex flex-col shadow-xl z-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sprout /> AgroSmart
          </h1>
          <p className="text-sm text-green-200 mt-1">Monitoring System</p>
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

        {/* Bottom Profile Section - Improved Spacing */}
        <div className="p-4 border-t border-green-800 mt-auto bg-green-950/30">
          <button
            onClick={() => setSelectedRegion(null)}
            className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-green-800/50 text-green-200 text-sm mb-2 transition-colors"
          >
            <MapPin size={16} /> Change Region
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-red-900/50 text-red-200 text-sm transition-colors mb-4"
          >
            <LogOut size={16} /> Logout
          </button>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center shrink-0 border border-green-500 shadow-sm">
              <span className="text-lg font-bold text-green-100">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{user?.name || 'Farmer'}</p>
              <p className="text-xs text-green-300 truncate">{user?.email || 'User'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            {selectedRegion && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 border border-green-200">
                <MapPin size={12} /> {selectedRegion.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 hidden md:block">Welcome, <span className="font-semibold text-green-700">{user?.name || 'Farmer'}</span></div>
            <button onClick={handleLogout} className="md:hidden text-gray-500 hover:text-red-500">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="p-6">
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
