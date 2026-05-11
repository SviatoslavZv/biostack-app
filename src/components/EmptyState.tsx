'use client';
import React from 'react';
import { Search, RefreshCcw } from 'lucide-react';

interface Props {
    title: string;
    description: string;
    onReset: () => void;
}

export const EmptyState = ({ title, description, onReset }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50">
                <Search className="text-green-600" size={32} />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
                {title}
            </h3>

            <p className="text-slate-500 max-w-[300px] mb-8 leading-relaxed">
                {description}
            </p>

            <button
                onClick={onReset}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-green-100"
            >
                <RefreshCcw size={14} />
                Reset Filters
            </button>
        </div>
    );
};