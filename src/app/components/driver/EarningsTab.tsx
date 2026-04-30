import { motion } from 'motion/react';
import { DollarSign, Wallet, TrendingUp, TrendingDown, ArrowUpRight, Zap, Target, Award, Calendar, ExternalLink } from 'lucide-react';

interface EarningsTabProps {
  earnings: any;
}

export default function EarningsTab({ earnings }: EarningsTabProps) {
  return (
    <motion.div
      key="earnings"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8 pb-20"
    >
      {/* Wallet Hero */}
      <div className="bg-gradient-to-br from-[#1A73E8] to-[#0B1B3B] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-100">المحفظة الرقمية</span>
            </div>
            <div className="text-5xl font-black mb-4 tabular-nums">{earnings.available.toLocaleString()} <span className="text-xl font-normal text-white/50 italic">ر.ي</span></div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase font-black mb-1">في انتظار التسوية</span>
                <span className="text-lg font-bold tabular-nums text-amber-400">{earnings.pending.toLocaleString()} ر.ي</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase font-black mb-1">إجمالي توفير الوقود</span>
                <span className="text-lg font-bold tabular-nums text-emerald-400">{earnings.totalFuelSaved.toLocaleString()} ر.ي</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button className="bg-white text-[#0B1B3B] px-10 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
              <ExternalLink className="w-5 h-5" />
              سحب الأرباح
            </button>
            <p className="text-[10px] text-center text-white/40 font-medium">سحب فوري متاح • رسوم تحويل ٠٪</p>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'دخل اليوم', value: earnings.today, change: '+١٥٪', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'أرباح الأسبوع', value: earnings.week, change: '+٨٪', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'أرباح الشهر', value: earnings.month, change: '+٢٤٪', icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-[2rem] shadow-xl hover:bg-slate-800/80 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl shadow-inner`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs font-black">
                <ArrowUpRight className="w-4 h-4" />
                {stat.change}
              </div>
            </div>
            <div className="text-3xl font-black text-white tabular-nums mb-2">{stat.value.toLocaleString()} <span className="text-sm font-normal text-slate-500 italic">ر.ي</span></div>
            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-[2rem] p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-500" />
            برنامج المكافآت الذكي
          </h3>
          <div className="space-y-6">
            {[
              { label: 'نقاط التوصيل المجمّع', progress: 85, target: 100, reward: '١٥٬٠٠٠ ر.ي' },
              { label: 'تقييم العملاء (الأسبوعي)', progress: 96, target: 100, reward: '٥٬٠٠٠ ر.ي' },
              { label: 'كفاءة استهلاك الوقود', progress: 72, target: 100, reward: '١٠٬٠٠٠ ر.ي' }
            ].map((goal, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-300">{goal.label}</span>
                  <span className="text-emerald-400 font-black">مكافأة: {goal.reward}</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden p-0.5 border border-slate-600/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" 
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                  <span>المحرز: {goal.progress}%</span>
                  <span>الهدف: {goal.target}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border-4 border-blue-500/20 shadow-2xl">
            <Zap className="w-10 h-10 text-blue-400 animate-pulse" />
          </div>
          <h4 className="text-2xl font-black mb-3">التسوية الفورية</h4>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-8">
            بفضل تقنية العقود الذكية في C-Route، يتم إيداع عمولتك في المحفظة في اللحظة التي يتم فيها مسح كود التسليم.
          </p>
          <div className="flex items-center gap-8 py-4 px-8 bg-slate-900/50 rounded-2xl border border-slate-700/50">
             <div className="text-center">
                <div className="text-[10px] text-slate-500 uppercase font-black mb-1">متوسط الوقت</div>
                <div className="text-lg font-black">٠٫٥ ثانية</div>
             </div>
             <div className="w-px h-8 bg-slate-700" />
             <div className="text-center">
                <div className="text-[10px] text-slate-500 uppercase font-black mb-1">نسبة النجاح</div>
                <div className="text-lg font-black text-emerald-400">١٠٠٪</div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
