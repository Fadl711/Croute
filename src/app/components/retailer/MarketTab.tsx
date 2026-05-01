import { motion } from 'motion/react';
import { LayoutGrid, List, Search } from 'lucide-react';
import type { MarketplaceItem } from '../../../hooks/useMarketplace';
import ProductCard from './ProductCard';

interface MarketTabProps {
  loading: boolean;
  filteredProducts: MarketplaceItem[];
  onAddToCart: (p: MarketplaceItem) => void;
  categories: { id: string, name: string, icon: string }[];
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (m: 'grid' | 'list') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function MarketTab(props: MarketTabProps) {
  const {
    loading, filteredProducts, onAddToCart, categories,
    selectedCategory, setSelectedCategory,
    viewMode, setViewMode,
    searchQuery, setSearchQuery
  } = props;

  return (
    <motion.div
      key="market"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-6"
    >
      {/* Search & Simple Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="ابحث عن منتج أو مصنع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl transition-all outline-none text-sm font-medium text-right"
              dir="rtl"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex-1 md:flex-none p-3.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#0B1B3B] text-white' : 'bg-slate-50 text-slate-400'}`}
            >
              <LayoutGrid className="w-5 h-5 mx-auto" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex-1 md:flex-none p-3.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#0B1B3B] text-white' : 'bg-slate-50 text-slate-400'}`}
            >
              <List className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-xs font-black transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-black text-slate-900">
          {selectedCategory === 'all' ? 'جميع المنتجات' : `قسم ${categories.find(c => c.id === selectedCategory)?.name}`}
        </h2>
        <span className="text-xs font-bold text-slate-400">
          {filteredProducts.length} منتج متوفر
        </span>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-3xl h-[350px] animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-24" 
          : "flex flex-col gap-4 pb-24"
        }>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">لا توجد نتائج بحث</h3>
              <p className="text-slate-500 max-w-xs mx-auto">لم نجد أي منتجات تطابق معاييرك الحالية. حاول تغيير الفئة أو كلمات البحث.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
