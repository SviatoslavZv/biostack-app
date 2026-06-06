import { useState, useEffect, useMemo } from 'react';
import { SUPPLEMENTS, Supplement } from "@/constants/supplements";
import { PresetItem } from "@/constants/presets";
import { STACK_RULES, RuleContext } from "@/constants/rules";

export interface CartItem {
    id: string;
    count: number;
}

export interface StackAnalytics {
    dailyCost: number;
    durationDays: number;
    efficiency: number;
}

// Описываем что именно возвращает наш хук
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
        // Сохраняем ТОЛЬКО если мы в браузере и корзина изменилась
        if (typeof window !== 'undefined') {
            localStorage.setItem('biostack-cart', JSON.stringify(cart));
        }
    }, [cart]);

    // Скрупулёзный разбор динамического формирования категорий:
    const dynamicCategories = useMemo<string[]>(() => {
        // 1. Собираем все категории из реальных товаров
        const categoriesInDb = SUPPLEMENTS.map(item => item.category);

        // 2. Оставляем только уникальные с помощью Set
        const uniqueCategories = Array.from(new Set(categoriesInDb));

        // 3. Возвращаем итоговый массив, где 'All' всегда на первом месте
        return ['All', ...uniqueCategories];
    }, []); // Массив зависимостей пустой, так как база SUPPLEMENTS статична

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

    const clearStack = () => {
        setCart([]); // Просто очищаем массив корзины
    };

    const selectedIds = cart.map(item => item.id);

    const filteredSupplements = SUPPLEMENTS.filter(item =>
        (activeCategory === 'All' || item.category === activeCategory) && item.isAvailable
    );

    const totalPrice = SUPPLEMENTS
        .filter(item => selectedIds.includes(item.id))
        .reduce((sum, item) => {
            const count = cart.find(c => c.id === item.id)?.count || 0;
            return sum + (item.price * count);
        }, 0);

    const analytics = useMemo(() => {
        const selectedSupps = SUPPLEMENTS.filter(s => selectedIds.includes(s.id));

        let totalDailyCost = 0;
        let minDays = Infinity;

        selectedSupps.forEach(supp => {
            const cartItem = cart.find(c => c.id === supp.id);
            if (cartItem && supp.servings && supp.suggestedDaily) {
                const costPerServing = supp.servings > 0 ? supp.price / supp.servings : 0;
                const itemDailyCost = costPerServing * supp.suggestedDaily;
                totalDailyCost += itemDailyCost;

                const itemDuration = (supp.servings * cartItem.count) / supp.suggestedDaily;
                if (itemDuration < minDays) {
                    minDays = itemDuration;
                }
            }
        });

        // --- ИДЕАЛЬНЫЙ ДИНАМИЧЕСКИЙ РАСЧЕТ STACK EFFICIENCY ---
        let efficiency = selectedIds.length > 0 ? 100 : 0;

        if (selectedIds.length > 0) {
            const subtypesOnly = selectedSupps.map(s => s.subType);

            // Честно реализуем интерфейс RuleContext, чтобы rules.ts не падал
            const ctx: RuleContext = {
                types: subtypesOnly,

                getMultipleFormsTypes: () => {
                    const duplicates = subtypesOnly.filter((type, index) => subtypesOnly.indexOf(type) !== index);
                    return Array.from(new Set(duplicates));
                },

                getHighQuantityTypes: () => {
                    const highQty: Array<{ subType: string; count: number; name: string }> = [];
                    selectedSupps.forEach(supp => {
                        const cartItem = cart.find(c => c.id === supp.id);
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

            let warningPenalties = 0;
            let upsellPenalties = 0;

            // Пробегаемся по всем правилам базы знаний
            STACK_RULES.forEach(rule => {
                try {
                    if (rule.condition(ctx)) {
                        if (rule.type === 'warning') {
                            warningPenalties += 20;
                        } else if (rule.type === 'info' && rule.upsellProductId) {
                            upsellPenalties += 10;
                        }
                    }
                } catch (e) {
                    console.error(`Error evaluating rule ${rule.id}:`, e);
                }
            });

            const hasDuplicateSubtypes = ctx.getMultipleFormsTypes().length > 0;
            const hasHighQuantity = ctx.getHighQuantityTypes().length > 0;
            if (hasDuplicateSubtypes || hasHighQuantity) {
                warningPenalties += 20;
            }

            const finalUpsellPenalty = Math.min(25, upsellPenalties);
            efficiency = Math.max(10, 100 - finalUpsellPenalty - warningPenalties);
        }

        return {
            dailyCost: totalDailyCost,
            durationDays: minDays === Infinity ? 0 : Math.floor(minDays),
            efficiency: efficiency
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
    };
};