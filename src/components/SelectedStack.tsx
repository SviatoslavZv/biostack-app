import { Supplement } from "@/constants/supplements";

interface Props {
  selectedItems: Supplement[];
  cart: { id: string; count: number }[]; // ДОБАВЛЯЕМ: данные о количестве
  onRemove: (id: string) => void;
}

export const SelectedStack = ({ selectedItems, cart, onRemove }: Props) => {
  if (selectedItems.length === 0) return null;

  return (
    <div className="mb-10 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
        Your Current Stack ({selectedItems.length})
      </h3>
      <div className="flex flex-wrap gap-3">
        {selectedItems.map((item) => {
          // Находим количество для этого конкретного товара
          const quantity = cart.find(c => c.id === item.id)?.count || 1;

          return (
            <div 
              key={item.id}
              className="group relative bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 animate-in zoom-in-95 duration-200"
            >
              <div>
                <div className="flex items-center gap-2">
                   <p className="text-sm font-bold text-slate-800 leading-none">{item.name}</p>
                   {/* Отображаем количество, если оно больше 1 */}
                   {quantity > 1 && (
                     <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-md font-black">
                       ×{quantity}
                     </span>
                   )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{item.category}</p>
              </div>
              <button 
                onClick={() => onRemove(item.id)}
                className="text-slate-300 hover:text-red-500 transition-colors ml-2 font-bold"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};