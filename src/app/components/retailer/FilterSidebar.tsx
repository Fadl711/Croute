import { Search, Filter, X, Building2, Route as RouteIcon, CreditCard, CheckCircle, Zap, Flame, DollarSign } from 'lucide-react';
import type { MarketplaceItem } from '../../../hooks/useMarketplace';

interface FilterSidebarProps {
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  openSections: Record<string, boolean>;
  toggleSection: (s: string) => void;
  allFactories: string[];
  selectedFactories: string[];
  setSelectedFactories: (f: string[]) => void;
  allProducts: MarketplaceItem[];
  allRoutes: string[];
  selectedRoutes: string[];
  setSelectedRoutes: (r: string[]) => void;
  collaborativeOnly: boolean;
  setCollaborativeOnly: (b: boolean) => void;
  financialTags: string[];
  setFinancialTags: (t: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  activeFilterCount: number;
  resetFilters: () => void;
  toggleInArray: (arr: string[], v: string, setter: (a: string[]) => void) => void;
}

const FilterSection = ({ title, icon, children, open, onToggle }: any) => (
  <div className="border-b border-slate-100 last:border-0 py-4">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between group mb-3"
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg transition-colors ${open ? 'bg-[#1A73E8]/10 text-[#1A73E8]' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
          {icon}
        </div>
        <span className={`text-sm font-bold transition-colors ${open ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{title}</span>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full transition-all ${open ? 'bg-[#1A73E8]' : 'bg-transparent'}`} />
    </button>
    {open && <div className="animate-in slide-in-from-top-2 duration-300">{children}</div>}
  </div>
);

export default function FilterSidebar(props: FilterSidebarProps) {
  const {
    searchQuery, setSearchQuery, openSections, toggleSection, allFactories,
    selectedFactories, setSelectedFactories, allProducts, allRoutes,
    selectedRoutes, setSelectedRoutes, collaborativeOnly, setCollaborativeOnly,
    financialTags, setFinancialTags, priceRange, setPriceRange,
    activeFilterCount, resetFilters, toggleInArray
  } = props;

  return (
    <aside className="w-72 hidden lg:block sticky top-[81px] h-[calc(100vh-81px)] overflow-y-auto bg-white border-l border-slate-200 p-6 scrollbar-hide">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-[#0B1B3B] flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#1A73E8]" />
          تصفية النتائج
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-[11px] text-red-500 hover:text-red-600 font-bold bg-red-50 px-2 py-1 rounded-md transition-colors"
          >
            مسح الكل ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="space-y-2 mb-8">
        <div className="relative group">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1A73E8] transition-colors" />
          <input
            type="text"
            placeholder="بحث عن منتج أو مصنع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#1A73E8]/10 focus:border-[#1A73E8] rounded-xl pr-10 pl-4 py-3 text-sm transition-all"
          />
        </div>
      </div>

      <div className="space-y-1">
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
                    {allProducts.filter(p => p.factory_name === f).length}
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
    </aside>
  );
}
