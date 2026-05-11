// 1. Импортируем интерфейс Supplement из твоего файла с базой
import { Supplement } from "./supplements";

// 2. Описываем, из чего состоит один пункт в пресете
// Мы не берем весь объект товара, а только его ID и нужное количество
export interface PresetItem {
  id: string;    // Это должен быть реальный ID из supplements.ts
  count: number; 
}

// 3. Описываем структуру самого пресета (набора)
export interface StackPreset {
  id: string;
  title: string;
  description: string;
  category: string;
  items: PresetItem[];
}

// 4. Создаем массив готовых наборов
export const STACK_PRESETS: StackPreset[] = [
  {
    id: 'deep-sleep-pro',
    title: 'Deep Sleep & Recovery',
    description: 'A combination of magnesium and theanine to relax the nervous system before bed.',
    category: 'Sleep',
    items: [
      { id: 'CGN-01901', count: 1 }, 
      { id: 'NOW-00147', count: 1 },
      { id: 'LKN-01410', count: 1 },
    ]
  },
  {
    id: 'brain-fuel',
    title: 'Executive Focus',
    description: 'A stack for long-lasting concentration without the caffeine "comeback".',
    category: 'Focus',
    items: [
      { id: 'NCS-67937', count: 1 },
      { id: 'SPN-02427', count: 1 },
      { id: 'NOW-03070', count: 1 },
    ]
  }
];