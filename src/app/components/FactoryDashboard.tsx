import { useState } from 'react';
import {
  Truck, DollarSign, TrendingUp, Package, FileText, Wallet, Plus,
  Search, Filter, Edit2, Trash2, Image as ImageIcon, BarChart3,
  Box, Tag, Calendar, Hash, X, ChevronDown, Check, Upload,
  AlertCircle, TrendingDown, ShoppingCart, Archive, ChevronLeft,
  Activity, Crown, ArrowUpRight, ArrowDownRight, Clock, MapPin,
  Sparkles, Download, Zap, Target, Award, Layers, Eye
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadialBarChart,
  RadialBar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend
} from 'recharts';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { motion, AnimatePresence } from 'motion/react';
import SupplyChainIntel from './SupplyChainIntel';

interface FactoryDashboardProps {
  onBack: () => void;
}

// Built-in Units (وحدات مبنية في النظام)
const UNITS = [
  { id: 'kg', name: 'كيلوجرام', symbol: 'كجم' },
  { id: 'g', name: 'جرام', symbol: 'جم' },
  { id: 'ton', name: 'طن', symbol: 'طن' },
  { id: 'liter', name: 'لتر', symbol: 'لتر' },
  { id: 'ml', name: 'ملليلتر', symbol: 'مل' },
  { id: 'carton', name: 'كرتون', symbol: 'كرتون' },
  { id: 'box', name: 'علبة', symbol: 'علبة' },
  { id: 'piece', name: 'قطعة', symbol: 'قطعة' },
  { id: 'bottle', name: 'عبوة', symbol: 'عبوة' },
  { id: 'pack', name: 'حزمة', symbol: 'حزمة' },
  { id: 'bag', name: 'كيس', symbol: 'كيس' },
  { id: 'can', name: 'علبة معدنية', symbol: 'علبة' },
  { id: 'jar', name: 'جركن', symbol: 'جركن' },
];

// Built-in Categories (فئات مبنية في النظام)
const CATEGORIES = [
  { id: 'beverages', name: 'مشروبات', icon: '🥤', color: 'blue' },
  { id: 'food', name: 'منتجات غذائية', icon: '🍽️', color: 'green' },
  { id: 'dairy', name: 'ألبان ومشتقاتها', icon: '🥛', color: 'cyan' },
  { id: 'bakery', name: 'مخبوزات', icon: '🍞', color: 'amber' },
  { id: 'oils', name: 'زيوت وسمن', icon: '🫒', color: 'yellow' },
  { id: 'canned', name: 'معلبات', icon: '🥫', color: 'orange' },
  { id: 'grains', name: 'حبوب ومكرونة', icon: '🌾', color: 'lime' },
  { id: 'spices', name: 'توابل وبهارات', icon: '🌶️', color: 'red' },
  { id: 'sweets', name: 'حلويات', icon: '🍬', color: 'pink' },
  { id: 'cleaning', name: 'مواد تنظيف', icon: '🧹', color: 'purple' },
];

interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  price: number;
  barcode?: string;
  expiryDate?: string;
  description?: string;
  image?: string;
  minStock: number;
  createdAt: string;
}

// Analytics dataset (mock)
const revenueSeries = [
  { m: 'يناير', rev: 78, set: 72, ret: 4 },
  { m: 'فبراير', rev: 84, set: 80, ret: 3 },
  { m: 'مارس', rev: 92, set: 86, ret: 5 },
  { m: 'أبريل', rev: 105, set: 99, ret: 4 },
  { m: 'مايو', rev: 118, set: 110, ret: 6 },
  { m: 'يونيو', rev: 124, set: 119, ret: 3 },
];

const productMix = [
  { name: 'حبوب', value: 34, color: '#1A73E8' },
  { name: 'زيوت', value: 22, color: '#0B1B3B' },
  { name: 'ألبان', value: 18, color: '#15803D' },
  { name: 'معلبات', value: 14, color: '#B45309' },
  { name: 'أخرى', value: 12, color: '#94A3B8' },
];

