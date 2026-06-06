'use client';
import React from 'react';
import Image from 'next/image';
import { Trash2, Info } from 'lucide-react';
import { Supplement } from '@/constants/supplements';

interface CartProductCardProps {
    id: string;
    count: number;
    product: Supplement;
    updateQuantity: (id: string, delta: number) => void;
    onOpenProductModal: (product: Supplement) => void;
}

export const CartProductCard = ({
    id,
    count,
    product,
    updateQuantity,
    onOpenProductModal
}: CartProductCardProps) => {
    return (
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-green-200 transition-all group/card relative">

            {/* ЛЕВАЯ ЧАСТЬ: Интерактивная зона товара (Клик = Модалка, Ховер = Тултип) */}
            <button
                onClick={() => onOpenProductModal(product)}
                className="relative w-12 h-12 flex-shrink-0 group/tooltip bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 hover:border-blue-200 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-100"
            >
                <Image
                    src={product.imageFront}
                    alt={product.name}
                    fill
                    className="object-contain p-1 group-hover/card:scale-105 transition-transform"
                    sizes="48px"
                />

                {/* Иконка "i" как визуальный маркер */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover/tooltip:text-blue-600 group-hover/tooltip:border-blue-100 transition-all z-10">
                    <Info size={10} />
                </div>

                {/* TOOLTIP: Всплывает вправо внутри карточки поверх текста */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 group-hover/tooltip:translate-x-14 z-50 w-48 p-2.5 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl border border-slate-800 transition-all duration-200 delay-200 ease-out">
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />

                    <div className="space-y-1 font-medium text-left">
                        <div className="font-black border-b border-slate-800 pb-1 uppercase tracking-tight text-slate-400 flex justify-between">
                            <span>Stack Logic</span>
                            <span className="text-emerald-500 italic text-[9px]">Active</span>
                        </div>
                        <div className="flex justify-between gap-2 pt-0.5">
                            <span className="text-slate-400">Pack size:</span>
                            <span className="font-bold text-slate-200">{product.servings || 'N/A'} serv.</span>
                        </div>
                        {product.servings && product.suggestedDaily && (
                            <div className="flex justify-between border-t border-slate-800 pt-1 mt-1 font-bold">
                                <span className="text-slate-400">Duration:</span>
                                <span className="text-blue-400">~{Math.floor(product.servings / product.suggestedDaily)} days</span>
                            </div>
                        )}
                    </div>
                </div>
            </button>

            {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ: Название + Бренд + Цена */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="text-[10px] font-black text-slate-800 truncate uppercase tracking-tight leading-none mb-1 max-w-[110px] lg:max-w-[160px]">
                    {product.name}
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 font-bold truncate max-w-[60px] lg:max-w-[95px]">
                        {product.brand}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-black px-1.5 py-0.5 bg-emerald-50 rounded-md border border-emerald-100">
                        ${product.price.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* ПРАВАЯ ЧАСТЬ: Управление количеством */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-100 flex-shrink-0">
                <button
                    onClick={() => updateQuantity(id, -1)}
                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                >
                    {count === 1 ? <Trash2 size={12} /> : <span className="font-black">-</span>}
                </button>
                <span className="text-[11px] font-black w-4 text-center text-slate-700">{count}</span>
                <button
                    onClick={() => updateQuantity(id, 1)}
                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-green-600 transition-colors"
                >
                    <span className="font-black">+</span>
                </button>
            </div>

        </div>
    );
};