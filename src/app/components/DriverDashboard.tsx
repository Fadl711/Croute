import { useState } from 'react';
import {
  Navigation, MapPin, Package, QrCode, CheckCircle, Clock, Phone,
  DollarSign, TrendingUp, Calendar, Star, Fuel, Award, BarChart3,
  Wallet, FileText, Camera, Map, ExternalLink, ChevronLeft, Hash,
  Truck, AlertCircle, User, MessageSquare, ChevronRight, Zap,
  Target, TrendingDown, ArrowUpRight, Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useDriverRoute } from '../../hooks/useDriverRoute';

interface DriverDashboardProps {
  onBack: () => void;
}

interface Stop {
  id: number;
  type: 'pickup' | 'dropoff';
  name: string;
  items: string;
  status: 'completed' | 'current' | 'pending';
  location: string;
  address: string;
  contact?: string;
  phone?: string;
  distance?: string;
  eta?: string;
  earnings?: number;
}

interface Trip {
  id: string;
  date: string;
  stops: number;
  distance: number;
  earnings: number;
  duration: string;
  fuelSaved: number;
  efficiency: number;
  rating: number;
}

export default function DriverDashboard({ onBack }: DriverDashboardProps) {
  const [activeTab, setActiveTab] = useState('route');
  const [scanning, setScanning] = useState(false);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);

  // ★ SUPABASE: Live route data with real-time updates
  const {
    driver, activeShipment, stops, currentStop: currentTask,
    loading, confirmDelivery,
    completedStops, totalStops, estimatedEarnings, actualEarnings
  } = useDriverRoute();

  // Keep mock data for tabs that aren't wired yet
  const route = {
    id: activeShipment?.shipment_number || 'RT-4821',
    efficiency: 92,
    totalStops: totalStops || 7,
    completed: completedStops || 3,
    estimatedEarnings: estimatedEarnings || 45000,
    actualEarnings: actualEarnings || 28000,
    distance: '45 كم',
    fuelSaved: '30%',
    eta: '2:30 ساعة',
  };

  // Trip History
  const tripHistory: Trip[] = [
    {
      id: 'RT-4820',
      date: '2026-04-27',
      stops: 6,
      distance: 52,
      earnings: 48000,
      duration: '3:15',
      fuelSaved: 32,
      efficiency: 95,
      rating: 4.8
    },
    {
      id: 'RT-4819',
      date: '2026-04-26',
      stops: 5,
      distance: 38,
      earnings: 42000,
      duration: '2:45',
      fuelSaved: 28,
      efficiency: 89,
      rating: 4.9
    },
    {
      id: 'RT-4818',
      date: '2026-04-25',
      stops: 7,
      distance: 61,
      earnings: 55000,
      duration: '3:50',
      fuelSaved: 35,
      efficiency: 93,
      rating: 4.7
    },
    {
      id: 'RT-4817',
      date: '2026-04-24',
      stops: 4,
      distance: 29,
      earnings: 35000,
      duration: '2:10',
      fuelSaved: 25,
      efficiency: 87,
      rating: 5.0
    },
  ];

  // Earnings Stats
  const earnings = {
    today: 28000,
    week: 245000,
    month: 980000,
    available: 450000,
    pending: 95000,
    totalFuelSaved: 85000,
  };

  // Performance Stats
  const performance = {
    totalTrips: 127,
    totalDistance: 5430,
    avgRating: 4.8,
    onTimeDelivery: 96,
    completionRate: 98,
    rank: 12,
  };

  const tabs = [
    { id: 'route', label: 'المسار الحالي', icon: Navigation },
    { id: 'earnings', label: 'الأرباح', icon: DollarSign },
    { id: 'history', label: 'السجل', icon: FileText },
    { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
  ];

  // ★ CONFIRM DELIVERY — triggers Supabase settlement cascade
  const completeStop = async () => {
    if (!currentTask) return;
    setConfirmingDelivery(true);
    const result = await confirmDelivery(currentTask.id);
    setConfirmingDelivery(false);
    if (result.success) {
      setScanning(false);
      setShowProofDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" dir="rtl">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>العودة</span>
              </button>
              <div className="w-px h-6 bg-slate-600" />
              <h1 className="text-xl">لوحة السائق</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2 border border-green-500/30">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">كفاءة: {route.efficiency}%</span>
              </div>
              <div className="bg-amber-500/20 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2 border border-amber-500/30">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400">{earnings.today.toLocaleString()} ر.ي</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-[73px] z-30">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 transition-all relative ${
                    activeTab === tab.id
                      ? 'text-amber-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="driverActiveTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'route' && (
            <motion.div
              key="route"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Section */}
                <div className="lg:col-span-2">
                  {/* Map */}
                  <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl overflow-hidden mb-6 relative h-[400px]">
                    <div className="absolute inset-0">
                      <svg className="absolute inset-0 w-full h-full">
                        {/* Route Path */}
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
                      {[
                        { top: '87%', right: '10%', status: 'completed', color: 'green' },
                        { top: '63%', right: '25%', status: 'current', color: 'amber' },
                        { top: '45%', right: '40%', status: 'pending', color: 'blue' },
                        { top: '30%', right: '60%', status: 'pending', color: 'blue' },
                      ].map((marker, idx) => (
                        <motion.div
                          key={idx}
                          className="absolute"
                          style={{ top: marker.top, right: marker.right }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.2 }}
                        >
                          <div className={`w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
                            marker.status === 'completed' ? 'bg-green-500' :
                            marker.status === 'current' ? 'bg-amber-500 animate-pulse' :
                            'bg-blue-500'
                          }`}>
                            {marker.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <Package className="w-5 h-5 text-white" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Current Location */}
                    <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-xs text-slate-400">موقعك الحالي</p>
                          <p className="text-sm">صنعاء - طريق الزراعة</p>
                        </div>
                      </div>
                    </div>

                    {/* Route Stats */}
                    <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
                      <div className="bg-slate-900/80 backdrop-blur rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Navigation className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-slate-400">المسافة</span>
                        </div>
                        <div className="text-lg text-white">{route.distance}</div>
                      </div>
                      <div className="bg-slate-900/80 backdrop-blur rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span className="text-xs text-slate-400">الوقت المتبقي</span>
                        </div>
                        <div className="text-lg text-white">{route.eta}</div>
                      </div>
                      <div className="bg-slate-900/80 backdrop-blur rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Fuel className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-slate-400">توفير</span>
                        </div>
                        <div className="text-lg text-green-400">{route.fuelSaved}</div>
                      </div>
                    </div>
                  </div>

                  {/* Current Task */}
                  {currentTask && (
                    <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/20 border border-amber-500/30 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl mb-1">المهمة الحالية</h3>
                          <p className="text-slate-400 text-sm">
                            {currentTask.type === 'pickup' ? 'استلام من المصنع' : 'تسليم للمتجر'}
                          </p>
                        </div>
                        <div className="bg-amber-500 px-4 py-2 rounded-lg text-slate-900 font-bold">
                          #{currentTask.stop_order} من {route.totalStops}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-800/50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-400">الموقع</span>
                          </div>
                          <div className="text-lg mb-1">{currentTask.location_name}</div>
                          <div className="text-sm text-slate-400">{currentTask.city}</div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-400">جهة الاتصال</span>
                          </div>
                          <div className="text-lg mb-1">{currentTask.contact_name}</div>
                          <div className="text-sm text-slate-400">{currentTask.contact_phone}</div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Box className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-400">العناصر</span>
                          </div>
                          <div className="text-lg">{currentTask.items_description}</div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-slate-400">الأرباح</span>
                          </div>
                          <div className="text-lg text-green-400">{currentTask.earnings?.toLocaleString()} ر.ي</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setScanning(!scanning)}
                          className="col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <QrCode className="w-5 h-5" />
                          <span>مسح الباركود</span>
                        </button>

                        <a
                          href={`tel:${currentTask.contact_phone}`}
                          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">اتصال</span>
                        </a>

                        <a
                          href={`https://maps.google.com/?q=${currentTask.city}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Map className="w-4 h-4" />
                          <span className="text-sm">خرائط</span>
                        </a>

                        <button
                          onClick={() => setShowProofDialog(true)}
                          className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          <span className="text-sm">صورة</span>
                        </button>
                      </div>

                      {scanning && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 bg-slate-900/50 rounded-xl p-6 flex flex-col items-center"
                        >
                          <div className="w-48 h-48 border-4 border-blue-500 rounded-xl mb-4 relative overflow-hidden">
                            <motion.div
                              className="absolute inset-x-0 h-1 bg-blue-500"
                              animate={{ y: [0, 192, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                          </div>
                          <p className="text-slate-400 mb-4">جاري مسح الكود...</p>
                          <button
                            onClick={completeStop}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                          >
                            تأكيد الاستلام
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {/* Stops List */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-amber-400" />
                    المسار ({route.totalStops} نقاط)
                  </h3>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {stops.map((stop, idx) => (
                      <motion.div
                        key={stop.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`rounded-xl p-4 cursor-pointer transition-all ${
                          stop.status === 'completed'
                            ? 'bg-green-500/20 border border-green-500/30'
                            : stop.status === 'current'
                            ? 'bg-amber-500/20 border border-amber-500/30'
                            : 'bg-slate-700/50 border border-slate-600/50 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            stop.status === 'completed' ? 'bg-green-500' :
                            stop.status === 'current' ? 'bg-amber-500' :
                            'bg-slate-600'
                          }`}>
                            {stop.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span>{stop.stop_order}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <div className="text-sm font-medium mb-0.5">{stop.location_name}</div>
                                <div className="text-xs text-slate-400">{stop.city}</div>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                stop.type === 'pickup'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {stop.type === 'pickup' ? 'استلام' : 'تسليم'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mb-2">{stop.items_description}</div>
                            {stop.earnings > 0 && (
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-slate-400">{stop.distance}</span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-400">{stop.eta}</span>
                                {stop.earnings > 0 && (
                                  <>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-green-400">{stop.earnings.toLocaleString()} ر.ي</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'earnings' && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Earnings Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-600 to-green-600 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-green-200">أرباح اليوم</h3>
                    <DollarSign className="w-8 h-8 text-green-200" />
                  </div>
                  <div className="text-4xl mb-2">{earnings.today.toLocaleString()}</div>
                  <div className="text-sm text-green-200">ريال يمني</div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-sky-600 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-blue-200">أرباح الأسبوع</h3>
                    <TrendingUp className="w-8 h-8 text-blue-200" />
                  </div>
                  <div className="text-4xl mb-2">{earnings.week.toLocaleString()}</div>
                  <div className="text-sm text-blue-200 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    +15% من الأسبوع الماضي
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-600 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-blue-200">أرباح الشهر</h3>
                    <Calendar className="w-8 h-8 text-blue-200" />
                  </div>
                  <div className="text-4xl mb-2">{(earnings.month / 1000).toFixed(0)}k</div>
                  <div className="text-sm text-blue-200">ريال يمني</div>
                </div>
              </div>

              {/* Wallet & Savings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl mb-6 flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-amber-400" />
                    المحفظة
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">الرصيد المتاح</div>
                        <div className="text-2xl text-green-400">{earnings.available.toLocaleString()} ر.ي</div>
                      </div>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors">
                        سحب
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">قيد المعالجة</div>
                        <div className="text-2xl text-amber-400">{earnings.pending.toLocaleString()} ر.ي</div>
                      </div>
                      <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl mb-6 flex items-center gap-2">
                    <Fuel className="w-6 h-6 text-green-400" />
                    التوفير من الوقود
                  </h3>

                  <div className="bg-gradient-to-br from-green-500/20 to-green-500/20 border border-green-500/30 rounded-xl p-6 mb-4">
                    <div className="text-sm text-slate-400 mb-2">إجمالي التوفير</div>
                    <div className="text-4xl text-green-400 mb-2">{earnings.totalFuelSaved.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">ريال يمني</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1">المسارات التعاونية</div>
                      <div className="text-2xl text-green-400">30%</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1">متوسط التوفير</div>
                      <div className="text-2xl text-green-400">2,800 ر.ي</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  سجل الرحلات
                </h2>
              </div>

              <div className="divide-y divide-slate-700">
                {tripHistory.map((trip, idx) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Truck className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-lg mb-1">{trip.id}</div>
                          <div className="text-sm text-slate-400">{trip.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl text-green-400 mb-1">
                          {trip.earnings.toLocaleString()} ر.ي
                        </div>
                        <div className="flex items-center gap-1 text-sm text-amber-400">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{trip.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-slate-400 mb-1">النقاط</div>
                        <div className="text-lg">{trip.stops}</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-slate-400 mb-1">المسافة</div>
                        <div className="text-lg">{trip.distance} كم</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-slate-400 mb-1">المدة</div>
                        <div className="text-lg">{trip.duration}</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-slate-400 mb-1">التوفير</div>
                        <div className="text-lg text-green-400">{trip.fuelSaved}%</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-slate-400 mb-1">الكفاءة</div>
                        <div className="text-lg text-blue-400">{trip.efficiency}%</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-sky-600 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-blue-200">إجمالي الرحلات</h3>
                    <Truck className="w-8 h-8 text-blue-200" />
                  </div>
                  <div className="text-4xl mb-2">{performance.totalTrips}</div>
                  <div className="text-sm text-blue-200">رحلة مكتملة</div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-600 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-blue-200">المسافة الكلية</h3>
                    <Navigation className="w-8 h-8 text-blue-200" />
                  </div>
                  <div className="text-4xl mb-2">{performance.totalDistance.toLocaleString()}</div>
                  <div className="text-sm text-blue-200">كيلومتر</div>
                </div>

                <div className="bg-gradient-to-br from-amber-600 to-amber-600 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-amber-200">متوسط التقييم</h3>
                    <Star className="w-8 h-8 text-amber-200" />
                  </div>
                  <div className="text-4xl mb-2">{performance.avgRating}</div>
                  <div className="text-sm text-amber-200">من 5.0</div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-green-400" />
                    مؤشرات الأداء
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">التوصيل في الوقت</span>
                        <span className="text-green-400">{performance.onTimeDelivery}%</span>
                      </div>
                      <div className="bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${performance.onTimeDelivery}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">معدل الإكمال</span>
                        <span className="text-blue-400">{performance.completionRate}%</span>
                      </div>
                      <div className="bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${performance.completionRate}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">رضا العملاء</span>
                        <span className="text-amber-400">{(performance.avgRating / 5 * 100).toFixed(0)}%</span>
                      </div>
                      <div className="bg-slate-700 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(performance.avgRating / 5 * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    الترتيب والإنجازات
                  </h3>

                  <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/20 border border-amber-500/30 rounded-xl p-6 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">ترتيبك</div>
                        <div className="text-4xl text-amber-400">#{performance.rank}</div>
                        <div className="text-sm text-slate-400">من 250 سائق</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-1">🏆</div>
                      <div className="text-xs text-slate-400">سائق الشهر</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-1">⭐</div>
                      <div className="text-xs text-slate-400">5 نجوم</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Proof of Delivery Dialog */}
      <Dialog.Root open={showProofDialog} onOpenChange={setShowProofDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md z-50" dir="rtl">
            <div className="p-6">
              <Dialog.Title className="text-xl text-white mb-4">إثبات التسليم</Dialog.Title>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
                  <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">اضغط لالتقاط صورة</p>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">ملاحظات</label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white resize-none focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="أضف أي ملاحظات..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Dialog.Close className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">
                  إلغاء
                </Dialog.Close>
                <button
                  onClick={completeStop}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
                >
                  تأكيد التسليم
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