const topProducts = [
  { name: 'أرز بسمتي فاخر', units: 4820, revenue: 18400000, share: 92 },
  { name: 'زيت نباتي مكرر', units: 3210, revenue: 14600000, share: 76 },
  { name: 'سكر أبيض نقي', units: 2950, revenue: 11200000, share: 64 },
  { name: 'حليب مجفف', units: 1840, revenue: 9300000, share: 52 },
  { name: 'طحين فاخر', units: 1620, revenue: 7800000, share: 44 },
];

const geoData = [
  { city: 'صنعاء', value: 4200 },
  { city: 'عدن', value: 3100 },
  { city: 'الحديدة', value: 2400 },
  { city: 'تعز', value: 1850 },
];

const activityFeed = [
  { icon: Truck, title: 'شحنة SH-2487 سُلِّمت إلى تاجر صنعاء', sub: 'المسار A • تسوية فورية بقيمة ٤٫٢M ر.ي', time: 'منذ ٣د', tone: 'bg-blue-50 text-[#1A73E8]' },
  { icon: DollarSign, title: 'تسوية مالية مكتملة', sub: '٣٢ شحنة • إجمالي ١٢٫٨M ر.ي', time: 'منذ ١٥د', tone: 'bg-green-50 text-green-700' },
  { icon: Package, title: 'طلب جديد من مطاحن عدن', sub: '١٢٠ كرتون أرز بسمتي', time: 'منذ ٣٤د', tone: 'bg-amber-50 text-amber-700' },
  { icon: Truck, title: 'تجميع شحنة تعاونية', sub: 'المسار B • ٤ تجار في حمولة واحدة', time: 'منذ ١ﺳ', tone: 'bg-blue-50 text-[#1A73E8]' },
  { icon: Award, title: 'تجاوز هدف الشهر بنسبة ١٢٪', sub: 'إجمالي الإيرادات ١٢٤٫٨M ر.ي', time: 'منذ ٢ﺳ', tone: 'bg-blue-50 text-[#0B1B3B]' },
];

const alerts = [
  { icon: AlertCircle, title: 'مخزون منخفض: زيت نباتي', sub: 'تبقّى ١٨ وحدة دون الحد الأدنى', cls: 'bg-amber-50 border-amber-100 text-amber-800' },
  { icon: Clock, title: 'تأخّر تسوية واحدة', sub: 'الشحنة SH-2461 — ٧ ساعات', cls: 'bg-red-50 border-red-100 text-red-800' },
  { icon: TrendingUp, title: 'ارتفاع طلب على المسار C', sub: 'فرصة لرفع التسعير ٤–٦٪', cls: 'bg-blue-50 border-blue-100 text-blue-800' },
];

