'use client';

import React from 'react';
import Image from 'next/image';
import { Supplement } from "@/constants/supplements";
import { Trash2, Plus, Minus, CheckCircle2 } from "lucide-react";
import { StackSummary } from "./StackSummary";

interface CartItem {
  id: string;
  count: number;
}

interface Props {
  mode: 'custom' | 'editors';
  setMode: (mode: 'custom' | 'editors') => void;
  selectedItems: Supplement[];
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  totalPrice: number;
  generateLink: () => void;
}

export const SidebarStack = ({
  mode, setMode, selectedItems, cart, onUpdateQuantity, totalPrice, generateLink 
}: Props) => {
  
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
            className={`flex-1 z-10 py-2.5 rounded-[1.1rem] text-[11px] font-black uppercase tracking-tighter transition-all ${
              mode === 'custom' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            My Stack
          </button>
          <button 
            onClick={() => setMode('editors')}
            className={`flex-1 z-10 py-2.5 rounded-[1.1rem] text-[11px] font-black uppercase tracking-tighter transition-all ${
              mode === 'editors' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Editor's Choice
          </button>
        </div>
      </div>

      {/* 3. ДИНАМИЧЕСКИЙ КОНТЕНТ */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 no-scrollbar">
        {mode === 'custom' ? (
          /* РЕЖИМ: МОЙ СТЭК */
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
          /* РЕЖИМ: ВЫБОР РЕДАКЦИИ */
          <div className="space-y-4 p-2 text-center py-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
               <CheckCircle2 size={24} />
            </div>
            <p className="text-[13px] font-black text-slate-900 uppercase">Expert Presets</p>
            <p className="text-[11px] text-slate-400 leading-relaxed font-bold italic">
               Ready-made stacks for your specific goals.<br/>Coming soon.
            </p>
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