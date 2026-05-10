/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function GlassCard({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-xl",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent -z-10" />
      {children}
    </motion.div>
  );
}
