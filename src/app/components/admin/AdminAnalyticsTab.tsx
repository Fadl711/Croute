import { motion } from 'motion/react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface AdminAnalyticsTabProps {
  transactionTypes: any[];
  settlementTimes: any[];
}

export default function AdminAnalyticsTab({ transactionTypes, settlementTimes }: AdminAnalyticsTabProps) {
  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-xl font-bold mb-8">توزيع أنواع المعاملات</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={transactionTypes}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {transactionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-xl font-bold mb-8">كفاءة وقت التسوية (Settlement SLA)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={settlementTimes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="range" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'متوسط قيمة المعاملة', value: '٤٥٬٠٠٠ ر.ي', color: 'text-blue-400' },
          { label: 'نسبة النجاح التقني', value: '٩٩٫٩٩٪', color: 'text-emerald-400' },
          { label: 'الوقت المستقطع للتسوية', value: '١٫٨ ساعة', color: 'text-amber-400' }
        ].map((item, i) => (
          <div key={i} className="bg-slate-950/50 border border-slate-800/50 p-6 rounded-3xl text-center">
             <div className="text-2xl font-black mb-1 tabular-nums {item.color}">{item.value}</div>
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
