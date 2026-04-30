import { motion } from 'motion/react';
import { Navigation, MapPin, Fuel, Clock, CheckCircle, Package, QrCode, Phone, Map, Camera, Box, DollarSign, ArrowRight } from 'lucide-react';
import type { RouteStop, Shipment } from '../../../lib/supabase';

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
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          {/* Map Simulation */}
          <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-3xl overflow-hidden mb-6 relative h-[450px] border border-slate-700/50 shadow-2xl">
            <div className="absolute inset-0">
              <svg className="absolute inset-0 w-full h-full opacity-30">
                <motion.path
                  d="M 100,350 Q 150,300 250,250 T 400,180 T 550,120"
                  stroke="#3B82F6"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="10,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </svg>

              {/* Markers */}
              {stops.map((stop, idx) => (
                <motion.div
                  key={stop.id}
                  className="absolute"
                  style={{ 
                    top: `${80 - (idx * 15)}%`, 
                    right: `${10 + (idx * 20)}%` 
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className={`w-12 h-12 rounded-2xl border-4 border-slate-800 shadow-xl flex items-center justify-center transition-all ${
                    stop.status === 'completed' ? 'bg-emerald-500' :
                    stop.status === 'current' ? 'bg-amber-500 ring-4 ring-amber-500/30 animate-pulse' :
                    'bg-slate-700'
                  }`}>
                    {stop.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Package className={`w-6 h-6 text-white ${stop.status === 'current' ? 'animate-bounce' : ''}`} />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Current Location Overlay */}
            <div className="absolute top-6 right-6 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">موقعك الحالي</p>
                  <p className="text-sm font-bold">صنعاء - جولة الرويشان</p>
                </div>
              </div>
            </div>

            {/* Route Stats floating bar */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
              {[
                { icon: Navigation, label: 'المسافة', value: route.distance, color: 'text-blue-400' },
                { icon: Clock, label: 'الوقت المتبقي', value: route.eta, color: 'text-amber-400' },
                { icon: Fuel, label: 'توفير وقود', value: route.fuelSaved, color: 'text-emerald-400' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{stat.label}</span>
                  </div>
                  <div className="text-lg font-black tabular-nums">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Task Detail Card */}
          {currentTask ? (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-[2rem] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Package className="w-8 h-8 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-1">المهمة الحالية</h3>
                    <p className="text-slate-400 text-sm font-medium">
                      {currentTask.type === 'pickup' ? '📦 استلام من المصنع' : '📍 تسليم لمتجر التجزئة'}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-700/50 border border-slate-600/50 px-5 py-3 rounded-2xl text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-black mb-1">المحطة</div>
                  <div className="text-lg font-black">#{currentTask.stop_order} <span className="text-slate-500 text-xs font-normal">من {route.totalStops}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: MapPin, label: 'الموقع المستهدف', value: currentTask.location_name, sub: currentTask.city },
                  { icon: Phone, label: 'المسؤول المباشر', value: currentTask.contact_name, sub: currentTask.contact_phone },
                  { icon: Box, label: 'تفاصيل الشحنة', value: currentTask.items_description, sub: 'الحمولة مؤمنة' },
                  { icon: DollarSign, label: 'الأرباح المتوقعة', value: `${currentTask.earnings?.toLocaleString()} ر.ي`, sub: 'تضاف للمحفظة فوراً', color: 'text-emerald-400' }
                ].map((info, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 hover:bg-slate-800/80 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <info.icon className={`w-4 h-4 ${info.color || 'text-slate-400'}`} />
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{info.label}</span>
                    </div>
                    <div className="text-lg font-bold mb-1">{info.value}</div>
                    <div className="text-xs text-slate-500">{info.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setScanning(!scanning)}
                  className="md:col-span-3 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl transition-all font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 group"
                >
                  <QrCode className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>مسح باركود {currentTask.type === 'pickup' ? 'الاستلام' : 'التسليم'}</span>
                </button>

                <a
                  href={`tel:${currentTask.contact_phone}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl transition-all font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 active:scale-95"
                >
                  <Phone className="w-5 h-5" />
                  <span>اتصال</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${currentTask.city}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-2xl transition-all font-bold flex items-center justify-center gap-2 active:scale-95"
                >
                  <Map className="w-5 h-5" />
                  <span>خرائط</span>
                </a>

                <button
                  onClick={() => setShowProofDialog(true)}
                  className="bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-2xl transition-all font-bold flex items-center justify-center gap-2 active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                  <span>توثيق</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-[2rem] p-20 text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">لا يوجد مسار نشط حالياً</h3>
              <p className="text-slate-500 max-w-xs mx-auto">بمجرد قبولك لمهمة توصيل من المصانع المتاحة ستظهر تفاصيل المسار هنا</p>
              <button className="mt-8 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
                استعراض الفرص المتاحة
              </button>
            </div>
          )}
        </div>

        {/* Stops Sidebar List */}
        <div className="space-y-6">
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 h-fit sticky top-[160px]">
            <h4 className="font-black text-lg mb-6 flex items-center gap-2">
              <List className="w-5 h-5 text-blue-400" />
              نقاط المسار
            </h4>
            <div className="relative space-y-8">
              {/* Vertical Progress Line */}
              <div className="absolute right-6 top-6 bottom-6 w-0.5 bg-slate-700" />
              
              {stops.map((stop, idx) => (
                <div key={stop.id} className="relative pr-12">
                  <div className={`absolute right-4 top-1 w-4 h-4 rounded-full border-4 border-slate-800 z-10 transition-colors ${
                    stop.status === 'completed' ? 'bg-emerald-500' :
                    stop.status === 'current' ? 'bg-amber-500 ring-4 ring-amber-500/20 animate-pulse' :
                    'bg-slate-600'
                  }`} />
                  
                  <div className={`p-4 rounded-2xl border transition-all ${
                    stop.status === 'current' 
                      ? 'bg-amber-500/10 border-amber-500/30' 
                      : 'bg-slate-800/40 border-transparent'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-black uppercase ${
                        stop.status === 'completed' ? 'text-emerald-400' :
                        stop.status === 'current' ? 'text-amber-400' :
                        'text-slate-500'
                      }`}>
                        {stop.type === 'pickup' ? 'استلام' : 'تسليم'}
                      </span>
                      <span className="text-[10px] text-slate-500 tabular-nums">{stop.eta || '10:30 ص'}</span>
                    </div>
                    <div className={`text-sm font-bold ${stop.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                      {stop.location_name}
                    </div>
                    {stop.status === 'current' && (
                      <div className="mt-2 text-[10px] text-amber-500/80 font-medium">أنت الآن في هذه المحطة</div>
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

import { List, Truck } from 'lucide-react';
