/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useWeather } from '../lib/WeatherContext';
import { Heart, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function HeroSection() {
  const { weather, toggleFavorite, favorites } = useWeather();
  if (!weather) return null;

  const isFav = favorites.includes(weather.city);

  return (
    <section className="flex flex-col items-center justify-center py-12 text-center text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mb-6"
      >
        <div className="flex items-center justify-center gap-4 mb-2">
           <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{weather.city}</h1>
           <button 
            onClick={() => toggleFavorite(weather.city)}
            className="rounded-full bg-white/10 p-2 backdrop-blur-sm transition-transform active:scale-95"
           >
             <Heart className={cn("h-6 w-6 transition-colors", isFav ? "fill-red-500 text-red-500" : "text-white/70")} />
           </button>
        </div>
        <p className="text-xl text-white/70 capitalize">{weather.description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <div className="relative flex items-center justify-center">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} 
            alt={weather.condition}
            className="w-48 h-48 drop-shadow-2xl filter brightness-110"
          />
        </div>
        <div className="mt-[-2rem]">
          <span className="text-[8rem] md:text-[10rem] font-thin leading-none tracking-tighter">
            {weather.temp}°
          </span>
        </div>
        <div className="flex gap-4 text-xl font-medium text-white/80">
          <span className="flex items-center gap-1">
            <Maximize2 className="h-4 w-4" /> {weather.tempMax}°
          </span>
          <span className="flex items-center gap-1">
            <Minimize2 className="h-4 w-4" /> {weather.tempMin}°
          </span>
        </div>
      </motion.div>
    </section>
  );
}
