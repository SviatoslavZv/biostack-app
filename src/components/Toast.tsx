'use client';
import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export const Toast = ({ message, isVisible, onClose }: ToastProps) => {
    // Автоматически закрываем через 3 секунды
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    // Внутри Toast.tsx изменили блок return:

    return (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300 px-4 w-full max-w-fit">
            <div className="bg-slate-900/95 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-3 border border-white/10 ring-1 ring-green-500/30">
                <div className="bg-green-500/20 p-1 rounded-full">
                    <CheckCircle2 size={16} className="text-green-400" />
                </div>
                <span className="text-[13px] font-bold tracking-tight whitespace-nowrap">
                    {message}
                </span>
                <div className="w-[1px] h-4 bg-white/10 mx-1" /> {/* Разделитель */}
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <X size={14} className="text-slate-400" />
                </button>
            </div>
        </div>
    );
};