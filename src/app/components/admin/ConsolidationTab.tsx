import { useState, useMemo } from "react";
import {
  GitMerge,
  CheckCircle2,
  Zap,
  AlertCircle,
  Truck,
  MapPin,
  Package,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import type { Shipment, Driver } from "../../../lib/supabase";

interface ConsolidationTabProps {
  shipments: Shipment[];
  drivers: Driver[];
  updateShipment: (id: string, patch: Partial<Shipment>) => Promise<void>;
}

export default function ConsolidationTab({
  shipments,
  drivers,
  updateShipment,
}: ConsolidationTabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [targetDriver, setTargetDriver] = useState<string>("");
  const [routeName, setRouteName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingShipments = shipments.filter((s) => s.status === "pending");

  const groups = useMemo(() => {
    const map: Record<string, Shipment[]> = {};
    pendingShipments.forEach((s) => {
      const city = s.route?.split("-")[1]?.trim() || "وجهات أخرى";
      map[city] = map[city] || [];
      map[city].push(s);
    });
    return Object.entries(map).filter(([_, items]) => items.length > 0);
  }, [pendingShipments]);

  const handleMerge = async () => {
    if (selectedIds.length === 0 || !targetDriver || !routeName) return;

    setIsProcessing(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          updateShipment(id, {
            driver_id: targetDriver,
            route: routeName,
            status: "in_transit",
          })
        )
      );
      setSelectedIds([]);
      setRouteName("");
      setTargetDriver("");
      alert("تم دمج الشحنات وإسناد المسار بنجاح!");
    } catch (error) {
      console.error("Merge error:", error);
      alert("حدث خطأ أثناء دمج الشحنات");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalValue = shipments
    .filter((s) => selectedIds.includes(s.id))
    .reduce((acc, s) => acc + s.total_amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GitMerge className="w-6 h-6 text-emerald-600" />
            محرك دمج المسارات (AI Consolidation)
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            توفير يصل إلى 30% من تكاليف النقل عبر تجميع الطلبات
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Shipment Groups */}
        <div className="lg:col-span-2 space-y-4">
          {groups.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <div className="text-slate-500 font-bold">
                لا توجد شحنات معلقة للدمج حالياً
              </div>
            </div>
          ) : (
            groups.map(([city, items], idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-slate-900 font-bold">{city}</span>
                      <span className="text-[10px] text-slate-500 mr-2 uppercase tracking-widest">
                        {items.length} شحنات متاحة
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const allInGroup = items.map((i) => i.id);
                      const someSelected = allInGroup.some((id) =>
                        selectedIds.includes(id)
                      );
                      if (someSelected) {
                        setSelectedIds((prev) =>
                          prev.filter((id) => !allInGroup.includes(id))
                        );
                      } else {
                        setSelectedIds((prev) => [
                          ...new Set([...prev, ...allInGroup]),
                        ]);
                      }
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                  >
                    تحديد الكل
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {items.map((shipment) => (
                    <div
                      key={shipment.id}
                      onClick={() =>
                        setSelectedIds((prev) =>
                          prev.includes(shipment.id)
                            ? prev.filter((id) => id !== shipment.id)
                            : [...prev, shipment.id]
                        )
                      }
                      className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-all ${
                        selectedIds.includes(shipment.id)
                          ? "bg-blue-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            selectedIds.includes(shipment.id)
                              ? "bg-blue-600 border-blue-600"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {selectedIds.includes(shipment.id) && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">
                            {shipment.shipment_number}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {shipment.route}
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-black text-slate-900 tabular-nums">
                          {shipment.total_amount.toLocaleString()}{" "}
                          <span className="text-[10px] font-normal text-slate-500">
                            ر.ي
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          جاهز للشحن
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Actions / Route Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24 shadow-sm">
            <h3 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              ملخص المسار المدمج
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">عدد الطلبات المحددة</span>
                <span className="text-slate-900 font-bold tabular-nums">
                  {selectedIds.length}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">إجمالي القيمة</span>
                <span className="text-slate-900 font-bold tabular-nums">
                  {totalValue.toLocaleString()} ر.ي
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-600 font-bold">
                  توفير لوجستي متوقع
                </span>
                <span className="text-emerald-600 font-bold tabular-nums">
                  30%
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  اسم المسار
                </label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="مثال: صنعاء-عدن المجمع"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  اختيار السائق
                </label>
                <div className="relative">
                  <UserPlus className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={targetDriver}
                    onChange={(e) => setTargetDriver(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-11 pl-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
                  >
                    <option value="">اختر سائقاً متاحاً...</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.avg_rating}★)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleMerge}
                disabled={
                  selectedIds.length < 1 ||
                  !targetDriver ||
                  !routeName ||
                  isProcessing
                }
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all mt-4 ${
                  selectedIds.length >= 1 &&
                  targetDriver &&
                  routeName &&
                  !isProcessing
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isProcessing ? "جاري الدمج..." : "دمج وإسناد المسار"}
                {!isProcessing && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-[11px] text-amber-700 leading-relaxed">
                عند إتمام عملية الدمج، سيتم إخطار السائق بالمسار الجديد وسيتغير
                وضع الطلبات إلى "قيد التوصيل".
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
