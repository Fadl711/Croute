import { useState, useEffect } from "react";
import {
  Globe,
  DollarSign,
  Activity,
  Bell,
  BarChart3,
  PieChart,
  FileText,
  Wallet,
  AlertTriangle,
  ChevronLeft,
  Package,
  GitMerge,
  Map,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTransactions } from "../../../hooks/useTransactions";
import { useShipments } from "../../../hooks/useShipments";
import { useDrivers } from "../../../hooks/useDrivers";

// Modular Components
import OverviewTab from "./OverviewTab";
import TransactionsTab from "./TransactionsTab";
import RiskTab from "./RiskTab";
import AdminAnalyticsTab from "./AdminAnalyticsTab";
import AuditTab from "./AuditTab";
import ShipmentsTab from "./ShipmentsTab";
import ConsolidationTab from "./ConsolidationTab";
import FleetMapTab from "./FleetMapTab";

interface AdminDashboardProps {
  onBack: () => void;
}

const GMV_TREND = [
  { day: "السبت", gmv: 0, settlements: 0, transactions: 0 },
  { day: "الأحد", gmv: 0, settlements: 0, transactions: 0 },
  { day: "الاثنين", gmv: 0, settlements: 0, transactions: 0 },
  { day: "الثلاثاء", gmv: 0, settlements: 0, transactions: 0 },
  { day: "الأربعاء", gmv: 0, settlements: 0, transactions: 0 },
  { day: "الخميس", gmv: 0, settlements: 0, transactions: 0 },
  { day: "الجمعة", gmv: 0, settlements: 0, transactions: 0 },
];

const TRANSACTION_TYPES = [
  { name: "تسويات", value: 0, color: "#10B981" },
  { name: "ائتمان", value: 0, color: "#3B82F6" },
  { name: "رسوم", value: 0, color: "#F59E0B" },
];

