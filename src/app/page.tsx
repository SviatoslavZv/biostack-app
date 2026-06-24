'use client';
import { useState, useMemo, useSyncExternalStore } from "react";
import { SupplementCard } from "@/components/SupplementCard";
import { Supplement } from "@/constants/supplements";
import { StackSummary } from "@/components/StackSummary";
import { SmartAlerts } from "@/components/SmartAlerts";
import { Header } from "@/components/Header";
import { useStackBuilder, StackBuilderHook } from "@/hooks/useStackBuilder";
import { generateIHerbLink, getBestValueId } from "@/utils/stackLogic";
import { formatPartnerLink, shareLink, isMobileDevice } from "@/utils/links";
import { SidebarStack } from "@/components/SidebarStack";
import { SharePopover } from "@/components/SharePopover";
import { ProductModal } from "@/components/ProductModal";
import { EmptyState } from "@/components/EmptyState";
import { WelcomeHero } from "@/components/WelcomeHero";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { Toast } from "@/components/Toast";
import { Trash2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PresetsList } from "@/components/PresetsList";
import { CartItemsList } from "@/components/CartItemsList";

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
  const [mobileTab, setMobileTab] = useState<'home' | 'presets' | 'stack'>('home');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({
    message: '',
    isVisible: false,
  });
  const [shareUrl, setShareUrl] = useState<string>('');
  const [shareTitle, setShareTitle] = useState<string>('');


  // const showToast = (message: string) => {
  //   setToast({ message, isVisible: true });
  // };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };



  const {
    cart, selectedIds, activeCategory, setActiveCategory,
    updateQuantity, filteredSupplements, totalPrice, allSupplements, analytics, categories, replaceInCart, setStackPreset,
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

  const handleShareProduct = async (productUrl: string, productName: string, rect: DOMRect) => {
    if ('share' in navigator && isMobileDevice()) {
      await shareLink(formatPartnerLink(productUrl), productName);
      return;
    }
    // Десктоп — открываем SharePopover с данными этого товара
    setShareUrl(formatPartnerLink(productUrl));
    setShareTitle(productName);
    setAnchorRect(rect);
    setIsShareOpen(true);
  };

  const handleOpenShare = async (rect: DOMRect) => {
    if ('share' in navigator && isMobileDevice()) {
      await shareLink(generateIHerbLink(cart), 'My BioStack supplement stack');
      return;
    }
    // Десктоп — записываем данные стека и открываем попап
    setShareUrl(generateIHerbLink(cart));
    setShareTitle('My BioStack supplement stack');
    setAnchorRect(rect);
    setIsShareOpen(true);
  };

  return (
    <main className="min-h-screen bg-white">
      <Header
        categories={categories}
        onCategoryChange={handleCategoryChange}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="pt-20 md:pt-24 px-4 md:px-8 2xl:px-12 max-w-[1920px] mx-auto">
        <div className="flex gap-8">

          <div className={`flex-1 pb-36 sm:pb-28 md:pb-16 flex-col justify-between min-h-[calc(100vh-240px)] ${mobileTab === 'home' ? 'flex' : 'hidden'} md:flex`}>
            <div>
              <div className="sticky top-20 z-30 my-6">
                <SmartAlerts
                  cart={cart}
                  allSupplements={allSupplements}
                  onAddProduct={(id) => updateQuantity(id, 1)}
                  optimizations={analytics.optimizations}
                  onReplace={replaceInCart}
                />
              </div>

              <div className="mb-12">
                <WelcomeHero />
              </div>

              {displaySupplements.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 transition-all duration-300 animate-in fade-in-50">
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
                      onShare={handleShareProduct}
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
              <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">
                BioStack — Independent Budgeting Tool
              </p>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
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
            onShare={handleOpenShare}
          />
        </div>
      </div>



      {mobileTab === 'presets' && (
        <div className="md:hidden px-4 pt-6 pb-8">
          <PresetsList
            activeCategory={activeCategory}
            setStackPreset={setStackPreset}
            onSelect={() => setMobileTab('stack')} />
        </div>
      )}

      {mobileTab === 'stack' && (
        <div className="md:hidden fixed inset-x-0 top-[80px] bottom-[64px] flex flex-col z-10">
          {/* Хедер вкладки — фиксированная высота, не скроллится */}
          <div className="flex items-center justify-between px-4 py-1 bg-white border-b border-slate-100 shrink-0">
            <h2 className="text-xl font-black text-slate-900 italic tracking-tight">Your Stack</h2>
            {selectedIds.length > 0 && (
              <button onClick={() => builder.clearStack()} className="p-2 text-slate-400 hover:text-red-500 transition-colors group" title="Clear all">
                <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>

          {/* Список товаров — скроллится независимо */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <CartItemsList
              cart={cart}
              allSupplements={allSupplements}
              updateQuantity={updateQuantity}
              onOpenProductModal={(product) => setSelectedProduct(product)}
            />
          </div>

          {/* StackSummary — всегда прибит к низу, не скроллится */}
          <div className="shrink-0 bg-white border-t border-slate-100">
            <StackSummary
              totalPrice={totalPrice}
              selectedCount={selectedIds.length}
              generateLink={handleGenerateLink}
              analytics={analytics} isSidebar={true}
              onShare={handleOpenShare}
            />
            <div className="text-center pb-4 -mt-3">
              <button
                onClick={() => setIsDisclaimerOpen(true)}
                className="text-[15px] text-green-700 hover:text-green-600 font-semibold tracking-wide uppercase transition-colors underline-offset-4 hover:underline"
              >
                Medical Disclaimer
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav
        activeTab={mobileTab}
        setActiveTab={setMobileTab}
        stackCount={selectedIds.length}
      />

      <ProductModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onShare={handleShareProduct}
      />

      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {isShareOpen && anchorRect && (
        <SharePopover
          url={shareUrl}
          title={shareTitle}
          heading={shareTitle === 'My BioStack supplement stack' ? 'Share your stack' : 'Share this product'}
          onClose={() => setIsShareOpen(false)}
          anchorRect={anchorRect}
        />
      )}

    </main>
  );
}