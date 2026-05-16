'use client';
import React, { useState, useMemo, useSyncExternalStore } from "react";
import { SupplementCard } from "@/components/SupplementCard";
import { Supplement } from "@/constants/supplements";
import { StackSummary } from "@/components/StackSummary";
import { SmartAlerts } from "@/components/SmartAlerts";
import { Header } from "@/components/Header";
import { useStackBuilder, StackBuilderHook } from "@/hooks/useStackBuilder";
import { generateIHerbLink, getBestValueId } from "@/utils/stackLogic";
import { SidebarStack } from "@/components/SidebarStack";
import { Toast } from "@/components/Toast";
import { ProductModal } from "@/components/ProductModal";
import { EmptyState } from "@/components/EmptyState";
import { SupplementSkeleton } from "@/components/SupplementSkeleton";

// Оставляем логику для гидратации
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Home() {
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!isClient) return <div className="min-h-screen bg-white" />;
  return <HomeSafeContent />;
}

function HomeSafeContent() {
  const builder = useStackBuilder();
  return <HomeContent builder={builder} />;
}

function HomeContent({ builder }: { builder: StackBuilderHook }) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Supplement | null>(null);
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const [sidebarMode, setSidebarMode] = useState<'custom' | 'editors'>('custom');

  const {
    cart, selectedIds, activeCategory, setActiveCategory,
    updateQuantity, filteredSupplements, totalPrice, allSupplements, analytics, clearStack
  } = builder;

  const displaySupplements = useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();
    return filteredSupplements.filter((item) =>
      item.name.toLowerCase().includes(searchLower) ||
      item.brand.toLowerCase().includes(searchLower)
    );
  }, [filteredSupplements, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setActiveCategory(category);
    setSearchQuery("");
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleGenerateLink = () => {
    // Используем актуальную корзину из builder
    window.open(generateIHerbLink(cart), '_blank');
  };



  return (
    <main className="min-h-screen bg-white">
      <Header
        onCategoryChange={handleCategoryChange}
        activeCategory={activeCategory}
        selectedCount={selectedIds.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="pt-32 md:pt-40 px-4 md:px-8 2xl:px-12 max-w-[1920px] mx-auto">
        <div className="flex gap-8">
          <div className="flex-1 pb-32"> {/* Добавил отступ снизу для мобильной панели */}
            <div className="mb-8">
              <SmartAlerts selectedIds={selectedIds} />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {[...Array(8)].map((_, i) => <SupplementSkeleton key={i} />)}
              </div>
            ) : displaySupplements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 transition-all duration-500 animate-in fade-in">
                {displaySupplements.map((item, index) => (
                  <SupplementCard
                    key={item.id}
                    item={item}
                    index={index}
                    isSelected={selectedIds.includes(item.id)}
                    isBestValue={item.id === getBestValueId(allSupplements, item.subType)}
                    count={cart.find(c => c.id === item.id)?.count || 0}
                    onUpdateQuantity={updateQuantity}
                    onOpenModal={() => setSelectedProduct(item)}
                    onAdd={() => builder.updateQuantity(item.id, 1)}

                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nothing found"
                description="Try another search or category"
                onReset={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              />
            )}
          </div>

          {/* Сайдбар теперь получает всё необходимое через builder */}
          <SidebarStack
            builder={builder}
            generateLink={handleGenerateLink}
            mode={sidebarMode} // Передаем текущий режим
            setMode={setSidebarMode} // Передаем функцию изменения
          />
        </div>
      </div>


      {/* Этот компонент покажется ТОЛЬКО на мобилках, так как в SidebarStack мы его скрыли через md:hidden */}
      <div className="md:hidden">
        <StackSummary
          totalPrice={totalPrice}
          selectedCount={selectedIds.length}
          generateLink={handleGenerateLink}
          analytics={analytics}
        />
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <ProductModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}