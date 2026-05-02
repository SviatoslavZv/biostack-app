'use client';

import React from 'react';
import { ShoppingCart, ArrowRight } from "lucide-react";

interface StackSummaryProps {
  totalPrice: number;
  selectedCount: number;
  generateLink: () => void; 
  isSidebar?: boolean;
}

export const StackSummary = ({ 
  totalPrice, 
  selectedCount, 
  generateLink, 
  isSidebar 
}: StackSummaryProps) => {
  
  if (selectedCount === 0) return null;

  const brandGreen = "bg-green-600 hover:bg-green-700 shadow-green-200/50";

  // --- 1. ВАРИАНТ ДЛЯ САЙДБАРА (Десктоп) ---
  if (isSidebar) {
    return (
      <div className="p-6 bg-white border-t border-gray-100 mt-auto">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Total Amount</p>
              <span className="text-3xl font-black text-slate-900 leading-none">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <button 
            onClick={generateLink}
            className={`w-full ${brandGreen} text-white py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.15em] transition-all active:scale-[0.96] shadow-xl flex items-center justify-center gap-3 group`}
          >
            <span>Order Stack on iHerb</span>
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // --- 2. ВАРИАНТ ДЛЯ МОБИЛОК (Плавающая панель) ---
  return (
    /* ВАЖНО: добавил xl:hidden, чтобы она исчезала на десктопе */
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[380px] z-[100] xl:hidden animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white shadow-[0_15px_50px_rgba(0,0,0,0.12)] rounded-[2rem] p-1.5 pl-5 flex items-center justify-between gap-3 border border-gray-50">
        
        <div className="flex flex-col">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
            Total
          </p>
          <p className="text-lg font-black text-slate-900 leading-none">
            ${totalPrice.toFixed(2)}
          </p>
        </div>
        
        <button 
          onClick={generateLink}
          /* Уменьшил padding и высоту кнопки: h-12 вместо h-14 */
          className={`${brandGreen} text-white h-12 px-5 rounded-[1.4rem] font-bold text-[12px] uppercase tracking-wider active:scale-95 flex items-center gap-2 shadow-md`}
        >
          <ShoppingCart size={16} strokeWidth={2.5} />
          <span>Order on iHerb</span>
        </button>
      </div>
    </div>
  );
};