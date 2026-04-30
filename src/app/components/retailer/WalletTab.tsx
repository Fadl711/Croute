import { motion } from 'motion/react';
import { Wallet, Sparkles, Building2, TrendingUp, ShieldCheck, ArrowRightLeft } from 'lucide-react';

interface WalletTabProps {
  creditLimit: number;
  creditUsed: number;
}

export default function WalletTab({ creditLimit, creditUsed }: WalletTabProps) {
  const creditAvailable = creditLimit - creditUsed;
  const utilizationPct = creditLimit > 0 ? Math.round((creditUsed / creditLimit) * 100) : 0;

  return (
    <motion.div
      key="wallet"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Wallet Balance Hero */}
      <div className="bg-gradient-to-br from-[#0B1B3B] via-[#1A73E8] to-[#0B1B3B] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 md:mb-8 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase">رصيد المشتريات المتاح</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
            <div>
              <div className="text-4xl md:text-5xl font-black mb-4 tabular-nums">
                {creditAvailable.toLocaleString()} <span className="text-lg md:text-xl font-normal text-white/60">ر.ي</span>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] text-white/50 uppercase mb-1">المستخدم</span>
                  <span className="font-bold tabular-nums text-red-300">{creditUsed.toLocaleString()} ر.ي</span>
                </div>
                <div className="w-px h-6 md:h-8 bg-white/20" />
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] text-white/50 uppercase mb-1">نسبة الاستهلاك</span>
                  <span className="font-bold tabular-nums text-emerald-300">{utilizationPct}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 md:gap-3">
              {/* Functional buttons only or info badges */}
              <div className="bg-white/10 border border-white/20 backdrop-blur-md px-4 md:px-6 py-2 rounded-xl text-[10px] font-bold text-white">
                حساب نشط
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl">
            <Building2 className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mb-0.5">ضمان بنكي</div>
            <div className="text-xs md:text-sm font-black text-slate-900">البنك التجاري</div>
          </div>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl">
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mb-0.5">حالة الضمان</div>
            <div className="text-xs md:text-sm font-black text-emerald-600">نشط ومفعل</div>
          </div>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm sm:col-span-2 md:col-span-1">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl md:rounded-2xl">
            <ArrowRightLeft className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mb-0.5">تاريخ التجديد</div>
            <div className="text-xs md:text-sm font-black text-slate-900">١٥ مايو ٢٠٢٦</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

