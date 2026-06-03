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
import { WelcomeHero } from "@/components/WelcomeHero";
import { DisclaimerModal } from "@/components/DisclaimerModal";

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
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);


  const {
    cart, selectedIds, activeCategory, setActiveCategory,
    updateQuantity, filteredSupplements, totalPrice, allSupplements, analytics, clearStack, categories,
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
        categories={categories}
        onCategoryChange={handleCategoryChange}
        activeCategory={activeCategory}
        selectedCount={selectedIds.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="pt-20 md:pt-24 px-4 md:px-8 2xl:px-12 max-w-[1920px] mx-auto">
        <div className="flex gap-8">

          {/* ЛЕВАЯ КОНТЕНТНАЯ ЧАСТЬ (Flex-коллектор для прижатия футера) */}
          <div className="flex-1 pb-12 md:pb-16 flex flex-col justify-between min-h-[calc(100vh-240px)]">

            {/* ПЕРВЫЙ ПРЯМОЙ ПОТОМОК: ВЕРХНЯЯ ЗОНА (Объединяет ВСЕ элементы каталога) */}
            <div>
              <div className="sticky top-20 z-30 my-6">
                {/* Передаем актуальную корзину и полную базу добавок из хука builder */}
                <SmartAlerts cart={cart} allSupplements={allSupplements} />
              </div>

              {/* ХЕРО-БАННЕР */}
              <div className="mb-12">
                <WelcomeHero />
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
                    handleCategoryChange("All");
                  }}
                />
              )}
            </div> {/* <-- ВОТ ТУТ МЫ ЗАКРЫВАЕМ ВЕРХНЮЮ ЗОНУ! В твоем коде этот тег стоял выше */}

            {/* ВТОРОЙ ПРЯМОЙ ПОТОМОК: НИЖНЯЯ ЗОНА (Информационный футер) */}
            {/* Теперь он находится строго внутри левой части и justify-between прижмет его к полу */}
            <div className="mt-10 pt-8 border-t border-slate-100 space-y-2 text-center md:text-left">
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">
                BioStack — Independent Budgeting Tool
              </p>
              <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
                This application is an independent development tool for supplement budget planning and routine tracking.
                It is not affiliated with or endorsed by the iHerb brand.
                ⭐ <button
                  onClick={() => setIsDisclaimerOpen(true)}
                  className="text-green-600 hover:text-green-700 font-bold underline underline-offset-2 transition-colors"
                >
                  Medical Disclaimer & Terms of Use
                </button>
              </p>
            </div>

          </div> {/* <-- ЗАКРЫВАЕМ ЛЕВУЮ КОНТЕНТНУЮ ЧАСТЬ */}

          {/* САЙДБАР БИЛДЕРА (Теперь он будет третьим полноценным соседом справа) */}
          {/* Сайдбар теперь получает функцию открытия дисклеймера */}
          <SidebarStack
            builder={builder}
            generateLink={handleGenerateLink}
            mode={sidebarMode}
            setMode={setSidebarMode}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)} // <-- Передаем пропсом вниз
          />
        </div> {/* <-- ЗАКРЫВАЕМ КОНТЕЙНЕР flex gap-8 */}
      </div> {/* <-- ЗАКРЫВАЕМ МАКСИМАЛЬНЫЙ ОГРАНИЧИТЕЛЬ max-w-[1920px] */}


      {/* Мобильный футер суммирования */}
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

      {/* МОДАЛЬНОЕ ОКНО ДИСКЛЕЙМЕРА */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </main>
  );
}