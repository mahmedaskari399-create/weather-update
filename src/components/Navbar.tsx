/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Star, Mic } from 'lucide-react';
import { useWeather } from '../lib/WeatherContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const { searchCity, detectLocation, units, toggleUnits, favorites } = useWeather();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchCity(query);
      setQuery('');
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      searchCity(transcript);
    };
    recognition.start();
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/20 bg-white/10 px-6 py-2 backdrop-blur-lg shadow-lg">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white p-1.5 shadow-inner">
            <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400 to-indigo-600" />
          </div>
          <span className="hidden text-xl font-bold tracking-tight text-white sm:block">SkyCast</span>
        </div>

        <form onSubmit={handleSubmit} className="relative flex flex-1 max-w-md items-center group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city..."
            className="w-full rounded-full bg-white/10 px-10 py-2 text-white placeholder-white/50 outline-none ring-1 ring-white/20 transition-all focus:bg-white/20 focus:ring-white/40"
          />
          <Search className="absolute left-3 h-4 w-4 text-white/50 group-focus-within:text-white" />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={startVoiceSearch}
              className={cn(
                "rounded-full p-1.5 transition-colors",
                isListening ? "bg-red-500 text-white animate-pulse" : "text-white/50 hover:bg-white/20 hover:text-white"
              )}
              title="Voice Search"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={detectLocation}
            className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 hover:bg-white/20"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Current</span>
          </button>
          
          <button
            onClick={toggleUnits}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/20"
          >
            {units === 'metric' ? '°C' : '°F'}
          </button>

          {favorites.length > 0 && (
            <div className="hidden items-center md:flex group relative">
              <Star className="h-5 w-5 text-yellow-400 cursor-pointer" />
              <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-48 overflow-hidden rounded-2xl border border-white/20 bg-slate-900/90 p-1 backdrop-blur-xl shadow-2xl">
                 <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">Favorites</p>
                 {favorites.map(city => (
                   <button 
                    key={city} 
                    onClick={() => searchCity(city)}
                    className="w-full text-left rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                   >
                     {city}
                   </button>
                 ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
