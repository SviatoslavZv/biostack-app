import { TIMING_PRESETS, TimingSlot } from '@/constants/timing';

/**
 * Безопасно достаёт тайминг для subType.
 * 
 * Почему это отдельная функция а не просто TIMING_PRESETS[subType]?
 * Потому что если subType не найден в словаре,
 * прямой доступ вернёт undefined — и компонент может сломаться.
 * Эта функция гарантирует что всегда вернётся валидное значение.
 * 
 * Параметр subType: string — тип добавки из базы данных
 * Возвращает: TimingSlot — один из трёх слотов, по умолчанию 'noon'
 */
export const getSupplementTiming = (subType: string): TimingSlot => {
  // Оператор ?? (nullish coalescing) — если левая часть undefined или null,
  // возвращает правую часть. Это наша "защита от падения"
  return TIMING_PRESETS[subType] ?? 'noon';
};