'use client';

import React, { useState } from 'react';
import { Supplement } from "@/constants/supplements";
import { STACK_RULES, RuleContext } from "@/constants/rules";

interface CartItem {
    id: string;
    count: number;
}

interface SmartAlertsProps {
    cart: CartItem[];
    allSupplements: Supplement[];
}

export const SmartAlerts = ({ cart, allSupplements }: SmartAlertsProps) => {
    // Стейт для раскрытия/сворачивания панели алертов
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Наш проверенный движок аналитики корзины
     */
    const getContextData = (): RuleContext => {
        const types: string[] = [];
        const productsBySubType: Record<string, Array<{ id: string; count: number; name: string }>> = {};

        cart.forEach(item => {
            const product = allSupplements.find(s => s.id === item.id);
            if (product) {
                for (let i = 0; i < item.count; i++) {
                    types.push(product.subType);
                }

                if (!productsBySubType[product.subType]) {
                    productsBySubType[product.subType] = [];
                }

                productsBySubType[product.subType].push({
                    id: item.id,
                    count: item.count,
                    name: product.name
                });
            }
        });

        return {
            types,
            getMultipleFormsTypes: () =>
                Object.keys(productsBySubType).filter(subType => productsBySubType[subType].length >= 2),

            getHighQuantityTypes: () => {
                const result: Array<{ subType: string; count: number; name: string }> = [];
                Object.keys(productsBySubType).forEach(subType => {
                    const group = productsBySubType[subType];
                    group.forEach(productInCart => {
                        if (productInCart.count >= 2) {
                            result.push({
                                subType,
                                count: productInCart.count,
                                name: productInCart.name
                            });
                        }
                    });
                });
                return result;
            }
        };
    };

    const context = getContextData();
    // Фильтруем правила на основе собранного контекста
    const activeRules = STACK_RULES.filter(rule => rule.condition(context));

    // Если корзина пуста или конфликтов нет — компонент не занимает место на экране
    if (activeRules.length === 0) return null;

    // Считаем количество алертов по категориям для компактных бейджей
    const warningsCount = activeRules.filter(r => r.type === 'warning').length;
    const successCount = activeRules.filter(r => r.type === 'success').length;
    const infoCount = activeRules.filter(r => r.type === 'info').length;

    return (
        <div className="sticky top-16 md:top-20 z-30 mb-8 bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden transition-all duration-300">

            {/* Кликабельная шапка-панель */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 active:bg-slate-100 transition-colors text-sm font-semibold text-slate-700 select-none outline-none focus:relative focus:z-10 focus:ring-2 focus:ring-blue-500/20"
            >
                <div className="flex items-center space-x-3">
                    <span className="flex items-center gap-1.5">
                        🧬 Smart Analyzer:
                    </span>

                    {/* Сводные бейджи — показывают статус "вспышками" */}
                    <div className="flex items-center space-x-1.5 text-xs font-bold">
                        {warningsCount > 0 && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full flex items-center gap-1">
                                ⚠️ {warningsCount}
                            </span>
                        )}
                        {successCount > 0 && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full flex items-center gap-1">
                                ✅ {successCount}
                            </span>
                        )}
                        {infoCount > 0 && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-full flex items-center gap-1">
                                💡 {infoCount}
                            </span>
                        )}
                    </div>
                </div>

                {/* Текстовый переключатель состояния */}
                <span className="text-xs text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-md transition-colors">
                    {isOpen ? 'Collapse ↑' : 'Review Details ↓'}
                </span>
            </button>

            {/* Раскрывающийся контент с внутренним скроллом */}
            {isOpen && (
                <div className="p-4 bg-white border-t border-slate-100 space-y-2.5 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    {activeRules.map(rule => (
                        <div
                            key={rule.id}
                            className={`p-3.5 rounded-xl border text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-top-1 ${rule.type === 'info' ? 'bg-blue-50/60 border-blue-100 text-blue-700' :
                                rule.type === 'warning' ? 'bg-amber-50/60 border-amber-100 text-amber-700' :
                                    'bg-emerald-50/60 border-emerald-100 text-emerald-700'
                                }`}
                        >
                            {typeof rule.message === 'function' ? rule.message(context) : rule.message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};