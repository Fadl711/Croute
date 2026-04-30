import { motion } from "motion/react";
import {
  TrendingUp,
  Users,
  Package,
  Wallet,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OverviewTabProps {
  stats: any;
  gmvTrend: any[];
}

export default function OverviewTab({ stats, gmvTrend }: OverviewTabProps) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Platform Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "إجمالي GMV المنصة",
            value: stats.gmv.toLocaleString(),
            unit: "ر.ي",
            icon: Globe,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "التسويات اليومية",
            value: stats.dailySettlements.toLocaleString(),
            unit: "ر.ي",
            icon: Wallet,
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "التوفير اللوجستي",
            value: stats.costSavings,
            unit: "٪",
            icon: Zap,
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "شحنات نشطة",
            value: stats.activeShipments,
            unit: "",
            icon: Package,
            color: "text-purple-600 bg-purple-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm group hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1 tabular-nums">
              {stat.value}{" "}
              <span className="text-xs font-normal text-slate-400">
                {stat.unit}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GMV Area Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                اتجاه التدفقات المالية (GMV)
              </h3>
              <p className="text-slate-500 text-xs">
                حجم التداول الأسبوعي عبر غرفة المقاصة
              </p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {["٧ أيام", "٣٠ يوم", "سنة"].map((t, i) => (
                <button
                  key={i}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${
                    i === 0
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmvTrend}>
                <defs>
                  <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ color: "#1E293B" }}
                />
                <Area
                  type="monotone"
                  dataKey="gmv"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorGmv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Terminal */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            التدفق اللحظي للبيانات
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {[
              {
                label: "إجمالي المعاملات",
                value: stats.totalTransactions,
                icon: Activity,
                color: "text-blue-600 bg-blue-50",
              },
              {
                label: "متوسط وقت التسوية",
                value: stats.avgSettlementTime,
                unit: "ساعة",
                icon: Clock,
                color: "text-amber-600 bg-amber-50",
              },
              {
                label: "رسوم المنصة اليوم",
                value: stats.platformFee.toLocaleString(),
                unit: "ر.ي",
                icon: DollarSign,
                color: "text-emerald-600 bg-emerald-50",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 border border-slate-100 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 tabular-nums">
                  {item.value}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    {(item as any).unit || ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 text-sm font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
            تصدير التقرير الكامل
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
