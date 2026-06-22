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
        // ХЕНДЛЕР ОВЕРЛЕЯ
        // ИЗМЕНЕНИЕ: На мобилках прижимаем к низу (items-end), на десктопе центрируем (sm:items-center).
        // Добавили отступы p-3 pb-20 sm:p-4, где pb-20 гарантированно приподнимает окно над нижним таб-баром!
        <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-3 pb-20 sm:p-4 animate-in fade-in duration-200"
        >
            {/* КОНТЕНТНОЕ ОКНО */}
            {/* ИЗМЕНЕНИЕ: rounded-3xl для красивых скруглений со всех сторон. */}
            {/* ИЗМЕНЕНИЕ: max-h-[70vh] на мобилках отодвинет верхний край от основного хедера BioStack, оставляя зазор, а sm:max-h-[80vh] вернет стандартный размер на ПК. */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-lg w-full max-h-[70vh] sm:max-h-[80vh] flex flex-col p-5 md:p-7 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200 relative overflow-hidden"
            >
                {/* Яркая предупреждающая полоса на самом верху карточки */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 to-orange-500 flex-shrink-0" />

                {/* КНОПКА-КРЕСТИК ДЛЯ ЗАКРЫТИЯ */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 transition-colors z-10"
                    aria-label="Close modal"
                >
                    <X size={16} />
                </button>

                {/* ЗАГОЛОВОК ОКНА (Фиксированный сверху) */}
                <div className="flex items-center gap-3 text-amber-600 pb-3 mt-1 flex-shrink-0">
                    <div className="p-2 bg-amber-50 rounded-xl">
                        <ShieldAlert size={22} />
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Medical Disclaimer</h3>
                </div>

                {/* ЮРИДИЧЕСКИЙ ТЕКСТ НА АНГЛИЙСКОМ (Изолированный внутренний скролл) */}
                <div className="flex-1 overflow-y-auto overscroll-contain pr-1.5 space-y-3.5 text-xs md:text-sm text-slate-600 leading-relaxed font-medium scrollbar-thin scrollbar-thumb-slate-200">
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
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-700 italic flex gap-2">
                        <Scale size={24} className="text-slate-400 flex-shrink-0" />
                        <p className="text-[11px] md:text-xs">
                            By using this calculator, you acknowledge that you bear full personal responsibility for how you interpret the calculations
                            and any subsequent reliance on the information provided herein.
                        </p>
                    </div>
                </div>

                {/* КНОПКА ПОДТВЕРЖДЕНИЯ (Фиксированная снизу) */}
                <div className="pt-3.5 mt-2 border-t border-slate-100 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-slate-900 hover:bg-green-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all hover:shadow-lg active:scale-[0.98] cursor-pointer"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};