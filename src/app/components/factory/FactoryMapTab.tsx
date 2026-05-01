import { useMemo, useEffect } from "react";
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
import { renderToString } from "react-dom/server";
import {
  Truck,
  Package,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import type { Shipment } from "../../../lib/supabase";

const CITY_COORDS: Record<string, [number, number]> = {
  "Sana'a": [15.3694, 44.191],
  صنعاء: [15.3694, 44.191],
  عدن: [12.7855, 45.0186],
  تعز: [13.5795, 44.0104],
  الحديدة: [14.7979, 42.953],
  إب: [13.9667, 44.1833],
  ذمار: [14.5431, 44.4106],
  عمران: [15.6594, 43.9439],
  المكلا: [14.5367, 49.1242],
};

function MapAutoFit({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
    }
  }, [coords, map]);
  return null;
}

function createIcon(
  color: string,
  IconComp: any,
  size: number = 32
): L.DivIcon {
  return L.divIcon({
    className: "custom-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 15px ${color}40;
      border:3px solid white;
    ">${renderToString(
      <IconComp
        style={{ width: size * 0.5, height: size * 0.5, color: "white" }}
      />
    )}</div>`,
  });
}

interface FactoryMapTabProps {
  shipments: Shipment[];
}

export default function FactoryMapTab({ shipments }: FactoryMapTabProps) {
  const activeShipments = shipments.filter(
    (s) => s.status === "in_transit" || s.status === "pending"
  );

  const routes = useMemo(() => {
    return activeShipments.map((shipment, idx) => {
      // 1. Get Factory Coords (Start)
      const startCoord: [number, number] = 
        shipment.factory?.latitude && shipment.factory?.longitude 
          ? [shipment.factory.latitude, shipment.factory.longitude]
          : CITY_COORDS[(shipment.factory?.city || "صنعاء")] || CITY_COORDS["صنعاء"];

      // 2. Get Retailer Coords (End)
      const retailer = (shipment as any).orders?.retailer;
      const endCoord: [number, number] = 
        retailer?.latitude && retailer?.longitude
          ? [retailer.latitude, retailer.longitude]
          : CITY_COORDS[(retailer?.city || "صنعاء")] || CITY_COORDS["صنعاء"];

      const coords: [number, number][] = [startCoord, endCoord];

      // Add a slight curve/midpoint for visual interest if they are same city
      if (coords[0][0] === coords[1][0] && coords[0][1] === coords[1][1]) {
        coords[1] = [coords[1][0] + 0.005, coords[1][1] + 0.005];
      }

      return {
        shipment,
        coords,
        color: "#1A73E8", // Factory theme color
      };
    });
  }, [activeShipments]);

  const allCoords = routes.flatMap((r) => r.coords);
  if (allCoords.length === 0) {
    allCoords.push([15.3694, 44.191]);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            تتبع الشحنات المباشر
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            متابعة حركة منتجاتك من المصنع إلى العميل
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-[600px]">
          <MapContainer
            center={[15.3694, 44.191]}
            zoom={7}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapAutoFit coords={allCoords} />

            {routes.map((route, idx) => (
              <div key={idx}>
                <Polyline
                  positions={route.coords}
                  pathOptions={{
                    color: route.color,
                    weight: 3,
                    opacity: 0.6,
                    dashArray:
                      route.shipment.status === "pending" ? "5 10" : undefined,
                  }}
                />

                {/* Pickup */}
                <Marker
                  position={route.coords[0]}
                  icon={createIcon("#1E293B", Package, 24)}
                >
                  <Popup>موقع الاستلام: المصنع</Popup>
                </Marker>

                {/* Dropoff */}
                <Marker
                  position={route.coords[route.coords.length - 1]}
                  icon={createIcon("#10B981", MapPin, 24)}
                >
                  <Popup>وجهة التوصيل: التاجر</Popup>
                </Marker>

                {/* Truck */}
                {route.shipment.status === "in_transit" && (
                  <Marker
                    position={[
                      (route.coords[0][0] +
                        route.coords[route.coords.length - 1][0]) /
                        2,
                      (route.coords[0][1] +
                        route.coords[route.coords.length - 1][1]) /
                        2,
                    ]}
                    icon={createIcon("#1A73E8", Truck, 32)}
                  >
                    <Popup>
                      <div className="text-right font-sans">
                        <div className="font-bold">
                          {route.shipment.shipment_number}
                        </div>
                        <div className="text-xs text-blue-600">قيد التوصيل حالياً</div>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </div>
            ))}
          </MapContainer>
        </div>

        {/* Shipment List for Map */}
        <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
          <h3 className="text-sm font-bold text-slate-800 sticky top-0 bg-slate-50 py-2">
            الشحنات النشطة ({activeShipments.length})
          </h3>
          {activeShipments.map((s) => (
            <div
              key={s.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-bold text-slate-900">
                  {s.shipment_number}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    s.status === "in_transit"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {s.status === "in_transit" ? "في الطريق" : "بانتظار السائق"}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mb-2">
                <MapPin className="w-3 h-3" /> {s.route}
              </div>
              <div className="text-xs font-bold text-slate-900">
                {s.total_amount.toLocaleString()} ر.ي
              </div>
            </div>
          ))}

          {activeShipments.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <div className="text-xs text-slate-400">لا توجد شحنات نشطة</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
