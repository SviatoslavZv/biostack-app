'use client';
import Image from 'next/image';
import { Supplement } from "@/constants/supplements";
import { formatPartnerLink } from "@/utils/links";
import { ExternalLink, Plus, Trash2 } from "lucide-react";

interface Props {
  item: Supplement;
  isSelected: boolean;
  count: number;
  index: number;
  isBestValue?: boolean;
  onUpdateQuantity: (id: string, delta: number) => void;
  onOpenModal: () => void;
  onAdd: () => void;
}

export const SupplementCard = ({
  item,
  isSelected,
  count,
  index,
  isBestValue,
  onUpdateQuantity,
  onOpenModal,
  onAdd
}: Props) => {
  const isPriority = index < 13;

  return (
    <div
      className={`animate-fade-in-up relative flex flex-col p-4 rounded-[2rem] border-2 transition-all duration-500 h-full overflow-hidden group/main-card ${isSelected
        ? 'border-green-500 shadow-lg shadow-green-100/50 bg-gradient-to-b from-green-50/30 to-white'
        : 'border-gray-50 hover:border-green-200 hover:shadow-xl hover:-translate-y-1 bg-white'
        }`}
    >
      {/* 1. Изображение */}
      <div className="relative w-full h-40 mb-2.5 rounded-[1.5rem] bg-gray-50/50 group/img  border border-transparent transition-colors group-hover/main-card:border-green-100/30 group/card">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="relative w-full h-full p-2.5">
            {/* Передняя сторона */}
            <div className="absolute inset-0 p-2.5 transition-all duration-500 group-hover/card:opacity-0 group-hover/card:scale-110">
              <Image
                src={item.imageFront}
                alt={item.name}
                fill
                priority={isPriority}
                className="object-contain drop-shadow-md group-hover/main-card:drop-shadow-xl transition-all duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            </div>
            {/* Задняя сторона - ТУТ ИСПРАВИЛИ SIZES */}
            <div className="absolute inset-0 p-2.5 transition-all duration-700 opacity-0 group-hover/card:opacity-100 group-hover/card:scale-[2.8] origin-center">
              <Image
                src={item.imageBack}
                alt="Facts"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>

        {isBestValue && (
          <div className="absolute top-2.5 left-2.5 bg-green-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full z-20 uppercase shadow-sm">
            Best Value
          </div>
        )}

        <a
          href={formatPartnerLink(item.productUrl)}
          target="_blank"
          className="absolute top-2.5 right-2.5 flex items-center group/link z-30"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="mr-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-green-100 text-green-600 text-[10px] font-bold rounded-full opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 shadow-sm">
            iHerb
          </span>
          <div className="p-1.5 bg-green-50 shadow-sm border border-green-100 text-green-600 rounded-full group-hover/link:bg-green-600 group-hover/link:text-white transition-all duration-300">
            <ExternalLink size={12} />
          </div>
        </a>
      </div>

      {/* 2. Контент */}
      <div className="flex flex-col flex-1 text-center">
        <span className="text-[9px] font-bold text-green-600/60 uppercase tracking-widest leading-none">
          {item.brand}
        </span>

        {/* ТУТ ДОБАВИЛИ min-h-[3rem] ДЛЯ ВЫРАВНИВАНИЯ */}
        <h3
          onClick={onOpenModal}
          className="text-[14px] font-bold text-slate-900 leading-tight line-clamp-2 min-h-[3rem] mt-1.5 mb-2 px-1 
                     cursor-pointer hover:text-green-600 transition-colors mx-auto decoration-green-500/30 hover:underline underline-offset-4"
        >
          {item.name}
        </h3>

        <div className="flex items-baseline justify-center flex-wrap gap-x-8 mt-auto">
          <span className="text-[17px] font-black text-green-600 transition-transform duration-300 group-hover/main-card:scale-110">
            ${item.price}
          </span>
          <span className="text-[11px] font-bold text-slate-500/90 tracking-tight">
            ${(item.price / item.servings).toFixed(2)} / dose
          </span>
        </div>

        {/* Кнопка / Селектор количества */}
        <div className="pt-3">
          {count > 0 ? (
            <div className="flex items-center justify-between bg-green-600 rounded-xl p-1 gap-1 shadow-md shadow-green-200">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg text-white hover:bg-white/30 transition-all font-bold text-xs"
              >
                {count === 1 ? (
                  <Trash2 size={14} className="animate-in fade-in zoom-in duration-300" />
                ) : (
                  "-"
                )}
              </button>
              <span className="text-xs font-black text-white px-2">{count}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg text-white hover:bg-white/30 transition-all font-bold text-xs"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="w-full bg-green-50 text-green-700 text-[11px] font-black py-[11px] rounded-xl transition-all hover:bg-green-600 hover:text-white flex items-center justify-center gap-1.5 uppercase active:scale-95 border border-green-100/50 hover:shadow-lg hover:shadow-green-200/50"
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