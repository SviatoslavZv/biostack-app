'use client';

import React, { useState } from 'react';
import { Supplement } from "@/constants/supplements";
import { STACK_RULES, RuleContext } from "@/constants/rules";
import { OptimizationSuggestion } from '@/utils/stackLogic';

interface CartItem {
    id: string;
    count: number;
}

interface SmartAlertsProps {
    cart: CartItem[];
    allSupplements: Supplement[];
    onAddProduct: (productId: string) => void;
    optimizations: OptimizationSuggestion[]
    onReplace: (oldId: string, newId: string, newCount: number) => void
}

export const SmartAlerts = ({ cart, allSupplements, onAddProduct, optimizations, onReplace }: SmartAlertsProps) => {
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Динамический подбор товара без использования UPSELL_TRIGGERS.
     * Пытается сопоставить объёмы порций с тем, что уже есть в корзине.
     */
    const getBestMatchProduct = (upsellTarget: string): Supplement | null => {
        // 1. Фильтруем каталог: берем только доступные товары нужного подтипа
        const candidateProducts = allSupplements.filter(s =>
            (s.subType === upsellTarget || s.id === upsellTarget) && s.isAvailable
        );

        if (candidateProducts.length === 0) return null;

        // По умолчанию ориентируемся на первого кандидата
        let bestMatch = candidateProducts[0];
        let targetServings = 0;

        // 2. УМНЫЙ ПОДБОР ОБЪЁМА: 
        // Вместо хардкодной карты ищем ЛЮБОЙ товар в корзине, который не равен целевому апсейлу,
        // чтобы понять базовые предпочтения пользователя по объёму банок (например, берёт он 30 или 120 порций).
        const triggerItemInCart = cart.find(item => {
            const prod = allSupplements.find(s => s.id === item.id);
            return prod ? prod.subType !== upsellTarget : false;
        });

        if (triggerItemInCart) {
            const triggerProduct = allSupplements.find(s => s.id === triggerItemInCart.id);
            if (triggerProduct && triggerProduct.servings) {
                targetServings = triggerProduct.servings * triggerItemInCart.count;
            }
        }

        // 3. Находим баночку апсейла, где количество порций ближе всего к ориентиру
        if (targetServings > 0) {
            let minDifference = Infinity;

            candidateProducts.forEach(product => {
                if (product.servings) {
                    const difference = Math.abs(product.servings - targetServings);

                    if (difference < minDifference) {
                        minDifference = difference;
                        bestMatch = product;
                    }
                }
            });
        }

        return bestMatch;
    };

    /**
     * Возвращает отформатированную строку с брендом и объемом подобранного товара.
     * Теперь на 100% соответствует рекомендации!
     */
    const getBestMatchName = (upsellTarget: string): string => {
        const bestMatch = getBestMatchProduct(upsellTarget);
        if (!bestMatch) return upsellTarget.toUpperCase();
        return `${bestMatch.brand} (${bestMatch.servings} serv.)`;
    };

    /**
     * Обработчик апсейла.
     */
    const handleUpsell = (upsellTarget: string) => {
        const bestMatch = getBestMatchProduct(upsellTarget);
        if (bestMatch) {
            onAddProduct(bestMatch.id);
        } else {
            console.warn(`No available products found for upsell target: ${upsellTarget}`);
        }
    };

    /**
     * Аналитика корзины для контекста правил
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
    const activeRules = STACK_RULES.filter(rule => rule.condition(context));

    if (activeRules.length === 0 && optimizations.length === 0) return null;

    const warningsCount = activeRules.filter(r => r.type === 'warning').length;
    const successCount = activeRules.filter(r => r.type === 'success').length;
    const infoCount = activeRules.filter(r => r.type === 'info').length;
    const optimizationsCount = optimizations.length;

    return (
        <div className="sticky top-16 md:top-20 z-30 mb-8 bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden transition-all duration-300">

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 active:bg-slate-100 transition-colors text-sm font-semibold text-slate-700 select-none outline-none cursor-pointer focus:relative focus:z-10 focus:ring-2 focus:ring-blue-500/20"
            >
                <div className="flex items-center gap-x-3 gap-y-1.5 flex-wrap">
                    <span className="flex items-center gap-1.5">
                        🧬 Smart Analyzer:
                    </span>

                    <div className="flex items-center space-x-1.5 text-xs font-bold">
                        {warningsCount > 0 && (
                            <span
                                aria-label={`${warningsCount} warning${warningsCount > 1 ? 's' : ''}`}
                                title={`${warningsCount} warning${warningsCount > 1 ? 's' : ''}`}
                                className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
                                ⚠️ {warningsCount}
                            </span>
                        )}
                        {successCount > 0 && (
                            <span
                                aria-label={`${successCount} positive synergy match${successCount > 1 ? 'es' : ''}`}
                                title={`${successCount} positive synergy match${successCount > 1 ? 'es' : ''}`}
                                className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full">
                                ✅ {successCount}
                            </span>
                        )}
                        {infoCount > 0 && (
                            <span
                                aria-label={`${infoCount} tip${infoCount > 1 ? 's' : ''}`}
                                title={`${infoCount} tip${infoCount > 1 ? 's' : ''}`}
                                className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-full">
                                💡 {infoCount}
                            </span>
                        )}
                        {optimizationsCount > 0 && (
                            <span
                                aria-label={`${optimizationsCount} money-saving suggestion${optimizationsCount > 1 ? 's' : ''}`}
                                title={`${optimizationsCount} money-saving suggestion${optimizationsCount > 1 ? 's' : ''}`}
                                className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full">
                                💰 {optimizationsCount}
                            </span>
                        )}
                    </div>
                </div>

                <span className="text-xs text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-md transition-colors">
                    {isOpen ? 'Collapse ↑' : 'Review Details ↓'}
                </span>
            </button>

            {isOpen && (
                <div className="p-4 bg-white border-t border-slate-100 space-y-2.5 max-h-[320px] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-200">

                    {/* Подсказки по оптимизации цены — показываем первыми */}
                    {optimizations.map((opt) => (
                        <div
                            key={opt.currentProduct.id}
                            className="p-3.5 rounded-xl border bg-emerald-50/60 border-emerald-100 text-emerald-700 text-sm font-medium animate-in fade-in slide-in-from-top-1"
                        >
                            <div className="flex items-center justify-between flex-wrap gap-2 w-full">
                                <span>
                                    💰 Switch to <strong>{opt.bestProduct.brand} ({opt.bestProduct.servings} serv.)</strong> and save{' '}
                                    <strong>${opt.savings.toFixed(2)}</strong>
                                </span>
                                <button
                                    onClick={() => onReplace(
                                        opt.currentProduct.id,
                                        opt.bestProduct.id,
                                        opt.suggestedCount
                                    )}
                                    className="text-xs bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold px-2.5 py-1.5 
                          rounded-lg shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
                                >
                                    🔄 Switch to Best Value
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Обычные правила из STACK_RULES */}
                    {activeRules.map(rule => (
                        <div
                            key={rule.id}
                            className={`p-3.5 rounded-xl border text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-top-1 ${rule.type === 'info' ? 'bg-blue-50/60 border-blue-100 text-blue-700' :
                                rule.type === 'warning' ? 'bg-amber-50/60 border-amber-100 text-amber-700' :
                                    'bg-emerald-50/60 border-emerald-100 text-emerald-700'
                                }`}
                        >
                            {typeof rule.message === 'function'
                                ? rule.message(context, handleUpsell, getBestMatchName)
                                : rule.message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};