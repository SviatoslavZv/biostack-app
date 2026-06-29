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
    id: 'complete-night-recovery',
    title: 'Complete Night Recovery',
    description: 'An all-in-one science-backed stack designed to completely optimize your sleep architecture. It effectively relaxes stiff muscles, silences an overactive mind, safely initiates the natural onset of sleep, and maximizes deep-phase cellular recovery.',
    category: 'Sleep',
    items: [
      { id: 'CGN-01901', count: 1 },
      { id: 'NCS-67720', count: 1 },
      { id: 'NOW-00107', count: 1 },
      { id: 'NOW-03255', count: 1 },
    ]
  },
  {
    id: 'total-peak-productivity',
    title: 'Total Peak Productivity',
    description: 'The ultimate non-crash cognitive enhancer designed to unlock deep focus and flow state. It sharpens mental clarity, accelerates information processing, promotes neurogenesis, and sustains high energy levels without jittery side effects.',
    category: 'Focus',
    items: [
      { id: 'FOA-66038', count: 1 },
      { id: 'NCS-67723', count: 1 },
      { id: 'NCS-67720', count: 1 },
      { id: 'NOW-04588', count: 1 },
    ]
  },
  {
    id: 'mitochondrial-cellular-charge',
    title: 'Mitochondrial Cellular Charge',
    description: 'A premium cellular energy formula that fuels your body from within. Instead of a temporary artificial buzz, it directly supercharges mitochondrial ATP production, optimizes oxygen utilization, fights chronic fatigue, and enhances physical endurance.',
    category: 'Energy',
    items: [
      { id: 'DRB-00088', count: 1 },
      { id: 'SNS-00499', count: 1 },
      { id: 'NOW-00426', count: 1 },
      { id: 'DRB-00103', count: 1 },
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
  },




];