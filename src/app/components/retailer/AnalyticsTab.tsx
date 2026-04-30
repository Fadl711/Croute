import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Clock, Calendar, BarChart3, ArrowUpRight, DollarSign, Award, Target, Zap } from 'lucide-react';
import type { Order, CreditHistoryEntry } from '../../../lib/supabase';

interface AnalyticsTabProps {
  retailer: any;
  creditAvailable: number;
  utilizationPct: number;
  scoreBreakdown: any;
  riskLevel: string;
  riskColor: string;
  orders: Order[];
  creditHistory: CreditHistoryEntry[];
}

export default function AnalyticsTab(props: AnalyticsTabProps) {
  const { retailer, creditAvailable, utilizationPct, scoreBreakdown, riskLevel, riskColor, orders, creditHistory } = props;

  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-[#1A73E8] rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +١٢٪
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{creditAvailable.toLocaleString()}</div>
          <div className="text-xs text-slate-400 font-medium">الائتمان المتاح حالياً</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className={`text-[10px] font-bold ${riskColor} bg-opacity-10 px-2 py-1 rounded-lg`}>
              {riskLevel}
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{retailer?.credit_score || 0}</div>
          <div className="text-xs text-slate-400 font-medium">مؤشر الجدارة الائتمانية</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{orders.length}</div>
          <div className="text-xs text-slate-400 font-medium">إجمالي الطلبات الناجحة</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">٩٨٪</div>
          <div className="text-xs text-slate-400 font-medium">نسبة الالتزام بالسداد</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Credit Score Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0B1B3B] text-white p-8 rounded-[2rem] relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-1">تفاصيل النطاق الائتماني</h3>
                  <p className="text-white/50 text-xs">تحليل دقيق بناءً على سلوكك الشرائي والسداد الفعلي</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black">{utilizationPct}%</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest">نسبة الاستخدام</div>
                </div>
              </div>
              
              <div className="space-y-6">
                {Object.entries(scoreBreakdown).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/70">
                        {key === 'paymentTimeliness' ? 'الالتزام بالمواعيد' : 
                         key === 'utilizationHealth' ? 'صحة الاستخدام' : 
                         key === 'orderFrequency' ? 'تكرار الطلبات' : 
                         key === 'accountAge' ? 'عمر الحساب' : 
                         'التقييم العام'}
                      </span>
                      <span className="font-bold">{value}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        className="h-full bg-[#1A73E8]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#1A73E8]/20 rounded-full blur-[100px]" />
          </div>

          {/* Transactions List */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1A73E8]" />
              سجل العمليات الائتمانية
            </h3>
            <div className="space-y-4">
              {creditHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${entry.type === 'purchase' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {entry.type === 'purchase' ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{entry.description}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{new Date(entry.created_at).toLocaleDateString('ar-YE')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-black ${entry.type === 'purchase' ? 'text-red-600' : 'text-emerald-600'}`}>
                      {entry.type === 'purchase' ? '-' : '+'}{entry.amount.toLocaleString()} ر.ي
                    </div>
                    <div className="text-[10px] text-slate-400 tabular-nums">الرصيد: {entry.balance_after.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#1A73E8] to-[#0B1B3B] p-6 rounded-3xl text-white shadow-xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              نصائح لرفع التقييم
            </h4>
            <div className="space-y-4">
              {[
                'التزم بالسداد قبل ٥ أيام من الموعد',
                'قم بزيادة عدد الطلبات الأسبوعية',
                'حافظ على نسبة استخدام أقل من ٧٠٪'
              ].map((tip, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">{i+1}</div>
                  <p className="text-white/80 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">موعد السداد القادم</h4>
            <div className="space-y-4">
              {retailer?.next_payment_date ? (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-800">قسط التمويل الجاري</div>
                    <div className="text-[10px] text-slate-400">{new Date(retailer.next_payment_date).toLocaleDateString('ar-YE')}</div>
                  </div>
                  <div className="text-xs font-bold text-red-500">{(retailer.next_payment_amount || 0).toLocaleString()} ر.ي</div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">لا توجد دفعات مستحقة حالياً</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
