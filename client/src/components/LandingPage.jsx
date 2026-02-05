import React from 'react';
import { ArrowRight, Leaf, Droplets, Sun } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 text-white flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Leaf size={400} className="absolute -top-20 -left-20 animate-pulse" />
                <Sun size={300} className="absolute top-40 right-10 animate-spin-slow" />
                <Droplets size={200} className="absolute bottom-10 left-1/3" />
            </div>

            <div className="z-10 text-center max-w-4xl px-6">
                <div className="mb-6 flex justify-center">
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/10">
                        <Leaf size={64} className="text-green-300" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                    Smart Agriculture <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-yellow-300">
                        Decision System
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-green-100 mb-10 font-light leading-relaxed">
                    Empowering farmers . Monitor soil health, maximize crop yields, and make data-driven decisions in real-time.
                </p>

                <button
                    onClick={onEnter}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-green-900 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10">Enter Dashboard</span>
                    <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Footer / Credits */}
            <footer className="absolute bottom-6 text-green-200/60 text-sm">
                &copy; 2026 Smart Agri Systems. Designed for the Future of Farming.
            </footer>
        </div>
    );
};

export default LandingPage;
