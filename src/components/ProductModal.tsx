'use client';
import React from 'react';
import Image from 'next/image';
import { Supplement } from "@/constants/supplements";
import { X, ExternalLink, ShieldCheck, Leaf } from "lucide-react";
import { formatPartnerLink } from "@/utils/links";

interface Props {
    item: Supplement | null;
    onClose: () => void;
}

export const ProductModal = ({ item, onClose }: Props) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            {/* Overlay: темный фон с размытием */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:row animate-in zoom-in-95 duration-300 border border-green-100/20">

                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 bg-slate-100 hover:bg-green-100 text-slate-500 hover:text-green-600 rounded-full transition-all active:scale-90"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
                    {/* Левая часть: Изображение (Back) */}
                    <div className="md:w-1/2 bg-slate-50 p-8 flex flex-col items-center justify-center border-r border-slate-100 min-h-[300px]">
                        <div className="relative w-full aspect-square max-w-[350px] group cursor-zoom-in">
                            <Image
                                src={item.imageBack || item.imageFront}
                                alt={item.name}
                                fill
                                priority // Добавим приоритет, так как это важное окно
                                className="object-contain drop-shadow-2xl transition-transform duration-700 ease-in-out group-hover:scale-150"
                                sizes="(max-width: 768px) 100vw, 50vw" // <--- ДОБАВЛЯЕМ ЭТУ СТРОКУ
                            />
                        </div>
                        <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Supplement Facts & Ingredients
                        </p>
                    </div>

                    {/* Правая часть: Инфо */}
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <Leaf size={14} className="text-green-500" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-green-600">
                                    {item.category}
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                                {item.name}
                            </h2>
                            <div className="mt-4 flex items-center gap-4">
                                <span className="text-2xl font-black text-green-600">${item.price}</span>
                                <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-full uppercase">
                                    {item.servings} Servings
                                </span>
                            </div>
                        </div>

                        <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-10 italic">
                            {item.description || "Premium quality supplement meticulously tested for purity and potency. Perfect addition to your daily biohacking stack."}
                        </p>

                        <div className="space-y-4 mb-10">
                            <div className="flex items-center gap-3 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                    <ShieldCheck className="text-green-500" size={18} />
                                </div>
                                Quality Guaranteed
                            </div>
                        </div>

                        {/* Кнопка iHerb (Теперь в нашем стиле) */}
                        <a
                            href={formatPartnerLink(item.productUrl)}
                            target="_blank"
                            className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-green-600 shadow-xl shadow-slate-200 hover:shadow-green-200 transition-all duration-300 active:scale-[0.98]"
                        >
                            Full Product Info on iHerb
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};