const SETTLEMENT_TIMES = [
  { range: "< 1 ساعة", count: 0 },
  { range: "1-2 ساعة", count: 0 },
  { range: "2-3 ساعات", count: 0 },
  { range: "3-4 ساعات", count: 0 },
  { range: "> 4 ساعات", count: 0 },
];

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const {
    transactions,
    auditLog: liveAuditLog,
    retailers,
    platformStats,
    loading: transactionsLoading,
  } = useTransactions();
  const {
    shipments,
    loading: shipmentsLoading,
    updateShipment,
  } = useShipments(undefined as any, true);
  const { drivers, loading: driversLoading } = useDrivers();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [liveUpdate, setLiveUpdate] = useState(true);

  // Real live stats from platform_stats
  const [stats, setStats] = useState({
    gmv: 0,
    dailySettlements: 0,
    costSavings: 30,
    activeUsers: 0,
    activeShipments: 0,
    totalTransactions: 0,
    avgSettlementTime: 0,
    platformFee: 0,
  });

  useEffect(() => {
    if (platformStats) {
      setStats({
        gmv: platformStats.gmv || 0,
        dailySettlements: platformStats.daily_settlements || 0,
        costSavings: 30,
        activeUsers: platformStats.active_users || 0,
        activeShipments: shipments.filter(
          (s) => s.status === "in_transit" || s.status === "pending"
        ).length,
        totalTransactions: platformStats.total_transactions || 0,
        avgSettlementTime: platformStats.avg_settlement_hours || 0,
        platformFee: platformStats.platform_fee_today || 0,
      });
    }
  }, [platformStats, shipments]);

  // Dynamic risk map from real retailer data
  const riskMap = retailers.map((r) => {
    const ratio = r.credit_limit > 0 ? r.credit_used / r.credit_limit : 0;
    let risk = "منخفض";
    let color = "bg-green-500";
    if (ratio > 0.9) {
      risk = "عالي";
      color = "bg-red-500";
    } else if (ratio > 0.7) {
      risk = "متوسط";
      color = "bg-yellow-500";
    }
    return {
      retailer: r.name,
      risk,
      color,
      score: r.credit_score,
      credit: r.credit_limit,
      used: r.credit_used,
    };
  });

  const allTransactions = transactions.map((tx) => {
    let fromName = "نظام التمويل";
    let toName = "حساب غير معروف";
    if (tx.type === "settlement") {
      fromName = "غرفة المقاصة";
      toName =
        retailers.find((r) => r.id === (tx as any).receiver_id)?.name ||
        "المصنع";
    } else if (tx.type === "credit_usage") {
      fromName =
        retailers.find((r) => r.id === (tx as any).sender_id)?.name || "متجر";
      toName = "غرفة المقاصة";
    }
    return {
      id: tx.id.substring(0, 8).toUpperCase(),
      from: fromName,
      to: toName,
      amount: tx.amount,
      type: tx.type === "settlement" ? "تسوية" : "ائتمان",
      time: new Date(tx.created_at).toLocaleString("ar-YE"),
      status: tx.status === "completed" ? "مكتمل" : "قيد المعالجة",
    };
  });

  const filteredTransactions = allTransactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const auditLog = liveAuditLog.map((log) => ({
    id: log.id,
    action: log.action,
    user: (log as any).actor_id || "النظام الآلي",
    target: (log as any).target_id || "",
    time: new Date(log.created_at).toLocaleString("ar-YE"),
    type: log.action.includes("settlement") ? "settlement" : "update",
  }));

  const tabs = [
    { id: "overview", label: "نظرة عامة", icon: BarChart3 },
    { id: "fleet-map", label: "رادار الأسطول", icon: Map },
    { id: "shipments", label: "الشحنات", icon: Package },
    { id: "consolidation", label: "دمج المسارات", icon: GitMerge },
    { id: "transactions", label: "المعاملات", icon: Wallet },
    { id: "risk", label: "إدارة المخاطر", icon: AlertTriangle },
    { id: "analytics", label: "التحليلات", icon: PieChart },
    { id: "audit", label: "سجل التدقيق", icon: FileText },
  ];

  return (
    <div
      className="min-h-screen flex bg-slate-50 font-['Inter','Cairo',sans-serif]"
      dir="rtl"
    >
      {/* ═══════════ Sidebar ═══════════ */}
      <aside className="w-72 bg-[#0B1B3B] text-white flex flex-col fixed inset-y-0 right-0 z-50 shadow-[0_0_50px_rgba(0,0,0,0.3)] border-l border-white/5">
        <div className="p-8 border-b border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h1 className="text-xl font-black flex items-center gap-4 relative z-10">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/40 border border-white/10 group-hover:rotate-12 transition-transform duration-500 p-2.5">
              <img src="/logo.png" alt="C-Route Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-white tracking-tight leading-none">C-ROUTE</span>
              <span className="text-[10px] text-blue-400 font-black tracking-[0.2em] mt-1.5 uppercase">SYSTEM ADMIN</span>
            </div>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] text-white/30 font-black tracking-[0.2em] mb-6 px-4 uppercase">
            القائمة الرئيسية
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all duration-300 relative group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/40 font-bold translate-x-1"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-white/40"
                    }`}
                  />
                </div>
                <span className="flex-1 text-right tracking-tight">{tab.label}</span>
                {tab.id === "shipments" &&
                  shipments.filter((s) => s.status === "pending").length > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-amber-900/20 animate-pulse">
                      {shipments.filter((s) => s.status === "pending").length}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        {/* Live Status */}
        <div className="px-4 py-3 border-t border-white/10">
          <button
            onClick={() => setLiveUpdate(!liveUpdate)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
              liveUpdate
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-white/5 text-slate-500 border border-white/10"
            }`}
          >
            <Activity
              className={`w-4 h-4 ${liveUpdate ? "animate-pulse" : ""}`}
            />
            <span className="text-xs font-bold">
              {liveUpdate ? "بث مباشر نشط" : "البث متوقف"}
            </span>
          </button>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 rotate-180" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ═══════════ Main Content ═══════════ */}
      <main className="flex-1 mr-72 flex flex-col min-h-screen relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-slate-200 px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl md:hidden">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">النظام نشط • يمن شيب</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">
                  مدير النظام
                </div>
                <div className={`text-xs font-medium ${!transactionsLoading && retailers.length === 0 ? "text-rose-600" : "text-emerald-600"}`}>
                  {!transactionsLoading && retailers.length === 0 ? "غير متصل (Supabase Paused)" : "متصل ومفعل"}
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                م
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          {!transactionsLoading && retailers.length === 0 && (
            <div className="bg-amber-50 border-r-4 border-amber-500 p-6 rounded-2xl mb-8 flex items-start gap-4 shadow-sm" dir="rtl">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-amber-800 font-black text-sm mb-1">فشل الاتصال بقاعدة البيانات (Supabase)</h3>
                <p className="text-amber-700 text-xs font-semibold leading-relaxed">
                  لم نتمكن من الاتصال بالخادم. يرجى التاكد من ان مشروع قاعدة البيانات نشط وغير مؤقت (Active / Not Paused) على منصة Supabase. 
                  اذا كان المشروع متوقف مؤقتا، يرجى تسجيل الدخول الى Supabase وتفعيله بالضغط على "Resume Project".
                </p>
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <OverviewTab key="overview" stats={stats} gmvTrend={GMV_TREND} />
            )}

            {activeTab === "fleet-map" && (
              <FleetMapTab
                key="fleet-map"
                shipments={shipments}
                drivers={drivers}
              />
            )}

            {activeTab === "shipments" && (
              <ShipmentsTab
                key="shipments"
                shipments={shipments}
                loading={shipmentsLoading}
                updateShipment={updateShipment}
              />
            )}

            {activeTab === "consolidation" && (
              <ConsolidationTab
                key="consolidation"
                shipments={shipments}
                drivers={drivers}
                updateShipment={updateShipment}
              />
            )}

            {activeTab === "transactions" && (
              <TransactionsTab
                key="transactions"
                {...{
                  searchQuery,
                  setSearchQuery,
                  filterType,
                  setFilterType,
                  showFilters,
                  setShowFilters,
                  paginatedTransactions,
                  currentPage,
                  setCurrentPage,
                  totalPages,
                }}
              />
            )}

            {activeTab === "risk" && (
              <RiskTab key="risk" riskMap={riskMap} />
            )}

            {activeTab === "analytics" && (
              <AdminAnalyticsTab
                key="analytics"
                transactionTypes={TRANSACTION_TYPES}
                settlementTimes={SETTLEMENT_TIMES}
              />
            )}

            {activeTab === "audit" && (
              <AuditTab key="audit" auditLog={auditLog} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
