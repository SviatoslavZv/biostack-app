'use client';

import React from 'react';

interface Props {
  selectedCount: number;
}

export const OptimizationProgress = ({ selectedCount = 0 }: Props) => {
  const targetCount = 5;
  // Проверка на случай, если selectedCount придет некорректным
  const safeCount = typeof selectedCount === 'number' ? selectedCount : 0;
  const progress = Math.min((safeCount / targetCount) * 100, 100);

  const getStatus = () => {
    if (progress === 0) return "Empty Stack";
    if (progress < 40) return "Building";
    if (progress < 80) return "Optimizing";
    if (progress < 100) return "Advanced";
    return "Elite Stack";
  };

  return (
    <div className="w-full bg-white p-6 pb-2 rounded-t-[2.5rem]">
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1.5">
            Stack Status
          </p>
          <p className={`text-sm font-black uppercase tracking-wider leading-none ${progress === 100 ? 'text-green-600' : 'text-slate-900'}`}>
            {getStatus()}
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-slate-900 leading-none">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Жирная полоска прогресса */}
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200/50 shadow-inner">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            progress === 100 
            ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-[0_0_15px_rgba(22,163,74,0.5)]' 
            : 'bg-gradient-to-r from-green-400 to-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-2 px-1">
        <p className="text-[10px] font-bold text-slate-400 italic">
          {safeCount < 5 
            ? `Add ${5 - safeCount} more for optimal results` 
            : 'Perfectly balanced stack'}
        </p>
      </div>
    </div>
  );
};