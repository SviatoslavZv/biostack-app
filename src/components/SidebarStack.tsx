'use client';

import { Layout, Star, Trash2 } from 'lucide-react';
import { StackSummary } from './StackSummary';
import { OptimizationProgress } from './OptimizationProgress';
import { StackBuilderHook } from '@/hooks/useStackBuilder';
import { Supplement } from '@/constants/supplements';
import { CartItemsList } from './CartItemsList';
import { PresetsList } from './PresetsList';
import { EmptyStack } from "@/components/EmptyStack";


interface SidebarStackProps {
  builder: StackBuilderHook;
  generateLink: () => void;
  mode: 'custom' | 'editors';
  setMode: (mode: 'custom' | 'editors') => void;
  onOpenDisclaimer: () => void;
  onOpenProductModal: (product: Supplement) => void;
  onShare: (anchorRect: DOMRect) => void;
}

export const SidebarStack = ({
  builder,
  generateLink,
  mode,
  setMode,
  onOpenDisclaimer,
  onOpenProductModal,
  onShare,
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
    activeCategory,
    replaceInCart,
  } = builder;

  return (
    <aside className="hidden md:flex flex-col w-72 lg:w-96 border-l bg-white sticky top-14 h-[calc(100vh-100px)] shadow-xl z-20">

      <div className="p-6 border-b space-y-4 shrink-0 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 italic tracking-tight">Your Stack</h2>

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
          <OptimizationProgress
            efficiency={analytics.efficiency}
            selectedCount={selectedIds.length}
            penalties={analytics.penalties}
            onAddSupplement={updateQuantity}
            allSupplements={allSupplements}
            cart={cart}
            optimizations={analytics.optimizations}
            onReplace={replaceInCart}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 min-h-0 custom-scrollbar overscroll-contain">

        {mode === 'custom' && (
          <div
            key={cart.length === 0 ? 'empty' : 'filled'}
            className="animate-fade-in-up"
          >
            {cart.length === 0
              ? <EmptyStack />
              : <CartItemsList
                cart={cart}
                allSupplements={allSupplements}
                updateQuantity={updateQuantity}
                onOpenProductModal={onOpenProductModal}
              />
            }
          </div>
        )}

        {mode === 'editors' && (
          <PresetsList
            activeCategory={activeCategory}
            setStackPreset={setStackPreset}
            onSelect={() => setMode('custom')}
          />
        )}
      </div>

      {cart.length > 0 && (
        <div className="px-5 pt-3 pb-0 bg-white border-t border-slate-100 shrink-0 animate-fade-in-up">
          <StackSummary
            totalPrice={totalPrice}
            selectedCount={selectedIds.length}
            generateLink={generateLink}
            analytics={analytics}
            isSidebar={true}
            onShare={onShare}
          />
        </div>
      )}
      <div className="px-5 py-3 bg-white border-t border-slate-100 shrink-0 text-center">
        <button
          onClick={onOpenDisclaimer}
          className="text-[15px] text-green-700 hover:text-green-600 font-semibold tracking-wide uppercase transition-colors underline-offset-4 hover:underline cursor-pointer"
        >
          Medical Disclaimer
        </button>
      </div>




    </aside>
  );
};