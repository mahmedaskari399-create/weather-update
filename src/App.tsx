/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeatherProvider, useWeather } from './lib/WeatherContext';
import Navbar from './components/Navbar';
import DynamicBackground from './components/DynamicBackground';
import HeroSection from './components/HeroSection';
import StatsGrid from './components/StatsGrid';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import TrendChart from './components/TrendChart';
import WeatherAlerts from './components/WeatherAlerts';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Wind, Search } from 'lucide-react';

function Dashboard() {
  const { weather, loading, error } = useWeather();

  if (loading && !weather) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-blue-400 mb-4" />
        <p className="text-xl font-medium animate-pulse">Loading SkyCast...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-white/30">
      {weather && (
        <DynamicBackground 
          condition={weather.condition} 
          isNight={new Date().getHours() > 19 || new Date().getHours() < 6} 
        />
      )}
      
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="bg-red-500/20 p-6 rounded-full mb-6">
                <Search className="h-12 w-12 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Location Not Found</h2>
              <p className="text-white/60 mb-8 max-w-md">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/20"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <WeatherAlerts />
              <HeroSection />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
                {/* Left Column: Stats & Hourly & Chart */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <HourlyForecast />
                  <StatsGrid />
                  <TrendChart />
                </div>

                {/* Right Column: Daily Forecast */}
                <div className="lg:col-span-4">
                  <DailyForecast />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full py-8 text-center text-white/40 text-xs tracking-widest uppercase font-bold">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
        </div>
        <p>&copy; {new Date().getFullYear()} SkyCast Weather. Powered by OpenWeather API.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <Dashboard />
    </WeatherProvider>
  );
}
