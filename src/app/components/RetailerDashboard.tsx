import { useState } from 'react';
import {
  ShoppingCart, Package, CreditCard, Wallet, Clock, TrendingUp, Truck,
  Search, Filter, Plus, Minus, Trash2, ChevronLeft, Star, MapPin,
  TrendingDown, Calendar, CheckCircle, XCircle, AlertCircle, Eye,
  FileText, BarChart3, Award, Zap, Box, DollarSign, ArrowUpRight,
  Hash, Tag, X, ChevronDown, SlidersHorizontal, Flame, Sparkles, Building2, Route as RouteIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';

interface RetailerDashboardProps {
  onBack: () => void;
}

interface CartItem {
  id: number;
  name: string;
  factory: string;
  price: number;
  image: string;
  route: string;
  category: string;
  unit: string;
  quantity: number;
  stock: number;
  rating: number;
}

interface Order {
  id: string;
  date: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  creditUsed: number;
  deliveryDate?: string;
  route: string;
}

export default function RetailerDashboard({ onBack }: RetailerDashboardProps) {
  const [activeTab, setActiveTab] = useState('market');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [selectedFactories, setSelectedFactories] = useState<string[]>([]);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [collaborativeOnly, setCollaborativeOnly] = useState(false);
  const [financialTags, setFinancialTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    factory: true,
    route: true,
    finance: true,
    price: true,
  });
  const toggleSection = (k: string) => setOpenSections((s) => ({ ...s, [k]: !s[k] }));
  const [groupBy, setGroupBy] = useState<'none' | 'factory' | 'category' | 'route' | 'finance'>('none');

  // Credit Info
  const creditInfo = {
    limit: 500000,
    used: 280000,
    available: 220000,
    gracePeriod: 45,
    nextPayment: '2026-05-15',
    paymentAmount: 150000
  };

  // Categories
  const categories = [
    { id: 'all', name: 'الكل', icon: '📦' },
    { id: 'grains', name: 'حبوب', icon: '🌾' },
    { id: 'oils', name: 'زيوت', icon: '🫒' },
    { id: 'dairy', name: 'ألبان', icon: '🥛' },
    { id: 'beverages', name: 'مشروبات', icon: '🥤' },
    { id: 'canned', name: 'معلبات', icon: '🥫' },
  ];

  // Products
  const allProducts: CartItem[] = [
    {
      id: 1,
      name: 'أرز بسمتي فاخر',
      factory: 'مصنع الحبوب اليمني',
      price: 8500,
      image: '🌾',
      route: 'المسار A',
      category: 'grains',
      unit: 'كيس 5 كجم',
      quantity: 1,
      stock: 150,
      rating: 4.8
    },
    {
      id: 2,
      name: 'سكر أبيض نقي',
      factory: 'مصنع التحلية',
      price: 12000,
      image: '🍬',
      route: 'المسار A',
      category: 'grains',
      unit: 'كيس 10 كجم',
      quantity: 1,
      stock: 200,
      rating: 4.5
    },
    {
      id: 3,
      name: 'طحين فاخر',
      factory: 'مطاحن صنعاء',
      price: 15000,
      image: '🌾',
      route: 'المسار B',
      category: 'grains',
      unit: 'كيس 25 كجم',
      quantity: 1,
      stock: 90,
      rating: 4.7
    },
    {
      id: 4,
      name: 'زيت نباتي مكرر',
      factory: 'مصنع الزيوت الوطني',
      price: 18000,
      image: '🫒',
      route: 'المسار A',
      category: 'oils',
      unit: 'جركن 5 لتر',
      quantity: 1,
      stock: 120,
      rating: 4.9
    },
    {
      id: 5,
      name: 'معكرونة سباغيتي',
      factory: 'مصانع المكرونة',
      price: 9500,
      image: '🍝',
      route: 'المسار C',
      category: 'grains',
      unit: 'كرتون 24 عبوة',
      quantity: 1,
      stock: 180,
      rating: 4.6
    },
    {
      id: 6,
      name: 'صلصة طماطم',
      factory: 'مصنع الصلصات',
      price: 6500,
      image: '🍅',
      route: 'المسار B',
      category: 'canned',
      unit: 'كرتون 12 علبة',
      quantity: 1,
      stock: 250,
      rating: 4.4
    },
    {
      id: 7,
      name: 'حليب مجفف كامل الدسم',
      factory: 'مصانع الألبان',
      price: 22000,
      image: '🥛',
      route: 'المسار A',
      category: 'dairy',
      unit: 'كرتون 12 علبة',
      quantity: 1,
      stock: 75,
      rating: 4.7
    },
    {
      id: 8,
      name: 'عصير برتقال طبيعي',
      factory: 'مصنع العصائر',
      price: 14000,
      image: '🥤',
      route: 'المسار B',
      category: 'beverages',
      unit: 'كرتون 24 عبوة',
      quantity: 1,
      stock: 140,
      rating: 4.5
    },
  ];

  // Orders History
  const orders: Order[] = [
    {
      id: 'ORD-2341',
      date: '2026-04-25',
      items: 5,
      total: 125000,
      status: 'delivered',
      creditUsed: 125000,
      deliveryDate: '2026-04-27',
      route: 'المسار A'
    },
    {
      id: 'ORD-2340',
      date: '2026-04-22',
      items: 3,
      total: 85000,
      status: 'shipped',
      creditUsed: 85000,
      deliveryDate: '2026-04-29',
      route: 'المسار B'
    },
    {
      id: 'ORD-2339',
      date: '2026-04-18',
      items: 7,
      total: 180000,
      status: 'processing',
      creditUsed: 180000,
      route: 'المسار A'
    },
    {
      id: 'ORD-2338',
      date: '2026-04-15',
      items: 4,
      total: 95000,
      status: 'delivered',
      creditUsed: 95000,
      deliveryDate: '2026-04-17',
      route: 'المسار C'
    },
  ];

  // Credit History
  const creditHistory = [
    { id: 1, date: '2026-04-25', type: 'استخدام', amount: 125000, description: 'طلب ORD-2341', balance: 280000 },
    { id: 2, date: '2026-04-20', type: 'سداد', amount: -100000, description: 'تسديد دفعة', balance: 155000 },
    { id: 3, date: '2026-04-18', type: 'استخدام', amount: 180000, description: 'طلب ORD-2339', balance: 255000 },
    { id: 4, date: '2026-04-15', type: 'استخدام', amount: 95000, description: 'طلب ORD-2338', balance: 75000 },
  ];

  const allFactories = Array.from(new Set(allProducts.map(p => p.factory)));
  const allRoutes = Array.from(new Set(allProducts.map(p => p.route)));

  // Heuristics for badges (deterministic, based on product id/route/price)
  const isCollaborative = (p: CartItem) => p.route === 'المسار A' || p.route === 'المسار B';
  const isFinanced = (p: CartItem) => p.price <= 18000;
  const isInstantSettlement = (p: CartItem) => p.id % 2 === 0;
  const routeDiscount = (p: CartItem) => (isCollaborative(p) ? 30 : 0);

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.factory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesFactory = selectedFactories.length === 0 || selectedFactories.includes(product.factory);
    const matchesRoute = selectedRoutes.length === 0 || selectedRoutes.includes(product.route);
    const matchesCollab = !collaborativeOnly || isCollaborative(product);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesFinance = financialTags.length === 0 || financialTags.every(t => {
      if (t === 'credit') return isFinanced(product);
      if (t === 'instant') return isInstantSettlement(product);
      if (t === 'discount') return routeDiscount(product) > 0;
      return true;
    });
    return matchesSearch && matchesCategory && matchesFactory && matchesRoute && matchesCollab && matchesPrice && matchesFinance;
  });

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedFactories.length +
    selectedRoutes.length +
    (collaborativeOnly ? 1 : 0) +
    financialTags.length +
    (priceRange[0] !== 0 || priceRange[1] !== 25000 ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedFactories([]);
    setSelectedRoutes([]);
    setCollaborativeOnly(false);
    setFinancialTags([]);
    setPriceRange([0, 25000]);
    setSearchQuery('');
  };

  const toggleInArray = (arr: string[], v: string, setter: (a: string[]) => void) => {
    setter(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  };

  // Cart functions
  const addToCart = (product: CartItem) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.min(newQuantity, item.stock) } : item
    ));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Group cart by route
  const groupedByRoute = cart.reduce((acc: any, item) => {
    if (!acc[item.route]) acc[item.route] = [];
    acc[item.route].push(item);
    return acc;
  }, {});

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-blue-100 text-blue-700 border-blue-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    return icons[status];
  };

  const getStatusText = (status: Order['status']) => {
    const texts = {
      pending: 'قيد الانتظار',
      processing: 'قيد المعالجة',
      shipped: 'قيد الشحن',
      delivered: 'تم التسليم',
      cancelled: 'ملغي',
    };
    return texts[status];
  };

  const tabs = [
    { id: 'market', label: 'السوق', icon: Package },
    { id: 'orders', label: 'طلباتي', icon: ShoppingCart },
    { id: 'credit', label: 'سجل الائتمان', icon: CreditCard },
    { id: 'wallet', label: 'المحفظة', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-[#1A73E8] to-[#0B1B3B] text-white sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>العودة</span>
              </button>
              <div className="w-px h-6 bg-white/30" />
              <h1 className="text-2xl">لوحة التاجر</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4" />
                <span>الحد المتاح: {creditInfo.available.toLocaleString()} ر.ي</span>
              </div>
              <button
                onClick={() => setShowCartDialog(true)}
                className="relative p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Credit Progress */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">استخدام الحد الائتماني</span>
              <span className="text-sm text-white">
                {creditInfo.used.toLocaleString()} / {creditInfo.limit.toLocaleString()} ر.ي
              </span>
            </div>
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all"
                style={{ width: `${(creditInfo.used / creditInfo.limit) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-white/70">
              <span>الدفعة القادمة: {creditInfo.nextPayment}</span>
              <span>المبلغ: {creditInfo.paymentAmount.toLocaleString()} ر.ي</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-[165px] z-30">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 transition-all relative ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="retailerActiveTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'market' && (
            <motion.div
              key="market"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Top toolbar: Search */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3 mb-6 flex items-center gap-3 shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ابحث في كتالوج المصانع — منتج، مصنع، أو وحدة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-11 pl-4 py-2.5 bg-slate-50/60 border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#1A73E8] focus:bg-white transition-all"
                  />
                </div>
                <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="px-2 text-slate-500">العرض حسب:</span>
                  {[
                    { id: 'none', label: 'الكل' },
                    { id: 'factory', label: 'المصنع' },
                    { id: 'category', label: 'الصنف' },
                    { id: 'route', label: 'المسار' },
                    { id: 'finance', label: 'الشروط المالية' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setGroupBy(opt.id as typeof groupBy)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        groupBy === opt.id
                          ? 'bg-white text-[#1A73E8] shadow-sm border border-blue-100'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-xs">
                  <span className="text-slate-600">{filteredProducts.length}</span>
                  <span className="text-[#1A73E8]">منتج مطابق</span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {/* Filters Sidebar */}
                <aside className="col-span-12 lg:col-span-3">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm sticky top-[200px]">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-[#1A73E8]" />
                        <h3 className="text-sm text-slate-900">الفلاتر المتقدمة</h3>
                        {activeFilterCount > 0 && (
                          <span className="ml-1 text-[10px] bg-[#1A73E8] text-white rounded-full px-1.5 py-0.5">
                            {activeFilterCount}
                          </span>
                        )}
                      </div>
                      {activeFilterCount > 0 && (
                        <button onClick={resetFilters} className="text-[11px] text-slate-500 hover:text-[#1A73E8] transition-colors">
                          مسح الكل
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-slate-100">
                      {/* Category */}
                      <FilterSection
                        title="الأصناف"
                        icon={<Tag className="w-3.5 h-3.5" />}
                        open={openSections.category}
                        onToggle={() => toggleSection('category')}
                      >
                        <div className="space-y-1">
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(cat.id)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                selectedCategory === cat.id
                                  ? 'bg-blue-50 text-[#1A73E8] border border-blue-100'
                                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                              }`}
                            >
                              <span>{cat.name}</span>
                              <span className="text-[11px] text-slate-400">
                                {cat.id === 'all'
                                  ? allProducts.length
                                  : allProducts.filter(p => p.category === cat.id).length}
                              </span>
                            </button>
                          ))}
                        </div>
                      </FilterSection>

                      {/* Factories */}
                      <FilterSection
                        title="المصانع المورّدة"
                        icon={<Building2 className="w-3.5 h-3.5" />}
                        open={openSections.factory}
                        onToggle={() => toggleSection('factory')}
                      >
                        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                          {allFactories.map((f) => {
                            const checked = selectedFactories.includes(f);
                            return (
                              <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
                                <span
                                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                    checked
                                      ? 'bg-[#1A73E8] border-[#1A73E8]'
                                      : 'border-slate-300 group-hover:border-[#1A73E8]'
                                  }`}
                                >
                                  {checked && <CheckCircle className="w-3 h-3 text-white" strokeWidth={3} />}
                                </span>
                                <span className="text-sm text-slate-700 flex-1">{f}</span>
                                <span className="text-[11px] text-slate-400">
                                  {allProducts.filter(p => p.factory === f).length}
                                </span>
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={checked}
                                  onChange={() => toggleInArray(selectedFactories, f, setSelectedFactories)}
                                />
                              </label>
                            );
                          })}
                        </div>
                      </FilterSection>

                      {/* Routes */}
                      <FilterSection
                        title="المسارات اللوجستية"
                        icon={<RouteIcon className="w-3.5 h-3.5" />}
                        open={openSections.route}
                        onToggle={() => toggleSection('route')}
                      >
                        <label className="flex items-center justify-between mb-3 px-3 py-2.5 rounded-lg bg-blue-50/60 border border-blue-100 cursor-pointer">
                          <div>
                            <div className="text-sm text-slate-900">المسار التعاوني فقط</div>
                            <div className="text-[11px] text-slate-500">شحنات مجمّعة بخصم ٣٠٪</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCollaborativeOnly(!collaborativeOnly)}
                            className={`relative w-10 h-5 rounded-full transition-colors ${
                              collaborativeOnly ? 'bg-[#1A73E8]' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                                collaborativeOnly ? 'right-0.5' : 'right-[22px]'
                              }`}
                            />
                          </button>
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {allRoutes.map((r) => {
                            const active = selectedRoutes.includes(r);
                            return (
                              <button
                                key={r}
                                onClick={() => toggleInArray(selectedRoutes, r, setSelectedRoutes)}
                                className={`px-2.5 py-1 rounded-md text-[11px] border transition-all ${
                                  active
                                    ? 'bg-[#0B1B3B] text-white border-[#0B1B3B]'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#1A73E8]/40'
                                }`}
                              >
                                {r}
                              </button>
                            );
                          })}
                        </div>
                      </FilterSection>

                      {/* Financial Terms */}
                      <FilterSection
                        title="الشروط المالية"
                        icon={<CreditCard className="w-3.5 h-3.5" />}
                        open={openSections.finance}
                        onToggle={() => toggleSection('finance')}
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'credit', label: 'ائتمان متاح', icon: CreditCard },
                            { id: 'instant', label: 'تسوية فورية', icon: Zap },
                            { id: 'discount', label: 'خصم مسار', icon: Flame },
                          ].map((t) => {
                            const Icon = t.icon;
                            const active = financialTags.includes(t.id);
                            return (
                              <button
                                key={t.id}
                                onClick={() => toggleInArray(financialTags, t.id, setFinancialTags)}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] border transition-all ${
                                  active
                                    ? 'bg-blue-50 text-[#1A73E8] border-[#1A73E8]/40'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#1A73E8]/40'
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                                <span>{t.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </FilterSection>

                      {/* Price */}
                      <FilterSection
                        title="نطاق السعر"
                        icon={<DollarSign className="w-3.5 h-3.5" />}
                        open={openSections.price}
                        onToggle={() => toggleSection('price')}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-[#1A73E8]"
                          />
                          <span className="text-slate-400 text-xs">—</span>
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 0])}
                            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-[#1A73E8]"
                          />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={25000}
                          step={500}
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full accent-[#1A73E8]"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>٠ ر.ي</span>
                          <span>٢٥٬٠٠٠ ر.ي</span>
                        </div>
                      </FilterSection>
                    </div>
                  </div>
                </aside>

                {/* Products area */}
                <div className="col-span-12 lg:col-span-9">
                  {/* Active filter chips */}
                  {activeFilterCount > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-[11px] text-slate-500">فلاتر نشطة:</span>
                      {selectedCategory !== 'all' && (
                        <Chip onRemove={() => setSelectedCategory('all')}>
                          {categories.find(c => c.id === selectedCategory)?.name}
                        </Chip>
                      )}
                      {collaborativeOnly && (
                        <Chip onRemove={() => setCollaborativeOnly(false)}>مسار تعاوني</Chip>
                      )}
                      {selectedFactories.map(f => (
                        <Chip key={f} onRemove={() => toggleInArray(selectedFactories, f, setSelectedFactories)}>{f}</Chip>
                      ))}
                      {selectedRoutes.map(r => (
                        <Chip key={r} onRemove={() => toggleInArray(selectedRoutes, r, setSelectedRoutes)}>{r}</Chip>
                      ))}
                      {financialTags.map(t => (
                        <Chip key={t} onRemove={() => toggleInArray(financialTags, t, setFinancialTags)}>
                          {t === 'credit' ? 'ائتمان' : t === 'instant' ? 'تسوية فورية' : 'خصم مسار'}
                        </Chip>
                      ))}
                    </div>
                  )}

                  {filteredProducts.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-20 text-center">
                      <div className="w-14 h-14 mx-auto rounded-full bg-slate-50 flex items-center justify-center mb-3">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="text-slate-900 mb-1">لا توجد منتجات مطابقة</h3>
                      <p className="text-sm text-slate-500 mb-4">جرّب توسيع نطاق الفلاتر أو إعادة ضبطها.</p>
                      <button onClick={resetFilters} className="text-sm text-[#1A73E8] hover:underline">
                        إعادة ضبط الفلاتر
                      </button>
                    </div>
                  ) : groupBy !== 'none' ? (
                    <div className="space-y-6">
                      {(() => {
                        const groupKey = (p: CartItem): string => {
                          if (groupBy === 'factory') return p.factory;
                          if (groupBy === 'category') return categories.find(c => c.id === p.category)?.name || p.category;
                          if (groupBy === 'route') return p.route;
                          if (groupBy === 'finance') {
                            const tags = [
                              isFinanced(p) ? 'ائتمان متاح' : null,
                              isInstantSettlement(p) ? 'تسوية فورية' : null,
                              routeDiscount(p) > 0 ? 'خصم مسار' : null,
                            ].filter(Boolean) as string[];
                            return tags.length ? tags[0] : 'بدون شروط خاصة';
                          }
                          return '';
                        };
                        const groups = filteredProducts.reduce((acc: Record<string, CartItem[]>, p) => {
                          const k = groupKey(p);
                          (acc[k] = acc[k] || []).push(p);
                          return acc;
                        }, {});
                        return Object.entries(groups).map(([groupName, items]) => (
                          <section key={groupName} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                            <header className="flex items-center justify-between px-5 py-3 bg-gradient-to-l from-slate-50 to-white border-b border-slate-100">
                              <div className="flex items-center gap-2.5">
                                <span className="w-1.5 h-5 rounded-full bg-[#1A73E8]" />
                                <h3 className="text-sm text-[#0B1B3B]">{groupName}</h3>
                                <span className="text-[11px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-100">
                                  {items.length} منتج
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                {(items.reduce((s, i) => s + i.price, 0) / items.length).toFixed(0)} ر.ي متوسط السعر
                              </span>
                            </header>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                              {items.map((product) => (
                                <ProductCard
                                  key={product.id}
                                  product={product}
                                  collab={isCollaborative(product)}
                                  financed={isFinanced(product)}
                                  instant={isInstantSettlement(product)}
                                  discount={routeDiscount(product)}
                                  onAdd={() => addToCart(product)}
                                />
                              ))}
                            </div>
                          </section>
                        ));
                      })()}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredProducts.map((product) => {
                        const collab = isCollaborative(product);
                        const financed = isFinanced(product);
                        const instant = isInstantSettlement(product);
                        const discount = routeDiscount(product);
                        return (
                          <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-[0_18px_40px_-20px_rgba(26,115,232,0.35)] hover:border-[#1A73E8]/30 transition-all flex flex-col"
                          >
                            <div className="h-32 bg-gradient-to-br from-slate-50 to-blue-50/40 flex items-center justify-center text-5xl relative border-b border-slate-100">
                              <span className="opacity-90">{product.image}</span>
                              <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end">
                                <span className="px-2 py-0.5 rounded-md text-[10px] bg-white/90 backdrop-blur text-slate-700 border border-slate-200">
                                  {product.route}
                                </span>
                                {discount > 0 && (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-500 text-white inline-flex items-center gap-1">
                                    <Flame className="w-2.5 h-2.5" />
                                    خصم {discount}٪
                                  </span>
                                )}
                              </div>
                              <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-md">
                                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                <span className="text-[10px] text-slate-700">{product.rating}</span>
                              </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                              <h3 className="text-slate-900 mb-0.5 text-sm">{product.name}</h3>
                              <p className="text-[11px] text-slate-500 mb-2">{product.factory}</p>

                              <div className="flex flex-wrap gap-1 mb-3">
                                {financed && (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-[#1A73E8] border border-blue-100">
                                    <CreditCard className="w-2.5 h-2.5" /> ائتمان
                                  </span>
                                )}
                                {instant && (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-100">
                                    <Zap className="w-2.5 h-2.5" /> تسوية فورية
                                  </span>
                                )}
                                {collab && (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">
                                    <Sparkles className="w-2.5 h-2.5" /> تعاوني
                                  </span>
                                )}
                              </div>

                              <div className="flex items-end justify-between mb-3 mt-auto">
                                <div>
                                  <div className="text-lg text-[#0B1B3B]">
                                    {product.price.toLocaleString()}
                                    <span className="text-[10px] text-slate-500 mr-1">ر.ي</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500">{product.unit}</div>
                                </div>
                                <div className={`text-[10px] ${product.stock < 100 ? 'text-red-600' : 'text-green-600'}`}>
                                  {product.stock} متوفر
                                </div>
                              </div>

                              <button
                                onClick={() => addToCart(product)}
                                className="w-full bg-[#1A73E8] hover:bg-[#0B57C9] text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>إضافة للسلة</span>
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-sm text-slate-600">إجمالي الطلبات</div>
                  </div>
                  <div className="text-3xl text-slate-900">{orders.length}</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-sm text-slate-600">المكتملة</div>
                  </div>
                  <div className="text-3xl text-slate-900">
                    {orders.filter(o => o.status === 'delivered').length}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-sm text-slate-600">إجمالي القيمة</div>
                  </div>
                  <div className="text-3xl text-slate-900">
                    {(orders.reduce((sum, o) => sum + o.total, 0) / 1000).toFixed(0)}k
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="text-sm text-slate-600">التوفير الكلي</div>
                  </div>
                  <div className="text-3xl text-slate-900">30%</div>
                </div>
              </div>

              {/* Orders List */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl text-slate-900">سجل الطلبات</h2>
                </div>
                <div className="divide-y divide-slate-200">
                  {orders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                              <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-lg text-slate-900 mb-1">{order.id}</div>
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Calendar className="w-4 h-4" />
                                <span>{order.date}</span>
                                <span>•</span>
                                <MapPin className="w-4 h-4" />
                                <span>{order.route}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl text-slate-900 mb-1">
                              {order.total.toLocaleString()} ر.ي
                            </div>
                            <div className="text-sm text-slate-500">{order.items} منتجات</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-lg text-xs border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                              <StatusIcon className="w-3 h-3" />
                              {getStatusText(order.status)}
                            </span>
                            {order.deliveryDate && (
                              <span className="text-xs text-slate-500">
                                التسليم: {order.deliveryDate}
                              </span>
                            )}
                          </div>
                          <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>التفاصيل</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'credit' && (
            <motion.div
              key="credit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Credit Summary */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-blue-200">الحد الائتماني الكلي</h3>
                    <CreditCard className="w-8 h-8 text-blue-200" />
                  </div>
                  <div className="text-4xl mb-2">{creditInfo.limit.toLocaleString()}</div>
                  <div className="text-sm text-blue-200">ريال يمني</div>
                </div>
                <div className="bg-gradient-to-br from-amber-600 to-amber-600 text-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-amber-200">المستخدم</h3>
                    <TrendingUp className="w-8 h-8 text-amber-200" />
                  </div>
                  <div className="text-4xl mb-2">{creditInfo.used.toLocaleString()}</div>
                  <div className="text-sm text-amber-200">
                    {((creditInfo.used / creditInfo.limit) * 100).toFixed(1)}% من الحد
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-600 text-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-green-200">المتاح</h3>
                    <Wallet className="w-8 h-8 text-green-200" />
                  </div>
                  <div className="text-4xl mb-2">{creditInfo.available.toLocaleString()}</div>
                  <div className="text-sm text-green-200">
                    {((creditInfo.available / creditInfo.limit) * 100).toFixed(1)}% متاح
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gradient-to-l from-blue-50 to-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg text-slate-900 mb-1">الدفعة القادمة</h3>
                      <p className="text-sm text-slate-600">
                        فترة سماح {creditInfo.gracePeriod} يوم • تاريخ الاستحقاق: {creditInfo.nextPayment}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl text-blue-600 mb-1">
                      {creditInfo.paymentAmount.toLocaleString()} ر.ي
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      سداد الآن
                    </button>
                  </div>
                </div>
              </div>

              {/* Credit History */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl text-slate-900">سجل المعاملات الائتمانية</h2>
                </div>
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm text-slate-600">التاريخ</th>
                      <th className="px-6 py-3 text-right text-sm text-slate-600">النوع</th>
                      <th className="px-6 py-3 text-right text-sm text-slate-600">الوصف</th>
                      <th className="px-6 py-3 text-right text-sm text-slate-600">المبلغ</th>
                      <th className="px-6 py-3 text-right text-sm text-slate-600">الرصيد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {creditHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-600">{item.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs ${
                            item.type === 'استخدام'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.description}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${
                            item.amount > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()} ر.ي
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {item.balance.toLocaleString()} ر.ي
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <Wallet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl text-slate-600 mb-2">المحفظة قريباً</h3>
              <p className="text-sm text-slate-400">سيتم إضافة ميزات المحفظة قريباً</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cart Dialog */}
      <Dialog.Root open={showCartDialog} onOpenChange={setShowCartDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-0 left-0 bottom-0 bg-white w-full max-w-md shadow-2xl z-50 overflow-y-auto" dir="rtl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <Dialog.Title className="text-xl text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                السلة ({cartItemsCount} منتج)
              </Dialog.Title>
              <Dialog.Close className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-16 px-6">
                <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg text-slate-600 mb-2">السلة فارغة</h3>
                <p className="text-sm text-slate-400">ابدأ بإضافة منتجات من السوق</p>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-4">
                  {Object.entries(groupedByRoute).map(([route, items]: [string, any]) => (
                    <div key={route} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200">
                        <Truck className="w-5 h-5 text-orange-600" />
                        <span className="text-sm text-slate-900">{route}</span>
                        <span className="text-xs text-slate-500">({items.length} منتجات)</span>
                      </div>
                      <div className="space-y-3">
                        {items.map((item: CartItem) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-2xl">
                              {item.image}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm text-slate-900 mb-1">{item.name}</h4>
                              <div className="text-xs text-slate-500 mb-2">{item.price.toLocaleString()} ر.ي</div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="mr-auto text-red-600 hover:bg-red-50 p-1 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-900">
                                {(item.price * item.quantity).toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500">ر.ي</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">المجموع الفرعي</span>
                      <span className="text-sm text-slate-900">{cartTotal.toLocaleString()} ر.ي</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-600">التوفير من المسار التعاوني</span>
                      <span className="text-sm text-green-600">-{(cartTotal * 0.3).toLocaleString()} ر.ي</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-300">
                      <span className="text-lg text-slate-900">الإجمالي</span>
                      <span className="text-2xl text-blue-600">{(cartTotal * 0.7).toLocaleString()} ر.ي</span>
                    </div>
                  </div>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span>إتمام الطلب بالائتمان</span>
                  </button>
                  <p className="text-xs text-center text-slate-500 mt-3">
                    فترة سماح {creditInfo.gracePeriod} يوم • بدون فوائد
                  </p>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function FilterSection({
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-2 group"
      >
        <span className="flex items-center gap-2 text-[11px] tracking-wider text-slate-500 uppercase">
          <span className="text-[#1A73E8]">{icon}</span>
          {title}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pt-1 pb-1">{children}</div>}
    </div>
  );
}

function Chip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[11px] text-[#1A73E8]">
      {children}
      <button onClick={onRemove} className="hover:text-[#0B1B3B] transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function ProductCard({
  product,
  collab,
  financed,
  instant,
  discount,
  onAdd,
}: {
  product: any;
  collab: boolean;
  financed: boolean;
  instant: boolean;
  discount: number;
  onAdd: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-[0_18px_40px_-20px_rgba(26,115,232,0.35)] hover:border-[#1A73E8]/30 transition-all flex flex-col">
      <div className="h-32 bg-gradient-to-br from-slate-50 to-blue-50/40 flex items-center justify-center text-5xl relative border-b border-slate-100">
        <span className="opacity-90">{product.image}</span>
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end">
          <span className="px-2 py-0.5 rounded-md text-[10px] bg-white/90 backdrop-blur text-slate-700 border border-slate-200">
            {product.route}
          </span>
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-500 text-white inline-flex items-center gap-1">
              <Flame className="w-2.5 h-2.5" />
              خصم {discount}٪
            </span>
          )}
        </div>
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-md">
          <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
          <span className="text-[10px] text-slate-700">{product.rating}</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-slate-900 mb-0.5 text-sm">{product.name}</h3>
        <p className="text-[11px] text-slate-500 mb-2">{product.factory}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {financed && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-[#1A73E8] border border-blue-100">
              <CreditCard className="w-2.5 h-2.5" /> ائتمان
            </span>
          )}
          {instant && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-100">
              <Zap className="w-2.5 h-2.5" /> تسوية فورية
            </span>
          )}
          {collab && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">
              <Sparkles className="w-2.5 h-2.5" /> تعاوني
            </span>
          )}
        </div>
        <div className="flex items-end justify-between mb-3 mt-auto">
          <div>
            <div className="text-lg text-[#0B1B3B]">
              {product.price.toLocaleString()}
              <span className="text-[10px] text-slate-500 mr-1">ر.ي</span>
            </div>
            <div className="text-[10px] text-slate-500">{product.unit}</div>
          </div>
          <div className={`text-[10px] ${product.stock < 100 ? 'text-red-600' : 'text-green-600'}`}>
            {product.stock} متوفر
          </div>
        </div>
        <button
          onClick={onAdd}
          className="w-full bg-[#1A73E8] hover:bg-[#0B57C9] text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>إضافة للسلة</span>
        </button>
      </div>
    </div>
  );
}
