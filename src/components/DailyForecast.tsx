/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar } from 'lucide-react';
import { useWeather } from '../lib/WeatherContext';
import GlassCard from './GlassCard';

export default function DailyForecast() {
  const { weather } = useWeather();
  if (!weather) return null;

  return (
    <GlassCard className="flex flex-col h-full" delay={0.8}>
      <div className="flex items-center gap-2 mb-6 text-white/50">
        <Calendar className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-wider">7-Day Forecast</span>
      </div>
      <div className="flex flex-col gap-6">
        {weather.daily.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="w-12 text-sm font-bold text-white">{i === 0 ? 'Today' : item.date}</span>
            <div className="flex items-center gap-2 flex-1 justify-center">
              <img 
                src={`https://openweathermap.org/img/wn/${item.icon}.png`} 
                alt={item.condition}
                className="w-8 h-8"
              />
              <span className="hidden sm:inline text-xs text-white/50 w-20 text-center">{item.condition}</span>
            </div>
            <div className="flex items-center gap-4 w-24 justify-end">
              <span className="text-sm font-medium text-white/50">{Math.round(item.min)}°</span>
              <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-orange-400 opacity-50" />
              </div>
              <span className="text-sm font-bold text-white">{Math.round(item.max)}°</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
