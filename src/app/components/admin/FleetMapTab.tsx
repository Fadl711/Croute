import { useMemo } from "react";
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
import type { Shipment, Driver } from "../../../lib/supabase";
import { useEffect } from "react";

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

const ROUTE_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];

function MapAutoFit({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 9 });
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

interface FleetMapTabProps {
  shipments: Shipment[];
  drivers: Driver[];
}

export default function FleetMapTab({
  shipments,
  drivers,
}: FleetMapTabProps) {
  const activeShipments = shipments.filter(
    (s) => s.status === "in_transit" || s.status === "pending"
  );
  const deliveredCount = shipments.filter(
    (s) => s.status === "delivered" || s.status === "completed"
  ).length;

  // Generate route coordinates for each shipment
  const routes = useMemo(() => {
    return activeShipments.map((shipment, idx) => {
      const routeParts = (shipment.route || "صنعاء").split("-").map((s) => s.trim());
      const coords: [number, number][] = routeParts.map((city, i) => {
        const base = CITY_COORDS[city] || CITY_COORDS["صنعاء"];
        return [base[0] + i * 0.01 * (idx + 1), base[1] + i * 0.012 * (idx + 1)];
      });

      // If single city, generate two nearby points for a visible route
      if (coords.length < 2) {
        const base = coords[0] || [15.3694, 44.191];
        coords.push([base[0] + 0.05, base[1] + 0.06]);
      }

      const driverInfo = drivers.find((d) => d.id === shipment.driver_id);

      return {
        shipment,
        coords,
        color: ROUTE_COLORS[idx % ROUTE_COLORS.length],
        driver: driverInfo,
      };
    });
  }, [activeShipments, drivers]);

  const allCoords = routes.flatMap((r) => r.coords);
  if (allCoords.length === 0) {
    allCoords.push([15.3694, 44.191]); // Default to Sana'a
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "شحنات نشطة",
            value: activeShipments.length,
            icon: Truck,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "سائقون في الميدان",
            value: new Set(activeShipments.map((s) => s.driver_id)).size,
            icon: MapPin,
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "تم التوصيل",
            value: deliveredCount,
            icon: CheckCircle,
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "بانتظار التعيين",
            value: shipments.filter((s) => s.status === "pending").length,
            icon: Clock,
            color: "text-purple-600 bg-purple-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {stat.value}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map Container */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                رادار الأسطول المباشر
              </h3>
              <p className="text-xs text-slate-500">
                تتبع جميع الشحنات والسائقين في الوقت الحقيقي
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-600 font-bold">مباشر</span>
          </div>
        </div>

        <div style={{ height: "500px" }}>
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
                {/* Route line */}
                <Polyline
                  positions={route.coords}
                  pathOptions={{
                    color: route.color,
                    weight: 4,
                    opacity: 0.8,
                    dashArray:
                      route.shipment.status === "pending" ? "10 6" : undefined,
                  }}
                />

                {/* Origin marker */}
                <Marker
                  position={route.coords[0]}
                  icon={createIcon(route.color, Package, 28)}
                >
                  <Popup>
                    <div
                      className="text-center font-sans"
                      style={{ direction: "rtl" }}
                    >
                      <div className="font-bold text-sm">
                        {route.shipment.shipment_number}
                      </div>
                      <div className="text-xs text-gray-600">
                        المبلغ: {route.shipment.total_amount.toLocaleString()}{" "}
                        ر.ي
                      </div>
                      {route.driver && (
                        <div className="text-xs text-blue-600 mt-1">
                          السائق: {route.driver.name}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>

                {/* Destination marker */}
                {route.coords.length > 1 && (
                  <Marker
                    position={route.coords[route.coords.length - 1]}
                    icon={createIcon("#10B981", MapPin, 24)}
                  />
                )}

                {/* Truck marker (midpoint for in_transit) */}
                {route.shipment.status === "in_transit" &&
                  route.coords.length >= 2 && (
                    <Marker
                      position={[
                        (route.coords[0][0] +
                          route.coords[route.coords.length - 1][0]) /
                          2,
                        (route.coords[0][1] +
                          route.coords[route.coords.length - 1][1]) /
                          2,
                      ]}
                      icon={createIcon(route.color, Truck, 36)}
                    >
                      <Popup>
                        <div style={{ direction: "rtl" }} className="font-sans">
                          <div className="font-bold">
                            🚚 {route.driver?.name || "سائق"}
                          </div>
                          <div className="text-xs">
                            {route.shipment.route || "في الطريق"}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )}
              </div>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Route Legend */}
      {routes.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-slate-900 mb-3">
            المسارات النشطة
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {routes.map((route, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: route.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 truncate">
                    {route.shipment.shipment_number}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {route.driver?.name || "بانتظار التعيين"} •{" "}
                    {route.shipment.route || "—"}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    route.shipment.status === "in_transit"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {route.shipment.status === "in_transit"
                    ? "في الطريق"
                    : "معلق"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeShipments.length === 0 && (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <div className="text-slate-500 font-bold text-lg mb-2">
            لا توجد شحنات نشطة حالياً
          </div>
          <div className="text-sm text-slate-400">
            ستظهر الشحنات هنا بمجرد قبول طلبات جديدة من المصانع
          </div>
        </div>
      )}
    </motion.div>
  );
}
