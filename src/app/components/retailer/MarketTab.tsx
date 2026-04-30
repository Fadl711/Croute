import { motion } from 'motion/react';
import { LayoutGrid, List, ChevronDown, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { MarketplaceItem } from '../../../hooks/useMarketplace';
import ProductCard from './ProductCard';

interface MarketTabProps {
  loading: boolean;
  filteredProducts: MarketplaceItem[];
  onAddToCart: (p: MarketplaceItem) => void;
  categories: { id: string, name: string, icon: string }[];
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  groupBy: string;
  setGroupBy: (g: any) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (m: 'grid' | 'list') => void;
}

export default function MarketTab(props: MarketTabProps) {
  const {
    loading, filteredProducts, onAddToCart, categories,
    selectedCategory, setSelectedCategory, groupBy, setGroupBy,
    viewMode, setViewMode
  } = props;

  return (
    <motion.div
      key="market"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col lg:flex-row gap-8"
    >
      <div className="flex-1">
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#0B1B3B] tracking-tight mb-2 flex items-center gap-3">
              سوق الجملة الذكي
              <div className="bg-blue-50 text-[#1A73E8] text-[10px] px-2 py-1 rounded-md border border-blue-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>AI-Matched</span>
              </div>
            </h1>
            <p className="text-slate-500 text-sm">اكتشف أفضل العروض المباشرة من المصانع بأسعار الجملة</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm self-start">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#0B1B3B] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#0B1B3B] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl whitespace-nowrap transition-all duration-300 border-2 ${
                selectedCategory === cat.id 
                  ? 'bg-[#1A73E8] border-[#1A73E8] text-white shadow-xl shadow-blue-500/20 translate-y-[-2px]' 
                  : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-100 shadow-sm'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-sm font-bold">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Toolbar */}
        <div className="flex items-center justify-between mb-6 bg-slate-100/50 p-3 rounded-2xl border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              عرض حسب:
            </div>
            <div className="flex bg-white rounded-xl p-1 border border-slate-200">
              {[
                { id: 'none', label: 'الكل' },
                { id: 'factory', label: 'المصنع' },
                { id: 'route', label: 'المسار' }
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => setGroupBy(g.id)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    groupBy === g.id ? 'bg-[#0B1B3B] text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[11px] font-bold text-slate-400">
            تم العثور على <span className="text-slate-900">{filteredProducts.length}</span> منتج
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔍</div>
                <h3 className="text-xl text-slate-600 font-bold mb-2">لا توجد نتائج</h3>
                <p className="text-slate-400">حاول تغيير معايير البحث أو التصفية</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
