import { useState } from 'react';
import {
  Navigation, DollarSign, BarChart3, FileText, ChevronLeft, Zap, X, QrCode, CheckCircle, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useDriverRoute } from '../../../hooks/useDriverRoute';

// Modular Components
import RouteTab from './RouteTab';
import EarningsTab from './EarningsTab';
import { HistoryTab, StatsTab } from './HistoryTab';

interface DriverDashboardProps {
  onBack: () => void;
}

export default function DriverDashboard({ onBack }: DriverDashboardProps) {
  const [activeTab, setActiveTab] = useState('route');
  const [scanning, setScanning] = useState(false);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data Hook
  const {
    driver, activeShipment, stops, currentStop: currentTask,
    loading, confirmDelivery,
    completedStops, totalStops, estimatedEarnings, actualEarnings
  } = useDriverRoute();

  const routeStats = {
    id: activeShipment?.shipment_number || 'RT-4821',
    efficiency: 92,
    totalStops: totalStops || 0,
    completed: completedStops || 0,
    estimatedEarnings: estimatedEarnings || 0,
    actualEarnings: actualEarnings || 0,
    distance: `${(stops.length * 12 + 5)} كم`, // Dynamic-ish distance
    fuelSaved: '30%',
    eta: `${Math.ceil((stops.length - completedStops) * 0.5)} ساعة`,
  };

  const tripHistory: any[] = [];

  const earnings = {
    today: actualEarnings || 0,
    week: 0,
    month: 0,
    available: (driver?.balance || 0),
    pending: driver?.pending_earnings || 0,
    totalFuelSaved: 0,
  };

  const performance = {
    totalTrips: driver?.total_trips || 0,
    totalDistance: driver?.total_distance || 0,
    avgRating: driver?.avg_rating || 0,
    onTimeDelivery: driver?.on_time_pct || 0,
    completionRate: 0,
    rank: driver?.rank || 0,
  };

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

  const tabs = [
    { id: 'route', label: 'المسار الحالي', icon: Navigation },
    { id: 'earnings', label: 'الأرباح', icon: DollarSign },
    { id: 'history', label: 'السجل', icon: FileText },
    { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all group">
              <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-slate-900 group-hover:-translate-x-1 transition-all" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-[#0B1B3B] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <Navigation className="w-6 h-6 text-white" />
               </div>
               <span className="text-xl font-black text-[#0B1B3B] tracking-tight">C-ROUTE <span className="text-amber-500">DRIVER</span></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100">
               <Zap className="w-4 h-4 text-amber-500" />
               <span className="text-xs font-bold">كفاءة المسار: {routeStats.efficiency}%</span>
            </div>
            <div className="flex items-center gap-3 pr-2 border-r border-slate-200">
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    {driver?.name || "جاري التحميل..."}
                  </div>
                  <div className="text-sm font-black text-emerald-600 tabular-nums">
                    {(actualEarnings || 0).toLocaleString()} ر.ي
                  </div>
                </div>
               <div className="w-10 h-10 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-8 h-8 rounded-lg" alt="Driver" />
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Hidden on mobile, shown on desktop */}
      <nav className="bg-white/50 backdrop-blur-md border-b border-slate-200 sticky top-20 z-30 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-6 py-5 transition-all relative font-bold text-sm ${
                    active ? 'text-[#0B1B3B]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <motion.div
                    animate={active ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                  {tab.label}
                  {active && (
                    <motion.div
                      layoutId="activeDriverTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#0B1B3B] rounded-t-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'route' && (
            <RouteTab 
              route={routeStats}
              currentTask={currentTask}
              stops={stops}
              scanning={scanning}
              setScanning={setScanning}
              setShowProofDialog={setShowProofDialog}
              onCompleteStop={completeStop}
              confirmingDelivery={confirmingDelivery}
            />
          )}

          {activeTab === 'earnings' && (
            <EarningsTab earnings={earnings} />
          )}

          {activeTab === 'history' && (
            <HistoryTab tripHistory={tripHistory} />
          )}

          {activeTab === 'stats' && (
            <StatsTab performance={performance} />
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-50 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 transition-all ${
                active ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-bold">{tab.label}</span>
              {active && <motion.div layoutId="mobileDriverTab" className="w-1 h-1 bg-blue-600 rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* Scanning Overlay & Dialogs - Update theme */}
      {scanning && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6" dir="rtl">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl relative overflow-hidden">
             <button onClick={() => setScanning(false)} className="absolute top-6 left-6 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <X className="w-6 h-6 text-slate-400" />
             </button>
             
             <div className="text-center mb-10">
                <h3 className="text-2xl font-black text-slate-900 mb-2">مسح الكود الضوئي</h3>
                <p className="text-slate-500 text-sm">وجه الكاميرا نحو باركود {currentTask?.type === 'pickup' ? 'المصنع' : 'المتجر'}</p>
             </div>

             <div className="relative aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-blue-200 flex items-center justify-center overflow-hidden mb-10">
                <div className="absolute inset-10 border-2 border-blue-500 rounded-2xl animate-pulse" />
                <QrCode className="w-32 h-32 text-blue-500/20" />
                <motion.div 
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-4 right-4 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                />
             </div>

             <button 
                onClick={completeStop}
                disabled={confirmingDelivery}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 text-white py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/10"
             >
                <CheckCircle className="w-6 h-6" />
                <span>{confirmingDelivery ? 'جاري التأكيد...' : 'تأكيد العملية يدوياً'}</span>
             </button>
          </div>
        </div>
      )}

      {/* Proof Dialog - Update theme */}
      <Dialog.Root open={showProofDialog} onOpenChange={setShowProofDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-slate-100 rounded-[2.5rem] p-10 z-[120] shadow-2xl" dir="rtl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-blue-500" />
              </div>
              <Dialog.Title className="text-2xl font-black text-slate-900 mb-2">توثيق العملية</Dialog.Title>
              <Dialog.Description className="text-slate-500 text-sm">
                يرجى التقاط صورة واضحة للبضاعة {currentTask?.type === 'pickup' ? 'عند الاستلام' : 'عند التسليم'} لضمان حقوقك المالية.
              </Dialog.Description>
            </div>

            <div className="aspect-video bg-slate-50 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center gap-4 mb-8 group cursor-pointer hover:border-blue-200 transition-all">
               <Camera className="w-12 h-12 text-slate-300 group-hover:text-blue-500 transition-colors" />
               <span className="text-xs font-bold text-slate-400">اضغط لفتح الكاميرا</span>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowProofDialog(false)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all">إلغاء</button>
              <button onClick={completeStop} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20">حفظ وإرسال</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
