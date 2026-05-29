'use client'; // Указываем, что это клиентский компонент, так как есть интерактив взаимодействия с UI

import React from 'react';
import { ShieldAlert, Scale, X } from 'lucide-react'; // Импортируем аккуратные иконки

// Описываем интерфейс пропсов (Props), которые наш компонент ожидает получить от родителя
interface DisclaimerModalProps {
    isOpen: boolean;       // Флаг: true — модалка видна, false — скрыта
    onClose: () => void;   // Функция, которую нужно вызвать для закрытия модалки
}

export const DisclaimerModal = ({ isOpen, onClose }: DisclaimerModalProps) => {
    // Если родитель передал isOpen: false, компонент просто ничего не рендерит
    if (!isOpen) return null;

    return (
        // ХЕНДЛЕР ОВЕРЛЕЯ: Если пользователь кликнет на затемненный фон вокруг модалки, она закроется
        <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
            {/* КОНТЕНТНОЕ ОКНО: StopPropagation отменяет всплытие события клика, чтобы при нажатии 
          внутри самого окна модалка случайно не закрывалась */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden"
            >
                {/* Яркая предупреждающая полоса на самом верху карточки */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 to-orange-500" />

                {/* КНОПКА-КРЕСТИК ДЛЯ ЗАКРЫТИЯ */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                    aria-label="Close modal"
                >
                    <X size={16} />
                </button>

                {/* ЗАГОЛОВОК ОКНА */}
                <div className="flex items-center gap-3 text-amber-600">
                    <div className="p-2 bg-amber-50 rounded-xl">
                        <ShieldAlert size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Medical Disclaimer</h3>
                </div>

                {/* ЮРИДИЧЕСКИЙ ТЕКСТ НА АНГЛИЙСКОМ */}
                <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                    <p>
                        <strong>Important:</strong> The <strong>BioStack</strong> application is not a substitute for professional medical advice,
                        diagnosis, or treatment. All technical data provided in this database (such as dosages, serving sizes, and product facts)
                        is sourced from public specifications and is intended for <strong>budget planning and informational purposes only</strong>.
                    </p>
                    <p>
                        This tool does not provide medical recommendations or prescribe therapeutic routines. Before starting any new dietary supplement,
                        vitamin cycle, or making changes to your health regimen, please consult with a qualified healthcare professional or your physician.
                    </p>

                    {/* Акцентный блок-предупреждение */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-500 italic flex gap-2">
                        <Scale size={28} className="text-slate-400 flex-shrink-0" />
                        <p>
                            By using this calculator, you acknowledge that you bear full personal responsibility for how you interpret the calculations
                            and any subsequent reliance on the information provided herein.
                        </p>
                    </div>
                </div>

                {/* КНОПКА ПОДТВЕРЖДЕНИЯ */}
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all hover:shadow-lg active:scale-[0.98]"
                >
                    I Understand
                </button>
            </div>
        </div>
    );
};