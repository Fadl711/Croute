import { useState } from "react";
import {
  Package,
  Truck,
  BarChart3,
  Wallet,
  Globe,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useProducts } from "../../../hooks/useProducts";
import { useWallet } from "../../../hooks/useWallet";
import { useShipments } from "../../../hooks/useShipments";
import { useOrders } from "../../../hooks/useOrders";
import {
  supabase,
  getActiveFactoryId,
  getActiveDriverId,
} from "../../../lib/supabase";
import type { Product } from "../../../lib/supabase";

// Modular Components
import { CATEGORIES, UNITS } from "./constants";
import ProductsTab from "./ProductsTab";
import ShipmentsTab from "./ShipmentsTab";
import AnalyticsTab from "./AnalyticsTab";
import WalletTab from "./WalletTab";
import AddProductModal from "./AddProductModal";
import CashoutModal from "./CashoutModal";
import FactoryMapTab from "./FactoryMapTab";

interface FactoryDashboardProps {
  onBack: () => void;
}

export default function FactoryDashboard({ onBack }: FactoryDashboardProps) {
  const [activeTab, setActiveTab] = useState("analytics");

  // Products State
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    quantity: 0,
    price: 0,
    barcode: "",
    minStock: 0,
    expiryDate: "",
    description: "",
  });

  // Wallet, Shipments & Orders State
  const { factory, transactions: walletTransactions, requestCashout } =
    useWallet();
  // ✅ Pass factoryId explicitly for data isolation
  const { shipments } = useShipments(
    factory?.id || getActiveFactoryId()
  );
  const { incomingOrders, updateOrderStatus } = useOrders(
    factory?.id || getActiveFactoryId()
  );
  const [showCashoutDialog, setShowCashoutDialog] = useState(false);

  // Derived KPIs for Analytics
  const deliveredShipmentsCount = shipments.filter(
    (s) => s.status === "completed" || s.status === "delivered"
  ).length;
  const fulfillmentRate =
    shipments.length > 0
      ? (deliveredShipmentsCount / shipments.length) * 100
      : 100;

  const analyticsKpis = {
    netRevenue: factory?.balance || 0,
    deliveredShipments: deliveredShipmentsCount,
    fulfillmentRate: fulfillmentRate,
  };

  // Handlers
  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      unit: "",
      quantity: 0,
      price: 0,
      barcode: "",
      minStock: 0,
      expiryDate: "",
      description: "",
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
      description: formData.description,
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
      description: formData.description,
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
      barcode: product.barcode || "",
      minStock: product.min_stock || 0,
      expiryDate: product.expiry_date || "",
      description: product.description || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleAcceptOrder = async (orderId: string) => {
    const order = incomingOrders.find((o) => o.id === orderId);
    if (!order) return;

    // 1. Update order status to approved
    await updateOrderStatus(orderId, "approved");

    // 2. Fetch retailer name for the dropoff stop
    let retailerName = "متجر التجزئة";
    const { data: retailerData } = await supabase
      .from("retailers")
      .select("name, city")
      .eq("id", order.retailer_id)
      .single();
    if (retailerData) {
      retailerName = retailerData.name;
    }

    // 3. Create shipment — Status: "pending" (awaiting admin assignment)
    // ✅ No hardcoded driver ID — Admin assigns via ConsolidationTab
    const shipment_number = `SH-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;
    const { data: shipmentData, error: shipmentError } = await supabase
      .from("shipments")
      .insert({
        shipment_number,
        factory_id: factory?.id || getActiveFactoryId(),
        driver_id: null, // Admin will assign later via ConsolidationTab
        order_id: orderId, // Link to the originating order
        route: order.route || "قيد التحديد",
        status: "pending",
        total_amount: order.total,
      })
      .select()
      .single();

    if (shipmentError || !shipmentData) {
      console.error("Error creating shipment:", shipmentError);
      alert("تم قبول الطلب، لكن حدث خطأ أثناء تكوين الشحنة.");
      return;
    }

    // 4. Get order items count for description
    const orderItems = (order as any).order_items || (order as any).items || [];
    const itemsCount = orderItems.length;

    // 5. Create route stops (pickup & dropoff)
    await supabase.from("route_stops").insert([
      {
        shipment_id: shipmentData.id,
        stop_order: 1,
        type: "pickup",
        location_name: factory?.name || "المصنع المورد",
        city: factory?.city || "صنعاء",
        contact_name: "مدير المخزن",
        contact_phone: "770000000",
        items_description: `${itemsCount} أصناف مختلفة`,
        status: "current",
        earnings: 0,
      },
      {
        shipment_id: shipmentData.id,
        stop_order: 2,
        type: "dropoff",
        location_name: retailerName,
        city: retailerData?.city || "صنعاء",
        contact_name: "صاحب المتجر",
        contact_phone: "710000000",
        items_description: `تسليم طلبية رقم ${order.order_number}`,
        status: "pending",
        earnings: Math.floor(order.total * 0.05),
      },
    ]);

    alert("تم قبول الطلب وتجهيز الشحنة بنجاح! يمكن للأدمن إسناد السائق.");
  };

  const handleRejectOrder = async (orderId: string) => {
    if (!confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) return;
    await updateOrderStatus(orderId, "cancelled");
    alert("تم إلغاء الطلب بنجاح.");
  };

  // Helper Info
  const getCategoryInfo = (categoryId: string) =>
    CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  const getUnitInfo = (unitId: string) =>
    UNITS.find((u) => u.id === unitId) || UNITS[0];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: "analytics", label: "الرئيسية والتحليلات", icon: BarChart3 },
    { id: "products", label: "إدارة المخزون", icon: Package },
    { id: "shipments", label: "الطلبات والشحنات", icon: Truck },
    { id: "map", label: "رادار الشحنات", icon: Globe },
    { id: "wallet", label: "المحفظة والتسويات", icon: Wallet },
  ];

  return (
    <div
      className="min-h-screen flex bg-slate-50 font-['Inter', 'Cairo', sans-serif]"
      dir="rtl"
    >
      {/* Sidebar */}
      <aside className="w-72 bg-[#0B1B3B] text-white flex flex-col fixed inset-y-0 right-0 z-50 shadow-[0_0_50px_rgba(0,0,0,0.3)] border-l border-white/5">
        <div className="p-8 border-b border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h1 className="text-xl font-black flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/40 border border-white/10 group-hover:rotate-12 transition-transform duration-500 p-3">
              <img src="/src/assets/logo.png" alt="C-Route Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-white tracking-tight leading-none">C-ROUTE</span>
              <span className="text-[10px] text-blue-400 font-black tracking-[0.2em] mt-1.5 uppercase">FACTORY PORTAL</span>
            </div>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] text-white/30 font-black tracking-[0.2em] mb-6 px-4 uppercase">
            القائمة الرئيسية
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all duration-300 relative group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/40 font-bold translate-x-1"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-white/40"
                    }`}
                  />
                </div>
                <span className="flex-1 text-right tracking-tight">{tab.label}</span>
                {tab.id === "shipments" && incomingOrders.length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-amber-900/20 animate-pulse">
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
      <main className="flex-1 mr-72 flex flex-col min-h-screen relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-slate-200 px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl md:hidden">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">المصنع متصل • يمن شيب</span>
              </div>
            </div>
          </div>
          {activeTab === "analytics" && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] rounded-md font-medium">
              مباشر
            </span>
          )}

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-900">
                {factory?.name || "جاري التحميل..."}
              </div>
              <div className="text-xs text-emerald-600 font-medium">
                متصل ومفعل
              </div>
            </div>
            <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
              {factory?.name?.charAt(0) || "م"}
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === "products" && (
              <ProductsTab
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                filteredProducts={filteredProducts}
                onAddProduct={() => {
                  resetForm();
                  setEditingProduct(null);
                  setIsAddDialogOpen(true);
                }}
                onEditProduct={openEditDialog}
                onDeleteProduct={deleteProduct}
                getCategoryInfo={getCategoryInfo}
                getUnitInfo={getUnitInfo}
              />
            )}

            {activeTab === "shipments" && (
              <ShipmentsTab
                shipments={shipments}
                incomingOrders={incomingOrders}
                onAcceptOrder={handleAcceptOrder}
                onRejectOrder={handleRejectOrder}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsTab kpis={analyticsKpis} />
            )}

            {activeTab === "wallet" && (
              <WalletTab
                factory={factory}
                walletTransactions={walletTransactions}
                onCashout={() => setShowCashoutDialog(true)}
              />
            )}

            {activeTab === "map" && (
              <FactoryMapTab shipments={shipments} />
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
