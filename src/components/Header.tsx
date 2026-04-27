import { ShoppingBag, Zap } from "lucide-react";

export const Header = ({ totalCount, totalPrice }: { totalCount: number; totalPrice: number }) => {
  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-md border border-gray-100 p-4 rounded-[2rem] shadow-sm">
        
        {/* Логотип */}
        <div className="flex items-center gap-2 px-4">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-100">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            Bio<span className="text-green-600">Stack</span>
          </span>
        </div>

        {/* Индикатор корзины / Стека */}
        <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <div className="px-4 py-2 text-right hidden sm:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Stack</p>
            <p className="text-sm font-black text-slate-900">${totalPrice.toFixed(2)}</p>
          </div>
          
          <div className="relative group">
            <button className="bg-green-600 text-white p-4 rounded-xl shadow-lg shadow-green-100 transition-transform active:scale-95">
              <ShoppingBag size={20} />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};