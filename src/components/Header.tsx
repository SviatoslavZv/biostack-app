'use client';

import React from 'react';

interface HeaderProps {
  selectedCount: number;
  activeCategory: string; // Текущая категория
  onCategoryChange: (category: string) => void; // Функция смены
}

export const Header = ({ selectedCount, activeCategory, onCategoryChange }: HeaderProps) => {
  const categories = ['All', 'Focus', 'Sleep', 'Energy', 'Longevity', 'Immunity'];

  return (
    <header className="fixed top-0 left-0 right-0 h-[80px] bg-white/80 backdrop-blur-md z-[100] border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto h-full px-8 flex items-center">
        
        {/* ЛЕВО: Логотип */}
        <div 
          className="flex items-center gap-2 mr-12 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onCategoryChange('All')} // Сброс на "All" при клике на лого
        >
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-green-200">
            B
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">
            Biostack
          </span>
        </div>

        {/* КНОПКА КАТЕГОРИЙ */}
        <div className="relative group">
          <button className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100">
            <div className="flex flex-col gap-[3px]">
              <div className="w-3 h-[2px] bg-slate-900 group-hover:w-4 transition-all"></div>
              <div className="w-4 h-[2px] bg-slate-900"></div>
              <div className="w-2 h-[2px] bg-slate-900 group-hover:w-4 transition-all"></div>
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900">
              {activeCategory === 'All' ? 'Explore' : activeCategory}
            </span>
          </button>

          {/* Dropdown меню */}
          <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-[110]">
            {categories.map((category) => (
              <button 
                key={category} 
                onClick={() => onCategoryChange(category)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-[13px] font-bold transition-all flex justify-between items-center group/item ${
                  activeCategory === category 
                  ? 'bg-green-50 text-green-600' 
                  : 'hover:bg-slate-50 text-slate-600 hover:text-green-600'
                }`}
              >
                {category}
                <div className={`w-1.5 h-1.5 bg-green-500 rounded-full transition-transform ${
                  activeCategory === category ? 'scale-100' : 'scale-0 group-hover/item:scale-100'
                }`}></div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1"></div>
      </div>
    </header>
  );
};