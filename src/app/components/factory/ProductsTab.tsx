import { motion } from 'motion/react';
import { Search, Plus, Image as ImageIcon, AlertCircle, Edit2, Trash2, Box } from 'lucide-react';
import { CATEGORIES } from './constants';
import type { Product } from '../../../lib/supabase';

interface ProductsTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredProducts: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  getCategoryInfo: (categoryId: string) => any;
  getUnitInfo: (unitId: string) => any;
}

export default function ProductsTab({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  filteredProducts,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  getCategoryInfo,
  getUnitInfo
}: ProductsTabProps) {
  return (
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
          onClick={onAddProduct}
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
          const isLowStock = product.quantity <= (product.min_stock || 0);

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
              <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden group">
                {product.image_url ? (
                  <motion.img 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300 transition-colors group-hover:text-slate-400">
                    <ImageIcon className="w-12 h-12" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                  </div>
                )}
                
                {/* Badges Overlay */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-white/90 backdrop-blur text-slate-900 border border-slate-200 shadow-sm flex items-center gap-1">
                    {category.icon} {category.name}
                  </span>
                </div>
                
                {isLowStock && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-red-500 text-white shadow-lg flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      مخزون منخفض
                    </span>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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
                      {product.quantity.toLocaleString()} {unit?.symbol || product.unit}
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
                  {product.expiry_date && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">تاريخ الانتهاء</span>
                      <span className="text-slate-900 text-xs">{product.expiry_date}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>تعديل</span>
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product.id)}
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
  );
}
