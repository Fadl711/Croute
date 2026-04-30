import { motion } from 'motion/react';
import {
  Sparkles, Download, ArrowUpRight, ArrowDownRight, FileText, Plus, Clock,
  Zap, TrendingUp, Layers, Activity, Wallet, Crown, Award
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface WalletTabProps {
  factory: any;
  walletTransactions: any[];
  onCashout: () => void;
}

function WalletHealthRow({ label, value, pct, tone = 'blue' }: {
  label: string; value: string; pct: number; tone?: 'blue' | 'emerald' | 'amber';
}) {
  const colors: Record<string, string> = {
    blue: 'from-[#1A73E8] to-[#7CC2FF]',
    emerald: 'from-emerald-400 to-emerald-200',
    amber: 'from-amber-400 to-amber-200',
  };
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] mb-1.5">
        <span className="text-white/70">{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-l ${colors[tone]}`} style={{ width: `${pct}%` }} />
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

export default function WalletTab({ factory, walletTransactions, onCashout }: WalletTabProps) {
  return (
    <motion.div
      key="wallet"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Hero Balance Card — ★ LIVE from Supabase */}
      <div className="relative bg-gradient-to-l from-[#0B1B3B] via-[#13265A] to-[#1A73E8] rounded-3xl p-8 text-white overflow-hidden">
        <div className="absolute -top-32 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#1A73E8]/40 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[11px] tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              محفظة المصنع · حساب تسوية مباشر
            </div>
            <div className="text-[12px] text-white/70 mb-2 tracking-wider">الرصيد المتاح</div>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-5xl tabular-nums tracking-tight">{factory ? factory.balance.toLocaleString('ar-YE') : '---'}</span>
              <span className="text-base text-white/70">ر.ي</span>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-white/70">
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <ArrowUpRight className="w-3.5 h-3.5" /> +١٢.٤٪ هذا الأسبوع
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>آخر تحديث قبل دقيقتين</span>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-6">
              <button
                onClick={onCashout}
                className="inline-flex items-center gap-2 bg-white text-[#0B1B3B] px-4 py-2.5 rounded-xl hover:bg-white/90 transition shadow-lg shadow-black/20"
              >
                <Download className="w-4 h-4" /> سحب فوري
              </button>
              <button className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 px-4 py-2.5 rounded-xl hover:bg-white/25 transition">
                <ArrowUpRight className="w-4 h-4" /> تحويل بنكي
              </button>
              <button className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 px-4 py-2.5 rounded-xl hover:bg-white/25 transition">
                <FileText className="w-4 h-4" /> كشف الحساب
              </button>
              <button className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 px-4 py-2.5 rounded-xl hover:bg-white/25 transition">
                <Plus className="w-4 h-4" /> إيداع
              </button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-white/70">قيد التسوية</span>
                  <Clock className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-xl tabular-nums">{factory ? factory.pending_balance.toLocaleString('ar-YE') : '---'}</div>
                <div className="text-[10px] text-white/60 mt-1">{walletTransactions.filter(t => t.status === 'pending').length} معاملة</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-white/70">جاهز للسحب</span>
                  <Zap className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="text-xl tabular-nums">{factory ? (factory.balance - factory.pending_balance).toLocaleString('ar-YE') : '---'}</div>
                <div className="text-[10px] text-white/60 mt-1">سحب فوري</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-white/70">إيرادات اليوم</span>
                  <TrendingUp className="w-4 h-4 text-[#7CC2FF]" />
                </div>
                <div className="text-xl tabular-nums">١,٢٤٧,٥٠٠</div>
                <div className="text-[10px] text-emerald-300 mt-1">+٨.٢٪</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-white/70">رسوم الشهر</span>
                  <Layers className="w-4 h-4 text-white/70" />
                </div>
                <div className="text-xl tabular-nums">٦٢,٤٠٠</div>
                <div className="text-[10px] text-white/60 mt-1">٠.٤٪ من الحجم</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow + Settlement Health */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg text-[#0B1B3B]">تدفق النقد</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">حركة الإيداعات والسحوبات خلال آخر ٣٠ يوماً</p>
            </div>
            <div className="flex gap-2 text-[12px]">
              <Legend2 dot="#1A73E8" label="إيداعات" />
              <Legend2 dot="#B45309" label="سحوبات" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={[
              { d: '١', in: 1.2, out: 0.4 }, { d: '٥', in: 1.8, out: 0.6 },
              { d: '١٠', in: 2.4, out: 1.1 }, { d: '١٥', in: 2.1, out: 0.9 },
              { d: '٢٠', in: 3.2, out: 1.4 }, { d: '٢٥', in: 2.8, out: 1.0 },
              { d: '٣٠', in: 3.8, out: 1.6 },
            ]}>
              <defs>
                <linearGradient id="walletIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A73E8" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1A73E8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="walletOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B45309" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#B45309" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#EEF2F7" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E9F2', fontSize: 12 }} />
              <Area type="monotone" dataKey="in" stroke="#1A73E8" strokeWidth={2} fill="url(#walletIn)" />
              <Area type="monotone" dataKey="out" stroke="#B45309" strokeWidth={2} fill="url(#walletOut)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-[#0B1B3B] to-[#13265A] rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#1A73E8]/30 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg">صحة التسوية</h3>
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div className="space-y-4">
              <WalletHealthRow label="معدل التحصيل" value="٩٦.٤٪" pct={96} />
              <WalletHealthRow label="سرعة التسوية" value="١.٢ يوم" pct={88} tone="emerald" />
              <WalletHealthRow label="نسبة المرتجعات" value="٠.٨٪" pct={12} tone="amber" />
              <WalletHealthRow label="الموثوقية المالية" value="ممتاز" pct={94} />
            </div>
            <div className="mt-6 p-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl">
              <div className="flex items-center gap-2 text-[12px] text-emerald-300 mb-1">
                <Crown className="w-4 h-4" />
                تصنيف ذهبي
              </div>
              <div className="text-[11px] text-white/70 leading-relaxed">
                مؤهل لتسوية فورية وحدود ائتمان مرتفعة من شركاء التمويل
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Settlements + Linked Accounts */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg text-[#0B1B3B]">تسويات معلّقة</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">معاملات بانتظار الإفراج عبر شبكة المسارات</p>
            </div>
            <button className="text-[12px] text-[#1A73E8] hover:underline">عرض الكل</button>
          </div>
          <div className="space-y-2.5">
            {walletTransactions.filter(t => t.status === 'pending').map((s) => (
              <div key={s.id} className="border border-slate-200 rounded-xl p-4 hover:border-[#1A73E8]/40 hover:bg-blue-50/30 transition group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-[#1A73E8]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#0B1B3B]">{s.from_entity}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{s.tx_number}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[#1A73E8]">بانتظار التسوية</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-base text-[#0B1B3B] tabular-nums">{s.amount.toLocaleString('ar-YE')}</div>
                    <div className="text-[11px] text-amber-600 flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3" /> قيد المعالجة
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-l from-[#1A73E8] to-[#0B1B3B]" style={{ width: '45%' }} />
                </div>
              </div>
            ))}
            {walletTransactions.filter(t => t.status === 'pending').length === 0 && (
              <div className="text-center py-6 text-slate-500 text-sm">
                لا توجد تسويات معلقة
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg text-[#0B1B3B]">الحسابات المرتبطة</h3>
              <button className="text-[12px] text-[#1A73E8] hover:underline inline-flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> إضافة
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { name: 'بنك التضامن الإسلامي', num: '•••• ٤٢٨١', tag: 'افتراضي', tone: 'bg-emerald-50 text-emerald-700' },
                { name: 'بنك اليمن والكويت', num: '•••• ٧٧١٠', tag: 'احتياطي', tone: 'bg-blue-50 text-blue-700' },
                { name: 'محفظة فلوسك', num: '٧٧٣ ••• •••', tag: 'سريع', tone: 'bg-amber-50 text-amber-700' },
              ].map((a) => (
                <div key={a.num} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1A73E8] to-[#0B1B3B] flex items-center justify-center">
                      <Wallet className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-[#0B1B3B]">{a.name}</div>
                      <div className="text-[11px] text-slate-500 tabular-nums mt-0.5">{a.num}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-md ${a.tone}`}>{a.tag}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-[#0B1B3B]">آخر الحركات</h3>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-1">
              {walletTransactions.slice(0, 6).map((tx) => {
                const isDeposit = tx.type === 'deposit' || tx.type === 'settlement';
                return (
                  <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDeposit ? 'bg-emerald-50' : 'bg-red-50'}`}>
                        {isDeposit
                          ? <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                          : <ArrowUpRight className="w-3.5 h-3.5 text-red-600" />}
                      </div>
                      <div>
                        <div className="text-[13px] text-[#0B1B3B] truncate max-w-[120px]">
                          {tx.type === 'settlement' ? 'تسوية · ' + tx.from_entity : 
                           tx.type === 'withdrawal' ? 'سحب بنكي' : 
                           tx.type === 'fee' ? 'رسوم شبكة' : 'إيداع'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(tx.created_at).toLocaleDateString('ar-YE')}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm tabular-nums ${isDeposit ? 'text-emerald-700' : 'text-red-700'}`}>
                      {isDeposit ? '+' : '-'}{tx.amount.toLocaleString('ar-YE')}
                    </div>
                  </div>
                );
              })}
              {walletTransactions.length === 0 && (
                <div className="text-center py-4 text-slate-500 text-xs">لا توجد حركات مؤخراً</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
