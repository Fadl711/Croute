import { motion } from 'motion/react';
import { TrendingUp, Users, Package, Wallet, Globe, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
          { label: 'إجمالي GMV المنصة', value: stats.gmv.toLocaleString(), unit: 'ر.ي', icon: Globe, color: 'text-blue-400', change: '+١٢٫٥٪', trend: 'up' },
          { label: 'التسويات اليومية', value: stats.dailySettlements.toLocaleString(), unit: 'ر.ي', icon: Wallet, color: 'text-emerald-400', change: '+٨٫٢٪', trend: 'up' },
          { label: 'التوفير اللوجستي', value: stats.costSavings, unit: '٪', icon: Zap, color: 'text-amber-400', change: '+٥٪', trend: 'up' },
          { label: 'مستخدمون نشطون', value: stats.activeUsers, unit: '', icon: Users, color: 'text-purple-400', change: '-٢٪', trend: 'down' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl group hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-black mb-1 tabular-nums">
              {stat.value} <span className="text-xs font-normal text-slate-500">{stat.unit}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GMV Area Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold mb-1">اتجاه التدفقات المالية (GMV)</h3>
              <p className="text-slate-500 text-xs italic">حجم التداول الأسبوعي عبر غرفة المقاصة</p>
            </div>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['٧ أيام', '٣٠ يوم', 'سنة'].map((t, i) => (
                <button key={i} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{t}</button>
              ))}
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmvTrend}>
                <defs>
                  <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Area type="monotone" dataKey="gmv" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorGmv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Terminal */}
        <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            التدفق اللحظي للبيانات
          </h3>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { label: 'إجمالي المعاملات', value: stats.totalTransactions, sub: '+١٤ معاملة/ساعة', icon: Activity },
              { label: 'متوسط وقت التسوية', value: stats.avgSettlementTime, unit: 'ساعة', sub: '-١٢٪ كفاءة', icon: Clock },
              { label: 'رسوم المنصة اليوم', value: stats.platformFee.toLocaleString(), unit: 'ر.ي', sub: '+٥٪ نمو', icon: DollarSign }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 bg-slate-950 rounded-lg"><item.icon className="w-4 h-4 text-slate-400" /></div>
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                   <div className="text-2xl font-black tabular-nums">{item.value} <span className="text-xs font-normal text-slate-500">{item.unit || ''}</span></div>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">{item.sub}</div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl text-blue-400 text-sm font-bold hover:bg-blue-600/20 transition-all flex items-center justify-center gap-2">
             تصدير التقرير الكامل
             <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

import { Activity, Clock, DollarSign } from 'lucide-react';
