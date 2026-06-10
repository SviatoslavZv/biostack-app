// Тип для трёх временных слотов
// Мы используем строковый union-тип — это значит переменная может быть
// только одним из трёх значений, не чем-то другим
export type TimingSlot = 'morning' | 'noon' | 'evening';

// Интерфейс описывает один временной слот — его метку и иконку
export interface TimingInfo {
  slot: TimingSlot;
  label: string;       // Название для отображения пользователю
  icon: string;        // Эмодзи-иконка
  description: string; // Краткое пояснение
}

// Метаданные каждого слота — используем Record<TimingSlot, TimingInfo>
// Record<K, V> — это TypeScript-утилита: "объект где ключи типа K, значения типа V"
// Это гарантирует что мы не забудем ни один из трёх слотов
export const TIMING_META: Record<TimingSlot, TimingInfo> = {
  morning: {
    slot: 'morning',
    label: 'Morning',
    icon: '🌅',
    description: 'Take with breakfast or first meal'
  },
  noon: {
    slot: 'noon',
    label: 'Afternoon',
    icon: '☀️',
    description: 'Take with lunch or midday meal'
  },
  evening: {
    slot: 'evening',
    label: 'Evening',
    icon: '🌙',
    description: 'Take with dinner or before sleep'
  }
};

// Главный словарь: subType → TimingSlot
// Используем Record<string, TimingSlot> а не Record<SubType, TimingSlot>
// потому что в будущем subType будет расширяться, и мы не хотим
// менять тип каждый раз когда добавляем новый препарат
export const TIMING_PRESETS: Record<string, TimingSlot> = {

  // 🌅 УТРО — энергия, когнитивная функция, жирорастворимые витамины
  'caffeine':           'morning',
  'vitamin-b-complex':  'morning',
  'vitamin-d3':         'morning',
  'vitamin-d3-k2':      'morning',
  'vitamin-a':          'morning',
  'nmn':                'morning',
  'coq10':              'morning',
  'lions-mane':         'morning',
  'bacopa':             'morning',
  'alpha-lipoic-acid':  'morning',
  'spermidine':         'morning',
  'ashwagandha':        'morning',

  // ☀️ ДЕНЬ — нутриенты с едой, иммунитет, антиоксиданты
  'omega-3':            'noon',
  'vitamin-c':          'noon',
  'zinc':               'noon',
  'copper':             'noon',
  'iron':               'noon',
  'curcumin':           'noon',
  'quercetin':          'noon',
  'resveratrol':        'noon',
  'nac':                'noon',
  'astaxanthin':        'noon',
  'berberine':          'noon',
  'beta-glucan':        'noon',
  'collagen-bovine':    'noon',
  'collagen-marine':    'noon',
  'hyaluronic-acid':    'noon',
  'glucosamine-chondroitin': 'noon',
  'msm':                'noon',
  'fisetin':            'noon',

  // 🌙 ВЕЧЕР — сон, расслабление, восстановление
  'magnesium':          'evening',
  'magnesium-threonate': 'evening',
  'melatonin':          'evening',
  'theanine':           'evening',
  'glycine':            'evening',
};