/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wind, Droplets, Thermometer, Sunrise, Sunset, Wind as WindIcon, Gauge, Info } from 'lucide-react';
import { useWeather } from '../lib/WeatherContext';
import GlassCard from './GlassCard';
import { cn } from '../lib/utils';

export default function StatsGrid() {
  const { weather } = useWeather();
  if (!weather) return null;

  const formatTime = (ts: number) => {
    return new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAqiStatus = (aqi: number) => {
    const statuses: Record<number, { label: string, color: string }> = {
      1: { label: 'Good', color: 'text-green-400' },
      2: { label: 'Fair', color: 'text-yellow-400' },
      3: { label: 'Moderate', color: 'text-orange-400' },
      4: { label: 'Poor', color: 'text-red-400' },
      5: { label: 'Very Poor', color: 'text-purple-400' },
    };
    return statuses[aqi] || { label: 'Unknown', color: 'text-white' };
  };

  const aqi = getAqiStatus(weather.aqi || 1);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-0">
      <GlassCard delay={0.1}>
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Gauge className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Air Quality</span>
          </div>
          <div>
            <p className={cn("text-2xl font-bold mb-1", aqi.color)}>{aqi.label}</p>
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
               <div 
                className={cn("h-full transition-all duration-1000", aqi.color.replace('text', 'bg'))} 
                style={{ width: `${(weather.aqi || 1) * 20}%` }}
               />
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard delay={0.2}>
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Thermometer className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Feels Like</span>
          </div>
          <p className="text-3xl font-bold text-white">{weather.feelsLike}°</p>
          <p className="text-xs text-white/50">Wind is making it feel {weather.feelsLike > weather.temp ? 'warmer' : 'cooler'}.</p>
        </div>
      </GlassCard>

      <GlassCard delay={0.3}>
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <WindIcon className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Wind</span>
          </div>
          <p className="text-3xl font-bold text-white">{weather.windSpeed} <span className="text-lg font-medium opacity-50">km/h</span></p>
          <div className="flex items-center gap-1 text-xs text-white/50">
             <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <WindIcon className="h-5 w-5" style={{ transform: 'rotate(45deg)' }} />
             </div>
             <span>Direction: NE</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard delay={0.4}>
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Droplets className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Humidity</span>
          </div>
          <p className="text-3xl font-bold text-white">{weather.humidity}%</p>
          <p className="text-xs text-white/50">Deepest dew point is 12° right now.</p>
        </div>
      </GlassCard>

      <GlassCard delay={0.5}>
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Sunrise className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Sunrise</span>
          </div>
          <p className="text-3xl font-bold text-white">{formatTime(weather.sunrise)}</p>
          <div className="flex items-center gap-2 text-white/50">
             <Sunset className="h-4 w-4" />
             <span className="text-xs">Sunset: {formatTime(weather.sunset)}</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard delay={0.6}>
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Info className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Condition</span>
          </div>
          <p className="text-lg font-medium text-white capitalize">{weather.description}</p>
          <p className="text-xs text-white/50">Currently {weather.condition} with visibility of 10km.</p>
        </div>
      </GlassCard>
    </div>
  );
}
