/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertTriangle, Info } from 'lucide-react';
import { useWeather } from '../lib/WeatherContext';
import { motion, AnimatePresence } from 'motion/react';

export default function WeatherAlerts() {
  const { weather } = useWeather();
  if (!weather) return null;

  // Since OpenWeatherMap free tier doesn't always provide alerts, we'll show generic info or mock high-impact conditions
  const hasAlert = weather.windSpeed > 20 || weather.temp > 35 || weather.temp < 0;

  return (
    <AnimatePresence>
      {hasAlert && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 md:px-8 mb-6"
        >
          <div className="flex items-center gap-4 rounded-2xl bg-orange-500/20 border border-orange-500/40 p-4 backdrop-blur-md">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-orange-200 uppercase tracking-wider">Weather Warning</p>
              <p className="text-sm text-white/90">
                {weather.windSpeed > 20 ? 'Strong winds detected. Secure loose outdoor items.' : 
                 weather.temp > 35 ? 'Extreme heat advisory. Stay hydrated and avoid outdoor activities.' :
                 'Freezing temperatures expected. Protect sensitive plants and pipes.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
