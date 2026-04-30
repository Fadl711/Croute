import { motion } from 'motion/react';
import { Navigation, MapPin, Fuel, Clock, CheckCircle, Package, QrCode, Phone, Map, Camera, Box, DollarSign, ArrowRight, List, Truck } from 'lucide-react';
import type { RouteStop, Shipment } from '../../../lib/supabase';
import LeafletMap from './LeafletMap';

interface RouteTabProps {
  route: any;
  currentTask: RouteStop | null;
  stops: RouteStop[];
  scanning: boolean;
  setScanning: (s: boolean) => void;
  setShowProofDialog: (s: boolean) => void;
  onCompleteStop: () => void;
  confirmingDelivery: boolean;
}

export default function RouteTab(props: RouteTabProps) {
  const { route, currentTask, stops, scanning, setScanning, setShowProofDialog, onCompleteStop, confirmingDelivery } = props;

  return (
    <motion.div
      key="route"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-24 lg:pb-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Real Leaflet Map */}
          <LeafletMap 
            stops={stops} 
            currentTask={currentTask} 
            onConfirm={onCompleteStop}
            confirming={confirmingDelivery}
          />

          {/* Current Task Detail Card - High End Light Design */}
          {currentTask ? (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-[#0B1B3B] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/10">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#0B1B3B] mb-1">المهمة الحالية</h3>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full animate-pulse ${currentTask.type === 'pickup' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                       <p className="text-slate-500 text-sm font-bold">
                         {currentTask.type === 'pickup' ? '📦 استلام من المصنع' : '📍 تسليم لمتجر التجزئة'}
                       </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-black mb-1">المحطة</div>
                  <div className="text-xl font-black text-[#0B1B3B]">#{currentTask.stop_order} <span className="text-slate-300 text-xs font-normal">من {route.totalStops}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: MapPin, label: 'الموقع المستهدف', value: currentTask.location_name, sub: currentTask.city, color: 'bg-blue-50 text-blue-600' },
                  { icon: Phone, label: 'المسؤول المباشر', value: currentTask.contact_name, sub: currentTask.contact_phone, color: 'bg-emerald-50 text-emerald-600' },
                  { icon: Box, label: 'تفاصيل الشحنة', value: currentTask.items_description, sub: 'الحمولة مؤمنة', color: 'bg-amber-50 text-amber-600' },
                  { icon: DollarSign, label: 'الأرباح المتوقعة', value: `${currentTask.earnings?.toLocaleString()} ر.ي`, sub: 'تضاف للمحفظة فوراً', color: 'bg-blue-50 text-blue-600', valColor: 'text-blue-600' }
                ].map((info, i) => (
                  <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-xl transition-colors ${info.color}`}>
                         <info.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{info.label}</span>
                    </div>
                    <div className={`text-lg font-black mb-1 ${info.valColor || 'text-slate-900'}`}>{info.value}</div>
                    <div className="text-xs text-slate-500 font-medium">{info.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setScanning(!scanning)}
                  className="sm:col-span-3 bg-[#0B1B3B] hover:bg-[#1A73E8] text-white py-5 rounded-[1.5rem] transition-all font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 active:scale-95 group"
                >
                  <QrCode className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>مسح باركود {currentTask.type === 'pickup' ? 'الاستلام' : 'التسليم'}</span>
                </button>

                <a
                  href={`tel:${currentTask.contact_phone}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl transition-all font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/10 active:scale-95"
                >
                  <Phone className="w-5 h-5" />
                  <span>اتصال</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${currentTask.city}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl transition-all font-bold flex items-center justify-center gap-2 active:scale-95"
                >
                  <Map className="w-5 h-5" />
                  <span>خرائط</span>
                </a>

                <button
                  onClick={() => setShowProofDialog(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl transition-all font-bold flex items-center justify-center gap-2 active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                  <span>توثيق</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Truck className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-400 mb-3">لا يوجد مسار نشط حالياً</h3>
              <p className="text-slate-500 max-w-xs mx-auto font-medium">بمجرد إسناد مهمة توصيل لك من قبل الإدارة ستظهر تفاصيل المسار هنا</p>
              <button className="mt-10 bg-[#0B1B3B] hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/10">
                استعراض الفرص المتاحة
              </button>
            </div>
          )}
        </div>

        {/* Stops Sidebar List */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 h-fit sticky top-[100px] shadow-sm">
            <h4 className="font-black text-xl text-[#0B1B3B] mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                 <List className="w-4 h-4 text-blue-600" />
              </div>
              نقاط المسار
            </h4>
            <div className="relative space-y-10">
              {/* Vertical Progress Line */}
              <div className="absolute right-6 top-6 bottom-6 w-px bg-slate-100" />
              
              {stops.map((stop, idx) => (
                <div key={stop.id} className="relative pr-12">
                  <div className={`absolute right-4.5 top-1.5 w-3 h-3 rounded-full border-2 border-white z-10 transition-all ${
                    stop.status === 'completed' ? 'bg-emerald-500 scale-125' :
                    stop.status === 'current' ? 'bg-blue-600 ring-4 ring-blue-500/20 scale-150' :
                    'bg-slate-300'
                  }`} />
                  
                  <div className={`p-5 rounded-3xl border transition-all ${
                    stop.status === 'current' 
                      ? 'bg-blue-50 border-blue-100 shadow-sm' 
                      : 'bg-white border-transparent'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        stop.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        stop.status === 'current' ? 'bg-blue-600 text-white' :
                        'bg-slate-100 text-slate-400'
                      }`}>
                        {stop.type === 'pickup' ? 'استلام' : 'تسليم'}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold tabular-nums">
                         <Clock className="w-3 h-3" />
                         {stop.eta || '10:30 ص'}
                      </div>
                    </div>
                    <div className={`text-sm font-black ${stop.status === 'completed' ? 'text-slate-300 line-through' : 'text-[#0B1B3B]'}`}>
                      {stop.location_name}
                    </div>
                    {stop.status === 'current' && (
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-blue-600 font-black">
                         <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                         أنت الآن في هذه المحطة
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

