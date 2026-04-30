import { motion } from "motion/react";
import {
  DollarSign,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Zap,
  Target,
  Award,
  Calendar,
  ExternalLink,
} from "lucide-react";

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
      className="space-y-8 pb-24"
    >
      {/* Wallet Hero - Keep it vibrant but clean */}
      <div className="bg-[#0B1B3B] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-6 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/10">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">
                المحفظة الرقمية
              </span>
            </div>
            <div className="text-5xl font-black mb-4 tabular-nums">
              {earnings.available.toLocaleString()}
              <span className="text-xl font-normal text-slate-500 italic mr-2">
                ر.ي
              </span>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-black mb-1">
                  في انتظار التسوية
                </span>
                <span className="text-lg font-bold tabular-nums text-amber-500">
                  {earnings.pending.toLocaleString()} ر.ي
                </span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-black mb-1">
                  إجمالي توفير الوقود
                </span>
                <span className="text-lg font-bold tabular-nums text-emerald-500">
                  {earnings.totalFuelSaved.toLocaleString()} ر.ي
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button className="bg-[#1A73E8] text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2">
              <ExternalLink className="w-5 h-5" />
              سحب الأرباح
            </button>
            <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-wider">
              سحب فوري متاح • رسوم تحويل ٠٪
            </p>
          </div>
        </div>

        {/* Subtle Background Patterns */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Stats Cards - Light Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "دخل اليوم",
            value: earnings.today,
            change: "+١٥٪",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
          },
          {
            label: "أرباح الأسبوع",
            value: earnings.week,
            change: "+٨٪",
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
          },
          {
            label: "أرباح الشهر",
            value: earnings.month,
            change: "+٢٤٪",
            icon: Target,
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-100",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className={`p-4 ${stat.bg} ${stat.color} rounded-2xl border ${stat.border}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 ${stat.bg} ${stat.color} rounded-xl text-[10px] font-black`}
              >
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 tabular-nums mb-1">
              {stat.value.toLocaleString()}{" "}
              <span className="text-sm font-normal text-slate-400 italic">
                ر.ي
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-xl font-black text-[#0B1B3B] mb-8 flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-500" />
            برنامج المكافآت الذكي
          </h3>
          <div className="space-y-8">
            {[
              {
                label: "نقاط التوصيل المجمّع",
                progress: 85,
                target: 100,
                reward: "١٥٬٠٠٠ ر.ي",
                color: "from-blue-500 to-blue-400",
              },
              {
                label: "تقييم العملاء (الأسبوعي)",
                progress: 96,
                target: 100,
                reward: "٥٬٠٠٠ ر.ي",
                color: "from-emerald-500 to-emerald-400",
              },
              {
                label: "كفاءة استهلاك الوقود",
                progress: 72,
                target: 100,
                reward: "١٠٬٠٠٠ ر.ي",
                color: "from-amber-500 to-amber-400",
              },
            ].map((goal, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-700">{goal.label}</span>
                  <span className="text-emerald-600 font-black">
                    مكافأة: {goal.reward}
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    className={`h-full bg-gradient-to-r ${goal.color} rounded-full`}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>المحرز: {goal.progress}%</span>
                  <span>الهدف: {goal.target}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center shadow-sm">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-4 border-blue-100 shadow-xl shadow-blue-900/5">
            <Zap className="w-10 h-10 text-blue-600 animate-pulse" />
          </div>
          <h4 className="text-2xl font-black text-[#0B1B3B] mb-3">
            التسوية الفورية
          </h4>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-8">
            بفضل تقنية العقود الذكية في C-Route، يتم إيداع عمولتك في المحفظة في
            اللحظة التي يتم فيها مسح كود التسليم.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
