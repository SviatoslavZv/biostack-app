'use client';

import { Home, Sparkles, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
    activeTab: 'home' | 'presets' | 'stack';
    setActiveTab: (tab: 'home' | 'presets' | 'stack') => void;
    stackCount: number;
}

export const BottomNav = ({ activeTab, setActiveTab, stackCount }: BottomNavProps) => {
    const tabs = [
        { id: 'home' as const, label: 'Home', icon: Home },
        { id: 'presets' as const, label: 'Presets', icon: Sparkles },
        { id: 'stack' as const, label: 'Stack', icon: ShoppingBag },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-around px-2 py-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors relative ${activeTab === id ? 'text-green-600' : 'text-slate-400'
                            }`}
                    >
                        <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">{label}</span>
                        {id === 'stack' && stackCount > 0 && (
                            <span className="absolute -top-0.5 right-1 bg-green-600 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                                {stackCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </nav>
    );
};