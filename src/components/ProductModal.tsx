'use client';
import React from 'react';
import Image from 'next/image';
import { Supplement } from "@/constants/supplements";
import { X, ExternalLink, ShieldCheck, Leaf, Sparkles, Box, Share2 } from "lucide-react";
import { formatPartnerLink } from "@/utils/links";

interface Props {
    item: Supplement | null;
    onClose: () => void;
    onShare: (productUrl: string, productName: string, rect: DOMRect) => void;
}

export const ProductModal = ({ item, onClose, onShare }: Props) => {
    const [isFlipped, setIsFlipped] = React.useState(false);
    React.useEffect(() => {
        setIsFlipped(false);
    }, [item?.id]);
    if (!item) return null;

    const duration = item.servings && item.suggestedDaily
        ? Math.floor(item.servings / item.suggestedDaily)
        : null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            {/* Overlay: темный фон с размытием */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] md:h-[580px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-slate-100 ">

                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 p-2 bg-white/80 backdrop-blur-sm hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full shadow-sm border border-slate-100 transition-all active:scale-90 cursor-pointer"
                >
                    <X size={18} />
                </button>

                {/* Контейнер-сетка: жестко h-full на десктопе */}
                <div className="flex flex-col md:flex-row h-full w-full min-h-0">

                    {/* ЛЕВАЯ ЧАСТЬ */}
                    <div
                        className="w-full md:w-1/2 h-[220px] md:h-full bg-white relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center cursor-pointer"
                        onClick={() => setIsFlipped(prev => !prev)}
                    >
                        {/* ФРОНТАЛЬНОЕ ИЗОБРАЖЕНИЕ */}
                        <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${isFlipped ? 'opacity-0 scale-x-0 scale-y-95' : 'opacity-100 scale-x-100 scale-y-100'} flex items-center justify-center p-4`}>
                            <Image
                                src={item.imageFront}
                                alt={`${item.name} Front`}
                                fill
                                priority
                                className="object-contain drop-shadow-2xl scale-90"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        {/* ЗАДНЕЕ ИЗОБРАЖЕНИЕ */}
                        <div className={`absolute inset-0 transition-all duration-500 ease-out delay-75 ${isFlipped ? 'opacity-100 scale-x-[1.55] scale-y-[1.55]' : 'opacity-0 scale-x-0 scale-y-105'} flex items-center justify-center z-10 p-2`}>
                            <Image
                                src={item.imageBack || item.imageFront}
                                alt={`${item.name} Ingredients`}
                                fill
                                className="object-contain drop-shadow-2xl"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        {/* ПОДСКАЗКА */}
                        <div className={`absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 text-[8px] md:text-[9px] font-black text-emerald-500 md:text-slate-400 uppercase tracking-widest pointer-events-none transition-opacity duration-300 z-0 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                            Tap to view Facts 🔍
                        </div>
                    </div>



                    {/* ПРАВАЯ ЧАСТЬ: Независимый аккуратный скролл контента */}
                    <div className="w-full md:w-1/2 h-full p-5 md:p-12 flex flex-col justify-between overflow-y-auto bg-white custom-scrollbar">

                        <div>
                            {/* Категория и Бренд */}
                            <div className="flex items-center justify-between gap-2 mb-2 md:mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Leaf size={12} className="text-green-500" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-green-600">
                                        {item.category}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {item.brand}
                                </span>
                            </div>

                            {/* Название */}
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tight">
                                {item.name}
                            </h2>

                            {/* Цена и порции */}
                            <div className="mt-2 md:mt-4 flex items-center gap-3 border-b border-slate-100 pb-3 md:pb-5">
                                <span className="text-2xl font-black text-slate-900">${item.price.toFixed(2)}</span>
                                <div className="h-4 w-px bg-slate-200" />
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg uppercase border border-emerald-100">
                                    {item.servings} Servings
                                </span>
                                <button
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        onShare(item.productUrl, item.name, rect);
                                    }}
                                    className="ml-auto p-2 bg-slate-50 hover:bg-green-50 text-slate-500 hover:text-green-600 border border-slate-100 hover:border-green-200 rounded-xl transition-all duration-300 active:scale-95"
                                    title="Share this product"
                                >
                                    <Share2 size={22} />
                                </button>
                            </div>

                            {/* СЕТКА С ПАРАМЕТРАМИ (Интерактивные карточки) */}
                            <div className="grid grid-cols-2 gap-3 my-3 md:my-6">

                                {/* Карточка: Pack Volume (Мягкий синий ховер) */}
                                <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 flex items-center gap-2.5 
                    transition-all duration-300 ease-in-out cursor-default
                    hover:bg-blue-50/60 hover:border-blue-200 group/volume">
                                    <Box size={16} className="text-blue-400 flex-shrink-0 transition-transform duration-300 group-hover/volume:scale-110" />
                                    <div className="text-[11px] leading-tight">
                                        <p className="text-slate-500 font-bold uppercase text-[7px] tracking-wider transition-colors duration-300 group-hover/volume:text-blue-400">Pack Volume</p>
                                        <p className="font-extrabold text-slate-700 mt-0.5 transition-colors duration-300 group-hover/volume:text-blue-900">{item.servings} Portions</p>
                                    </div>
                                </div>

                                {/* Карточка: Est. Supply (Мягкий янтарный ховер) */}
                                <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 flex items-center gap-2.5 
                    transition-all duration-300 ease-in-out cursor-default
                    hover:bg-amber-50/60 hover:border-amber-200 group/supply">
                                    <Sparkles size={16} className="text-amber-500 flex-shrink-0 transition-transform duration-300 group-hover/supply:scale-110 animate-pulse" />
                                    <div className="text-[12px] leading-tight">
                                        <p className="text-slate-600 font-bold uppercase text-[7px] tracking-wider transition-colors duration-300 group-hover/supply:text-amber-500">Est. Supply</p>
                                        <p className="font-extrabold text-slate-700 mt-0.5 transition-colors duration-300 group-hover/supply:text-amber-900">
                                            {duration ? `~${duration} Days` : 'Custom Take'}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Описание с интерактивным эффектом */}
                            <p className="text-slate-600 text-xs leading-relaxed mb-2 md:mb-6 italic bg-slate-50/40 p-3 md:p-4 rounded-xl border border-dashed border-slate-200 
              transition-all duration-300 ease-in-out
              hover:bg-green-50/50 hover:text-green-700 hover:border-green-300  cursor-default">
                                {`"${item.description || "Premium quality supplement meticulously tested for purity and potency. Perfect addition to your daily biohacking stack."}"`}
                            </p>
                        </div>

                        {/* НИЖНИЙ БЛОК */}
                        <div className="space-y-3 mt-2 md:mt-4">
                            <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                <ShieldCheck className="text-emerald-500" size={14} />
                                Third-Party Tested Purity
                            </div>

                            <a
                                href={formatPartnerLink(item.productUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-slate-900 hover:bg-green-600 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider shadow-lg shadow-slate-200 hover:shadow-green-100 transition-all duration-300 active:scale-[0.99]"
                            >
                                Full Product Info on iHerb
                                <ExternalLink size={10} />
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};