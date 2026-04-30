import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useSupplyChainIntel } from '../../../hooks/useSupplyChainIntel';

import {
  MapPin, Truck, Factory as FactoryIcon, Activity, Layers,
  Maximize2, Compass, TrendingUp, Sparkles
} from 'lucide-react';

type City = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  demand: number;
  retailers: number;
  revenue: number;
  isHub?: boolean;
};

const NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  'شملان': { lat: 15.3850, lng: 44.1650 },
  'حدة': { lat: 15.3350, lng: 44.1850 },
  'الحصبة': { lat: 15.3800, lng: 44.2050 },
  'الستين': { lat: 15.3550, lng: 44.1750 },
  'السبعين': { lat: 15.3200, lng: 44.2000 },
};

const FACTORY = { lat: 15.3694, lng: 44.1910 };

export default function SupplyChainIntel() {
  const { cityDemand } = useSupplyChainIntel();
  const [hovered, setHovered] = useState<string | null>(null);
  const [layer, setLayer] = useState<'heat' | 'flow' | 'both'>('both');
  const [region, setRegion] = useState<'all' | 'north' | 'south' | 'coast'>('all');

  const showHeat = layer === 'heat' || layer === 'both';
  const showFlow = layer === 'flow' || layer === 'both';

  const CITIES: City[] = useMemo(() => {
    if (cityDemand.length === 0) {
      return Object.keys(NEIGHBORHOOD_COORDS).map((name) => {
        const coords = NEIGHBORHOOD_COORDS[name];
        return {
          id: name,
          name,
          lat: coords.lat,
          lng: coords.lng,
          demand: 60,
          retailers: 12,
          revenue: 1.5,
          isHub: name === 'حدة',
        };
      });
    }

    return cityDemand.map((cd) => {
      const coords = NEIGHBORHOOD_COORDS[cd.city] || { 
        lat: 15.3694 + (Math.sin(cd.city.charCodeAt(0)) * 0.02), 
        lng: 44.1910 + (Math.cos(cd.city.charCodeAt(0)) * 0.02) 
      };
      return {
        id: cd.city,
        name: cd.city,
        lat: coords.lat,
        lng: coords.lng,
        demand: Math.min(100, Math.max(20, cd.order_count * 15)),
        retailers: cd.retailer_count,
        revenue: cd.total_revenue / 1000000,
        isHub: cd.city === 'صنعاء' || cd.city === 'حدة',
      };
    });
  }, [cityDemand]);

  const hoveredCity = CITIES.find((c) => c.id === hovered);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span className="text-[10px] tracking-[0.3em] text-slate-400">SUPPLY CHAIN & MARKET INTELLIGENCE</span>
          </div>
          <h3 className="text-[#0B1B3B] text-lg">منصّة الذكاء اللوجستي والسوقي</h3>
          <p className="text-xs text-slate-500 mt-0.5">رؤية لحظية لتدفّق المنتجات وكثافة الطلب عبر المحافظات</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
            {([
              { id: 'both', label: 'الكل' },
              { id: 'heat', label: 'كثافة الطلب' },
              { id: 'flow', label: 'مسارات التوزيع' },
            ] as const).map((l) => (
              <button
                key={l.id}
                onClick={() => setLayer(l.id)}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  layer === l.id ? 'bg-[#0B1B3B] text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-9 relative bg-gradient-to-br from-slate-100 to-slate-200 min-h-[460px] z-0 overflow-hidden">
          {/* SVG-based Map Simulation */}
          <svg className="w-full h-[460px]" viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="600" height="460" fill="url(#grid)" />

            {/* Flow lines from factory to cities */}
            {showFlow && CITIES.filter(c => c.id !== 'صنعاء' && c.id !== 'حدة').map((c, i) => {
              const fx = 300, fy = 200;
              const cx = 100 + (i * 120) % 500;
              const cy = 100 + (i * 80) % 350;
              return (
                <motion.line
                  key={`flow-${c.id}`}
                  x1={fx} y1={fy} x2={cx} y2={cy}
                  stroke="#1A73E8"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  opacity={0.5}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.2 }}
                />
              );
            })}

            {/* City circles (heat map) */}
            {showHeat && CITIES.map((c, i) => {
              const cx = 100 + (i * 120) % 500;
              const cy = 100 + (i * 80) % 350;
              const r = 20 + (c.demand / 100) * 30;
              const color = c.demand > 75 ? '#1A73E8' : c.demand > 45 ? '#F59E0B' : '#15803D';
              return (
                <g key={`heat-${c.id}`}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                >
                  <motion.circle
                    cx={cx} cy={cy} r={r}
                    fill={color} fillOpacity={0.25}
                    initial={{ r: 0 }}
                    animate={{ r }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                  <motion.circle
                    cx={cx} cy={cy} r={r * 0.6}
                    fill={color} fillOpacity={0.5}
                    initial={{ r: 0 }}
                    animate={{ r: r * 0.6 }}
                    transition={{ duration: 0.5, delay: i * 0.1 + 0.1 }}
                  />
                  <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fill="#0B1B3B" fontWeight="bold" direction="rtl">{c.name}</text>
                  {hovered === c.id && (
                    <g>
                      <rect x={cx - 55} y={cy - r - 45} width="110" height="38" rx="8" fill="#0B1B3B" fillOpacity="0.9" />
                      <text x={cx} y={cy - r - 28} textAnchor="middle" fontSize="10" fill="white">{`طلب: ${c.demand}%`}</text>
                      <text x={cx} y={cy - r - 14} textAnchor="middle" fontSize="10" fill="#94A3B8">{`تجار: ${c.retailers}`}</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Factory marker */}
            <circle cx={300} cy={200} r={12} fill="#0B1B3B" stroke="#ffffff" strokeWidth="3" />
            <text x={300} y={230} textAnchor="middle" fontSize="10" fill="#0B1B3B" fontWeight="bold">المصنع الرئيسي</text>
          </svg>
        </div>

        <div className="col-span-12 lg:col-span-3 border-r border-slate-100 p-5 space-y-4 bg-slate-50/30">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-2">FLOW SUMMARY</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <Truck className="w-3 h-3 text-[#1A73E8]" />
                  شحنات نشطة
                </div>
                <div className="text-lg text-[#0B1B3B] font-bold">74</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <Activity className="w-3 h-3 text-[#15803D]" />
                  مسارات حيّة
                </div>
                <div className="text-lg text-[#0B1B3B] font-bold">12</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <FactoryIcon className="w-3 h-3 text-[#0B1B3B]" />
                  منشآت ربط
                </div>
                <div className="text-lg text-[#0B1B3B] font-bold">6</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <TrendingUp className="w-3 h-3 text-amber-600" />
                  نموّ الطلب
                </div>
                <div className="text-lg text-[#0B1B3B] font-bold" dir="ltr">+14%</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-2">CITY DEMAND RANK</div>
            <div className="space-y-2">
              {[...CITIES].sort((a, b) => b.demand - a.demand).slice(0, 5).map((c, i) => (
                <div
                  key={c.id}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100 hover:border-[#1A73E8]/30 transition-colors cursor-pointer shadow-sm"
                >
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[10px] flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-xs text-[#0B1B3B] font-bold">{c.name}</span>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-[#1A73E8] to-[#0B1B3B]"
                      style={{ width: `${c.demand}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 tabular-nums w-7 text-left" dir="ltr">{c.demand}%</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-2.5 rounded-xl bg-[#0B1B3B] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#1A73E8] transition-colors shadow-sm">
            <Maximize2 className="w-3.5 h-3.5" />
            تكبير الخريطة
          </button>
        </div>
      </div>
    </div>
  );
}
