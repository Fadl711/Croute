import { motion } from 'motion/react';
import {
  Sparkles, Download, DollarSign, Truck, Clock, Target, Layers, Crown, MapPin,
  ArrowUpRight, ArrowDownRight, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, PieChart, Pie,
  Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import SupplyChainIntel from './SupplyChainIntel';
import { revenueSeries, productMix, topProducts, geoData, activityFeed, alerts } from './constants';

function KpiCard({
  label, value, unit, delta, icon: Icon, accent, positiveIsDown, className
}: {
  label: string; value: string; unit?: string; delta: number;
  icon: any; accent: 'primary' | 'success' | 'amber' | 'violet';
  positiveIsDown?: boolean; className?: string;
}) {
  const tone: Record<string, string> = {
    primary: 'from-[#1A73E8] to-[#0B1B3B]',
    success: 'from-green-600 to-green-800',
    amber: 'from-amber-500 to-amber-700',
    violet: 'from-blue-700 to-[#0B1B3B]',
  };
  const isPositive = positiveIsDown ? delta < 0 : delta > 0;
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden ${className || ''}`}>
      <div className={`absolute -top-12 -left-12 w-32 h-32 rounded-full bg-gradient-to-br ${tone[accent]} opacity-[0.07] blur-2xl`} />
      <div className="relative flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tone[accent]} flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
        </div>
        <span className={`inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-md ${
          isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
        }`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(delta).toFixed(1)}٪
        </span>
      </div>
      <div className="relative">
        <div className="text-[11px] tracking-wider text-slate-500 mb-1">{label}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl text-[#0B1B3B] tabular-nums">{value}</span>
          {unit && <span className="text-[11px] text-slate-500">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

function Legend2({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-500">
      <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
      {label}
    </span>
  );
}

interface AnalyticsTabProps {
  kpis: {
    netRevenue: number;
    deliveredShipments: number;
    fulfillmentRate: number;
  };
}

export default function AnalyticsTab({ kpis }: AnalyticsTabProps) {
  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header bar */}
      <div className="bg-gradient-to-l from-[#0B1B3B] to-[#1A73E8] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#1A73E8]/30 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-[11px] tracking-[0.25em] text-white/80">FACTORY INTELLIGENCE</span>
            </div>
            <h2 className="text-2xl mb-1">لوحة التحليلات التنفيذية</h2>
            <p className="text-sm text-white/70">رؤية شاملة لأداء المصنع — الإيرادات، الإنتاجية، والتوزيع الجغرافي</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur rounded-xl border border-white/15">
              {['اليوم', 'الأسبوع', 'الشهر', 'الربع', 'السنة'].map((p, i) => (
                <button
                  key={p}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    i === 2 ? 'bg-white text-[#0B1B3B]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="px-3 py-2 bg-white/10 backdrop-blur border border-white/15 rounded-xl text-xs text-white hover:bg-white/15 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              تصدير التقرير
            </button>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-12 gap-4">
        <KpiCard
          label="صافي الإيرادات"
          value={(kpis.netRevenue / 1000000).toFixed(1) + 'M'}
          unit="ر.ي"
          delta={12.4}
          icon={DollarSign}
          accent="primary"
          className="col-span-12 md:col-span-6 lg:col-span-3"
        />
        <KpiCard
          label="الشحنات المسلّمة"
          value={kpis.deliveredShipments.toString()}
          delta={8.2}
          icon={Truck}
          accent="success"
          className="col-span-12 md:col-span-6 lg:col-span-3"
        />
        <KpiCard
          label="متوسط زمن التسوية"
          value="١:٤٧"
          unit="ساعة"
          delta={-23.0}
          positiveIsDown
          icon={Clock}
          accent="amber"
          className="col-span-12 md:col-span-6 lg:col-span-3"
        />
        <KpiCard
          label="معدّل الوفاء"
          value={kpis.fulfillmentRate.toFixed(1) + '٪'}
          delta={1.6}
          icon={Target}
          accent="violet"
          className="col-span-12 md:col-span-6 lg:col-span-3"
        />
      </div>

      {/* Supply Chain & Market Intelligence */}
      <SupplyChainIntel />

      {/* Revenue trend + Mix */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">REVENUE FLOW</div>
              <h3 className="text-[#0B1B3B]">تدفّق الإيرادات والتسويات</h3>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <Legend2 dot="#1A73E8" label="إيرادات" />
              <Legend2 dot="#15803D" label="تسويات" />
              <Legend2 dot="#B45309" label="مرتجعات" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A73E8" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1A73E8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="setG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#15803D" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#15803D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F2" vertical={false} />
              <XAxis dataKey="m" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#0B1B3B',
                  border: 'none',
                  borderRadius: 12,
                  color: 'white',
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="rev" stroke="#1A73E8" strokeWidth={2.5} fill="url(#revG)" />
              <Area type="monotone" dataKey="set" stroke="#15803D" strokeWidth={2} fill="url(#setG)" />
              <Area type="monotone" dataKey="ret" stroke="#B45309" strokeWidth={1.5} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">PRODUCT MIX</div>
              <h3 className="text-[#0B1B3B]">مزيج المنتجات</h3>
            </div>
            <Layers className="w-4 h-4 text-slate-300" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={productMix}
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                paddingAngle={3}
              >
                {productMix.map((d) => (
                  <Cell key={`mix-${d.name}`} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#0B1B3B', border: 'none', borderRadius: 12,
                  color: 'white', fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {productMix.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="text-[#0B1B3B]">{d.value}٪</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products + Geo + Settlement */}
      <div className="grid grid-cols-12 gap-4">
        {/* Top products */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">TOP PERFORMERS</div>
              <h3 className="text-[#0B1B3B]">أعلى المنتجات أداءً</h3>
            </div>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                  i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-[#1A73E8]'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#0B1B3B] truncate">{p.name}</span>
                    <span className="text-xs text-slate-500">{p.units} وحدة</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-[#1A73E8] to-[#0B1B3B]"
                      style={{ width: `${p.share}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#0B1B3B] tabular-nums">{(p.revenue / 1000000).toFixed(1)}M</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geo distribution */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">GEO COVERAGE</div>
              <h3 className="text-[#0B1B3B]">التوزيع الجغرافي</h3>
            </div>
            <MapPin className="w-4 h-4 text-slate-300" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={geoData} layout="vertical" margin={{ left: 0, right: 12 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="city"
                type="category"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  background: '#0B1B3B', border: 'none', borderRadius: 12,
                  color: 'white', fontSize: 12,
                }}
                cursor={{ fill: '#F1F5F9' }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
                {geoData.map((g, i) => (
                  <Cell key={`geo-${g.city}`} fill={i === 0 ? '#0B1B3B' : '#1A73E8'} fillOpacity={1 - i * 0.18} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Settlement health */}
        <div className="col-span-12 lg:col-span-3 bg-[#0B1B3B] text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-[#1A73E8]/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="text-[10px] tracking-[0.25em] text-white/60 mb-1">SETTLEMENT HEALTH</div>
            <h3 className="text-white mb-4">صحة التسويات</h3>
            <ResponsiveContainer width="100%" height={140}>
              <RadialBarChart
                innerRadius="68%"
                outerRadius="100%"
                data={[{ name: 'on-time', value: 96, fill: '#1A73E8' }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar background={{ fill: '#1E2A4A' }} dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="-mt-24 mb-6 flex flex-col items-center">
              <div className="text-3xl tabular-nums">٩٦٪</div>
              <div className="text-[11px] text-white/60">في الموعد</div>
            </div>
            <div className="space-y-2 mt-8">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">أقل من ٢ﺳ</span>
                <span className="text-white">٨٢٪</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">٢–٦ ساعات</span>
                <span className="text-white">١٤٪</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">أكثر من ٦ﺳ</span>
                <span className="text-amber-300">٤٪</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity feed + Alerts */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">LIVE ACTIVITY</div>
              <h3 className="text-[#0B1B3B]">النشاط اللحظي</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] text-green-700">مباشر</span>
            </span>
          </div>
          <div className="space-y-3">
            {activityFeed.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.tone}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#0B1B3B]">{a.title}</div>
                    <div className="text-[11px] text-slate-500">{a.sub}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 tabular-nums">{a.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-1">RISK & ALERTS</div>
              <h3 className="text-[#0B1B3B]">التنبيهات الذكية</h3>
            </div>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-2.5">
            {alerts.map((al, i) => (
              <div key={i} className={`p-3 rounded-xl border flex items-start gap-3 ${al.cls}`}>
                <al.icon className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm">{al.title}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{al.sub}</div>
                </div>
                <button className="text-[11px] underline opacity-80 hover:opacity-100">معالجة</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