export default function FactoryDashboard({ onBack }: FactoryDashboardProps) {
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Sample products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'P-001',
      name: 'أرز بسمتي فاخر',
      category: 'grains',
      unit: 'kg',
      quantity: 1250,
      price: 8500,
      barcode: '6281234567890',
      minStock: 200,
      description: 'أرز بسمتي درجة أولى مستورد',
      createdAt: '2026-04-15'
    },
    {
      id: 'P-002',
      name: 'زيت نباتي',
      category: 'oils',
      unit: 'liter',
      quantity: 580,
      price: 12000,
      barcode: '6281234567891',
      minStock: 100,
      expiryDate: '2027-03-20',
      description: 'زيت نباتي مكرر 100%',
      createdAt: '2026-04-10'
    },
    {
      id: 'P-003',
      name: 'سكر أبيض',
      category: 'food',
      unit: 'kg',
      quantity: 890,
      price: 4500,
      barcode: '6281234567892',
      minStock: 150,
      description: 'سكر أبيض نقي',
      createdAt: '2026-04-12'
    },
    {
      id: 'P-004',
      name: 'حليب مجفف',
      category: 'dairy',
      unit: 'carton',
      quantity: 320,
      price: 15000,
      barcode: '6281234567893',
      minStock: 50,
      expiryDate: '2027-02-15',
      description: 'حليب مجفف كامل الدسم',
      createdAt: '2026-04-08'
    },
    {
      id: 'P-005',
      name: 'معكرونة سباغيتي',
      category: 'grains',
      unit: 'carton',
      quantity: 450,
      price: 6500,
      barcode: '6281234567894',
      minStock: 80,
      description: 'معكرونة سباغيتي إيطالية',
      createdAt: '2026-04-05'
    },
  ]);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    unit: '',
    quantity: 0,
    price: 0,
    barcode: '',
    expiryDate: '',
    description: '',
    minStock: 0,
  });

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.barcode?.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  const lowStockProducts = products.filter(p => p.quantity <= p.minStock).length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `P-${String(products.length + 1).padStart(3, '0')}`,
      name: formData.name!,
      category: formData.category!,
      unit: formData.unit!,
      quantity: formData.quantity!,
      price: formData.price!,
      barcode: formData.barcode,
      expiryDate: formData.expiryDate,
      description: formData.description,
      minStock: formData.minStock!,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts([...products, newProduct]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? { ...editingProduct, ...formData }
          : p
      ));
      setEditingProduct(null);
      resetForm();
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      unit: '',
      quantity: 0,
      price: 0,
      barcode: '',
      expiryDate: '',
      description: '',
      minStock: 0,
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsAddDialogOpen(true);
  };

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  };

  const getUnitInfo = (unitId: string) => {
    return UNITS.find(u => u.id === unitId) || UNITS[0];
  };

  const shipments = [
    { id: 'SH-001', destination: 'متجر الأمل - صنعاء', items: '50 كرتون أرز', status: 'قيد التوصيل', amount: 425000 },
    { id: 'SH-002', destination: 'سوبر ماركت النور - عدن', items: '30 كرتون سكر', status: 'تم التسليم', amount: 360000 },
    { id: 'SH-003', destination: 'بقالة السلام - تعز', items: '40 جركن زيت', status: 'قيد التوصيل', amount: 720000 },
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
              <h1 className="text-2xl">لوحة المصنع</h1>
            </div>
            <div className="text-sm bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              مصنع الحبوب اليمني
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/70">إجمالي المنتجات</div>
                  <div className="text-2xl">{totalProducts}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/70">قيمة المخزون</div>
                  <div className="text-2xl">{(totalValue / 1000000).toFixed(1)}م</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/70">مخزون منخفض</div>
                  <div className="text-2xl text-amber-300">{lowStockProducts}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/70">إجمالي الكميات</div>
                  <div className="text-2xl">{totalQuantity.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-[145px] z-30">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'products', label: 'إدارة المنتجات', icon: Box },
              { id: 'shipments', label: 'الشحنات', icon: Truck },
              { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
              { id: 'wallet', label: 'المحفظة', icon: Wallet },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 transition-all relative ${
                    activeTab === tab.id
                      ? 'text-emerald-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="factoryActiveTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
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
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="ابحث عن منتج بالاسم أو الباركود..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="all">جميع الفئات</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setEditingProduct(null);
                    setIsAddDialogOpen(true);
                  }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const category = getCategoryInfo(product.category);
                  const unit = getUnitInfo(product.unit);
                  const isLowStock = product.quantity <= product.minStock;

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Product Image */}
                      <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-16 h-16 text-slate-300" />
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 rounded-lg text-xs bg-white/90 backdrop-blur text-slate-700 border border-slate-200">
                            {category.icon} {category.name}
                          </span>
                        </div>
                        {isLowStock && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 rounded-lg text-xs bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              مخزون منخفض
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg text-slate-900 mb-1">{product.name}</h3>
                            <p className="text-xs text-slate-500">رمز: {product.id}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">الكمية المتوفرة</span>
                            <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-emerald-600'}`}>
                              {product.quantity.toLocaleString()} {unit.symbol}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">السعر</span>
                            <span className="text-slate-900 font-bold">{product.price.toLocaleString()} ر.ي</span>
                          </div>
                          {product.barcode && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">الباركود</span>
                              <span className="text-slate-900 font-mono text-xs">{product.barcode}</span>
                            </div>
                          )}
                          {product.expiryDate && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">تاريخ الانتهاء</span>
                              <span className="text-slate-900 text-xs">{product.expiryDate}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditDialog(product)}
                            className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>تعديل</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <Box className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg text-slate-600 mb-2">لا توجد منتجات</h3>
                  <p className="text-sm text-slate-400">ابدأ بإضافة منتجات جديدة</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'shipments' && (
            <motion.div
              key="shipments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <h2 className="text-xl mb-6">الشحنات الصادرة</h2>
              <table className="w-full">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm text-slate-600">رقم الشحنة</th>
                    <th className="px-4 py-3 text-right text-sm text-slate-600">الوجهة</th>
                    <th className="px-4 py-3 text-right text-sm text-slate-600">المحتوى</th>
                    <th className="px-4 py-3 text-right text-sm text-slate-600">الحالة</th>
                    <th className="px-4 py-3 text-right text-sm text-slate-600">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {shipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-emerald-600">{shipment.id}</td>
                      <td className="px-4 py-4">{shipment.destination}</td>
                      <td className="px-4 py-4 text-slate-600">{shipment.items}</td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">{shipment.amount.toLocaleString()} ر.ي</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header bar */}
              <div className="bg-gradient-to-l from-[#0B1B3B] to-[#1A73E8] rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#1A73E8]/30 rounded-full blur-3xl" />
                <div className="relative flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="text-[11px] tracking-[0.25em] text-white/80">FACTORY INTELLIGENCE</span>
                    </div>
                    <h2 className="text-2xl mb-1">لوحة التحليلات التنفيذية</h2>
                    <p className="text-sm text-white/70">رؤية شاملة لأداء المصنع — الإيرادات، الإنتاجية، والتوزيع الجغرافي</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur rounded-xl border border-white/15">
                      {['اليوم', 'الأسبوع', 'الشهر', 'الربع', 'السنة'].map((p, i) => (
                        <button
                          key={p}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            i === 2 ? 'bg-white text-[#0B1B3B]' : 'text-white/80 hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <button className="px-3 py-2 bg-white/10 backdrop-blur border border-white/15 rounded-xl text-xs text-white hover:bg-white/15 flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      تصدير التقرير
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-12 gap-4">
                <KpiCard
                  label="صافي الإيرادات"
                  value="١٢٤٫٨M"
                  unit="ر.ي"
                  delta={12.4}
                  icon={DollarSign}
                  accent="primary"
                  className="col-span-12 md:col-span-6 lg:col-span-3"
                />
                <KpiCard
                  label="الشحنات المسلّمة"
                  value="٢٬٤٨٧"
                  delta={8.2}
                  icon={Truck}
                  accent="success"
                  className="col-span-12 md:col-span-6 lg:col-span-3"
                />
                <KpiCard
                  label="متوسط زمن التسوية"
                  value="١:٤٧"
                  unit="ساعة"
                  delta={-23.0}
                  positiveIsDown
                  icon={Clock}
                  accent="amber"
                  className="col-span-12 md:col-span-6 lg:col-span-3"
                />
                <KpiCard
                  label="معدّل الوفاء"
                  value="٩٨٫٤٪"
                  delta={1.6}
                  icon={Target}
                  accent="violet"
                  className="col-span-12 md:col-span-6 lg:col-span-3"
                />
              </div>

              {/* Supply Chain & Market Intelligence */}
              <SupplyChainIntel />

              {/* Revenue trend + Mix */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">REVENUE FLOW</div>
                      <h3 className="text-[#0B1B3B]">تدفّق الإيرادات والتسويات</h3>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <Legend2 dot="#1A73E8" label="إيرادات" />
                      <Legend2 dot="#15803D" label="تسويات" />
                      <Legend2 dot="#B45309" label="مرتجعات" />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1A73E8" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#1A73E8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="setG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#15803D" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#15803D" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F2" vertical={false} />
                      <XAxis dataKey="m" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: '#0B1B3B',
                          border: 'none',
                          borderRadius: 12,
                          color: 'white',
                          fontSize: 12,
                        }}
                      />
                      <Area type="monotone" dataKey="rev" stroke="#1A73E8" strokeWidth={2.5} fill="url(#revG)" />
                      <Area type="monotone" dataKey="set" stroke="#15803D" strokeWidth={2} fill="url(#setG)" />
                      <Area type="monotone" dataKey="ret" stroke="#B45309" strokeWidth={1.5} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">PRODUCT MIX</div>
                      <h3 className="text-[#0B1B3B]">مزيج المنتجات</h3>
                    </div>
                    <Layers className="w-4 h-4 text-slate-300" />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={productMix}
                        innerRadius={55}
                        outerRadius={85}
                        dataKey="value"
                        paddingAngle={3}
                      >
                        {productMix.map((d) => (
                          <Cell key={`mix-${d.name}`} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#0B1B3B', border: 'none', borderRadius: 12,
                          color: 'white', fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {productMix.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                          <span className="text-slate-600">{d.name}</span>
                        </div>
                        <span className="text-[#0B1B3B]">{d.value}٪</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top products + Geo + Settlement */}
              <div className="grid grid-cols-12 gap-4">
                {/* Top products */}
                <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">TOP PERFORMERS</div>
                      <h3 className="text-[#0B1B3B]">أعلى المنتجات أداءً</h3>
                    </div>
                    <Crown className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="space-y-3">
                    {topProducts.map((p, i) => (
                      <div key={p.name} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                          i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-[#1A73E8]'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-[#0B1B3B] truncate">{p.name}</span>
                            <span className="text-xs text-slate-500">{p.units} وحدة</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-l from-[#1A73E8] to-[#0B1B3B]"
                              style={{ width: `${p.share}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-[#0B1B3B] tabular-nums">{(p.revenue / 1000000).toFixed(1)}M</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Geo distribution */}
                <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">GEO COVERAGE</div>
                      <h3 className="text-[#0B1B3B]">التوزيع الجغرافي</h3>
                    </div>
                    <MapPin className="w-4 h-4 text-slate-300" />
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={geoData} layout="vertical" margin={{ left: 0, right: 12 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="city"
                        type="category"
                        stroke="#94A3B8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        width={50}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#0B1B3B', border: 'none', borderRadius: 12,
                          color: 'white', fontSize: 12,
                        }}
                        cursor={{ fill: '#F1F5F9' }}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
                        {geoData.map((g, i) => (
                          <Cell key={`geo-${g.city}`} fill={i === 0 ? '#0B1B3B' : '#1A73E8'} fillOpacity={1 - i * 0.18} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Settlement health */}
                <div className="col-span-12 lg:col-span-3 bg-[#0B1B3B] text-white rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-[#1A73E8]/20 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="text-[10px] tracking-[0.25em] text-white/60 mb-1">SETTLEMENT HEALTH</div>
                    <h3 className="text-white mb-4">صحة التسويات</h3>
                    <ResponsiveContainer width="100%" height={140}>
                      <RadialBarChart
                        innerRadius="68%"
                        outerRadius="100%"
                        data={[{ name: 'on-time', value: 96, fill: '#1A73E8' }]}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar background={{ fill: '#1E2A4A' }} dataKey="value" cornerRadius={8} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="-mt-24 mb-6 flex flex-col items-center">
                      <div className="text-3xl tabular-nums">٩٦٪</div>
                      <div className="text-[11px] text-white/60">في الموعد</div>
                    </div>
                    <div className="space-y-2 mt-8">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70">أقل من ٢ﺳ</span>
                        <span className="text-white">٨٢٪</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70">٢–٦ ساعات</span>
                        <span className="text-white">١٤٪</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70">أكثر من ٦ﺳ</span>
                        <span className="text-amber-300">٤٪</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity feed + Alerts */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">LIVE ACTIVITY</div>
                      <h3 className="text-[#0B1B3B]">النشاط اللحظي</h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 border border-green-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[11px] text-green-700">مباشر</span>
                    </span>
                  </div>
                  <div className="space-y-3">
                    {activityFeed.map((a, i) => {
                      const Icon = a.icon;
                      return (
                        <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.tone}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-[#0B1B3B]">{a.title}</div>
                            <div className="text-[11px] text-slate-500">{a.sub}</div>
                          </div>
                          <span className="text-[10px] text-slate-400 tabular-nums">{a.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">RISK & ALERTS</div>
                      <h3 className="text-[#0B1B3B]">التنبيهات الذكية</h3>
                    </div>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="space-y-2.5">
                    {alerts.map((al, i) => (
                      <div key={i} className={`p-3 rounded-xl border flex items-start gap-3 ${al.cls}`}>
                        <al.icon className="w-4 h-4 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm">{al.title}</div>
                          <div className="text-[11px] opacity-80 mt-0.5">{al.sub}</div>
                        </div>
                        <button className="text-[11px] underline opacity-80 hover:opacity-100">معالجة</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Hero Balance Card */}
              <div className="relative bg-gradient-to-l from-[#0B1B3B] via-[#13265A] to-[#1A73E8] rounded-3xl p-8 text-white overflow-hidden">
                <div className="absolute -top-32 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#1A73E8]/40 rounded-full blur-3xl" />
                <div className="absolute inset-0 opacity-[0.06]" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }} />
                <div className="relative grid grid-cols-12 gap-6 items-center">
                  <div className="col-span-12 lg:col-span-7">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[11px] tracking-wider mb-4">
                      <Sparkles className="w-3.5 h-3.5" />
                      محفظة المصنع · حساب تسوية مباشر
                    </div>
                    <div className="text-[12px] text-white/70 mb-2 tracking-wider">الرصيد المتاح</div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-5xl tabular-nums tracking-tight">٤٢,٨٧٥,٣٢٠</span>
                      <span className="text-base text-white/70">ر.ي</span>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-white/70">
                      <span className="inline-flex items-center gap-1 text-emerald-300">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +١٢.٤٪ هذا الأسبوع
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      <span>آخر تحديث قبل دقيقتين</span>
                    </div>

                    <div className="flex flex-wrap gap-2.5 mt-6">
                      <button className="inline-flex items-center gap-2 bg-white text-[#0B1B3B] px-4 py-2.5 rounded-xl hover:bg-white/90 transition shadow-lg shadow-black/20">
                        <Download className="w-4 h-4" /> سحب فوري
                      </button>
                      <button className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 px-4 py-2.5 rounded-xl hover:bg-white/25 transition">
                        <ArrowUpRight className="w-4 h-4" /> تحويل بنكي
                      </button>
                      <button className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 px-4 py-2.5 rounded-xl hover:bg-white/25 transition">
                        <FileText className="w-4 h-4" /> كشف الحساب
                      </button>
                      <button className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 px-4 py-2.5 rounded-xl hover:bg-white/25 transition">
                        <Plus className="w-4 h-4" /> إيداع
                      </button>
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] text-white/70">قيد التسوية</span>
                          <Clock className="w-4 h-4 text-amber-300" />
                        </div>
                        <div className="text-xl tabular-nums">٨,٤٢٠,٠٠٠</div>
                        <div className="text-[10px] text-white/60 mt-1">٢٣ معاملة</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] text-white/70">جاهز للسحب</span>
                          <Zap className="w-4 h-4 text-emerald-300" />
                        </div>
                        <div className="text-xl tabular-nums">٣٤,٤٥٥,٣٢٠</div>
                        <div className="text-[10px] text-white/60 mt-1">سحب فوري</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] text-white/70">إيرادات اليوم</span>
                          <TrendingUp className="w-4 h-4 text-[#7CC2FF]" />
                        </div>
                        <div className="text-xl tabular-nums">١,٢٤٧,٥٠٠</div>
                        <div className="text-[10px] text-emerald-300 mt-1">+٨.٢٪</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] text-white/70">رسوم الشهر</span>
                          <Layers className="w-4 h-4 text-white/70" />
                        </div>
                        <div className="text-xl tabular-nums">٦٢,٤٠٠</div>
                        <div className="text-[10px] text-white/60 mt-1">٠.٤٪ من الحجم</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cash Flow + Settlement Health */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg text-[#0B1B3B]">تدفق النقد</h3>
                      <p className="text-[12px] text-slate-500 mt-0.5">حركة الإيداعات والسحوبات خلال آخر ٣٠ يوماً</p>
                    </div>
                    <div className="flex gap-2 text-[12px]">
                      <Legend2 dot="#1A73E8" label="إيداعات" />
                      <Legend2 dot="#B45309" label="سحوبات" />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={[
                      { d: '١', in: 1.2, out: 0.4 }, { d: '٥', in: 1.8, out: 0.6 },
                      { d: '١٠', in: 2.4, out: 1.1 }, { d: '١٥', in: 2.1, out: 0.9 },
                      { d: '٢٠', in: 3.2, out: 1.4 }, { d: '٢٥', in: 2.8, out: 1.0 },
                      { d: '٣٠', in: 3.8, out: 1.6 },
                    ]}>
                      <defs>
                        <linearGradient id="walletIn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1A73E8" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#1A73E8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="walletOut" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#B45309" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#B45309" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#EEF2F7" vertical={false} />
                      <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E9F2', fontSize: 12 }} />
                      <Area type="monotone" dataKey="in" stroke="#1A73E8" strokeWidth={2} fill="url(#walletIn)" />
                      <Area type="monotone" dataKey="out" stroke="#B45309" strokeWidth={2} fill="url(#walletOut)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-[#0B1B3B] to-[#13265A] rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#1A73E8]/30 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg">صحة التسوية</h3>
                      <Award className="w-5 h-5 text-amber-300" />
                    </div>
                    <div className="space-y-4">
                      <WalletHealthRow label="معدل التحصيل" value="٩٦.٤٪" pct={96} />
                      <WalletHealthRow label="سرعة التسوية" value="١.٢ يوم" pct={88} tone="emerald" />
                      <WalletHealthRow label="نسبة المرتجعات" value="٠.٨٪" pct={12} tone="amber" />
                      <WalletHealthRow label="الموثوقية المالية" value="ممتاز" pct={94} />
                    </div>
                    <div className="mt-6 p-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl">
                      <div className="flex items-center gap-2 text-[12px] text-emerald-300 mb-1">
                        <Crown className="w-4 h-4" />
                        تصنيف ذهبي
                      </div>
                      <div className="text-[11px] text-white/70 leading-relaxed">
                        مؤهل لتسوية فورية وحدود ائتمان مرتفعة من شركاء التمويل
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Settlements + Linked Accounts */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg text-[#0B1B3B]">تسويات معلّقة</h3>
                      <p className="text-[12px] text-slate-500 mt-0.5">معاملات بانتظار الإفراج عبر شبكة المسارات</p>
                    </div>
                    <button className="text-[12px] text-[#1A73E8] hover:underline">عرض الكل</button>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { id: 'STL-2841', party: 'تاجر الأمل · صنعاء', route: 'المسار A', amount: 1240000, eta: 'خلال ٤ ساعات', pct: 75 },
                      { id: 'STL-2840', party: 'متاجر النور · عدن', route: 'المسار B', amount: 875000, eta: 'غداً ١٠ ص', pct: 45 },
                      { id: 'STL-2839', party: 'سوبرماركت السعادة · تعز', route: 'المسار C', amount: 432000, eta: 'بعد يومين', pct: 25 },
                      { id: 'STL-2838', party: 'مؤسسة البركة · الحديدة', route: 'المسار A', amount: 2150000, eta: 'تسوية فورية', pct: 92 },
                    ].map((s) => (
                      <div key={s.id} className="border border-slate-200 rounded-xl p-4 hover:border-[#1A73E8]/40 hover:bg-blue-50/30 transition group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Wallet className="w-4 h-4 text-[#1A73E8]" />
                            </div>
                            <div>
                              <div className="text-sm text-[#0B1B3B]">{s.party}</div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span>{s.id}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-[#1A73E8]">{s.route}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="text-base text-[#0B1B3B] tabular-nums">{s.amount.toLocaleString()}</div>
                            <div className="text-[11px] text-amber-600 flex items-center gap-1 justify-end mt-0.5">
                              <Clock className="w-3 h-3" /> {s.eta}
                            </div>
                          </div>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-l from-[#1A73E8] to-[#0B1B3B]" style={{ width: `${s.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-5 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg text-[#0B1B3B]">الحسابات المرتبطة</h3>
                      <button className="text-[12px] text-[#1A73E8] hover:underline inline-flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> إضافة
                      </button>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { name: 'بنك التضامن الإسلامي', num: '•••• ٤٢٨١', tag: 'افتراضي', tone: 'bg-emerald-50 text-emerald-700' },
                        { name: 'بنك اليمن والكويت', num: '•••• ٧٧١٠', tag: 'احتياطي', tone: 'bg-blue-50 text-blue-700' },
                        { name: 'محفظة فلوسك', num: '٧٧٣ ••• •••', tag: 'سريع', tone: 'bg-amber-50 text-amber-700' },
                      ].map((a) => (
                        <div key={a.num} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1A73E8] to-[#0B1B3B] flex items-center justify-center">
                              <Wallet className="w-4.5 h-4.5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm text-[#0B1B3B]">{a.name}</div>
                              <div className="text-[11px] text-slate-500 tabular-nums mt-0.5">{a.num}</div>
                            </div>
                          </div>
                          <span className={`text-[10px] px-2 py-1 rounded-md ${a.tone}`}>{a.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg text-[#0B1B3B]">آخر الحركات</h3>
                      <Activity className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      {[
                        { t: 'إيداع · تاجر الأمل', a: '+٣٢٠,٠٠٠', time: 'قبل ٥ د', pos: true },
                        { t: 'سحب بنكي · التضامن', a: '-١,٥٠٠,٠٠٠', time: 'قبل ٤٢ د', pos: false },
                        { t: 'إيداع · متاجر النور', a: '+٨٧٥,٠٠٠', time: 'قبل ساعة', pos: true },
                        { t: 'رسوم تسوية', a: '-١٢,٤٠٠', time: 'قبل ساعتين', pos: false },
                        { t: 'إيداع · مؤسسة البركة', a: '+٢,١٥٠,٠٠٠', time: 'اليوم ٠٩:٢٠', pos: true },
                      ].map((tx, i) => (
                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tx.pos ? 'bg-emerald-50' : 'bg-red-50'}`}>
                              {tx.pos
                                ? <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                                : <ArrowUpRight className="w-3.5 h-3.5 text-red-600" />}
                            </div>
                            <div>
                              <div className="text-[13px] text-[#0B1B3B]">{tx.t}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{tx.time}</div>
                            </div>
                          </div>
                          <div className={`text-sm tabular-nums ${tx.pos ? 'text-emerald-700' : 'text-red-700'}`}>{tx.a}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog.Root open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50" dir="rtl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <Dialog.Title className="text-xl text-slate-900">
                {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
              </Dialog.Title>
              <Dialog.Close className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">اسم المنتج *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="مثال: أرز بسمتي فاخر"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">الفئة *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">اختر الفئة</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">الوحدة *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">اختر الوحدة</option>
                    {UNITS.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">الكمية *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">السعر (ريال) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">الباركود</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="6281234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">الحد الأدنى للمخزون *</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">تاريخ الانتهاء</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none"
                  rows={3}
                  placeholder="وصف المنتج..."
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">صورة المنتج</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 mb-1">اضغط لرفع صورة أو اسحبها هنا</p>
                  <p className="text-xs text-slate-400">PNG, JPG حتى 10MB</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                  setEditingProduct(null);
                }}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={editingProduct ? handleEditProduct : handleAddProduct}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function KpiCard({
  label, value, unit, delta, icon: Icon, accent, positiveIsDown, className
}: {
  label: string; value: string; unit?: string; delta: number;
  icon: any; accent: 'primary' | 'success' | 'amber' | 'violet';
  positiveIsDown?: boolean; className?: string;
}) {
  const tone: Record<string, string> = {
    primary: 'from-[#1A73E8] to-[#0B1B3B]',
    success: 'from-green-600 to-green-800',
    amber: 'from-amber-500 to-amber-700',
    violet: 'from-blue-700 to-[#0B1B3B]',
  };
  const isPositive = positiveIsDown ? delta < 0 : delta > 0;
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden ${className || ''}`}>
      <div className={`absolute -top-12 -left-12 w-32 h-32 rounded-full bg-gradient-to-br ${tone[accent]} opacity-[0.07] blur-2xl`} />
      <div className="relative flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tone[accent]} flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
        </div>
        <span className={`inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-md ${
          isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
        }`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(delta).toFixed(1)}٪
        </span>
      </div>
      <div className="relative">
        <div className="text-[11px] tracking-wider text-slate-500 mb-1">{label}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl text-[#0B1B3B] tabular-nums">{value}</span>
          {unit && <span className="text-[11px] text-slate-500">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

function WalletHealthRow({ label, value, pct, tone = 'blue' }: {
  label: string; value: string; pct: number; tone?: 'blue' | 'emerald' | 'amber';
}) {
  const colors: Record<string, string> = {
    blue: 'from-[#1A73E8] to-[#7CC2FF]',
    emerald: 'from-emerald-400 to-emerald-200',
    amber: 'from-amber-400 to-amber-200',
  };
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] mb-1.5">
        <span className="text-white/70">{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-l ${colors[tone]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Legend2({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-500">
      <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
      {label}
    </span>
  );
}
