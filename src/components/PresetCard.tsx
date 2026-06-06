'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PresetItem } from '@/constants/presets';

interface PresetCardProps {
    id: string;
    category: string;
    title: string;
    description: string;
    items: PresetItem[];
    setStackPreset: (presetItems: PresetItem[]) => void;
    setMode: (mode: 'custom' | 'editors') => void;
}

export const PresetCard = ({
    category,
    title,
    description,
    items,
    setStackPreset,
    setMode
}: PresetCardProps) => {
    return (
        <button
            onClick={() => {
                setStackPreset(items);
                setMode('custom');
            }}
            className="w-full text-left p-5 rounded-3xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group relative"
        >
            <div className="flex flex-col gap-2">
                <span className="w-fit text-[9px] font-black text-purple-500 bg-purple-100 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    {category}
                </span>
                <h4 className="font-black text-slate-900 text-sm tracking-tight">{title}</h4>
                <p className="text-[11px] leading-relaxed text-slate-500 font-medium line-clamp-2 italic">
                    "{description}"
                </p>
            </div>
            <div className="mt-4 flex items-center text-[10px] font-black text-purple-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                Select this stack <ArrowRight size={12} className="ml-1" />
            </div>
        </button>
    );
};