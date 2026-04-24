'use client';

import { motion } from 'framer-motion';

export const Logo = ({ className = "w-10 h-10", iconOnly = false }: { className?: string, iconOnly?: boolean }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 5 }}
        className="relative shrink-0"
      >
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Shape */}
          <rect width="100" height="100" rx="24" fill="#0A2540" />
          
          {/* Stylized T / Flight Path */}
          <path 
            d="M30 35H70" 
            stroke="#FF6B00" 
            strokeWidth="8" 
            strokeLinecap="round" 
            className="logo-line-1"
          />
          <path 
            d="M50 35V75" 
            stroke="white" 
            strokeWidth="8" 
            strokeLinecap="round" 
            className="logo-line-2"
          />
          
          {/* Accent Dot / Flight Node */}
          <circle cx="70" cy="35" r="5" fill="white" />
          
          {/* Subtle Curve representing Global Connectivity */}
          <path 
            d="M30 65C30 65 50 80 70 65" 
            stroke="#FF6B00" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeDasharray="4 4"
          />
        </svg>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[#FF6B00]/20 blur-xl -z-10 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
      </motion.div>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-black tracking-tighter text-[#0A2540] uppercase">
            Travsify
          </span>
          <span className="text-[10px] font-black tracking-[0.3em] text-[#FF6B00] uppercase mt-0.5">
            NDC Engine
          </span>
        </div>
      )}
    </div>
  );
};
