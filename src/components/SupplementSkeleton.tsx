'use client';
import React from 'react';

export const SupplementSkeleton = () => {
    return (
        <div className="relative flex flex-col p-4 rounded-[2rem] border-2 border-gray-50 bg-white h-full overflow-hidden">
            {/* 1. Имитация изображения */}
            <div className="relative w-full h-40 mb-2.5 rounded-[1.5rem] bg-slate-100 animate-pulse" />

            {/* 2. Контент */}
            <div className="flex flex-col flex-1 items-center space-y-3 pt-2">
                {/* Бренд */}
                <div className="h-2 w-16 bg-slate-100 rounded-full animate-pulse" />

                {/* Название (две строки) */}
                <div className="h-4 w-full bg-slate-100 rounded-full animate-pulse" />
                <div className="h-4 w-2/3 bg-slate-100 rounded-full animate-pulse" />

                {/* Цена и доза */}
                <div className="flex gap-4 mt-auto pt-4">
                    <div className="h-6 w-12 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="h-6 w-16 bg-slate-100 rounded-lg animate-pulse" />
                </div>

                {/* Кнопка */}
                <div className="w-full h-10 bg-slate-50 rounded-xl mt-4 animate-pulse" />
            </div>
        </div>
    );
};