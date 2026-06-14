import { useState, useEffect, useMemo, ReactNode } from 'react';
import { SUPPLEMENTS, Supplement } from "@/constants/supplements";
import { PresetItem } from "@/constants/presets";
import { STACK_RULES, RuleContext } from "@/constants/rules";
import { findOptimizationSuggestions, OptimizationSuggestion } from '@/utils/stackLogic';

export interface CartItem {
    id: string;
    count: number;
}

export interface PenaltyAction {
    supplementId: string;
    buttonText: string;
}

export type RuleMessageFunction = (
    ctx: RuleContext,
    onUpsell?: (target: string) => void,
    getBestMatchName?: (target: string) => string
) => ReactNode;

export interface EfficiencyPenalty {
    id: string;
    type: 'warning' | 'info';
    points: number;
    message: ReactNode | RuleMessageFunction;
    action?: PenaltyAction;
}

export interface StackAnalytics {
    dailyCost: number;
    durationDays: number;
    efficiency: number;
    penalties: EfficiencyPenalty[];
    optimizations: OptimizationSuggestion[];
}

export interface StackBuilderHook {
    cart: CartItem[];
    selectedIds: string[];
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    setStackPreset: (presetItems: PresetItem[]) => void;
    filteredSupplements: Supplement[];
    allSupplements: Supplement[];
    categories: string[];
    totalPrice: number;
    analytics: StackAnalytics;
    clearStack: () => void;
    replaceInCart: (oldId: string, newId: string, newCount: number) => void;
}

