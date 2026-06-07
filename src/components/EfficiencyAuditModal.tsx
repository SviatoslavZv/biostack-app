'use client';

import { useEffect } from "react";
import { X, AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { EfficiencyPenalty } from "@/hooks/useStackBuilder";
import { Supplement } from "@/constants/supplements";

interface EfficiencyAuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    efficiency: number;
    penalties: EfficiencyPenalty[];
    allSupplements: Supplement[];
    cart: Array<{ id: string; count: number }>;
    onAddSupplement: (id: string, delta: number) => void;
}

export const EfficiencyAuditModal = ({
    isOpen,
    onClose,
    efficiency,
    penalties = [],
    allSupplements = [],
    cart = [],
    onAddSupplement,
}: EfficiencyAuditModalProps) => {

    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const getBestMatchProduct = (upsellTarget: string): Supplement | null => {
        const triggerItemInCart = cart.find(item => {
            const prod = allSupplements.find(s => s.id === item.id);
            return prod ? prod.subType === upsellTarget || prod.id === upsellTarget : false;
        });

        let targetServings = 0;
        if (triggerItemInCart) {
            const triggerProduct = allSupplements.find(s => s.id === triggerItemInCart.id);
            if (triggerProduct?.servings) {
                targetServings = triggerProduct.servings * triggerItemInCart.count;
            }
        }

        const candidateProducts = allSupplements.filter(s =>
            (s.subType === upsellTarget || s.id === upsellTarget) && s.isAvailable
        );

        if (candidateProducts.length === 0) return null;
        if (targetServings === 0) return candidateProducts[0];

        let bestMatch = candidateProducts[0];
        let minDifference = Infinity;

        candidateProducts.forEach(product => {
            if (product.servings) {
                const difference = Math.abs(product.servings - targetServings);
                if (difference < minDifference) {
                    minDifference = difference;
                    bestMatch = product;
                }
            }
        });

        return bestMatch;
    };

    const getBestMatchName = (upsellTarget: string): string => {
        const bestMatch = getBestMatchProduct(upsellTarget);
        if (!bestMatch) return upsellTarget;
        return `${bestMatch.brand} (${bestMatch.servings} serv.)`;
    };

    const handleUpsell = (upsellTarget: string): void => {
        const bestMatch = getBestMatchProduct(upsellTarget);
        if (bestMatch) {
            onAddSupplement(bestMatch.id, 1);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return { text: 'text-green-600', border: 'border-green-200', bg: 'bg-green-50' };
        if (score >= 50) return { text: 'text-amber-600', border: 'border-amber-200', bg: 'bg-amber-50' };
        return { text: 'text-red-600', border: 'border-red-200', bg: 'bg-red-50' };
    };

    const scoreStyle = getScoreColor(efficiency);

    const currentSubTypes = cart
        .map(item => allSupplements.find(s => s.id === item.id)?.subType)
        .filter((type): type is NonNullable<typeof type> => type !== undefined);

    const modalContext = {
        types: currentSubTypes as string[],
        getMultipleFormsTypes: (): string[] => {
            const duplicates = (currentSubTypes as string[]).filter(
                (type, index) => (currentSubTypes as string[]).indexOf(type) !== index
            );
            return Array.from(new Set(duplicates));
        },
        getHighQuantityTypes: (): Array<{ subType: string; count: number; name: string }> => {
            const result: Array<{ subType: string; count: number; name: string }> = [];
            cart.forEach(item => {
                if (item.count >= 2) {
                    const product = allSupplements.find(s => s.id === item.id);
                    if (product) {
                        result.push({
                            subType: product.subType,
                            count: item.count,
                            name: product.name
                        });
                    }
                }
            });
            return result;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-6 shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col overflow-hidden">

                <div className="flex items-center justify-between pb-4 border-b border-gray-50 shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Stack Bio-Audit</h2>
                        <p className="text-xs font-medium text-slate-500">Detailed synergy analysis of your protocol</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto py-4 flex-1 pr-1 overscroll-contain">
                    <div className={`flex items-center gap-4 p-4 rounded-[1.5rem] border ${scoreStyle.border} ${scoreStyle.bg} mb-5`}>
                        <div className="relative flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-inner shrink-0">
                            <span className={`text-xl font-black ${scoreStyle.text}`}>{efficiency}%</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                                {efficiency === 100 ? 'Optimal Protocol' : 'Optimization Required'}
                            </h4>
                            <p className="text-xs font-semibold text-slate-600 mt-0.5">
                                {efficiency === 100
                                    ? 'All ingredients pair perfectly. No competing pathways detected.'
                                    : `Found ${penalties.length} bio-compatibility issues. Resolve them to maximize bioavailability.`}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {penalties.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50/50 rounded-[1.5rem] border border-dashed border-gray-200">
                                <div className="inline-flex p-3 bg-green-50 text-green-600 rounded-full mb-2">
                                    <ShieldCheck size={24} />
                                </div>
                                <p className="text-xs font-bold text-slate-800">Clean Protocol</p>
                                <p className="text-[11px] font-medium text-slate-500 mt-0.5">No conflicts detected in your stack.</p>
                            </div>
                        ) : (
                            penalties.map((penalty) => (
                                <div
                                    key={penalty.id}
                                    className={`flex gap-3 p-4 rounded-[1.5rem] border transition-all ${penalty.type === 'warning'
                                        ? 'bg-red-50/30 border-red-100'
                                        : 'bg-amber-50/30 border-amber-100'
                                        }`}
                                >
                                    <div className={`mt-0.5 shrink-0 ${penalty.type === 'warning' ? 'text-red-500' : 'text-amber-500'
                                        }`}>
                                        {penalty.type === 'warning'
                                            ? <AlertTriangle size={16} />
                                            : <Info size={16} />
                                        }
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="text-xs font-bold text-slate-900 leading-snug w-full">
                                            {typeof penalty.message === 'function'
                                                ? penalty.message(modalContext, handleUpsell, getBestMatchName)
                                                : penalty.message
                                            }
                                        </div>

                                        <div className="flex items-center gap-1.5 mt-2.5">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${penalty.type === 'warning'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                -{penalty.points} points
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="pt-3 border-t border-gray-50 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white text-xs font-bold py-3 rounded-xl transition-all hover:bg-slate-800 active:scale-[0.98]"
                    >
                        Got it, back to stack
                    </button>
                </div>
            </div>
        </div>
    );
};