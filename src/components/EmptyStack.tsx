'use client';
import { Layers, Tag, RotateCcw } from 'lucide-react';

export const EmptyStack = () => {
    return (
        <div className="flex flex-col items-center justify-center py-0.5 md:py-8 px-4 animate-fade-in-up">

            {/* Иконка */}
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl flex items-center justify-center mb-3 md:mb-5 border border-green-100 shadow-inner">
                <Layers className="text-green-400 w-8 h-8 lg:w-10 lg:h-10 animate-pulse" />
            </div>

            {/* Заголовок */}
            <h3 className="text-lg lg:text-xl font-black text-slate-900 mb-0.5 md:mb-1 tracking-tight">
                Your stack is empty
            </h3>

            {/* Подзаголовок */}
            <p className="text-slate-500 text-[11px] xl:text-sm mb-3 md:mb-6 text-center font-medium md:font-semibold leading-relaxed max-w-[220px]">
                Browse the catalog and add supplements to build your personalized stack.
            </p>

            {/* Инфо-блоки */}
            <div className="w-full max-w-[260px] space-y-2.5">

                {/* Скидки */}
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                    <div className="p-1.5 bg-emerald-100 rounded-lg shrink-0 mt-0.5">
                        <Tag size={12} className="text-emerald-600" />
                    </div>
                    <p className="text-xs lg:text-sm text-emerald-800 font-medium leading-relaxed">
                        Any active iHerb promotions on your selected items will be applied
                        <strong className="font-black"> automatically</strong> at checkout.
                    </p>
                </div>

                {/* Отмена заказа */}
                <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3">
                    <div className="p-1.5 bg-slate-100 rounded-lg shrink-0 mt-0.5">
                        <RotateCcw size={12} className="text-slate-500" />
                    </div>
                    <p className="text-xs lg:text-sm text-slate-600 font-medium leading-relaxed">
                        You can modify or cancel your order at
                        <strong className="font-black"> any stage</strong> of the checkout process on iHerb.
                    </p>
                </div>

            </div>
        </div >
    );
};