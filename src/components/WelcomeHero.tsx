'use client';
import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export const WelcomeHero = () => {
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window === 'undefined') return false;
        const isHidden = localStorage.getItem('biostack_hero_hidden');
        return isHidden !== 'true';
    });

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('biostack_hero_hidden', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-50/60 via-emerald-50/40 to-white p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-500">

            <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Close welcome banner"
            >
                <X size={16} />
            </button>

            <div className="flex items-start gap-4 max-w-3xl">
                <div className="p-3 bg-green-600 rounded-2xl text-white shadow-md shadow-green-200 shrink-0 hidden sm:block">
                    <Sparkles size={20} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                        Welcome to BioStack Builder! ⚡️
                    </h2>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                        A free, interactive supplement calculator designed to streamline your wellness routine.
                        Build custom ingredient stacks, automatically track course durations, monitor daily costs,
                        and optimize your budget without any hidden fees. Simply select products from the catalog below,
                        and the system will calculate efficiency and generate your iHerb cart instantly.
                    </p>
                </div>
            </div>
        </div>
    );
};