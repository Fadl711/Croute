import { motion } from "motion/react";
import {
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  Target,
  Info,
} from "lucide-react";

interface RiskTabProps {
  riskMap: any[];
}

export default function RiskTab({ riskMap }: RiskTabProps) {
  return (
    <motion.div
      key="risk"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              مؤشرات مخاطر السيولة والائتمان
            </h3>
            <div className="grid gap-4">
              {riskMap.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  لا يوجد بيانات تجار بعد
                </div>
              ) : (
                riskMap.map((item, i) => (
                  <div
                    key={i}
                    className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 group"
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex flex-col items-center justify-center border border-blue-100 shadow-sm group-hover:scale-110 transition-transform">
                        <span className="text-[9px] text-blue-400 font-black uppercase mb-0.5">
                          SCORE
                        </span>
                        <div className="text-xl font-black text-blue-900">
                          {item.score}
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                          {item.retailer}
                          {item.score > 80 && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="تاجر موثوق" />}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${
                              item.risk === "عالي"
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : item.risk === "متوسط"
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${item.color} animate-pulse`} />
                            {item.risk === "عالي" ? "خطر مرتفع" : item.risk === "متوسط" ? "خطر متوسط" : "آمن ائتمانياً"}
                          </span>
                          <div className="h-4 w-px bg-slate-200" />
                          <span className="text-xs text-slate-500 font-medium">
                            المتبقي: <span className="font-bold text-slate-900">{(item.credit - item.used).toLocaleString()} ر.ي</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-72 space-y-3">
                      <div className="flex justify-between text-[11px] font-black mb-1.5">
                        <span className="text-slate-400 uppercase tracking-widest">تحليل الاستهلاك</span>
                        <span className={item.used / item.credit > 0.85 ? "text-red-500" : "text-blue-600"}>
                          {item.credit > 0 ? Math.round((item.used / item.credit) * 100) : 0}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${item.credit > 0 ? (item.used / item.credit) * 100 : 0}%`,
                          }}
                          className={`h-full rounded-full ${
                            item.used / item.credit > 0.9
                              ? "bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                              : item.used / item.credit > 0.7
                              ? "bg-gradient-to-r from-amber-500 to-amber-300"
                              : "bg-gradient-to-r from-blue-600 to-blue-400"
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                        <span>مستعمل: {item.used.toLocaleString()}</span>
                        <span>الإجمالي: {item.credit.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2.5 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border border-slate-100">
                        <Info className="w-5 h-5" />
                      </button>
                      <button className="px-4 py-2.5 bg-[#0B1B3B] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20">
                        إدارة الحد
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 p-8 rounded-3xl shadow-sm relative overflow-hidden">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-6" />
            <h4 className="text-xl font-black text-slate-900 mb-4">
              تنبيهات حرجة
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-red-100 flex gap-4">
                <TrendingDown className="w-10 h-10 text-red-500 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-slate-900 mb-1">
                    انخفاض مفاجئ في Score
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    يتم مراقبة التجار ذوي الاستهلاك المرتفع تلقائياً.
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-amber-100 flex gap-4">
                <Target className="w-10 h-10 text-amber-500 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-slate-900 mb-1">
                    تجاوز الحد الائتماني
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    سيتم تنبيهك عند وصول أي تاجر لنسبة ٨٥٪ من الحد.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              كيف يعمل النظام؟
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              يستخدم C-Route خوارزميات تعلم آلي لتحليل أكثر من ٥٠ مؤشر لكل
              تاجر، مما يضمن استدامة السيولة في غرفة المقاصة وحماية حقوق
              المصانع.
            </p>
            <div className="space-y-3">
              {[
                "تحليل تاريخ السداد",
                "تتبع حركة المبيعات",
                "الانتظام في الطلب",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-[11px] font-bold text-slate-700"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
