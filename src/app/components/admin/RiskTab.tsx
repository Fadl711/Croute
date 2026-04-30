import { motion } from 'motion/react';
import { AlertTriangle, ShieldCheck, TrendingDown, Target, Info } from 'lucide-react';

interface RiskTabProps {
  riskMap: any[];
}

export default function RiskTab({ riskMap }: RiskTabProps) {
  return (
    <motion.div
      key="risk"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              مؤشرات مخاطر السيولة والائتمان
            </h3>
            <div className="grid gap-4">
              {riskMap.map((item, i) => (
                <div key={i} className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl hover:border-blue-500/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex flex-col items-center justify-center border border-slate-700/50">
                       <span className="text-[10px] text-slate-500 font-black uppercase mb-1">Score</span>
                       <div className="text-xl font-black text-white">{item.score}</div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">{item.retailer}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${
                          item.risk === 'عالي' ? 'bg-red-500/10 text-red-400' :
                          item.risk === 'متوسط' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                          خطر {item.risk}
                        </span>
                        <span className="text-xs text-slate-500 italic">الحد الائتماني: {item.credit.toLocaleString()} ر.ي</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-64 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 font-bold mb-1">
                      <span>الاستهلاك الائتماني</span>
                      <span>{Math.round((item.used / item.credit) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.used / item.credit) * 100}%` }}
                        className={`h-full ${item.risk === 'عالي' ? 'bg-red-500' : item.risk === 'متوسط' ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                       />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-red-500/20 to-slate-900 border border-red-500/30 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-6 animate-pulse" />
            <h4 className="text-xl font-black mb-4">تنبيهات حرجة</h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-red-500/20 flex gap-4">
                <TrendingDown className="w-10 h-10 text-red-400 shrink-0" />
                <div>
                   <div className="text-sm font-bold text-red-100 mb-1">انخفاض مفاجئ في Score</div>
                   <div className="text-xs text-red-400/70 leading-relaxed">متجر "الوفاء" تأخر عن سداد آخر دفعتين بنسبة تزيد عن ١٥ يوم.</div>
                </div>
              </div>
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-amber-500/20 flex gap-4">
                <Target className="w-10 h-10 text-amber-400 shrink-0" />
                <div>
                   <div className="text-sm font-bold text-amber-100 mb-1">تجاوز الحد الائتماني</div>
                   <div className="text-xs text-amber-400/70 leading-relaxed">بقالة "السلام" وصلت لنسبة ٨٧٪ من الحد المسموح.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              كيف يعمل النظام؟
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              يستخدم C-Route خوارزميات تعلم آلي لتحليل أكثر من ٥٠ مؤشر لكل تاجر، مما يضمن استدامة السيولة في غرفة المقاصة وحماية حقوق المصانع.
            </p>
            <div className="space-y-3">
               {['تحليل تاريخ السداد', 'تتبع حركة المبيعات', 'الانتظام في الطلب'].map((text, i) => (
                 <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {text}
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
