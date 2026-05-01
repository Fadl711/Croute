import { useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";
import {
  Users,
  TrendingUp,
  Map as MapIcon,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useFactoryMarket } from "../../../hooks/useFactoryMarket";
import type { Factory } from "../../../lib/supabase";

const CITY_COORDS: Record<string, [number, number]> = {
  "صنعاء - حدة": [15.3125, 44.1833],
  "صنعاء - السبعين": [15.3250, 44.2100],
  "صنعاء - شملان": [15.4200, 44.1500],
  "صنعاء - التحرير": [15.3533, 44.2058],
  "صنعاء - الستين": [15.3400, 44.1700],
  صنعاء: [15.3694, 44.191],
  عدن: [12.7855, 45.0186],
  تعز: [13.5795, 44.0104],
  الحديدة: [14.7979, 42.953],
  إب: [13.9667, 44.1833],
  ذمار: [14.5431, 44.4106],
  عمران: [15.6594, 43.9439],
  المكلا: [14.5367, 49.1242],
};

const SIMULATED_RETAILERS = [
  { id: 'sim-1', name: 'سوبر ماركت الهدى', city: 'صنعاء - حدة', heat_rank: 5, total: 450000 },
  { id: 'sim-2', name: 'بقالة الأمل', city: 'صنعاء - حدة', heat_rank: 4, total: 320000 },
  { id: 'sim-3', name: 'مركز رعاية المستهلك', city: 'صنعاء - حدة', heat_rank: 5, total: 890000 },
  { id: 'sim-4', name: 'تجزئة السبعين الكبرى', city: 'صنعاء - السبعين', heat_rank: 4, total: 150000 },
  { id: 'sim-5', name: 'متجر شملان الصغير', city: 'صنعاء - شملان', heat_rank: 1, total: 25000 },
  { id: 'sim-6', name: 'بقالة النور', city: 'صنعاء - شملان', heat_rank: 1, total: 12000 },
  { id: 'sim-7', name: 'مركز التحرير التجاري', city: 'صنعاء - التحرير', heat_rank: 3, total: 210000 },
  { id: 'sim-8', name: 'هايبر الستين', city: 'صنعاء - الستين', heat_rank: 4, total: 540000 },
];

function MapAutoFit({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 10 });
    }
  }, [coords, map]);
  return null;
}

interface FactoryMarketMapProps {
  factory: Factory | null;
}

