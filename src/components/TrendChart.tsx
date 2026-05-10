/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { useWeather } from '../lib/WeatherContext';
import GlassCard from './GlassCard';
import { TrendingUp } from 'lucide-react';

export default function TrendChart() {
  const { weather } = useWeather();
  if (!weather) return null;

  const data = weather.hourly.slice(0, 12);

  return (
    <GlassCard className="h-[300px]" delay={0.9}>
      <div className="flex items-center gap-2 mb-6 text-white/50">
        <TrendingUp className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Temperature Trend (12h)</span>
      </div>
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.4)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              interval={1}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
