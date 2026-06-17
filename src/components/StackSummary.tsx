'use client';

import { useRef } from 'react';
import { ShoppingCart, ArrowRight, Wallet, Share2 } from "lucide-react";
import { StackAnalytics } from "@/hooks/useStackBuilder"; // Импортируем тип

interface StackSummaryProps {
  totalPrice: number;
  selectedCount: number;
  generateLink: () => void;
  isSidebar?: boolean;
  analytics: StackAnalytics;
  onShare: (anchorRect: DOMRect) => void; // теперь передаёт координаты
}

export const StackSummary = ({
  totalPrice,
  selectedCount,
  generateLink,
  isSidebar,
  analytics,
  onShare,
}: StackSummaryProps) => {

  const shareButtonRef = useRef<HTMLButtonElement>(null);

  if (selectedCount === 0) return null;

  const brandGreen = "bg-green-600 hover:bg-green-700 shadow-green-200/50";

  // --- 1. ВАРИАНТ ДЛЯ САЙДБАРА ---
  if (isSidebar) {
    return (
      <div className="p-6 bg-white border-t border-gray-100 mt-auto">
        <div className="flex flex-col gap-3">
          {/* Единый ряд: Total / Per Day / Duration */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">

            <div className="flex flex-col">
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1 leading-none">
                Total
              </p>
              <span className="flex items-center gap-1.5 text-xl font-black text-slate-900 leading-none">
                <Wallet size={16} className="text-emerald-600" />
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col border-l border-slate-200 pl-2">
              <span className="text-[9px] text-emerald-600 uppercase font-bold tracking-widest mb-1 leading-none">
                Per Day
              </span>
              <span className="text-lg font-bold text-emerald-600 leading-none">
                ${analytics.dailyCost.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col border-l border-slate-200 pl-2">
              <span className="text-[9px] text-emerald-600 uppercase font-bold tracking-widest mb-1 leading-none">
                Duration
              </span>
              <span className="text-lg font-bold text-emerald-600 leading-none">
                {analytics.durationDays}<span className="text-xs">days</span>
              </span>
            </div>
          </div>

          {/* Ряд с кнопками: Order (основная) + Share (вторичная) */}
          <div className="flex gap-2">
            <button
              onClick={generateLink}
              className={`flex-1 ${brandGreen} text-white py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] transition-all active:scale-[0.96] shadow-xl flex items-center justify-center gap-2 group`}
            >
              <span>Order on iHerb</span>
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              ref={shareButtonRef}
              onClick={() => {
                if (shareButtonRef.current) {
                  onShare(shareButtonRef.current.getBoundingClientRect());
                }
              }}
              className="shrink-0 w-14 bg-green-50 hover:bg-green-600 text-green-600 hover:text-white border-2 border-green-500 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center"
              title="Share this stack"
            >
              <Share2 size={22} />
            </button>
          </div>

          {/* Юридическая пометка о согласии с условиями использования */}
          <p className="text-[12px] text-slate-700 text-center leading-snug px-2">
            By proceeding, you confirm you&apos;ve read and agree to our{' '}
            <span className="font-semibold text-slate-500">Medical Disclaimer & Terms</span>.
          </p>
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