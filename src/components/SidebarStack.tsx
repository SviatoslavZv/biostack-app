'use client';
import React from 'react';
import Image from 'next/image';
import { Wallet, Clock, Zap, Layout, Star, ArrowRight, Trash2, Info } from 'lucide-react';
import { StackSummary } from './StackSummary';
import { StackBuilderHook } from '@/hooks/useStackBuilder';
import { STACK_PRESETS } from '@/constants/presets';
import { Supplement } from '@/constants/supplements';

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

        {mode === 'custom' && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <span>Stack Efficiency</span>
              <span>{Math.min(selectedIds.length * 20, 100)}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-700"
                style={{ width: `${Math.min(selectedIds.length * 20, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ОСНОВНОЙ КОНТЕНТ: Скролл-зона карточек */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0 custom-scrollbar">
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
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-green-200 transition-all group/card relative">

                    {/* ЛЕВАЯ ЧАСТЬ: Интерактивная зона товара (Клик = Модалка, Ховер = Тултип) */}
                    <button
                      onClick={() => onOpenProductModal(product)}
                      className="relative w-12 h-12 flex-shrink-0 group/tooltip bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 hover:border-blue-200 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-100"
                      title="View full details"
                    >
                      <Image
                        src={product.imageFront}
                        alt={product.name}
                        fill
                        className="object-contain p-1 group-hover/card:scale-105 transition-transform"
                        sizes="48px"
                      />

                      {/* Иконка "i" как визуальный маркер */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover/tooltip:text-blue-600 group-hover/tooltip:border-blue-100 transition-all z-10">
                        <Info size={10} />
                      </div>

                      {/* TOOLTIP: Всплывает вправо внутри карточки поверх текста */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-14 hidden group-hover/tooltip:block z-50 w-48 p-2.5 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl border border-slate-800 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />

                        <div className="space-y-1 font-medium text-left">
                          <div className="font-black border-b border-slate-800 pb-1 uppercase tracking-tight text-slate-400 flex justify-between">
                            <span>Stack Logic</span>
                            <span className="text-emerald-500 italic text-[9px]">Active</span>
                          </div>
                          <div className="flex justify-between gap-2 pt-0.5">
                            <span className="text-slate-400">Pack size:</span>
                            <span className="font-bold text-slate-200">{product.servings || 'N/A'} serv.</span>
                          </div>
                          {product.servings && product.suggestedDaily && (
                            <div className="flex justify-between border-t border-slate-800 pt-1 mt-1 font-bold">
                              <span className="text-slate-400">Duration:</span>
                              <span className="text-blue-400">~{Math.floor(product.servings / product.suggestedDaily)} days</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ: Название + Бренд + Цена */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-[10px] font-black text-slate-800 truncate uppercase tracking-tight leading-none mb-1 max-w-[110px] lg:max-w-[160px]">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 font-bold truncate max-w-[60px] lg:max-w-[95px]">{product.brand}</span>
                        <span className="text-[9px] text-emerald-600 font-black px-1.5 py-0.5 bg-emerald-50 rounded-md border border-emerald-100">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* ПРАВАЯ ЧАСТЬ: Управление количеством */}
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-100 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                      >
                        {item.count === 1 ? <Trash2 size={12} /> : <span className="font-black">-</span>}
                      </button>
                      <span className="text-[11px] font-black w-4 text-center text-slate-700">{item.count}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-green-600 transition-colors"
                      >
                        <span className="font-black">+</span>
                      </button>
                    </div>

                  </div>
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
                  <button
                    key={preset.id}
                    onClick={() => {
                      setStackPreset(preset.items);
                      setMode('custom');
                    }}
                    className="w-full text-left p-5 rounded-3xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group relative"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="w-fit text-[9px] font-black text-purple-500 bg-purple-100 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        {preset.category}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm tracking-tight">{preset.title}</h4>
                      <p className="text-[11px] leading-relaxed text-slate-500 font-medium line-clamp-2 italic">
                        "{preset.description}"
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-[10px] font-black text-purple-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                      Select this stack <ArrowRight size={12} className="ml-1" />
                    </div>
                  </button>
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