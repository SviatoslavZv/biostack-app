'use client';
import React from 'react';
import { Wallet, Clock, Zap, Layout, Star, ArrowRight } from 'lucide-react';
import { StackSummary } from './StackSummary';
import { StackBuilderHook } from '@/hooks/useStackBuilder';
import { STACK_PRESETS } from '@/constants/presets';

interface SidebarStackProps {
  builder: StackBuilderHook;
  generateLink: () => void;
  mode: 'custom' | 'editors';
  setMode: (mode: 'custom' | 'editors') => void;
}

export const SidebarStack = ({ builder, generateLink, mode, setMode }: SidebarStackProps) => {
  if (!builder) return null;

  const {
    cart,
    allSupplements,
    updateQuantity,
    totalPrice,
    analytics,
    selectedIds,
    setStackPreset,
    activeCategory
  } = builder;

  return (
    <aside className="hidden md:flex w-96 border-l bg-white flex-col h-screen sticky top-0 shadow-xl z-20">

      {/* ШАПКА: Навигация и прогресс */}
      <div className="p-6 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 italic tracking-tight">Your Stack</h2>

          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setMode('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${mode === 'custom' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
                }`}
            >
              <Layout size={14} /> Custom
            </button>
            <button
              onClick={() => setMode('editors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${mode === 'editors' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500'
                }`}
            >
              <Star size={14} /> Editors
            </button>
          </div>
        </div>

        {/* Прогресс-бар активен только в режиме Custom */}
        {mode === 'custom' && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <span>Stack Efficiency</span>
              <span>{Math.min(selectedIds.length * 20, 100)}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
                style={{ width: `${Math.min(selectedIds.length * 20, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* --- РЕЖИМ CUSTOM --- */}
        {mode === 'custom' && (
          <div className="space-y-4">
            {selectedIds.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-center space-y-3 opacity-50">
                <Zap size={24} className="text-slate-300" />
                <p className="text-xs font-bold uppercase tracking-tighter text-slate-400">
                  Stack is empty
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const product = allSupplements.find((s) => s.id === item.id);
                if (!product) return null;
                return (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-blue-200 transition-all group">
                    <div className="w-10 h-10 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <img src={product.imageFront} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[10px] font-black text-slate-800 truncate uppercase tracking-tight">{product.name}</h4>
                      <p className="text-[9px] text-slate-400 font-bold">{product.brand}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 font-bold">-</button>
                      <span className="text-[10px] font-black w-3 text-center text-slate-700">{item.count}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-green-500 font-bold">+</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* --- РЕЖИМ EDITORS (С фильтрацией) --- */}
        {mode === 'editors' && (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">
              {activeCategory === 'All' ? 'Expert Curated Stacks' : `${activeCategory} Solutions`}
            </p>

            {(() => {
              const filteredPresets = STACK_PRESETS.filter(p =>
                activeCategory === 'All' || p.category === activeCategory
              );

              if (filteredPresets.length === 0) {
                return (
                  <div className="py-20 flex flex-col items-center text-center space-y-3 opacity-40">
                    <Star size={24} className="text-slate-300" />
                    <p className="text-xs font-bold uppercase tracking-tighter">
                      No presets for {activeCategory}
                    </p>
                  </div>
                );
              }

              return filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setStackPreset(preset.items);
                    setMode('custom');
                  }}
                  className="w-full text-left p-5 rounded-3xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group relative"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-purple-500 bg-purple-100 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        {preset.category}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm tracking-tight">{preset.title}</h4>
                    <p className="text-[11px] leading-relaxed text-slate-500 font-medium line-clamp-2 italic">
                      "{preset.description}"
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-[10px] font-black text-purple-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    Select this stack <ArrowRight size={12} className="ml-1" />
                  </div>
                </button>
              ));
            })()}
          </div>
        )}
      </div>

      {/* ФУТЕР С АНАЛИТИКОЙ */}
      <div className="p-6 bg-slate-50/80 border-t border-slate-100 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={14} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter font-sans">Daily Cost</span>
            </div>
            <div className="text-sm font-black text-slate-900">
              ${analytics.dailyCost.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-blue-500" />
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter font-sans">Duration</span>
            </div>
            <div className="text-sm font-black text-slate-900">
              {analytics.durationDays} days
            </div>
          </div>
        </div>

        <StackSummary
          totalPrice={totalPrice}
          selectedCount={selectedIds.length}
          generateLink={generateLink}
          analytics={analytics}
          isSidebar={true}
        />
      </div>
    </aside>
  );
};