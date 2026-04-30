import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Package, Navigation, CheckCircle, Truck, Clock, ShieldCheck, Info } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { motion } from 'motion/react';

// Use same coordinates as driver for consistency
const CITY_COORDS: Record<string, [number, number]> = {
  'Sana\'a': [15.3694, 44.1910],
  'صنعاء': [15.3694, 44.1910],
  'Aden': [12.7855, 45.0186],
  'Taiz': [13.5795, 44.0104],
  'Hodeidah': [14.7979, 42.9530],
  'Ibb': [13.9667, 44.1833],
};

const getCoords = (city: string, index: number): [number, number] => {
  const base = CITY_COORDS[city] || CITY_COORDS['Sana\'a'];
  return [base[0] + (index * 0.005), base[1] + (index * 0.008)];
};

interface RetailerTrackingMapProps {
  order: any;
  retailerId?: string;
}

export default function RetailerTrackingMap({ order, retailerId }: RetailerTrackingMapProps) {
  // Mocking route stops that would belong to this shipment
  const stops = useMemo(() => [
    { id: '1', type: 'pickup', location_name: 'مصنع الألبان المركزية', city: 'صنعاء', stop_order: 1, status: 'completed' },
    { id: '2', type: 'delivery', location_name: 'سوبر ماركت الرشيد', city: 'صنعاء', stop_order: 2, status: 'completed' },
    { id: '3', type: 'pickup', location_name: order.factory_name || 'المصنع المورد', city: 'صنعاء', stop_order: 3, status: 'completed' },
    { id: '4', type: 'delivery', location_name: 'بقالة الأمانة', city: 'صنعاء', stop_order: 4, status: 'in_progress' },
    { id: '5', type: 'delivery', location_name: 'سوبر ماركت الهناء (أنت)', city: 'صنعاء', stop_order: 5, status: 'pending', is_mine: true },
  ], [order]);

  const stopCoords = useMemo(() => 
    stops.map((stop, i) => getCoords(stop.city, i)), 
    [stops]
  );

  // Truck is currently moving towards the first non-completed stop
  const currentStopIndex = stops.findIndex(s => s.status !== 'completed');
  const truckPos = useMemo(() => {
    const idx = currentStopIndex !== -1 ? currentStopIndex : stops.length - 1;
    const prevIdx = Math.max(0, idx - 1);
    // Position it 60% of the way between prev and current for "live" feel
    return [
        stopCoords[prevIdx][0] + (stopCoords[idx][0] - stopCoords[prevIdx][0]) * 0.6,
        stopCoords[prevIdx][1] + (stopCoords[idx][1] - stopCoords[prevIdx][1]) * 0.6
    ] as [number, number];
  }, [currentStopIndex, stopCoords, stops]);

  // Smart ETA Calculation
  const etaInfo = useMemo(() => {
    const myStopIdx = stops.findIndex(s => (s as any).is_mine);
    if (myStopIdx === -1) return null;
    
    const stopsRemaining = myStopIdx - currentStopIndex;
    const minutesRemaining = (stopsRemaining * 15) + 10; // 15 mins per stop + 10 mins travel
    
    return {
        minutes: minutesRemaining,
        stopsCount: stopsRemaining,
        status: stopsRemaining === 0 ? 'الشحنة وصلت منطقتك' : `بانتظار ${stopsRemaining} توقفات أخرى`
    };
  }, [stops, currentStopIndex]);

  const truckIcon = L.divIcon({
    html: renderToString(
      <div className="w-10 h-10 bg-[#0B1B3B] rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-pulse">
         <Truck size={18} color="white" />
      </div>
    ),
    className: 'truck-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const createMarkerIcon = (isMine: boolean, status: string) => {
    const color = isMine ? '#1A73E8' : '#CBD5E1';
    return L.divIcon({
        html: renderToString(
          <div className="relative flex items-center justify-center">
            <div style={{ backgroundColor: color }} className={`w-6 h-6 rounded-lg border-2 border-white shadow-lg flex items-center justify-center`}>
               {isMine ? <MapPin size={12} color="white" /> : <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
          </div>
        ),
        className: 'stop-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
  };

  return (
    <div className="space-y-6">
      {/* Smart Status Card */}
      <div className="bg-white border border-blue-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
              <Clock className="w-8 h-8 text-blue-600 animate-pulse" />
           </div>
           <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">الوقت المتوقع للوصول</p>
              <div className="flex items-center gap-2">
                 <h3 className="text-2xl font-black text-[#0B1B3B]">{etaInfo?.minutes} دقيقة</h3>
                 <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg font-bold">مباشر</span>
              </div>
           </div>
        </div>
        <div className="hidden md:flex flex-col items-end text-right">
           <div className="text-[10px] text-slate-400 font-black uppercase mb-1">{etaInfo?.status}</div>
           <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
              ))}
           </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-inner">
        <MapContainer 
          center={CITY_COORDS['Sana\'a']} 
          zoom={13} 
          style={{ height: '100%', width: '100%', background: '#F8FAFC' }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          
          <Polyline positions={stopCoords} pathOptions={{ color: '#1A73E8', weight: 3, opacity: 0.2, dashArray: '8, 8' }} />
          
          <Marker position={truckPos} icon={truckIcon} />

          {stops.map((stop, i) => {
            const isMine = (stop as any).is_mine;
            return (
              <Marker key={stop.id} position={stopCoords[i]} icon={createMarkerIcon(isMine, stop.status)}>
                <Popup className="custom-popup">
                   <div className="p-2 text-right" dir="rtl">
                      <div className="flex items-center gap-2 mb-1">
                         <div className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase ${isMine ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {isMine ? '📦 شحنتك' : '📍 محطة مسار'}
                         </div>
                      </div>
                      <h4 className="text-xs font-black text-[#0B1B3B]">
                        {isMine ? stop.location_name : 'محطة توقف (بيانات محمية)'}
                      </h4>
                      {!isMine && (
                        <div className="flex items-center gap-1 mt-1 text-[8px] text-slate-400 font-bold">
                           <ShieldCheck size={8} /> خصوصية المسار مفعلة
                        </div>
                      )}
                   </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl space-y-2">
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full" /> شحنتك الحالية
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
              <div className="w-2 h-2 bg-slate-300 rounded-full" /> توقفات أخرى في المسار
           </div>
        </div>

        {/* Protection Banner */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-[#0B1B3B]/90 backdrop-blur-xl text-white px-6 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 border border-white/10">
           <ShieldCheck className="w-3 h-3 text-emerald-400" />
           نظام حماية البيانات النشط: يتم عرض مسار الشاحنة فقط دون كشف تفاصيل العملاء الآخرين.
        </div>
      </div>

      {/* Driver Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
               <Truck className="w-6 h-6 text-slate-400" />
            </div>
            <div>
               <h4 className="text-sm font-black text-[#0B1B3B]">السائق: محمد الكبسي</h4>
               <p className="text-[10px] text-slate-500 font-bold">شاحنة متوسطة - رقم اللوحة: ١٢٣٤ / أ</p>
            </div>
         </div>
         <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black text-[#0B1B3B] shadow-sm hover:bg-slate-50">
            اتصال بالسائق
         </button>
      </div>
    </div>
  );
}
