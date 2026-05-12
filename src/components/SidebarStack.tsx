'use client';

import React from 'react';
import { Wallet, Clock, Trash2, Plus, Minus } from 'lucide-react';
import { StackSummary } from './StackSummary';
import { StackBuilderHook } from '@/hooks/useStackBuilder';

interface SidebarStackProps {
  builder: StackBuilderHook;
  generateLink: () => void;
}

export const SidebarStack = ({ builder, generateLink }: SidebarStackProps) => {
  // 1. Распаковываем всё нужное из билдера прямо здесь
  // Проверка на случай, если builder все еще не пришел (защита от краша)
  if (!builder) return null;

  const {
    cart,
    allSupplements,
    updateQuantity,
    totalPrice,
    analytics,
    selectedIds
  } = builder;

  if (selectedIds.length === 0) {
    return (
      <aside className="w-96 border-l bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-50 p-8 rounded-full mb-4">
          <Clock size={40} className="text-slate-300" />
        </div>
        <p className="text-slate-400 font-medium">Your stack is empty</p>
        <p className="text-xs text-slate-300 mt-2">Add some supplements to start analysis</p>
      </aside>
    );
  }

  return (
    <aside className="w-96 border-l bg-white flex flex-col h-screen sticky top-0 shadow-xl">
      <div className="p-6 border-b">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Your Stack</h2>
      </div>

      {/* Список товаров */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {cart.map((item) => {
          const product = allSupplements.find((s) => s.id === item.id);
          if (!product) return null;

          return (
            <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <img src={product.imageFront} alt={product.name} className="w-12 h-12 object-contain" />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                <p className="text-[10px] text-slate-400">{product.brand}</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-red-500"><Minus size={14} /></button>
                <span className="text-xs font-bold w-4 text-center">{item.count}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-green-500"><Plus size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Футер с аналитикой */}
      <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-4">

        {/* Блок аналитики */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Daily Cost</span>
            </div>
            <span className="text-sm font-black text-slate-900">${analytics.dailyCost.toFixed(2)}</span>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Duration</span>
            </div>
            <span className="text-sm font-black text-slate-900">{analytics.durationDays} days</span>
          </div>
        </div>

        {/* Финальная кнопка и цена */}
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