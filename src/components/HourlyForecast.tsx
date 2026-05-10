/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Clock } from 'lucide-react';
import { useWeather } from '../lib/WeatherContext';
import GlassCard from './GlassCard';
import { motion } from 'motion/react';

export default function HourlyForecast() {
  const { weather } = useWeather();
  if (!weather) return null;

  return (
    <GlassCard className="p-0" delay={0.7}>
      <div className="flex items-center gap-2 px-6 py-4 border-bottom border-white/10 text-white/50">
        <Clock className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Hourly Forecast</span>
      </div>
      <div className="flex overflow-x-auto pb-4 px-4 gap-6 scrollbar-hide no-scrollbar">
        {weather.hourly.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            className="flex flex-col items-center min-w-[60px] py-4"
          >
            <span className="text-xs font-bold text-white/50 mb-2">{item.time}</span>
            <img 
              src={`https://openweathermap.org/img/wn/${item.icon}.png`} 
              alt="icon"
              className="w-10 h-10 mb-2 filter drop-shadow-md"
            />
            <span className="text-lg font-bold text-white">{Math.round(item.temp)}°</span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
