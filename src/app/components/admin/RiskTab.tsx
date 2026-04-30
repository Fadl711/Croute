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
                    className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                        <span className="text-[10px] text-slate-400 font-black uppercase mb-1">
                          Score
                        </span>
                        <div className="text-xl font-black text-slate-900">
                          {item.score}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">
                          {item.retailer}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${
                              item.risk === "عالي"
                                ? "bg-red-50 text-red-600"
                                : item.risk === "متوسط"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${item.color}`}
                            />
                            خطر {item.risk}
                          </span>
                          <span className="text-xs text-slate-500">
                            الحد الائتماني:{" "}
                            {item.credit.toLocaleString()} ر.ي
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-64 space-y-2">
                      <div className="flex justify-between text-xs text-slate-500 font-bold mb-1">
                        <span>الاستهلاك الائتماني</span>
                        <span>
                          {item.credit > 0
                            ? Math.round((item.used / item.credit) * 100)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              item.credit > 0
                                ? (item.used / item.credit) * 100
                                : 0
                            }%`,
                          }}
                          className={`h-full ${
                            item.risk === "عالي"
                              ? "bg-red-500"
                              : item.risk === "متوسط"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        />
                      </div>
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
