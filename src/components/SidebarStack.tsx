'use client';
import React from 'react';
import Image from 'next/image';
import { Wallet, Clock, Zap, Layout, Star, ArrowRight, Trash2, Info } from 'lucide-react';
import { StackSummary } from './StackSummary';
import { OptimizationProgress } from './OptimizationProgress'; // Импортируем новый компонент
import { StackBuilderHook } from '@/hooks/useStackBuilder';
import { STACK_PRESETS } from '@/constants/presets';
import { Supplement } from '@/constants/supplements';
import { CartProductCard } from './CartProductCard';
import { PresetCard } from './PresetCard';

interface SidebarStackProps {
  builder: StackBuilderHook;
  generateLink: () => void;
  mode: 'custom' | 'editors';
  setMode: (mode: 'custom' | 'editors') => void;
  onOpenDisclaimer: () => void;
  onOpenProductModal: (product: Supplement) => void;
}

export const SidebarStack = ({
  builder,
  generateLink,
  mode,
  setMode,
  onOpenDisclaimer,
  onOpenProductModal
}: SidebarStackProps) => {
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
    <aside className="hidden md:flex flex-col w-72 lg:w-96 border-l bg-white sticky top-24 h-[calc(100vh-100px)] shadow-xl z-20">

      {/* ШАПКА: Зафиксирована вверху */}
      <div className="p-6 border-b space-y-4 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 italic tracking-tight">Your Stack</h2>

          {/* КНОПКА СБРОСА */}
          {selectedIds.length > 0 && (
            <button
              onClick={() => builder.clearStack()}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors group"
              title="Clear all"
            >
              <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          )}

          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setMode('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${mode === 'custom' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500'
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

        {/* Аккуратный вызов нового компонента вместо громоздкой верстки */}
        {mode === 'custom' && (
          <OptimizationProgress
            efficiency={analytics.efficiency}
            selectedCount={selectedIds.length}
          />
        )}
      </div>

      {/* ОСНОВНОЙ КОНТЕНТ: Скролл-зона карточек */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0 custom-scrollbar overscroll-contain">

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
                  <CartProductCard
                    key={item.id}
                    id={item.id}
                    count={item.count}
                    product={product}
                    updateQuantity={updateQuantity}
                    onOpenProductModal={onOpenProductModal}
                  />
                );
              })
            )}
          </div>
        )}

        {/* --- РЕЖИМ EDITORS --- */}
        {mode === 'editors' && (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">
              {activeCategory === 'All' ? 'Expert Curated Stacks' : `${activeCategory} Solutions`}
            </p>

            {STACK_PRESETS.filter(p => activeCategory === 'All' || p.category === activeCategory).length === 0 ? (
              <div className="py-20 flex flex-col items-center text-center space-y-3 opacity-40">
                <Star size={24} className="text-slate-300" />
                <p className="text-xs font-bold uppercase tracking-tighter">No presets for {activeCategory}</p>
              </div>
            ) : (
              STACK_PRESETS
                .filter(p => activeCategory === 'All' || p.category === activeCategory)
                .map((preset) => (
                  <PresetCard
                    key={preset.id}
                    id={preset.id}
                    category={preset.category}
                    title={preset.title}
                    description={preset.description}
                    items={preset.items}
                    setStackPreset={setStackPreset}
                    setMode={setMode}
                  />
                ))
            )}
          </div>
        )}
      </div>

      {/* ФУТЕР С АНАЛИТИКОЙ: Зафиксирован внизу */}
      <div className="p-6 bg-slate-50/90 border-t border-slate-100 space-y-4 flex-shrink-0">
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

        {/* ЛИПКИЙ МИКРО-ДИСКЛЕЙМЕР */}
        <div className="text-center -mt-1">
          <button
            onClick={onOpenDisclaimer}
            className="text-[11px] text-slate-400 hover:text-green-600 font-semibold tracking-wide uppercase transition-colors underline-offset-4 hover:underline"
          >
            Medical Disclaimer
          </button>
        </div>

      </div>
    </aside>
  );
};