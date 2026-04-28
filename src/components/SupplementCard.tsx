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
    // Увеличили p-3 -> p-4, rounded-[1.5rem] -> rounded-[2rem]
    <div className={`relative flex flex-col p-4 rounded-[2rem] border-2 transition-all duration-500 h-full bg-white ${isSelected
        ? 'border-green-500 shadow-lg shadow-green-100/50'
        : 'border-gray-50 hover:border-green-200 hover:shadow-md'
      }`}>

      {/* 1. Изображение (Контейнер с overflow-hidden обязателен для эффекта лупы) */}
      <div className="relative w-full h-40 mb-2.5 rounded-[1.5rem] bg-gray-50/50 group/card group/img overflow-hidden border border-transparent transition-colors group-hover/card:border-green-100/50">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="relative w-full h-full p-2.5">
            
            {/* Передняя сторона (просто исчезает) */}
            <div className="absolute inset-0 p-2.5 transition-all duration-500 group-hover/card:opacity-0 group-hover/card:scale-150">
              <Image 
                src={item.imageFront} 
                alt={item.name} 
                fill 
                priority={isPriority} 
                className="object-contain" 
                sizes="250px"
              />
            </div>

            {/* Задняя сторона (СОСТАВ) — Эффект "Лупы" */}
            <div className="absolute inset-0 p-2.5 transition-all duration-700 opacity-0 group-hover/card:opacity-100 group-hover/card:scale-[2.8] origin-center">
              <Image 
                src={item.imageBack} 
                alt="Facts" 
                fill 
                className="object-contain" 
                sizes="400px" // Увеличили для четкости при зуме
              />
            </div>
          </div>
        </div>

        {/* Бейдж Best Value (теперь поверх всего в этом блоке) */}
        {isBestValue && (
          <div className="absolute top-2.5 left-2.5 bg-green-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full z-20 uppercase shadow-sm">
            Best Value
          </div>
        )}

        {/* Кнопка iHerb (теперь поверх всего в этом блоке) */}
        <a 
  href={formatPartnerLink(item.productUrl)} 
  target="_blank" 
  className="absolute top-2.5 right-2.5 flex items-center group/link z-30" // Убедись, что z-30, чтобы быть поверх зума
  onClick={(e) => e.stopPropagation()}
>
  {/* Текст "iHerb" — теперь всегда с зеленым текстом */}
  <span className="mr-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-green-100 text-green-600 text-[10px] font-bold rounded-full opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 shadow-sm">
    iHerb
  </span>

  {/* Контейнер иконки — теперь изначально зеленый */}
  <div className="p-1.5 bg-green-50 shadow-sm border border-green-100 text-green-600 rounded-full group-hover/link:bg-green-600 group-hover/link:text-white transition-all duration-300">
    <ExternalLink size={12} />
  </div>
</a>
      </div>

      {/* 2. Контент — теперь всё по центру */}
      <div className="flex flex-col flex-1 text-center"> {/* Добавили text-center */}
        
        {/* Бренд */}
        <span className="text-[9px] font-bold text-green-600/60 uppercase tracking-widest leading-none">
          {item.brand}
        </span>

        {/* Название — убираем mt-1 и mb-1.5, заменяем на mx-auto для контроля ширины */}
        <h3 className="text-[14px] font-bold text-slate-900 leading-tight line-clamp-2 min-h-[2.5rem] mt-1.5 mb-2 px-1 group-hover/card:text-green-700 transition-colors mx-auto">
          {item.name}
        </h3>

        {/* Цена и доза — Увеличили расстояние (gap-x-3) и улучшили читаемость */}
        <div className="flex items-baseline justify-center flex-wrap gap-x-8 mt-auto">
          {/* Основная цена (оставляем без изменений или чуть увеличиваем до text-[17px]) */}
          <span className="text-[17px] font-black text-green-600">${item.price}</span>
          
          {/* Стоимость за порцию — сделали темнее (text-slate-500) и чуть крупнее (text-[11px]) */}
          <span className="text-[11px] font-bold text-slate-500/90 truncate tracking-tight">
            ${(item.price / item.servings).toFixed(2)} / dose
          </span>
        </div>

        {/* Кнопка — она по умолчанию растягивается на всю ширину, тут всё ок */}
        <div className="pt-3">
          {count > 0 ? (
            <div className="flex items-center justify-between bg-green-600 rounded-xl p-1 gap-1">
              <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg text-white hover:bg-white/30 transition-all font-bold text-xs">−</button>
              <span className="text-xs font-black text-white">{count}</span>
              <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg text-white hover:bg-white/30 transition-all font-bold text-xs">+</button>
            </div>
          ) : (
            <button 
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="w-full bg-green-50 text-green-700 text-[11px] font-black py-2.5 rounded-xl transition-all hover:bg-green-600 hover:text-white flex items-center justify-center gap-1.5 uppercase active:scale-95 border border-green-100/50"
            >
              <Plus size={12} strokeWidth={4} />
              <span>Add TO STACK</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};