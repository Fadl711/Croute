import { motion } from 'motion/react';
import { ShoppingCart, Route as RouteIcon, CreditCard, Zap, Flame, Building2, MapPin } from 'lucide-react';
import type { MarketplaceItem } from '../../../hooks/useMarketplace';
import { getProductImage, getProductRoute, isCollaborative, isFinanced, isInstantSettlement, routeDiscount } from './utils';

interface ProductCardProps {
  product: MarketplaceItem;
  onAddToCart: (p: MarketplaceItem) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const route = getProductRoute(product.id);
  const collaborative = isCollaborative(product);
  const financed = isFinanced(product);
  const instant = isInstantSettlement(product);
  const discount = routeDiscount(product);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
    >
      <div className="relative aspect-square bg-slate-50 flex items-center justify-center overflow-hidden transition-all duration-500">
        {product.image_url ? (
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            loading="lazy"
          />
        ) : (
          <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
            {getProductImage(product.category)}
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <div className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1 animate-bounce">
              <Flame className="w-3 h-3" />
              <span>-{discount}% خصم مسار</span>
            </div>
          )}
          {instant && (
            <div className="bg-[#1A73E8] text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>تسوية فورية</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 mb-1">
          <Building2 className="w-3 h-3" />
          <span className="uppercase tracking-wider truncate">{product.factory_name}</span>
        </div>
        
        <h3 className="font-bold text-slate-900 mb-1 truncate">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="text-lg font-black text-slate-900 tabular-nums">
            {product.price.toLocaleString()}
            <span className="text-[10px] text-slate-400 font-normal mr-1 italic">ر.ي</span>
          </div>
          {discount > 0 && (
            <div className="text-xs text-slate-300 line-through tabular-nums">
              {(product.price * 1.3).toLocaleString()}
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              المسار اللوجستي
            </span>
            <span className={`font-semibold ${collaborative ? 'text-orange-600' : 'text-slate-600'}`}>
              {route}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              خيار الدفع
            </span>
            <span className={`font-semibold ${financed ? 'text-emerald-600' : 'text-slate-600'}`}>
              {financed ? 'ائتمان متاح (٤٥ يوم)' : 'دفع نقدي'}
            </span>
          </div>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-[#0B1B3B] hover:bg-[#1A73E8] text-white py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium active:scale-95 group/btn"
        >
          <ShoppingCart className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
          <span>إضافة للسلة</span>
        </button>
      </div>
    </motion.div>
  );
}
