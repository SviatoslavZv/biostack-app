import { PARTNER_CONFIG } from "@/constants/config";

interface Props {
    totalPrice: number;
    selectedCount: number;
    generateLink: () => string; // Передаем функцию как пропс
}

export const StackSummary = ({ totalPrice, selectedCount, generateLink }: Props) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border shadow-2xl p-6 rounded-2xl flex justify-between items-center z-50">
            <div>
                <p className="text-sm text-gray-500">Total Price ({selectedCount}):</p>
                <p className="text-2xl font-bold text-slate-900">${totalPrice.toFixed(2)}</p>
            </div>
            <a
                href={generateLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-transform active:scale-95 text-center"
            >
                Buy with Discount
            </a>
        </div>
    );
};