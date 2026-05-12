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
import { PresetItem } from "@/constants/presets";



// Функция-заглушка для проверки наличия окна
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Home() {
  // Этот хук вернет true только на клиенте и false на сервере. 
  // Без всяких useEffect и лишних рендеров!
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isClient) {
    return <div className="min-h-screen bg-white" />;
  }

  // Теперь вызываем контент, внутри которого будет жить наш хук
  return <HomeSafeContent />;
}

// Создаем промежуточный компонент, который безопасно инициализирует хук
function HomeSafeContent() {
  const builder = useStackBuilder(); // Хук вызывается ТОЛЬКО когда мы уже на клиенте
  return <HomeContent builder={builder} />;
}

// Теперь типизация пропсов максимально строгая
function HomeContent({ builder }: { builder: StackBuilderHook }) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarMode, setSidebarMode] = useState<'custom' | 'editors'>('custom');
  const [selectedProduct, setSelectedProduct] = useState<Supplement | null>(null);
  const [toast, setToast] = useState({ isVisible: false, message: '' });

  const {
    cart, selectedIds, activeCategory, setActiveCategory,
    updateQuantity, filteredSupplements, totalPrice, allSupplements, setStackPreset, analytics
  } = builder;

  const displaySupplements = useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();
    return filteredSupplements.filter((item) =>
      item.name.toLowerCase().includes(searchLower) ||
      item.brand.toLowerCase().includes(searchLower)
    );
  }, [filteredSupplements, searchQuery]);

  const selectedItems = useMemo(() =>
    allSupplements.filter((item) => selectedIds.includes(item.id)),
    [allSupplements, selectedIds]
  );

  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setActiveCategory(category);
    setSearchQuery("");
    setTimeout(() => setIsLoading(false), 300);
  };

  const showToast = (message: string) => {
    setToast({ isVisible: false, message: '' });
    setTimeout(() => setToast({ isVisible: true, message }), 10);
  };

  return (
    <main className="min-h-screen bg-white">
      <Header
        onCategoryChange={handleCategoryChange}
        activeCategory={activeCategory}
        selectedCount={cart.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="pt-32 md:pt-40 px-4 md:px-8 2xl:px-12 max-w-[1920px] mx-auto">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="mb-8">
              <SmartAlerts selectedIds={selectedIds} />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <SupplementSkeleton key={i} />)}
              </div>
            ) : displaySupplements.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {displaySupplements.map((item) => (
                  <SupplementCard
                    key={item.id}
                    item={item}
                    index={0}
                    isSelected={selectedIds.includes(item.id)}
                    isBestValue={item.id === getBestValueId(allSupplements, item.subType)}
                    count={cart.find(c => c.id === item.id)?.count || 0}
                    onUpdateQuantity={updateQuantity}
                    onOpenModal={() => setSelectedProduct(item)}
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

          <SidebarStack
            mode={sidebarMode}
            setMode={setSidebarMode}
            setStackPreset={(items: PresetItem[], name: string) => {
              setStackPreset(items);
              showToast(`Preset "${name}" applied!`);
            }}
            selectedItems={selectedItems}
            cart={cart}
            onUpdateQuantity={updateQuantity}
            totalPrice={totalPrice}
            generateLink={() => window.open(generateIHerbLink(cart), '_blank')}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            analytics={analytics}
          />
        </div>
      </div>

      <StackSummary
        totalPrice={totalPrice}
        selectedCount={selectedIds.length}
        generateLink={() => window.open(generateIHerbLink(cart), '_blank')}
        analytics={builder.analytics} // Передаем аналитику сюда!
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <ProductModal item={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </main>
  );
}