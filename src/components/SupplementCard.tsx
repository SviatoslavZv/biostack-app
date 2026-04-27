import Image from 'next/image';
import { Supplement } from "@/constants/supplements";
import { formatPartnerLink } from "@/utils/links";
import { ExternalLink, Plus } from "lucide-react";

interface Props {
  item: Supplement;
  isSelected: boolean;
  count: number;
  index: number;
  isBestValue?: boolean;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export const SupplementCard = ({ item, isSelected, count, index, isBestValue, onUpdateQuantity }: Props) => {
  const isPriority = index < 8; 

  return (
    <div className={`relative flex flex-col p-3 rounded-[1.5rem] border-2 transition-all duration-500 h-full group/card bg-white ${
      isSelected 
        ? 'border-green-500 shadow-lg shadow-green-100/50' 
        : 'border-gray-50 hover:border-green-200 hover:shadow-md'
    }`}>
      
      {/* 1. Изображение (еще компактнее: h-32) */}
      <div className="relative w-full h-32 mb-1.5 rounded-[1.2rem] bg-gray-50/50 group/img overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-700 group-hover/card:scale-110 z-10 pointer-events-none">
          <div className="relative w-full h-full p-2">
            <div className="absolute inset-0 p-2 transition-opacity duration-500 group-hover/card:opacity-0">
              <Image 
                src={item.imageFront} 
                alt={item.name} 
                fill 
                priority={isPriority} 
                className="object-contain" 
                sizes="200px"
              />
            </div>
            <div className="absolute inset-0 p-2 transition-opacity duration-500 opacity-0 group-hover/card:opacity-100">
              <Image 
                src={item.imageBack} 
                alt="Facts" 
                fill 
                className="object-contain" 
                sizes="200px"
              />
            </div>
          </div>
        </div>

        {isBestValue && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-[6px] font-black px-1.5 py-0.5 rounded-full z-20 uppercase">
            Best Value
          </div>
        )}

        <a 
          href={formatPartnerLink(item.productUrl)} 
          target="_blank" 
          className="absolute top-2 right-2 flex items-center group/link z-30"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="mr-1 px-2 py-0.5 bg-white border border-gray-100 text-green-600 text-[8px] font-bold rounded-full opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 shadow-sm">
            iHerb
          </span>
          <div className="p-1 bg-white shadow-sm border border-gray-100 text-slate-400 rounded-full group-hover/link:bg-green-600 group-hover/link:text-white transition-all">
            <ExternalLink size={10} />
          </div>
        </a>
      </div>

      {/* 2. Контент */}
      <div className="flex flex-col flex-1">
        <span className="text-[7px] font-bold text-green-600/60 uppercase tracking-widest leading-none">
          {item.brand}
        </span>
        <h3 className="text-[12px] font-bold text-slate-900 leading-tight line-clamp-2 min-h-[2rem] mt-0.5 mb-1 group-hover/card:text-green-700 transition-colors">
          {item.name}
        </h3>

        {/* Цена (предотвращаем вылет текста за границы) */}
        <div className="flex items-baseline flex-wrap gap-x-2 mt-auto">
          <span className="text-sm font-black text-green-600">${item.price}</span>
          <span className="text-[8px] font-bold text-slate-400 truncate">
            ${(item.price / item.servings).toFixed(2)}/dose
          </span>
        </div>

        {/* Кнопка (в одну строку, компактная) */}
        <div className="pt-2">
          {count > 0 ? (
            <div className="flex items-center justify-between bg-green-600 rounded-lg p-0.5 gap-1">
              <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white/20 rounded text-white hover:bg-white/30 transition-all font-bold text-xs">−</button>
              <span className="text-[10px] font-black text-white">{count}</span>
              <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white/20 rounded text-white hover:bg-white/30 transition-all font-bold text-xs">+</button>
            </div>
          ) : (
            <button 
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="w-full bg-green-50 text-green-700 text-[9px] font-black py-2 rounded-lg transition-all hover:bg-green-600 hover:text-white flex items-center justify-center gap-1 uppercase active:scale-95 border border-green-100/50"
            >
              <Plus size={10} strokeWidth={4} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};