'use client';

import React from 'react';
import { ShoppingCart, ArrowRight, Wallet } from "lucide-react"; // Добавил Wallet для красоты
import { StackAnalytics } from "@/hooks/useStackBuilder"; // Импортируем тип

interface StackSummaryProps {
  totalPrice: number;
  selectedCount: number;
  generateLink: () => void;
  isSidebar?: boolean;
  analytics: StackAnalytics; // 1. Добавляем в интерфейс
}

export const StackSummary = ({
  totalPrice,
  selectedCount,
  generateLink,
  isSidebar,
  analytics, // 2. Получаем из пропсов
}: StackSummaryProps) => {

  if (selectedCount === 0) return null;

  const brandGreen = "bg-green-600 hover:bg-green-700 shadow-green-200/50";

  // --- 1. ВАРИАНТ ДЛЯ САЙДБАРА ---
  if (isSidebar) {
    return (
      <div className="p-6 bg-white border-t border-gray-100 mt-auto">
        <div className="flex flex-col gap-4">
          {/* Верхний ряд: Общая цена и Цена в день */}
          <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Total Amount</p>
              <span className="text-2xl font-black text-slate-900 leading-none">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col items-end border-l border-slate-200 pl-4">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1 leading-none">
                Per Day
              </span>
              <span className="text-lg font-bold text-emerald-600 leading-none">
                ${analytics.dailyCost.toFixed(2)}
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

  // --- 2. ВАРИАНТ ДЛЯ МОБИЛОК ---
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] z-[100] xl:hidden animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white shadow-[0_15px_50px_rgba(0,0,0,0.12)] rounded-[2rem] p-1.5 pl-5 flex items-center justify-between gap-3 border border-gray-50">

        <div className="flex gap-4">
          <div className="flex flex-col">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Total
            </p>
            <p className="text-base font-black text-slate-900 leading-none">
              ${totalPrice.toFixed(2)}
            </p>
          </div>

          {/* Добавил цену в день и на мобилки, это важно для конверсии */}
          <div className="flex flex-col border-l border-slate-100 pl-3">
            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest leading-none mb-1">
              /Day
            </p>
            <p className="text-base font-bold text-emerald-600 leading-none">
              ${analytics.dailyCost.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          onClick={generateLink}
          className={`${brandGreen} text-white h-12 px-5 rounded-[1.4rem] font-bold text-[12px] uppercase tracking-wider active:scale-95 flex items-center gap-2 shadow-md`}
        >
          <ShoppingCart size={16} strokeWidth={2.5} />
          <span>Order</span>
        </button>
      </div>
    </div>
  );
};