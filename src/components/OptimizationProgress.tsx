'use client';
import React from 'react';

interface OptimizationProgressProps {
  efficiency: number;
  selectedCount: number;
}

export const OptimizationProgress = ({ efficiency, selectedCount }: OptimizationProgressProps) => {
  const isEmpty = selectedCount === 0;

  // Динамически определяем цвет текста процентов
  const getTextColor = () => {
    if (isEmpty) return 'text-slate-400';
    if (efficiency === 100) return 'text-emerald-500';
    if (efficiency <= 60) return 'text-rose-500';
    return 'text-amber-500';
  };

  // Динамически определяем градиент полосы прогресса
  const getProgressGradient = () => {
    if (isEmpty) return 'bg-slate-200';
    if (efficiency === 100) return 'bg-gradient-to-r from-emerald-600 to-green-400';
    if (efficiency <= 60) return 'bg-gradient-to-r from-rose-500 to-orange-400';
    return 'bg-gradient-to-r from-amber-500 to-yellow-400';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
        <span>Stack Efficiency</span>
        <span className={`font-mono font-bold transition-colors duration-300 ${getTextColor()}`}>
          {isEmpty ? 0 : efficiency}%
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ease-out ${getProgressGradient()}`}
          style={{ width: `${isEmpty ? 0 : efficiency}%` }}
        />
      </div>
    </div>
  );
};