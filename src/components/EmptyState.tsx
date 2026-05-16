'use client';
import React from 'react';
import { SearchX, RefreshCcw } from "lucide-react";

interface Props {
    title: string;
    description: string;
    onReset: () => void;
}

export const EmptyState = ({ title, description, onReset }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in duration-500">
            {/* Иконка с мягким фоном */}
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                <SearchX className="text-slate-300 w-10 h-10" />
            </div>

            {/* Текстовый блок */}
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                {title}
            </h3>
            <p className="text-slate-500 text-sm mb-8 max-w-[250px] text-center font-medium leading-relaxed">
                {description}
            </p>

            {/* Кнопка сброса */}
            <button
                onClick={onReset}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-green-500 hover:text-green-600 transition-all active:scale-95 shadow-sm"
            >
                <RefreshCcw size={14} strokeWidth={3} />
                Reset Filters
            </button>
        </div>
    );
};