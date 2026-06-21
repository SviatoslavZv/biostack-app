'use client';

import { useRef } from 'react';
import { ArrowRight, Wallet, Share2 } from "lucide-react";
import { StackAnalytics } from "@/hooks/useStackBuilder"; // Импортируем тип

interface StackSummaryProps {
  totalPrice: number;
  selectedCount: number;
  generateLink: () => void;
  isSidebar?: boolean;
  analytics: StackAnalytics;
  onShare?: (anchorRect: DOMRect) => void; // теперь передаёт координаты
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

          <div className="grid grid-cols-[auto_1fr_1fr] gap-3 items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <span className="flex items-center gap-1.5 text-xl font-black text-slate-900 whitespace-nowrap">
              <Wallet size={18} className="text-emerald-600" />
              ${totalPrice.toFixed(2)}
            </span>

            <div className="flex flex-col border-l border-slate-200 pl-2">
              <span className="text-[9px] text-emerald-600 uppercase font-bold tracking-wide whitespace-nowrap">
                Per Day
              </span>
              <span className="text-sm font-bold text-emerald-600 whitespace-nowrap">
                ${analytics.dailyCost.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col border-l border-slate-200 pl-2">
              <span className="text-[9px] text-emerald-600 uppercase font-bold tracking-wide whitespace-nowrap">
                Duration
              </span>
              <span className="text-sm font-bold text-emerald-600 whitespace-nowrap">
                {analytics.durationDays}<span className="text-[10px]">d</span>
              </span>
            </div>
          </div>

          {/* Ряд с кнопками: Order (основная) + Share (вторичная) */}
          <div className="flex gap-2">
            <button
              onClick={generateLink}
              className={`flex-1 ${brandGreen} text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-wide transition-all active:scale-[0.96] shadow-xl flex items-center justify-center gap-1.5 group whitespace-nowrap`}
            >
              <span>Order on iHerb</span>
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              ref={shareButtonRef}
              onClick={() => {
                if (shareButtonRef.current && onShare) {
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
          <p className="text-[12px] text-slate-700 text-center leading-snug">
            By proceeding, you confirm you&apos;ve read and agree to our{' '}
            <span className="font-semibold text-slate-500">Medical Disclaimer & Terms</span>.
          </p>
        </div>
      </div>
    );
  }
};