import { useState } from 'react';
import {
  Package, Truck, BarChart3, Wallet, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../../../hooks/useProducts';
import { useWallet } from '../../../hooks/useWallet';
import { useShipments } from '../../../hooks/useShipments';
import { useOrders } from '../../../hooks/useOrders';
import { supabase, DEMO_FACTORY_ID, DEMO_DRIVER_ID } from '../../../lib/supabase';
import type { Product } from '../../../lib/supabase';

// Modular Components
import { CATEGORIES, UNITS } from './constants';
import ProductsTab from './ProductsTab';
import ShipmentsTab from './ShipmentsTab';
import AnalyticsTab from './AnalyticsTab';
import WalletTab from './WalletTab';
import AddProductModal from './AddProductModal';
import CashoutModal from './CashoutModal';

interface FactoryDashboardProps {
  onBack: () => void;
}

export default function FactoryDashboard({ onBack }: FactoryDashboardProps) {
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Products State
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    quantity: 0,
    price: 0,
    barcode: '',
    minStock: 0,
    expiryDate: '',
    description: ''
  });

  // Wallet, Shipments & Orders State
  const { factory, transactions: walletTransactions, requestCashout } = useWallet();
  const { shipments } = useShipments();
  const { incomingOrders, updateOrderStatus } = useOrders(factory?.id || DEMO_FACTORY_ID);
  const [showCashoutDialog, setShowCashoutDialog] = useState(false);

  // Derived KPIs for Analytics
  const deliveredShipmentsCount = shipments.filter(s => s.status === 'completed').length;
  const fulfillmentRate = shipments.length > 0 
    ? (deliveredShipmentsCount / shipments.length) * 100 
    : 100;
  
  const analyticsKpis = {
    netRevenue: factory?.balance || 0,
    deliveredShipments: deliveredShipmentsCount,
    fulfillmentRate: fulfillmentRate
  };

  // Handlers
  const resetForm = () => {
    setFormData({
      name: '', category: '', unit: '', quantity: 0, price: 0,
      barcode: '', minStock: 0, expiryDate: '', description: ''
    });
  };

  const handleAddProduct = async () => {
    await addProduct({
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      quantity: formData.quantity,
      price: formData.price,
      barcode: formData.barcode,
      min_stock: formData.minStock,
      expiry_date: formData.expiryDate,
      description: formData.description
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, {
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      quantity: formData.quantity,
      price: formData.price,
      barcode: formData.barcode,
      min_stock: formData.minStock,
      expiry_date: formData.expiryDate,
      description: formData.description
    });
    setIsAddDialogOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      unit: product.unit,
      quantity: product.quantity,
      price: product.price,
      barcode: product.barcode || '',
      minStock: product.min_stock || 0,
      expiryDate: product.expiry_date || '',
      description: product.description || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleAcceptOrder = async (orderId: string) => {
    const order = incomingOrders.find(o => o.id === orderId);
    if (!order) return;

    // 1. Update order status
    await updateOrderStatus(orderId, 'approved');
    
    // 2. Create actual shipment for the driver
    const shipment_number = `SH-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const { data: shipmentData, error: shipmentError } = await supabase.from('shipments').insert({
      shipment_number,
      factory_id: factory?.id || DEMO_FACTORY_ID,
      driver_id: DEMO_DRIVER_ID,
      route: order.route || 'المسار A',
      status: 'pending',
      total_amount: order.total
    }).select().single();

    if (shipmentError || !shipmentData) {
      console.error('Error creating shipment:', shipmentError);
      alert('تم قبول الطلب، لكن حدث خطأ أثناء تكوين الشحنة.');
      return;
    }

    // 3. Create route stops (pickup & dropoff)
    // First stop: Pickup from Factory
    await supabase.from('route_stops').insert([
      {
        shipment_id: shipmentData.id,
        stop_order: 1,
        type: 'pickup',
        location_name: factory?.name || 'المصنع المورد',
        city: factory?.city || 'صنعاء',
        contact_name: 'مدير المخزن',
        contact_phone: '770000000',
        items_description: `${order.items?.length || 0} أصناف مختلفة`,
        status: 'current',
        earnings: 0 // Pickup doesn't usually pay the driver immediately
      },
      // Second stop: Dropoff to Retailer
      {
        shipment_id: shipmentData.id,
        stop_order: 2,
        type: 'dropoff',
        location_name: `متجر التجزئة #${order.retailer_id.substring(0, 5)}`,
        city: 'صنعاء',
        contact_name: 'صاحب المتجر',
        contact_phone: '710000000',
        items_description: `تسليم طلبية رقم ${order.order_number}`,
        status: 'pending',
        earnings: Math.floor(order.total * 0.05) // Driver takes 5% as earnings (example)
      }
    ]);

    alert('تم قبول الطلب وتجهيز الشحنة ومسار السائق بنجاح!');
  };

  const handleRejectOrder = async (orderId: string) => {
    if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return;
    await updateOrderStatus(orderId, 'cancelled');
    alert('تم إلغاء الطلب بنجاح.');
  };

  // Helper Info
  const getCategoryInfo = (categoryId: string) => CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  const getUnitInfo = (unitId: string) => UNITS.find(u => u.id === unitId) || UNITS[0];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (p.barcode && p.barcode.includes(searchQuery));
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: 'analytics', label: 'الرئيسية والتحليلات', icon: BarChart3 },
    { id: 'products', label: 'إدارة المخزون', icon: Package },
    { id: 'shipments', label: 'الطلبات والشحنات', icon: Truck },
    { id: 'wallet', label: 'المحفظة والتسويات', icon: Wallet },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-['Inter', 'Cairo', sans-serif]" dir="rtl">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1B3B] text-white flex flex-col fixed inset-y-0 right-0 z-10 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1A73E8] to-[#0A48A3] rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="leading-tight">بوابة المصنع</div>
              <div className="text-[10px] text-[#7CC2FF] tracking-widest mt-1 uppercase">C-Route Enterprise</div>
            </div>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-[10px] text-white/40 tracking-wider mb-4 px-2">القائمة الرئيسية</div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#1A73E8] text-white shadow-lg shadow-[#1A73E8]/20 font-medium translate-x-1' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/50'}`} />
                <span className="flex-1 text-right">{tab.label}</span>
                {tab.id === 'shipments' && incomingOrders.length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {incomingOrders.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 rotate-180" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 mr-64 flex flex-col min-h-screen relative">
        {/* Minimal Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl text-slate-800 font-semibold">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            {activeTab === 'analytics' && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] rounded-md font-medium">مباشر</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-900">{factory?.name || 'مصنع يماني'}</div>
              <div className="text-xs text-emerald-600 font-medium">متصل ومفعل</div>
            </div>
            <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
              {factory?.name?.charAt(0) || 'ي'}
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'products' && (
              <ProductsTab
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                filteredProducts={filteredProducts}
                onAddProduct={() => { resetForm(); setEditingProduct(null); setIsAddDialogOpen(true); }}
                onEditProduct={openEditDialog}
                onDeleteProduct={deleteProduct}
                getCategoryInfo={getCategoryInfo}
                getUnitInfo={getUnitInfo}
              />
            )}

            {activeTab === 'shipments' && (
              <ShipmentsTab 
                shipments={shipments} 
                incomingOrders={incomingOrders}
                onAcceptOrder={handleAcceptOrder}
                onRejectOrder={handleRejectOrder}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsTab kpis={analyticsKpis} />}

            {activeTab === 'wallet' && (
              <WalletTab 
                factory={factory}
                walletTransactions={walletTransactions}
                onCashout={() => setShowCashoutDialog(true)}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        onSave={editingProduct ? handleEditProduct : handleAddProduct}
        onReset={resetForm}
      />

      <CashoutModal
        isOpen={showCashoutDialog}
        onClose={() => setShowCashoutDialog(false)}
        factoryBalance={factory?.balance || 0}
        requestCashout={requestCashout}
      />
    </div>
  );
}
