import { useState } from 'react';
import { SUPPLEMENTS } from "@/constants/supplements";

// 1. Описываем, как выглядит один элемент в корзине
interface CartItem {
    id: string;
    count: number;
}

export const useStackBuilder = () => {
    // 2. Меняем состояние со списка строк на список объектов
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Focus', 'Sleep', 'Energy', 'Longevity'];

    // 3. Новая функция управления количеством
    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === id);

            if (!existing && delta > 100) return prev; // Защита для удаления
            
            if (!existing && delta > 0) {
                return [...prev, { id, count: 1 }];
            }

            if (existing) {
                const newCount = existing.count + delta;
                // Если количество 0 или меньше (или мы передали -1000 для удаления) — убираем из корзины
                if (newCount <= 0) {
                    return prev.filter(item => item.id !== id);
                }
                // Иначе обновляем число
                return prev.map(item => item.id === id ? { ...item, count: newCount } : item);
            }

            return prev;
        });
    };

    // 4. Вспомогательные данные для страницы
    const selectedIds = cart.map(item => item.id);

    const filteredSupplements = SUPPLEMENTS.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        return matchesCategory && item.isAvailable;
    });

    // 5. Считаем общую сумму с учетом количества банок
    const totalPrice = SUPPLEMENTS
        .filter(item => selectedIds.includes(item.id))
        .reduce((sum, item) => {
            const cartItem = cart.find(c => c.id === item.id);
            const count = cartItem ? cartItem.count : 0;
            return sum + (item.price * count);
        }, 0);

    return {
        cart,               // Теперь возвращаем саму корзину
        selectedIds,        // Список ID для фильтров и алертов
        activeCategory,
        setActiveCategory,
        categories,
        updateQuantity,     // Заменили toggleSupplement на это
        filteredSupplements,
        totalPrice,
        allSupplements: SUPPLEMENTS,
    };
};