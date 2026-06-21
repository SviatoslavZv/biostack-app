'use client';

import { Star } from 'lucide-react';
import { STACK_PRESETS, PresetItem } from '@/constants/presets';
import { PresetCard } from './PresetCard';

interface PresetsListProps {
    activeCategory: string;
    setStackPreset: (presetItems: PresetItem[]) => void;
    onSelect: () => void;
}

export const PresetsList = ({ activeCategory, setStackPreset, onSelect }: PresetsListProps) => {
    // Фильтруем один раз и сохраняем в переменную —
    // в исходном коде .filter() вызывался ДВАЖДЫ (один раз для проверки
    // .length === 0, второй раз внутри .map()). Это работало, но
    // на каждый рендер компонент дважды проходил по всему массиву
    // STACK_PRESETS без необходимости. Сейчас массив маленький (2 пресета),
    // разницы не почувствуешь, но это плохая привычка, которая аукнется,
    // когда пресетов станет 50.
    const filteredPresets = STACK_PRESETS.filter(
        (p) => activeCategory === 'All' || p.category === activeCategory
    );

    return (
        <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">
                {activeCategory === 'All' ? 'Expert Curated Stacks' : `${activeCategory} Solutions`}
            </p>

            {filteredPresets.length === 0 ? (
                <div className="py-20 flex flex-col items-center text-center space-y-3 opacity-40">
                    <Star size={24} className="text-slate-300" />
                    <p className="text-xs font-bold uppercase tracking-tighter">No presets for {activeCategory}</p>
                </div>
            ) : (
                filteredPresets.map((preset) => (
                    <PresetCard
                        key={preset.id}
                        id={preset.id}
                        category={preset.category}
                        title={preset.title}
                        description={preset.description}
                        items={preset.items}
                        setStackPreset={setStackPreset}
                        onSelect={onSelect}
                    />
                ))
            )}
        </div>
    );
};