'use client';
import { useState, useMemo, useSyncExternalStore } from "react";
import { SupplementCard } from "@/components/SupplementCard";
import { Supplement } from "@/constants/supplements";
import { StackSummary } from "@/components/StackSummary";
import { SmartAlerts } from "@/components/SmartAlerts";
import { Header } from "@/components/Header";
import { useStackBuilder, StackBuilderHook } from "@/hooks/useStackBuilder";
import { generateIHerbLink, getBestValueId } from "@/utils/stackLogic";
import { SidebarStack } from "@/components/SidebarStack";
import { ProductModal } from "@/components/ProductModal";
import { EmptyState } from "@/components/EmptyState";
import { WelcomeHero } from "@/components/WelcomeHero";
import { DisclaimerModal } from "@/components/DisclaimerModal";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Supplement | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'custom' | 'editors'>('custom');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const {
    cart, selectedIds, activeCategory, setActiveCategory,
    updateQuantity, filteredSupplements, totalPrice, allSupplements, analytics, categories,
  } = builder;

  const displaySupplements = useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();
    return filteredSupplements.filter((item) =>
      item.name.toLowerCase().includes(searchLower) ||
      item.brand.toLowerCase().includes(searchLower)
    );
  }, [filteredSupplements, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery("");
  };

  const handleGenerateLink = () => {
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

          <div className="flex-1 pb-12 md:pb-16 flex flex-col justify-between min-h-[calc(100vh-240px)]">
            <div>
              <div className="sticky top-20 z-30 my-6">
                <SmartAlerts
                  cart={cart}
                  allSupplements={allSupplements}
                  onAddProduct={(id) => updateQuantity(id, 1)}
                />
              </div>

              <div className="mb-12">
                <WelcomeHero />
              </div>

              {displaySupplements.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 transition-all duration-300 animate-in fade-in-50">
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
            </div>

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
          </div>

          <SidebarStack
            builder={builder}
            generateLink={handleGenerateLink}
            mode={sidebarMode}
            setMode={setSidebarMode}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
            onOpenProductModal={(product) => setSelectedProduct(product)}
          />
        </div>
      </div>

      <div className="md:hidden">
        <StackSummary
          totalPrice={totalPrice}
          selectedCount={selectedIds.length}
          generateLink={handleGenerateLink}
          analytics={analytics}
        />
      </div>

      <ProductModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </main>
  );
}