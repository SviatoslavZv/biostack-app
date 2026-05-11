'use client';

import React from 'react';
import Image from 'next/image';
import { Supplement } from "@/constants/supplements";
import { Trash2, Plus, Minus, CheckCircle2, Sparkles } from "lucide-react";
import { StackSummary } from "./StackSummary";
import { STACK_PRESETS, PresetItem } from "@/constants/presets";

interface CartItem {
  id: string;
  count: number;
}

interface Props {
  mode: 'custom' | 'editors';
  setMode: (mode: 'custom' | 'editors') => void;
  setStackPreset: (items: PresetItem[], name: string) => void;
  selectedItems: Supplement[];
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  totalPrice: number;
  generateLink: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const SidebarStack = ({
  mode, setMode, setStackPreset, selectedItems, cart, onUpdateQuantity, totalPrice, generateLink, activeCategory, setActiveCategory
}: Props) => {
  // Фильтруем пресеты на основе выбранной категории
  const filteredPresets = STACK_PRESETS.filter(preset =>
    activeCategory === 'All' || preset.category === activeCategory
  );

  const progress = Math.min((selectedItems.length / 5) * 100, 100);

  return (
    <aside className="w-[380px] hidden xl:flex flex-col h-[calc(100vh-120px)] sticky top-[100px] bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm transition-all duration-500">

      {/* 1. ЕДИНАЯ ШАПКА: Прогресс и статус */}
      <div className="p-6 pb-4 bg-white">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Stack</h2>
            <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full font-black uppercase">
              {mode === 'custom' ? selectedItems.length : 'PRO'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
              {mode === 'custom' ? (progress === 100 ? 'Optimized' : 'Building') : 'Expert Choice'}
            </span>
          </div>
        </div>

        <div className="space-y-2 px-1">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out ${mode === 'custom' ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${mode === 'custom' ? progress : 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ */}
      <div className="px-6 mb-4">
        <div className="bg-slate-100 p-1 rounded-[1.4rem] flex relative">
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 z-10 py-2.5 rounded-[1.1rem] text-[11px] font-black uppercase tracking-tighter transition-all ${mode === 'custom' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            My Stack
          </button>
          <button
            onClick={() => setMode('editors')}
            className={`flex-1 z-10 py-2.5 rounded-[1.1rem] text-[11px] font-black uppercase tracking-tighter transition-all ${mode === 'editors' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            Editor's Choice
          </button>
        </div>
      </div>

      {/* 3. ДИНАМИЧЕСКИЙ КОНТЕНТ */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 no-scrollbar">
        {mode === 'custom' ? (
          /* РЕЖИМ: МОЙ СТЭК (Твой старый добрый код) */
          selectedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <Plus className="mb-2" size={24} />
              <p className="text-xs font-bold uppercase tracking-widest">Stack is empty</p>
            </div>
          ) : (
            selectedItems.map((item) => {
              const count = cart.find(c => c.id === item.id)?.count || 0;
              return (
                <div key={item.id} className="bg-white p-3 rounded-2xl border border-slate-50 shadow-sm hover:border-green-100 transition-all">
                  <div className="flex gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-slate-50">
                      <Image src={item.imageFront} alt={item.name} fill className="object-contain p-1" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-black text-slate-900 truncate">{item.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-0.5">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-xs hover:text-red-500 transition-colors">
                            {count <= 1 ? <Trash2 size={10} /> : <Minus size={10} />}
                          </button>
                          <span className="text-[10px] font-black w-3 text-center">{count}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-xs hover:text-green-500 transition-colors">
                            <Plus size={10} />
                          </button>
                        </div>
                        <span className="text-[12px] font-black text-slate-900">${(item.price * count).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )
        ) : (
          /* РЕЖИМ: ВЫБОР РЕДАКЦИИ (Новая магия здесь!) */
          <div className="space-y-4 p-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4 pl-2">
              <Sparkles size={12} className="text-blue-500" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Curated by BioStack
              </p>
            </div>

            {filteredPresets.map((preset) => (
              <div
                key={preset.id}
                className="group relative p-5 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-blue-200 transition-all shadow-sm"
              >
                <h4 className="text-[14px] font-black text-slate-900 mb-1">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                  {preset.description}
                </p>

                <button
                  onClick={() => {
                    setStackPreset(preset.items, preset.title);
                    setMode('custom');
                  }}
                  className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95"
                >
                  Apply This Stack
                </button>
              </div>
            ))}

            {/* Добавим проверку: если в этой категории нет пресетов */}
            {filteredPresets.length === 0 && (
              <div className="text-center py-12 px-6 animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={20} />
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  No {activeCategory} stacks yet
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('All'); // Сбрасываем фильтр на главном экране
                    // Можно оставить пользователя в пресетах или вернуть в My Stack
                  }}
                  className="text-[10px] font-black text-blue-500 uppercase border-b border-blue-200 pb-0.5 hover:text-blue-600 transition-all"
                >
                  Show all presets
                </button>
              </div>
            )}

          </div>
        )}
      </div>

      {/* 4. ПОДВАЛ С ИТОГОМ */}
      <StackSummary
        totalPrice={totalPrice}
        selectedCount={selectedItems.length}
        generateLink={generateLink}
        isSidebar={true}
      />
    </aside>
  );
};