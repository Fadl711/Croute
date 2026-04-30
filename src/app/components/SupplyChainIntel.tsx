import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useSupplyChainIntel } from '../../hooks/useSupplyChainIntel';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip as LeafletTooltip } from 'react-leaflet';


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
        <div className="col-span-12 lg:col-span-9 relative bg-slate-100 min-h-[460px] z-0">
          <MapContainer center={[15.3550, 44.1850]} zoom={13} style={{ height: '460px', width: '100%', zIndex: 0 }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {showHeat && CITIES.map((c) => (
              <CircleMarker
                key={`heat-${c.id}`}
                center={[c.lat, c.lng]}
                radius={15 + (c.demand / 100) * 20}
                fillColor={c.demand > 75 ? '#1A73E8' : c.demand > 45 ? '#F59E0B' : '#15803D'}
                color="transparent"
                fillOpacity={0.6}
              >
                <LeafletTooltip direction="top" opacity={1}>
                  <div className="text-right font-bold" dir="rtl">
                    <div className="text-[#0B1B3B] mb-1">{c.name}</div>
                    <div className="text-xs text-slate-500">طلب: {c.demand}%</div>
                    <div className="text-xs text-slate-500">تجار: {c.retailers}</div>
                  </div>
                </LeafletTooltip>
              </CircleMarker>
            ))}
            {showFlow && CITIES.filter(c => c.id !== 'صنعاء' && c.id !== 'حدة').map((c) => (
              <Polyline
                key={`flow-${c.id}`}
                positions={[
                  [FACTORY.lat, FACTORY.lng],
                  [c.lat, c.lng]
                ]}
                color="#1A73E8"
                weight={3}
                opacity={0.5}
                dashArray="5, 10"
              />
            ))}
            {/* Factory Marker */}
            <CircleMarker
              center={[FACTORY.lat, FACTORY.lng]}
              radius={8}
              fillColor="#0B1B3B"
              color="#ffffff"
              weight={2}
              fillOpacity={1}
            >
              <LeafletTooltip permanent direction="bottom" opacity={0.9}>
                <span className="font-bold">المصنع الرئيسي (المركز)</span>
              </LeafletTooltip>
            </CircleMarker>
          </MapContainer>
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
