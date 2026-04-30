import { motion } from 'motion/react';
import { Wallet, Sparkles, Building2, TrendingUp, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export default function WalletTab() {
  return (
    <motion.div
      key="wallet"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Wallet Balance Hero */}
      <div className="bg-gradient-to-br from-[#0B1B3B] via-[#1A73E8] to-[#0B1B3B] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold tracking-wider uppercase">رصيد المشتريات المتاح</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="text-5xl font-black mb-4 tabular-nums">٥٠٠٬٠٠٠ <span className="text-xl font-normal text-white/60">ر.ي</span></div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/50 uppercase mb-1">المستخدم</span>
                  <span className="font-bold tabular-nums text-red-300">١٢٠٬٠٠٠ ر.ي</span>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/50 uppercase mb-1">نسبة الاستهلاك</span>
                  <span className="font-bold tabular-nums text-emerald-300">٢٤٪</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-white text-[#0B1B3B] px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-xl active:scale-95">طلب زيادة الائتمان</button>
              <button className="bg-white/10 border border-white/20 backdrop-blur-md px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all active:scale-95 text-white">تحويل رصيد</button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">ضمان بنكي</div>
            <div className="text-sm font-black text-slate-900">البنك التجاري</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">حالة الضمان</div>
            <div className="text-sm font-black text-emerald-600">نشط ومفعل</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">تاريخ التجديد</div>
            <div className="text-sm font-black text-slate-900">١٥ مايو ٢٠٢٦</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
