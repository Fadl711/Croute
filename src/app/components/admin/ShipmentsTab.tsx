import { useState, useMemo } from "react";
import {
  Package,
  Search,
  Download,
  MapPin,
  Clock,
  Truck,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "motion/react";
import type { Shipment } from "../../../lib/supabase";

interface ShipmentsTabProps {
  shipments: Shipment[];
  loading: boolean;
  updateShipment: (id: string, patch: Partial<Shipment>) => Promise<void>;
}

const STATUS_META: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  pending: {
    label: "قيد التجهيز",
    color: "text-slate-700",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
  },
  in_transit: {
    label: "قيد التوصيل",
    color: "text-blue-700",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
  },
  completed: {
    label: "تم التسليم",
    color: "text-green-700",
    bg: "bg-green-50",
    dot: "bg-green-500",
  },
  delivered: {
    label: "تم التسليم",
    color: "text-green-700",
    bg: "bg-green-50",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "ملغي",
    color: "text-red-700",
    bg: "bg-red-50",
    dot: "bg-red-500",
  },
};

export default function ShipmentsTab({
  shipments,
  loading,
  updateShipment,
}: ShipmentsTabProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | string>("all");
  const [sort, setSort] = useState<"newest" | "amount_desc" | "amount_asc">(
    "newest"
  );
  const [selected, setSelected] = useState<string[]>([]);

  const filteredShipments = useMemo(() => {
    let rows = shipments;
    if (filter !== "all") rows = rows.filter((s) => s.status === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (s) =>
          s.shipment_number.toLowerCase().includes(q) ||
          (s.route && s.route.toLowerCase().includes(q))
      );
    }
    rows = [...rows];
    if (sort === "newest")
      rows.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    if (sort === "amount_desc")
      rows.sort((a, b) => b.total_amount - a.total_amount);
    if (sort === "amount_asc")
      rows.sort((a, b) => a.total_amount - b.total_amount);
    return rows;
  }, [shipments, search, filter, sort]);

  const toggleSelectAll = () => {
    if (selected.length === filteredShipments.length) {
      setSelected([]);
    } else {
      setSelected(filteredShipments.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const exportCSV = () => {
    const header = ["ID", "Number", "Route", "Status", "Amount", "Date"];
    const rows = filteredShipments.map((s) =>
      [
        s.id,
        s.shipment_number,
        s.route,
        s.status,
        s.total_amount,
        s.created_at,
      ].join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shipments-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            إدارة الشحنات الذكية
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            تتبع وتحكم في جميع الشحنات عبر المنصة
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm transition-all border border-slate-200 shadow-sm"
        >
          <Download className="w-4 h-4" />
          تصدير CSV
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الشحنة أو المسار..."
            className="w-full bg-white border border-slate-200 rounded-xl pr-11 pl-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 transition-all"
        >
          <option value="all">كل الحالات</option>
          <option value="pending">قيد التجهيز</option>
          <option value="in_transit">في الطريق</option>
          <option value="completed">مكتملة</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 transition-all"
        >
          <option value="newest">الأحدث أولاً</option>
          <option value="amount_desc">الأعلى قيمة</option>
          <option value="amount_asc">الأقل قيمة</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "إجمالي الشحنات",
            value: shipments.length,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "نشطة حالياً",
            value: shipments.filter((s) => s.status === "in_transit").length,
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "مكتملة",
            value: shipments.filter(
              (s) => s.status === "completed" || s.status === "delivered"
            ).length,
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "قيمة الشحنات",
            value:
              shipments
                .reduce((acc, s) => acc + s.total_amount, 0)
                .toLocaleString() + " ر.ي",
            color: "text-slate-900 bg-slate-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 p-4 rounded-2xl"
          >
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">
              {stat.label}
            </div>
            <div className={`text-lg font-black text-slate-900`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === filteredShipments.length &&
                      filteredShipments.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300"
                  />
                </th>
                <th className="px-6 py-4 font-bold">الشحنة</th>
                <th className="px-6 py-4 font-bold">المسار</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold">القيمة</th>
                <th className="px-6 py-4 font-bold">التاريخ</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    جاري التحميل...
                  </td>
                </tr>
              ) : filteredShipments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    لا توجد شحنات تطابق البحث
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(shipment.id)}
                        onChange={() => toggleSelectOne(shipment.id)}
                        className="rounded border-slate-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-bold text-slate-900">
                          {shipment.shipment_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {shipment.route || "غير محدد"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit ${
                          STATUS_META[shipment.status]?.bg
                        } ${STATUS_META[shipment.status]?.color}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            STATUS_META[shipment.status]?.dot
                          }`}
                        />
                        {STATUS_META[shipment.status]?.label || shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 tabular-nums">
                      {shipment.total_amount.toLocaleString()}{" "}
                      <span className="text-[10px] font-normal text-slate-400">
                        ر.ي
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(shipment.created_at).toLocaleDateString(
                          "ar-YE"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
