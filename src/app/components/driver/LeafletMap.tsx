import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Package, Navigation, CheckCircle, Truck } from "lucide-react";
import { renderToString } from "react-dom/server";
import type { RouteStop } from "../../../lib/supabase";

const CITY_COORDS: Record<string, [number, number]> = {
  "Sana'a": [15.3694, 44.191],
  صنعاء: [15.3694, 44.191],
  Aden: [12.7855, 45.0186],
  عدن: [12.7855, 45.0186],
  Taiz: [13.5795, 44.0104],
  تعز: [13.5795, 44.0104],
  Hodeidah: [14.7979, 42.953],
  الحديدة: [14.7979, 42.953],
  Ibb: [13.9667, 44.1833],
  إب: [13.9667, 44.1833],
  Mukalla: [14.5367, 49.1242],
  المكلا: [14.5367, 49.1242],
  Dhamar: [14.5431, 44.4106],
  ذمار: [14.5431, 44.4106],
  Amran: [15.6594, 43.9439],
  عمران: [15.6594, 43.9439],
};

const getCoords = (city: string, index: number): [number, number] => {
  const base = CITY_COORDS[city] || CITY_COORDS["Sana'a"];
  return [base[0] + index * 0.005, base[1] + index * 0.008];
};

interface LeafletMapProps {
  stops: RouteStop[];
  currentTask: RouteStop | null;
  onConfirm: () => void;
  confirming: boolean;
}

function MapAutoFit({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  const coordsStr = JSON.stringify(coords);
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [coordsStr, map]);
  return null;
}

export default function LeafletMap({
  stops,
  currentTask,
  onConfirm,
  confirming,
}: LeafletMapProps) {
  const stopCoords = useMemo(
    () => stops.map((stop, i) => getCoords(stop.city, i)),
    [stops]
  );

  const truckPos = useMemo(() => {
    if (!currentTask) return null;
    const currentIndex = stops.findIndex((s) => s.id === currentTask.id);
    if (currentIndex === 0)
      return [stopCoords[0][0] - 0.005, stopCoords[0][1] - 0.005] as [
        number,
        number
      ];
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    return stopCoords[prevIndex];
  }, [currentTask, stops, stopCoords]);

  const createCustomIcon = (status: string, isCurrent: boolean) => {
    const color =
      status === "completed" ? "#10B981" : isCurrent ? "#1A73E8" : "#94A3B8";
    return L.divIcon({
      html: renderToString(
        <div
          className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg ${
            isCurrent ? "animate-bounce" : ""
          }`}
          style={{ background: color }}
        >
          {status === "completed" ? (
            <CheckCircle size={16} color="white" />
          ) : (
            <MapPin size={16} color="white" />
          )}
        </div>
      ),
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  };

  const truckIcon = L.divIcon({
    html: renderToString(
      <div className="relative">
        <div className="w-12 h-12 bg-[#0B1B3B] rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
          <Truck size={24} color="white" className="animate-pulse" />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 blur-sm rounded-full" />
      </div>
    ),
    className: "truck-icon-container",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  return (
    <div className="relative w-full h-[500px] rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm group">
      <style>{`
        .truck-icon-container { transition: all 2s cubic-bezier(0.4, 0, 0.2, 1); }
        .custom-popup .leaflet-popup-content-wrapper { background: white !important; color: #0F172A !important; border-radius: 20px !important; padding: 4px !important; box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important; }
      `}</style>

      <MapContainer
        center={CITY_COORDS["Sana'a"]}
        zoom={13}
        style={{ height: "100%", width: "100%", background: "#F8FAFC" }}
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapAutoFit coords={stopCoords} />

        {currentTask && (
          <Polyline
            positions={stopCoords}
            pathOptions={{
              color: "#1A73E8",
              weight: 5,
              opacity: 0.3,
              dashArray: "12, 12",
            }}
          />
        )}

        {currentTask && truckPos && (
          <Marker position={truckPos} icon={truckIcon} />
        )}

        {stops.map((stop, i) => (
          <Marker
            key={stop.id}
            position={stopCoords[i]}
            icon={createCustomIcon(stop.status, stop.id === currentTask?.id)}
          >
            <Popup className="custom-popup">
              <div className="p-2 text-right" dir="rtl">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      stop.type === "pickup"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {stop.type === "pickup" ? "📦 استلام" : "📍 تسليم"}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">
                    المحطة #{stop.stop_order}
                  </span>
                </div>
                <div className="text-sm font-black text-[#0B1B3B] mb-1">
                  {stop.location_name}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <MapPin size={10} className="text-blue-500" />
                  {stop.city}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Overlays */}
      {currentTask && (
        <>
          <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-3">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-xl flex items-center gap-4 min-w-[200px]">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                <Navigation className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                  الموقع الحالي
                </p>
                <p className="text-sm font-black text-[#0B1B3B]">
                  صنعاء - الجراف
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-6">
            <div className="bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-[2rem] p-6 shadow-2xl border-t-blue-500">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#0B1B3B]">
                      {currentTask.type === "pickup"
                        ? "تأكيد الاستلام"
                        : "تأكيد التسليم"}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {currentTask.location_name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-emerald-600 font-black mb-0.5 uppercase">
                    أرباحك
                  </div>
                  <div className="text-sm font-black tabular-nums text-emerald-600">
                    +{currentTask.earnings?.toLocaleString()} ر.ي
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
                disabled={confirming}
                className="w-full bg-[#0B1B3B] hover:bg-[#1A73E8] disabled:bg-slate-100 disabled:text-slate-400 text-white py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
              >
                {confirming ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>
                      {currentTask.type === "pickup"
                        ? "تأكيد تحميل البضاعة"
                        : "تأكيد وصول الشحنة"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Empty State Overlay */}
      {!currentTask && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-2xl text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-[#0B1B3B] mb-2">
              اكتملت جميع المهام!
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              لقد قمت بإيصال جميع الشحنات بنجاح. يمكنك الآن مراجعة أرباحك في
              تبويب "الأرباح".
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/20 to-transparent pointer-events-none z-[999]" />
    </div>
  );
}
