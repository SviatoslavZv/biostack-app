'use client';

import { SupplementCard } from "@/components/SupplementCard";
import { StackSummary } from "@/components/StackSummary";
import { SmartAlerts } from "@/components/SmartAlerts";
import { CategoryFilters } from "@/components/CategoryFilters";
import { useStackBuilder } from "@/hooks/useStackBuilder";
import { generateIHerbLink, getBestValueId } from "@/utils/stackLogic"; // Объединил импорты
import { SelectedStack } from "@/components/SelectedStack";

export default function Home() {
  // 1. Добавляем 'cart' и 'updateQuantity', убираем старый 'toggleSupplement'
  const {
    cart,
    selectedIds,
    activeCategory,
    setActiveCategory,
    categories,
    updateQuantity,
    filteredSupplements,
    totalPrice,
    allSupplements,
  } = useStackBuilder();

  // Фильтруем все добавки для верхней панели
  const selectedItems = allSupplements.filter(item => selectedIds.includes(item.id));

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* 1. Секция заголовка и фильтров (центрирована для удобства чтения) */}
      <div className="max-w-7xl mx-auto px-6 pt-8 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
          Bio<span className="text-green-600">Stack</span> Builder
        </h1>
        <p className="text-slate-500 mb-8 font-medium">Build your perfect supplement routine.</p>

        <SelectedStack
          selectedItems={selectedItems}
          cart={cart}
          onRemove={(id) => updateQuantity(id, -1000)}
        />

        <div className="my-6">
          <CategoryFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <SmartAlerts selectedIds={selectedIds} />
      </div>

      {/* 2. СЕТКА ТОВАРОВ: Теперь она во всю ширину экрана */}
      <div className="w-full px-4 md:px-8 2xl:px-12 mt-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-5">
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

      <StackSummary
        totalPrice={totalPrice}
        selectedCount={selectedIds.length}
        generateLink={() => generateIHerbLink(cart)}
      />
    </main>
  );
}