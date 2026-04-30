import { useState, useMemo } from 'react';
import {
  LayoutDashboard, ShoppingBag, History, Wallet as WalletIcon,
  Bell, User, Settings, LogOut, Search,
  Menu, X, Sparkles, Filter, TrendingUp, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMarketplace } from '../../../hooks/useMarketplace';
import { useOrders } from '../../../hooks/useOrders';
import { useCreditScore } from '../../../hooks/useCreditScore';
import type { MarketplaceItem } from '../../../hooks/useMarketplace';
import type { Order, CreditHistoryEntry } from '../../../lib/supabase';

// Modular Components
import MarketTab from './MarketTab';
import AnalyticsTab from './AnalyticsTab';
import WalletTab from './WalletTab';
import OrdersTab from './OrdersTab';
import CartDialog from './CartDialog';
import FilterSidebar from './FilterSidebar';
import { toggleInArray, getProductImage } from './utils';

interface RetailerDashboardProps {
  onBack: () => void;
}

export interface CartItem extends MarketplaceItem {
  cartQuantity: number;
}

export default function RetailerDashboard({ onBack }: RetailerDashboardProps) {
  // Tabs & UI State
  const [activeTab, setActiveTab] = useState('market');
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFactories, setSelectedFactories] = useState<string[]>([]);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [collaborativeOnly, setCollaborativeOnly] = useState(false);
  const [financialTags, setFinancialTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [groupBy, setGroupBy] = useState<'none' | 'factory' | 'route'>('none');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    factory: true,
    route: true,
    finance: true,
    price: true
  });

  // Data Hooks
  const { items: allProducts = [], loading } = useMarketplace();
  const { createOrder } = useOrders();
  const { 
    retailer,
    orders = [], 
    creditHistory = [], 
    creditAvailable = 0, 
    utilizationPct = 0, 
    scoreBreakdown, 
    riskLevel = 'متوسط', 
    riskColor = 'yellow' 
  } = useCreditScore();
  const creditUsed = retailer?.credit_used || 0;
  const [cart, setCart] = useState<CartItem[]>([]);

  // Derived Data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allProducts.map(p => p.category)));
    return [
      { id: 'all', name: 'الكل', icon: '📦' },
      ...cats.map(c => ({ id: c, name: c, icon: getProductImage(c) }))
    ];
  }, [allProducts]);

  const allFactories = useMemo(() => Array.from(new Set(allProducts.map(p => p.factory_name))), [allProducts]);
  const allRoutes = ['المسار A', 'المسار B', 'المسار C'];

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.factory_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesFactory = selectedFactories.length === 0 || selectedFactories.includes(p.factory_name);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      
      // Heuristics for filtering
      const charCode = p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1);
      const route = allRoutes[charCode % 3];
      const matchesRoute = selectedRoutes.length === 0 || selectedRoutes.includes(route);
      const matchesCollab = !collaborativeOnly || (route === 'المسار A' || route === 'المسار B');
      
      const isFinanced = p.price <= 18000;
      const isInstant = p.price > 10000;
      const matchesFinancial = financialTags.length === 0 || financialTags.every(tag => {
        if (tag === 'credit') return isFinanced;
        if (tag === 'instant') return isInstant;
        if (tag === 'discount') return matchesCollab;
        return true;
      });

      return matchesSearch && matchesCategory && matchesFactory && matchesPrice && matchesRoute && matchesCollab && matchesFinancial;
    });
  }, [allProducts, searchQuery, selectedCategory, selectedFactories, priceRange, selectedRoutes, collaborativeOnly, financialTags]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory !== 'all') count++;
    count += selectedFactories.length;
    count += selectedRoutes.length;
    if (collaborativeOnly) count++;
    count += financialTags.length;
    if (priceRange[0] > 0 || priceRange[1] < 25000) count++;
    return count;
  }, [searchQuery, selectedCategory, selectedFactories, selectedRoutes, collaborativeOnly, financialTags, priceRange]);

  // Cart logic
  const addToCart = (product: MarketplaceItem) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      updateQuantity(product.id, existing.cartQuantity + 1);
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, cartQuantity: Math.min(newQuantity, item.quantity) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  const groupedByRoute = useMemo(() => {
    return cart.reduce((acc: any, item) => {
      const charCode = item.id.charCodeAt(0) + item.id.charCodeAt(item.id.length - 1);
      const route = allRoutes[charCode % 3];
      if (!acc[route]) acc[route] = [];
      acc[route].push(item);
      return acc;
    }, {});
  }, [cart]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedFactories([]);
    setSelectedRoutes([]);
    setCollaborativeOnly(false);
    setFinancialTags([]);
    setPriceRange([0, 25000]);
    setSearchQuery('');
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    
    try {
      const itemsByFactory = cart.reduce((acc: any, item) => {
        if (!acc[item.factory_id]) acc[item.factory_id] = [];
        acc[item.factory_id].push(item);
        return acc;
      }, {});

      for (const [factoryId, items] of Object.entries(itemsByFactory) as [string, CartItem[]][]) {
        const total = items.reduce((sum, i) => sum + (i.price * i.cartQuantity), 0);
        const finalAmount = total * 0.7; // Apply 30% route discount
        
        const charCode = items[0].id.charCodeAt(0) + items[0].id.charCodeAt(items[0].id.length - 1);
        const route = allRoutes[charCode % 3];

        await createOrder(
          {
            factory_id: factoryId,
            total: finalAmount,
            credit_used: finalAmount,
            route: route,
          },
          items.map(item => ({
            product_id: item.id,
            quantity: item.cartQuantity,
            unit_price: item.price
          }))
        );
      }

      setCart([]);
      setShowCartDialog(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setActiveTab('orders');
      }, 3000);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsCheckingOut(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans" dir="rtl">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0B1B3B] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-[#0B1B3B] tracking-tight">C-ROUTE <span className="text-[#1A73E8]">RETAIL</span></span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'market', label: 'السوق', icon: ShoppingBag },
                { id: 'orders', label: 'مشترياتي', icon: History },
                { id: 'analytics', label: 'التحليلات', icon: TrendingUp },
                { id: 'wallet', label: 'المحفظة', icon: WalletIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm ${
                      active ? 'bg-[#0B1B3B] text-white shadow-xl shadow-blue-900/20 translate-y-[-1px]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Filter Toggle (Only on Market) */}
            {activeTab === 'market' && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold"
              >
                <Filter className="w-4 h-4" />
                تصفية {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-left hidden sm:block">
                <div className="text-xs font-black text-slate-900 uppercase">سوبر ماركت الهناء</div>
                <div className="text-[10px] text-[#1A73E8] font-bold">تاجر بلاتيني</div>
              </div>
              <button className="w-10 h-10 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center hover:ring-4 hover:ring-blue-50 transition-all">
                <User className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <button onClick={onBack} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Only show on market tab */}
          {activeTab === 'market' && (
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
              <FilterSidebar 
                {...{
                  searchQuery, setSearchQuery, openSections, toggleSection,
                  allFactories, selectedFactories, setSelectedFactories,
                  allProducts, allRoutes, selectedRoutes, setSelectedRoutes,
                  collaborativeOnly, setCollaborativeOnly, financialTags, setFinancialTags,
                  priceRange, setPriceRange, activeFilterCount, resetFilters, toggleInArray
                }}
              />
            </div>
          )}

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'market' && (
                <MarketTab 
                  {...{
                    loading, filteredProducts, onAddToCart: addToCart, categories,
                    selectedCategory, setSelectedCategory, groupBy, setGroupBy,
                    viewMode, setViewMode
                  }}
                />
              )}

              {activeTab === 'orders' && (
                <OrdersTab orders={orders} />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsTab 
                  {...{
                    retailer,
                    creditAvailable, utilizationPct, scoreBreakdown, riskLevel, riskColor,
                    orders, creditHistory
                  }}
                />
              )}

              {activeTab === 'wallet' && (
                <WalletTab 
                  creditLimit={retailer?.credit_limit || 0}
                  creditUsed={retailer?.credit_used || 0}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Floating Cart Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCartDialog(true)}
        className="fixed bottom-8 left-8 bg-[#1A73E8] text-white p-5 rounded-full shadow-2xl z-50 flex items-center gap-3 group"
      >
        <div className="relative">
          <ShoppingBag className="w-7 h-7" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              {cartItemsCount}
            </span>
          )}
        </div>
        <div className="flex flex-col items-start pr-2 border-r border-white/20">
          <span className="text-[10px] text-blue-100 font-bold uppercase leading-none mb-1">عرض السلة</span>
          <span className="text-sm font-black tabular-nums">{(cartTotal * 0.7).toLocaleString()} ر.ي</span>
        </div>
      </motion.button>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-50 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {[
          { id: 'market', label: 'السوق', icon: ShoppingBag },
          { id: 'orders', label: 'مشترياتي', icon: History },
          { id: 'analytics', label: 'التحليلات', icon: TrendingUp },
          { id: 'wallet', label: 'المحفظة', icon: WalletIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 transition-all ${
                active ? 'text-[#1A73E8]' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-bold">{tab.label}</span>
              {active && <motion.div layoutId="mobileTab" className="w-1 h-1 bg-[#1A73E8] rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0B1B3B]/90 backdrop-blur-md flex items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-[#0B1B3B] mb-2">تم الطلب بنجاح!</h3>
              <p className="text-slate-500 text-sm mb-6">تم إرسال طلباتك إلى المصانع وجاري التجهيز حالياً.</p>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDialog 
        {...{
          isOpen: showCartDialog,
          onOpenChange: setShowCartDialog,
          cart,
          cartItemsCount,
          groupedByRoute,
          updateQuantity,
          removeFromCart,
          cartTotal,
          isCheckingOut,
          onCheckout: handleCheckout
        }}
      />
    </div>
  );
}
