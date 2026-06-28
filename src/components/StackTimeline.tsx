'use client';

// Импортируем наши константы и утилиту
// CartItem — тип элемента корзины из хука
// Supplement — тип товара из базы данных
import { CartItem } from '@/hooks/useStackBuilder';
import { Supplement } from '@/constants/supplements';
import { TIMING_META, TimingSlot } from '@/constants/timing';
import { getSupplementTiming } from '@/utils/timingUtils';

// Описываем пропсы компонента
// cart — текущая корзина пользователя
// allSupplements — полная база товаров (нужна чтобы найти subType по id)
interface StackTimelineProps {
    cart: CartItem[];
    allSupplements: Supplement[];
}

export const StackTimeline = ({ cart, allSupplements }: StackTimelineProps) => {

    // Если корзина пустая — не рендерим ничего
    // Это называется "early return" — выходим из функции раньше
    // чтобы не делать лишнюю работу
    if (cart.length === 0) return null;

    // Шаг 1: Группируем товары по временным слотам
    // Создаём объект где ключ — слот ('morning'/'noon'/'evening'),
    // значение — массив товаров для этого слота
    // Record<TimingSlot, Supplement[]> гарантирует что все три слота существуют
    const groups: Record<TimingSlot, Supplement[]> = {
        morning: [],
        noon: [],
        evening: []
    };

    // Проходим по каждому элементу корзины
    cart.forEach(cartItem => {
        // Находим полные данные о товаре в базе по его id
        const supplement = allSupplements.find(s => s.id === cartItem.id);

        // Если товар не найден — пропускаем (защита от ошибок)
        if (!supplement) return;

        // Получаем тайминг через нашу безопасную функцию-хелпер
        // Если subType не в словаре — вернёт 'noon' по умолчанию
        const slot = getSupplementTiming(supplement.subType);

        // Добавляем товар в нужную группу
        groups[slot].push(supplement);
    });

    // Шаг 2: Определяем порядок отображения слотов
    // Мы используем массив а не Object.keys() чтобы гарантировать
    // правильный порядок: утро → день → вечер
    const slotOrder: TimingSlot[] = ['morning', 'noon', 'evening'];

    // Фильтруем: показываем только те слоты где есть хотя бы один товар
    const activeSlots = slotOrder.filter(slot => groups[slot].length > 0);

    // Если все товары в одном слоте и он пустой — не показываем блок
    // (на практике это не случится если cart.length > 0, но защита не помешает)
    if (activeSlots.length === 0) return null;

    return (
        // Внешний контейнер блока таймлайна
        <div className="mt-4 pt-4 border-t border-slate-100">

            {/* Заголовок блока */}
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">
                Daily Schedule
            </p>

            {/* Рендерим только активные слоты */}
            <div className="space-y-5">
                {activeSlots.map(slot => {
                    // Получаем метаданные слота — иконку, название, описание
                    const meta = TIMING_META[slot];
                    // Получаем список товаров для этого слота
                    const items = groups[slot];

                    return (
                        <div key={slot} className="flex gap-3 animate-fade-in-up">

                            {/* Левая часть — иконка и название слота */}
                            <div className="flex flex-col items-center gap-1 w-14 shrink-0">
                                <span className="text-base leading-none">{meta.icon}</span>
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wide text-center leading-tight">
                                    {meta.label}
                                </span>
                            </div>

                            {/* Правая часть — список товаров этого слота */}
                            <div className="flex-1 flex flex-wrap gap-1.5">
                                {items.map(item => (
                                    <span
                                        key={item.id}
                                        className={`
        text-[10px] font-bold px-2 py-1 rounded-lg leading-tight
        max-w-[140px] truncate
        ${slot === 'morning'
                                                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                                : slot === 'noon'
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                            }
      `}
                                        title={`${item.brand} — ${item.name}`}
                                    >
                                        {item.brand.split(' ')[0]} {item.name.split(',')[0]}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Подсказка внизу */}
            <p className="text-[11px] text-slate-800 mt-3 leading-relaxed">
                ✦ Take fat-soluble supplements with food containing healthy fats
            </p>
        </div>
    );
};