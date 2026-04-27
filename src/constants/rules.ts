export interface Rule {
  id: string;
  condition: (selectedIds: string[]) => boolean;
  message: string;
  type: 'info' | 'warning' | 'success';
}

export const STACK_RULES: Rule[] = [
  {
    id: 'd3-k2-synergy',
    // Условие: если выбран D3 (допустим его ID 'd3-001'), но не выбран K2
    condition: (ids) => ids.includes('d3-001') && !ids.includes('k2-002'),
    message: "Vitamin D3 is best absorbed with Vitamin K2. Consider adding it to your stack.",
    type: 'info'
  },
  {
    id: 'magnesium-calm',
    condition: (ids) => ids.includes('magnesium-001'),
    message: "Great choice! Magnesium is most effective when taken in the evening.",
    type: 'success'
  },
  {
    id: 'too-many-stimulants',
    // Если выбрано больше 2-х товаров из категории Energy (нужно будет добавить категории)
    condition: (ids) => ids.length > 4, 
    message: "Your stack is getting large. Make sure to consult with a professional regarding compatibility.",
    type: 'warning'
  }
];