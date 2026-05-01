import { motion } from 'motion/react';
import { FileText, Calendar, MapPin, DollarSign, Clock, Star, Zap, Navigation, Award } from 'lucide-react';

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
      className="space-y-8 pb-24"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#0B1B3B] mb-1">سجل الرحلات</h2>
          <p className="text-slate-500 text-sm font-medium">مراجعة كاملة لكل المهام التي أنجزتها ومستحقاتها</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
           <Calendar className="w-4 h-4 text-blue-600" />
           <span className="text-xs font-bold text-slate-600">آخر ٣٠ يوم</span>
        </div>
      </div>

      <div className="grid gap-6">
        {tripHistory.map((trip) => (
          <div key={trip.id} className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg hover:border-blue-100 transition-all group relative overflow-hidden">
            <div className="flex items-center gap-6 flex-1">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 shrink-0 shadow-inner group-hover:bg-blue-50 transition-colors">
                <span className="text-[10px] text-slate-400 font-black uppercase mb-0.5">التقييم</span>
                <div className="flex items-center gap-1 text-amber-500 font-black">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{trip.rating}</span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-black text-[#0B1B3B]">{trip.id}</h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 font-black uppercase">مكتملة</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {[
                    { icon: Calendar, text: trip.date },
                    { icon: Navigation, text: `${trip.distance} كم` },
                    { icon: Clock, text: `توقفات: ${trip.stops}` }
                  ].map((info, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <info.icon className="w-3.5 h-3.5 text-blue-600" />
                      <span>{info.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-r border-slate-100 pt-6 md:pt-0 md:pr-8">
               <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-black uppercase mb-1">الأرباح الصافية</div>
                  <div className="text-2xl font-black text-emerald-600 tabular-nums">
                    {trip.earnings.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400 mr-1 italic">ر.ي</span>
                  </div>
               </div>
               <button className="p-4 bg-slate-50 text-slate-400 hover:text-[#0B1B3B] hover:bg-white hover:shadow-md rounded-2xl border border-slate-100 transition-all active:scale-95">
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
      className="space-y-10 pb-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي الرحلات', value: performance.totalTrips, icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'المسافة الكلية', value: `${performance.totalDistance} كم`, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'التسليم في الموعد', value: `${performance.onTimeDelivery}%`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'الترتيب العام', value: `#${performance.rank}`, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
            <div className={`p-4 ${stat.bg} w-fit rounded-2xl border border-slate-100 mb-6`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-black text-[#0B1B3B] mb-1">{stat.value}</div>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
        <div className="flex items-center justify-between mb-12">
           <h3 className="text-2xl font-black text-[#0B1B3B]">الإنتاجية الشهرية</h3>
           <div className="flex gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                 <div className="w-3 h-3 bg-blue-600 rounded-full" /> كفاءة
              </div>
           </div>
        </div>
        <div className="h-64 flex items-end justify-between gap-3 px-4">
          {[40, 65, 45, 90, 55, 80, 100, 75, 45, 60, 85, 50].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
              <div className="relative w-full">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  className="w-full bg-[#0B1B3B] rounded-t-2xl group-hover:bg-blue-600 transition-all shadow-lg"
                />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0B1B3B] text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                  {val}%
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                {['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

