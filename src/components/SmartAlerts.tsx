import { SUPPLEMENTS } from "@/constants/supplements";
import { STACK_RULES } from "@/constants/rules";

interface Props {
    selectedIds: string[];
}

export const SmartAlerts = ({ selectedIds }: Props) => {
    // Преобразуем selectedIds в массив subType
    // Например: ['CGN-01901', 'NOW-00147'] → ['magnesium', 'theanine']
    const selectedSubTypes = SUPPLEMENTS
        .filter(s => selectedIds.includes(s.id))
        .map(s => s.subType);

    const activeRules = STACK_RULES.filter(rule => rule.condition(selectedSubTypes));

    if (activeRules.length === 0) return null;

    return (
        <div className="mb-8 space-y-3">
            {activeRules.map(rule => (
                <div
                    key={rule.id}
                    className={`p-4 rounded-xl border text-sm font-medium animate-in fade-in slide-in-from-top-2 ${rule.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                        rule.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                            'bg-emerald-50 border-emerald-200 text-emerald-700'
                        }`}
                >
                    {rule.message}
                </div>
            ))}
        </div>
    );
};