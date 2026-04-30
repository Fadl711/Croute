import { motion } from 'motion/react';
import { FileText, Calendar, MapPin, DollarSign, Clock, Star, Zap, Navigation } from 'lucide-react';

interface HistoryTabProps {
  tripHistory: any[];
}

export function HistoryTab({ tripHistory }: HistoryTabProps) {
  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-20"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">سجل الرحلات</h2>
          <p className="text-slate-400 text-sm">مراجعة كاملة لكل المهام التي أنجزتها ومستحقاتها</p>
        </div>
      </div>

      <div className="grid gap-4">
        {tripHistory.map((trip) => (
          <div key={trip.id} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-800/80 transition-all group">
            <div className="flex items-center gap-6 flex-1">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex flex-col items-center justify-center border border-slate-700/50 shrink-0">
                <span className="text-[10px] text-slate-500 font-black uppercase mb-0.5">التقييم</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{trip.rating}</span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-black text-white">{trip.id}</h4>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-black uppercase">ناجحة</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{trip.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{trip.distance} كم</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>توقفات: {trip.stops}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-r border-slate-700/50 pt-4 md:pt-0 md:pr-8">
               <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-black uppercase mb-1">الأرباح الصافية</div>
                  <div className="text-2xl font-black text-white tabular-nums">
                    {trip.earnings.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500 mr-1 italic">ر.ي</span>
                  </div>
               </div>
               <button className="p-4 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-700 rounded-2xl border border-slate-700/50 transition-all active:scale-95">
                  <FileText className="w-6 h-6" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function StatsTab({ performance }: { performance: any }) {
  return (
    <motion.div
      key="stats"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8 pb-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي الرحلات', value: performance.totalTrips, icon: Navigation, color: 'text-blue-400' },
          { label: 'المسافة الكلية', value: `${performance.totalDistance} كم`, icon: MapPin, color: 'text-purple-400' },
          { label: 'التسليم في الموعد', value: `${performance.onTimeDelivery}%`, icon: Zap, color: 'text-amber-400' },
          { label: 'الترتيب العام', value: `#${performance.rank}`, icon: Award, color: 'text-emerald-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl shadow-xl">
            <div className="p-3 bg-slate-900 w-fit rounded-xl border border-slate-700/50 mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-black mb-1">{stat.value}</div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] p-10">
        <h3 className="text-2xl font-black mb-8 text-center">الإنتاجية الشهرية</h3>
        <div className="h-64 flex items-end justify-between gap-2 px-4">
          {[40, 65, 45, 90, 55, 80, 100, 75, 45, 60, 85, 50].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
              <div className="relative w-full">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  className="w-full bg-gradient-to-t from-blue-600 to-emerald-400 rounded-t-xl group-hover:from-blue-500 group-hover:to-emerald-300 transition-all shadow-lg"
                />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}%
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase">{['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

import { Award } from 'lucide-react';