export const useStackBuilder = (): StackBuilderHook => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem('biostack-cart');
        try {
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    const [activeCategory, setActiveCategory] = useState<string>('All');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('biostack-cart', JSON.stringify(cart));
        }
    }, [cart]);

    const dynamicCategories = useMemo<string[]>(() => {
        const categoriesInDb = SUPPLEMENTS.map(item => item.category);
        const uniqueCategories = Array.from(new Set(categoriesInDb));
        return ['All', ...uniqueCategories];
    }, []);

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === id);
            if (!existing && delta > 0) return [...prev, { id, count: 1 }];
            if (existing) {
                const newCount = existing.count + delta;
                return newCount <= 0
                    ? prev.filter(item => item.id !== id)
                    : prev.map(item => item.id === id ? { ...item, count: newCount } : item);
            }
            return prev;
        });
    };

    const setStackPreset = (presetItems: PresetItem[]) => {
        setCart(presetItems.map(item => ({ id: item.id, count: item.count })));
    };

    const clearStack = () => setCart([]);


    /**
     * Заменяет один товар в корзине на другой с заданным количеством.
     * Используется для фичи "Switch to Best Value" —
     * убираем неоптимальный товар, ставим оптимальный.
     * 
     * @param oldId - id товара который нужно удалить
     * @param newId - id товара который нужно добавить
     * @param newCount - сколько банок нового товара поставить
     */
    const replaceInCart = (oldId: string, newId: string, newCount: number) => {
        setCart(prev => {
            // Шаг 1: убираем старый товар из корзины
            const withoutOld = prev.filter(item => item.id !== oldId);

            // Шаг 2: проверяем — может новый товар уже есть в корзине?
            // (например, пользователь уже использует "лучший" вариант для другого товара)
            const existingNew = withoutOld.find(item => item.id === newId);

            if (existingNew) {
                // Если новый товар уже в корзине — суммируем количество
                return withoutOld.map(item =>
                    item.id === newId
                        ? { ...item, count: item.count + newCount }
                        : item
                );
            }

            // Если нового товара ещё нет — просто добавляем
            return [...withoutOld, { id: newId, count: newCount }];
        });
    };


    // ✅ Мемоизация selectedIds — новый массив не создаётся на каждый рендер
    const selectedIds = useMemo(
        () => cart.map(item => item.id),
        [cart]
    );

    // ✅ Мемоизация filteredSupplements
    const filteredSupplements = useMemo(() =>
        SUPPLEMENTS.filter(item =>
            (activeCategory === 'All' || item.category === activeCategory) && item.isAvailable
        ), [activeCategory]);

    // ✅ Мемоизация totalPrice
    const totalPrice = useMemo(() =>
        SUPPLEMENTS
            .filter(item => selectedIds.includes(item.id))
            .reduce((sum, item) => {
                const count = cart.find(c => c.id === item.id)?.count || 0;
                return sum + (item.price * count);
            }, 0),
        [cart, selectedIds]
    );

    const analytics = useMemo(() => {
        const selectedSupps = SUPPLEMENTS.filter(s => selectedIds.includes(s.id));

        let totalDailyCost = 0;
        let minDays = Infinity;

        selectedSupps.forEach(supp => {
            const cartItem = cart.find(c => c.id === supp.id);
            if (cartItem && supp.servings && supp.suggestedDaily) {
                const costPerServing = supp.servings > 0 ? supp.price / supp.servings : 0;
                totalDailyCost += costPerServing * supp.suggestedDaily;

                const itemDuration = (supp.servings * cartItem.count) / supp.suggestedDaily;
                if (itemDuration < minDays) minDays = itemDuration;
            }
        });

        let efficiency = selectedIds.length > 0 ? 100 : 0;
        const penalties: EfficiencyPenalty[] = [];

        if (selectedIds.length > 0) {
            // 1. Создаем плоский массив подтипов с учетом количества каждой позиции в корзине
            const subtypesOnly: string[] = [];
            selectedSupps.forEach(supp => {
                const cartItem = cart.find(c => c.id === supp.id);
                const count = cartItem ? cartItem.count : 0;
                for (let i = 0; i < count; i++) {
                    subtypesOnly.push(supp.subType);
                }
            });

            const ctx: RuleContext = {
                types: subtypesOnly,
                getMultipleFormsTypes: () => {
                    // Теперь это сработает, если у пользователя добавлены разные товары с ОДИНАКОВЫМ subType
                    // (например, две разные банки магния)
                    const duplicates = subtypesOnly.filter(
                        (type, index) => subtypesOnly.indexOf(type) !== index
                    );
                    return Array.from(new Set(duplicates));
                },
                getHighQuantityTypes: () => {
                    const highQty: Array<{ subType: string; count: number; name: string }> = [];
                    selectedSupps.forEach(supp => {
                        const cartItem = cart.find(c => c.id === supp.id);
                        // Если одной конкретной банки больше или равно 2 единиц
                        if (cartItem && cartItem.count >= 2) {
                            highQty.push({
                                subType: supp.subType,
                                count: cartItem.count,
                                name: supp.name
                            });
                        }
                    });
                    return highQty;
                }
            };
            // ✅ STACK_RULES 
            STACK_RULES.forEach(rule => {
                try {
                    if (rule.condition(ctx)) {
                        const safeType: 'warning' | 'info' =
                            rule.type === 'warning' ? 'warning' : 'info';

                        // Определяем штраф по трём уровням важности:
                        let pointsDeducted = 0;

                        if (rule.type === 'warning') {
                            // Настоящий конфликт (например Zinc + Iron) — серьёзный штраф
                            pointsDeducted = 20;
                        } else if (rule.type === 'info' && rule.upsellProductId) {
                            // Упущенная синергия (например "добавь Omega-3 к CoQ10")
                            // Небольшой штраф — мотивирует улучшить стек, но не наказывает строго
                            pointsDeducted = 5;
                        } else {
                            // Просто совет по таймингу/приёму — это не ошибка пользователя,
                            // штраф не начисляем, но в списке советов это всё равно покажем
                            pointsDeducted = 0;
                        }

                        penalties.push({
                            id: rule.id,
                            type: safeType,
                            points: pointsDeducted,
                            message: rule.message,
                        });
                    }
                } catch (e) {
                    console.error(`Error evaluating rule ${rule.id}:`, e);
                }
            });

            const totalPenaltyPoints = penalties.reduce((sum, p) => sum + p.points, 0);
            efficiency = Math.max(10, 100 - totalPenaltyPoints);
        }

        // Считаем подсказки по оптимизации цены —
        // независимо от efficiency, это отдельная система рекомендаций
        const optimizations = findOptimizationSuggestions(cart, SUPPLEMENTS);

        return {
            dailyCost: totalDailyCost,
            durationDays: minDays === Infinity ? 0 : Math.floor(minDays),
            efficiency,
            penalties,
            optimizations // 👈 добавляем в результат
        };


    }, [cart, selectedIds]);

    return {
        cart,
        selectedIds,
        activeCategory,
        setActiveCategory,
        updateQuantity,
        setStackPreset,
        filteredSupplements,
        totalPrice,
        allSupplements: SUPPLEMENTS,
        categories: dynamicCategories,
        analytics,
        clearStack,
        replaceInCart,
    };
};