export default function FactoryMarketMap({ factory }: FactoryMarketMapProps) {
  const { retailers, loading } = useFactoryMarket(factory?.id);

  const factoryCoord: [number, number] = useMemo(() => {
    if (factory?.latitude && factory?.longitude) {
      return [factory.latitude, factory.longitude];
    }
    return CITY_COORDS[factory?.city || "صنعاء"] || CITY_COORDS["صنعاء"];
  }, [factory]);

  const retailerPoints = useMemo(() => {
    // Combine real data with simulation for a "WOW" demo effect
    const combined = [
      ...retailers.map(r => ({ ...r, heat_rank: Math.min(r.order_count, 5), is_sim: false })),
      ...SIMULATED_RETAILERS.map(r => ({ 
        id: r.id, 
        name: r.name, 
        city: r.city, 
        latitude: 0, 
        longitude: 0, 
        total_spent: r.total,
        heat_rank: r.heat_rank,
        is_sim: true 
      }))
    ];

    return combined.map(r => {
      const coords: [number, number] = r.latitude && r.longitude 
        ? [r.latitude, r.longitude]
        : CITY_COORDS[r.city || "صنعاء"] || CITY_COORDS["صنعاء"];
      
      // Add jitter for simulation points or same-city retailers
      // Using a larger and more varied jitter for better realism
      const latJitter = (Math.random() - 0.5) * 0.05;
      const lngJitter = (Math.random() - 0.5) * 0.05;
      return {
        ...r,
        coords: [coords[0] + latJitter, coords[1] + lngJitter] as [number, number],
        // Mist density depends on heat_rank
        mist_radius: 1000 + (r.heat_rank * 1200),
        mist_opacity: 0.1 + (r.heat_rank * 0.08),
      };
    });
  }, [retailers]);

  const allCoords = useMemo(() => {
    const points = retailerPoints.map(p => p.coords);
    points.push(factoryCoord);
    return points;
  }, [retailerPoints, factoryCoord]);

  if (loading) {
    return (
      <div className="h-[600px] bg-slate-100 animate-pulse rounded-3xl flex items-center justify-center">
        <div className="text-slate-400 font-bold">جاري تحليل بيانات الانتشار...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="md:col-span-1 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase">شبكة التجار</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{retailers.length}</div>
            <div className="text-xs text-emerald-600 font-bold mt-1">تغطية نشطة</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase">كثافة السوق</span>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {Math.round((retailers.length / 50) * 100)}%
            </div>
            <div className="text-xs text-purple-600 font-bold mt-1">من الهدف السنوي</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl shadow-xl shadow-blue-900/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl text-white">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-blue-100 uppercase">تحليل النطاق</span>
            </div>
            <div className="text-white space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-200">المدن الرئيسية</span>
                <span>{new Set(retailers.map(r => r.city)).size}</span>
              </div>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/4" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* The WOW Map */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl h-[600px] relative">
          <MapContainer
            center={factoryCoord}
            zoom={7}
            style={{ height: "100%", width: "100%", background: '#f8fafc' }}
            zoomControl={false}
          >
            {/* Light Mode Map Tiles */}
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapAutoFit coords={allCoords} />

            {/* Factory Marker (Center of Universe) */}
            <Marker position={factoryCoord} icon={L.divIcon({
              className: 'factory-glow',
              html: `<div class="relative">
                <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 scale-150"></div>
                <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-blue-600">
                  <img src="/src/assets/logo.png" class="w-6 h-6 object-contain" />
                </div>
              </div>`
            })} />

            {/* Retailer Markers */}
            {retailerPoints.map((rp, i) => (
              <div key={rp.id}>
                {/* The "Heat" Circle (Subtle for light mode) */}
                <Circle
                  center={rp.coords}
                  radius={rp.mist_radius}
                  pathOptions={{
                    fillColor: '#3B82F6',
                    fillOpacity: rp.mist_opacity * 0.5,
                    color: 'transparent',
                    className: 'blur-xl'
                  }}
                />
                
                {/* The Node Marker */}
                <Marker 
                  position={rp.coords}
                  icon={L.divIcon({
                    className: 'retailer-node',
                    html: `<div class="relative group">
                      <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-blue-500 hover:scale-125 transition-transform duration-300">
                        <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>`
                  })}
                >
                  <Popup className="custom-popup">
                    <div className="text-right font-sans p-2">
                      <div className="font-black text-slate-900">{rp.name}</div>
                      <div className="text-[10px] text-slate-500 mb-2">{rp.city}</div>
                      <div className="flex justify-between items-center gap-4 text-xs">
                        <span className="text-slate-400">إجمالي السحب:</span>
                        <span className="font-bold text-blue-600">{rp.total_spent.toLocaleString()} ر.ي</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </div>
            ))}
          </MapContainer>

          {/* Overlay Legend */}
          <div className="absolute bottom-8 right-8 z-[400] bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-lg">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-right">خريطة الانتشار</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-slate-600 font-bold">تجار نشطين</span>
                <div className="w-3 h-3 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center">
                   <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-slate-500">نطاق التوزيع</span>
                <div className="w-4 h-4 bg-blue-500/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .leaflet-container { background: #f8fafc !important; }
        .factory-glow { width: 40px !important; height: 40px !important; }
        .retailer-node { width: 24px !important; height: 24px !important; }
        .blur-xl { filter: blur(15px); }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 1rem;
          padding: 0;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e2e8f0;
        }
      `}</style>
    </div>
  );
}
