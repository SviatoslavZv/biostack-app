import { useState, useEffect, useMemo } from 'react';
import { SUPPLEMENTS, Supplement } from "@/constants/supplements";
import { PresetItem } from "@/constants/presets";

export interface CartItem {
    id: string;
    count: number;
}

export interface StackAnalytics {
  dailyCost: number;
  durationDays: number;
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
        // 1. Считаем стоимость дня для этого препарата
        // (Цена / порции в банке) * порций в день
        const costPerServing = supp.price / supp.servings;
        const itemDailyCost = costPerServing * supp.suggestedDaily;
        totalDailyCost += itemDailyCost;

        // 2. Считаем на сколько дней хватит запаса этого препарата
        // (Порции в банке * количество банок) / порций в день
        const itemDuration = (supp.servings * cartItem.count) / supp.suggestedDaily;
        
        if (itemDuration < minDays) {
          minDays = itemDuration;
        }
      }
    });

    return {
      dailyCost: totalDailyCost,
      durationDays: minDays === Infinity ? 0 : Math.floor(minDays)
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
        categories: ['All', 'Focus', 'Sleep', 'Energy', 'Longevity'],
        analytics
    };
};