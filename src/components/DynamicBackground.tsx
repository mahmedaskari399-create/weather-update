/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

interface Props {
  condition: string;
  isNight: boolean;
}

const backgrounds: Record<string, string> = {
  clear: 'bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-400',
  clouds: 'bg-gradient-to-br from-slate-400 via-slate-500 to-blue-300',
  rain: 'bg-gradient-to-br from-indigo-800 via-blue-900 to-slate-700',
  drizzle: 'bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-600',
  thunderstorm: 'bg-gradient-to-br from-gray-900 via-purple-950 to-slate-900',
  snow: 'bg-gradient-to-br from-blue-50 via-blue-100 to-slate-200',
  mist: 'bg-gradient-to-br from-gray-300 via-slate-400 to-gray-200',
  night: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-black',
};

export default function DynamicBackground({ condition, isNight }: Props) {
  const [bgClass, setBgClass] = useState(backgrounds.clear);

  useEffect(() => {
    if (isNight) {
      setBgClass(backgrounds.night);
      return;
    }

    const lower = condition.toLowerCase();
    if (lower.includes('clear')) setBgClass(backgrounds.clear);
    else if (lower.includes('cloud')) setBgClass(backgrounds.clouds);
    else if (lower.includes('rain')) setBgClass(backgrounds.rain);
    else if (lower.includes('drizzle')) setBgClass(backgrounds.drizzle);
    else if (lower.includes('thunder')) setBgClass(backgrounds.thunderstorm);
    else if (lower.includes('snow')) setBgClass(backgrounds.snow);
    else if (lower.includes('mist') || lower.includes('fog')) setBgClass(backgrounds.mist);
    else setBgClass(backgrounds.clear);
  }, [condition, isNight]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={bgClass}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className={cn("absolute inset-0 transition-all duration-1000", bgClass)}
        />
      </AnimatePresence>
      
      {/* Animated shapes for depth */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-32 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}
