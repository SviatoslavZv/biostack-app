'use client';
import React, { useState } from "react";
import { SupplementCard } from "@/components/SupplementCard";
import { StackSummary } from "@/components/StackSummary";
import { SmartAlerts } from "@/components/SmartAlerts";
import { Header } from "@/components/Header";
import { useStackBuilder } from "@/hooks/useStackBuilder";
import { generateIHerbLink, getBestValueId } from "@/utils/stackLogic";
import { SidebarStack } from "@/components/SidebarStack";


export default function Home() {
  // Достаем всё необходимое из хука
  const {
    cart,
    selectedIds,
    activeCategory,    // Используем это вместо category
    setActiveCategory, // Используем это вместо setCategory
    updateQuantity,
    filteredSupplements, // Это уже отфильтрованный список товаров
    totalPrice,
    allSupplements,
  } = useStackBuilder();

  const [sidebarMode, setSidebarMode] = useState<'custom' | 'editors'>('custom');

  // Находим объекты выбранных товаров для сайдбара
  const selectedItems = allSupplements.filter(item => selectedIds.includes(item.id));

  return (
    <main className="min-h-screen bg-white">
      {/* 1. ПЕРЕДАЕМ ПРАВИЛЬНЫЕ ПРОПСЫ В HEADER */}
      <Header 
        selectedCount={cart.length} 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      <div className="pt-32 md:pt-40 px-4 md:px-8 2xl:px-12 max-w-[1920px] mx-auto">
        <div className="flex gap-8">

          {/* ЛЕВАЯ ЧАСТЬ: Сетка товаров */}
          <div className="flex-1">
            <div className="mb-8">
              <SmartAlerts selectedIds={selectedIds} />
            </div>

            {/* 2. ИСПОЛЬЗУЕМ filteredSupplements НАПРЯМУЮ */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
              {filteredSupplements.map((item, index) => {
                const cartItem = cart.find(c => c.id === item.id);
                const currentCount = cartItem ? cartItem.count : 0;
                const bestValueId = getBestValueId(allSupplements, item.subType);

                return (
                  <SupplementCard
                    key={item.id}
                    item={item}
                    index={index}
                    isSelected={selectedIds.includes(item.id)}
                    isBestValue={item.id === bestValueId}
                    count={currentCount}
                    onUpdateQuantity={updateQuantity}
                  />
                );
              })}
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: Сайдбар */}
          <SidebarStack
            mode={sidebarMode}
            setMode={setSidebarMode}
            selectedItems={selectedItems}
            cart={cart}
            onUpdateQuantity={updateQuantity}
            totalPrice={totalPrice}
            generateLink={() => window.open(generateIHerbLink(cart), '_blank')}
          />
        </div>
      </div>

      <StackSummary
        totalPrice={totalPrice}
        selectedCount={selectedIds.length}
        generateLink={() => generateIHerbLink(cart)}
      />
    </main>
  );
}