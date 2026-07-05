import { useState, useMemo } from "react";
import {
  Package,
  Truck,
  BarChart3,
  Wallet,
  Globe,
  ChevronLeft,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
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
import FactoryMarketMap from "./FactoryMarketMap";

interface FactoryDashboardProps {
  onBack: () => void;
}

export default function FactoryDashboard({ onBack }: FactoryDashboardProps) {
  const [activeTab, setActiveTab] = useState("analytics");

  // Products State
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
    image_url: "" as string | null,
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  // Wallet, Shipments & Orders State
  const { 
    factory, 
    transactions: walletTransactions, 
    requestCashout, 
    loading: walletLoading 
  } = useWallet();

  const { products, addProduct, updateProduct, deleteProduct, loading: productsLoading } = useProducts();
  
  const { shipments, loading: shipmentsLoading } = useShipments(
    factory?.id || getActiveFactoryId()
  );
  const { incomingOrders, updateOrderStatus, loading: ordersLoading } = useOrders(
    factory?.id || getActiveFactoryId()
  );

  const [showCashoutDialog, setShowCashoutDialog] = useState(false);

  // Unified loading state - Wait for all to be stable for first load
  const isInitialLoading = walletLoading || productsLoading || shipmentsLoading || ordersLoading;

  // Derived KPIs for Analytics - Memoized to prevent flickering
  const analyticsKpis = useMemo(() => {
    const deliveredCount = shipments.filter(
      (s) => s.status === "completed" || s.status === "delivered"
    ).length;
    
    const fulfillment = shipments.length > 0
      ? (deliveredCount / shipments.length) * 100
      : 100;

    return {
      netRevenue: factory?.balance || 0,
      deliveredShipments: deliveredCount,
      fulfillmentRate: fulfillment,
    };
  }, [shipments, factory?.balance]);

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
      image_url: null,
    });
    setSelectedImageFile(null);
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimension 800px
          const MAX_SIZE = 800;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, 'image/jpeg', 0.7); // 70% quality
        };
      };
    });
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Compress first
      const compressedBlob = await compressImage(file);
      const fileExt = 'jpg'; // Always jpeg after compression
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, compressedBlob, {
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleImageChange = (file: File | null) => {
    setSelectedImageFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image_url: previewUrl }));
    } else {
      setFormData(prev => ({ ...prev, image_url: null }));
    }
  };

  const handleAddProduct = async () => {
    try {
      let finalImageUrl = formData.image_url;

      if (selectedImageFile) {
        const uploadedUrl = await uploadImage(selectedImageFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const { error } = await addProduct({
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        quantity: formData.quantity,
        price: formData.price,
        barcode: formData.barcode || null,
        min_stock: formData.minStock,
        expiry_date: formData.expiryDate || null, // Convert "" to null
        description: formData.description || null,
        image_url: finalImageUrl,
      });

      if (error) {
        console.error("Error adding product:", error);
        toast.error(`خطأ في إضافة المنتج: ${error.message}`);
        return;
      }

      toast.success("تم إضافة المنتج بنجاح!");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    
    try {
      let finalImageUrl = formData.image_url;
      if (selectedImageFile) {
        const uploadedUrl = await uploadImage(selectedImageFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const { error } = await updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        quantity: formData.quantity,
        price: formData.price,
        barcode: formData.barcode || null,
        min_stock: formData.minStock,
        expiry_date: formData.expiryDate || null, // Convert "" to null
        description: formData.description || null,
        image_url: finalImageUrl,
      });

      if (error) {
        console.error("Error updating product:", error);
        toast.error(`خطأ في تعديل المنتج: ${error.message}`);
        return;
      }

      toast.success("تم تعديل المنتج بنجاح!");
      setIsAddDialogOpen(false);
      setEditingProduct(null);
      resetForm();
    } catch (err) {
      console.error("Unexpected error:", err);
    }
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
      image_url: product.image_url || null,
    });
    setSelectedImageFile(null);
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
      toast.error("تم قبول الطلب، لكن حدث خطأ أثناء تكوين الشحنة.");
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

    toast.success("تم قبول الطلب وتجهيز الشحنة بنجاح! يمكن للأدمن إسناد السائق.");
  };

  const handleRejectOrder = async (orderId: string) => {
    if (!confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) return;
    await updateOrderStatus(orderId, "cancelled");
    toast.info("تم إلغاء الطلب بنجاح.");
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
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/40 border border-white/10 group-hover:rotate-12 transition-transform duration-500 p-2.5">
              <img src="/logo.png" alt="C-Route Logo" className="w-full h-full object-contain" />
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
                    ? "bg-white/10 text-white shadow-lg font-bold translate-x-1"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-blue-400" : "text-white/30"
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
                {factory?.name || (isInitialLoading ? "جاري التحميل..." : "فشل الاتصال")}
              </div>
              <div className={`text-xs font-medium ${factory ? "text-emerald-600" : "text-rose-600"}`}>
                {factory ? "متصل ومفعل" : "غير متصل (Supabase Paused)"}
              </div>
            </div>
            <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
              {factory?.name?.charAt(0) || "م"}
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          {!isInitialLoading && !factory && (
            <div className="bg-amber-50 border-r-4 border-amber-500 p-6 rounded-2xl mb-8 flex items-start gap-4 shadow-sm" dir="rtl">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-amber-800 font-black text-sm mb-1">فشل الاتصال بقاعدة البيانات (Supabase)</h3>
                <p className="text-amber-700 text-xs font-semibold leading-relaxed">
                  لم نتمكن من الاتصال بالخادم. يرجى التحقق من أن مشروع قاعدة البيانات الخاص بك على منصة Supabase نشط وغير مؤقت (Active / Not Paused). 
                  إذا كان المشروع مؤقتاً، يرجى تسجيل الدخول إلى لوحة تحكم Supabase والضغط على "Resume Project" لتنشيطه.
                </p>
              </div>
            </div>
          )}
          {isInitialLoading ? (
            <div className="space-y-8 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-slate-200 rounded-3xl" />
                ))}
              </div>
              <div className="h-[400px] bg-slate-200 rounded-3xl" />
            </div>
          ) : (
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
                <AnalyticsTab factory={factory} kpis={analyticsKpis} />
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
          )}
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
        onImageChange={handleImageChange}
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
