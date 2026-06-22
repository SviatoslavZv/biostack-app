'use client';
import { useState } from 'react';
import { Supplement } from '@/constants/supplements';
import { EfficiencyPenalty } from '@/hooks/useStackBuilder';
import { EfficiencyAuditModal } from './EfficiencyAuditModal';
import { OptimizationSuggestion } from '@/utils/stackLogic';

interface OptimizationProgressProps {
  efficiency: number;
  selectedCount: number;
  penalties: EfficiencyPenalty[];
  onAddSupplement: (id: string, delta: number) => void;
  allSupplements: Supplement[];
  cart: Array<{ id: string; count: number }>;
  optimizations: OptimizationSuggestion[];
  onReplace: (oldId: string, newId: string, newCount: number) => void;
}

export const OptimizationProgress = ({
  efficiency,
  selectedCount,
  penalties,
  onAddSupplement,
  allSupplements,
  cart,
  optimizations,
  onReplace,
}: OptimizationProgressProps) => {
  const isEmpty = selectedCount === 0;
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  const getTextColor = () => {
    if (isEmpty) return 'text-slate-400';
    if (efficiency === 100) return 'text-emerald-500';
    if (efficiency <= 60) return 'text-rose-500';
    return 'text-amber-500';
  };

  const getProgressGradient = () => {
    if (isEmpty) return 'bg-slate-200';
    if (efficiency === 100) return 'bg-gradient-to-r from-emerald-600 to-green-400';
    if (efficiency <= 60) return 'bg-gradient-to-r from-rose-500 to-orange-400';
    return 'bg-gradient-to-r from-amber-500 to-yellow-400';
  };

  return (
    <>
      <div
        onClick={() => !isEmpty && setIsAuditOpen(true)}
        role={isEmpty ? undefined : "button"}
        tabIndex={isEmpty ? undefined : 0}
        className={`space-y-2 select-none ${isEmpty
          ? 'cursor-not-allowed'
          : 'cursor-pointer group/progress p-1 -mx-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300'
          }`}
      >
        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
          <span className="transition-colors group-hover/progress:text-slate-600">
            {isEmpty ? 'Stack Efficiency' : 'Stack Efficiency • Review →'}
          </span>
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

      <EfficiencyAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        efficiency={efficiency}
        penalties={penalties}
        onAddSupplement={onAddSupplement}
        allSupplements={allSupplements}
        cart={cart}
        optimizations={optimizations}
        onReplace={onReplace}
      />
    </>
  );
};