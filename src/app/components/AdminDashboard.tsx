import { useState, useEffect } from 'react';
import {
  Globe, DollarSign, Activity, Bell, Settings, BarChart3, PieChart, FileText, Wallet, AlertTriangle, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTransactions } from '../../hooks/useTransactions';

// Modular Components
import OverviewTab from './admin/OverviewTab';
import TransactionsTab from './admin/TransactionsTab';
import RiskTab from './admin/RiskTab';
import AdminAnalyticsTab from './admin/AdminAnalyticsTab';
import AuditTab from './admin/AuditTab';

interface AdminDashboardProps {
  onBack: () => void;
}

const GMV_TREND = [
  { day: 'السبت', gmv: 8500000, settlements: 620000, transactions: 245 },
  { day: 'الأحد', gmv: 9200000, settlements: 680000, transactions: 287 },
  { day: 'الاثنين', gmv: 10100000, settlements: 750000, transactions: 312 },
  { day: 'الثلاثاء', gmv: 11300000, settlements: 820000, transactions: 356 },
  { day: 'الأربعاء', gmv: 10800000, settlements: 790000, transactions: 334 },
  { day: 'الخميس', gmv: 12000000, settlements: 870000, transactions: 389 },
  { day: 'الجمعة', gmv: 12500000, settlements: 850000, transactions: 421 },
];

const TRANSACTION_TYPES = [
  { name: 'تسويات', value: 1850, color: '#10B981' },
  { name: 'ائتمان', value: 1240, color: '#3B82F6' },
  { name: 'رسوم', value: 331, color: '#F59E0B' },
];

const SETTLEMENT_TIMES = [
  { range: '< 1 ساعة', count: 145 },
  { range: '1-2 ساعة', count: 98 },
  { range: '2-3 ساعات', count: 42 },
  { range: '3-4 ساعات', count: 18 },
  { range: '> 4 ساعات', count: 7 },
];

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { transactions, auditLog: liveAuditLog, retailers, loading } = useTransactions();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [liveUpdate, setLiveUpdate] = useState(true);

  // Simulated live stats
  const [stats, setStats] = useState({
    gmv: 12500000,
    dailySettlements: 850000,
    costSavings: 30,
    activeUsers: 1247,
    activeShipments: 89,
    totalTransactions: 3421,
    avgSettlementTime: 1.8,
    platformFee: 125000
  });

  useEffect(() => {
    if (!liveUpdate) return;
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        gmv: prev.gmv + Math.floor(Math.random() * 50000),
        dailySettlements: prev.dailySettlements + Math.floor(Math.random() * 20000),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        totalTransactions: prev.totalTransactions + 1
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [liveUpdate]);

  const riskMap = [
    { retailer: 'متجر الأمل', risk: 'منخفض', color: 'bg-green-500', score: 95, credit: 250000, used: 120000 },
    { retailer: 'سوبر ماركت النور', risk: 'منخفض', color: 'bg-green-500', score: 92, credit: 300000, used: 180000 },
    { retailer: 'بقالة السلام', risk: 'متوسط', color: 'bg-yellow-500', score: 75, credit: 150000, used: 130000 },
    { retailer: 'محلات الفرح', risk: 'منخفض', color: 'bg-green-500', score: 88, credit: 200000, used: 95000 },
    { retailer: 'متجر الوفاء', risk: 'عالي', color: 'bg-red-500', score: 45, credit: 100000, used: 98000 }
  ];

  const allTransactions = transactions.map(tx => {
    let fromName = 'نظام التمويل';
    let toName = 'حساب غير معروف';
    if (tx.type === 'settlement') {
      fromName = 'غرفة المقاصة';
      toName = retailers.find(r => r.id === tx.receiver_id)?.name || 'المصنع';
    } else if (tx.type === 'credit_usage') {
      fromName = retailers.find(r => r.id === tx.sender_id)?.name || 'متجر';
      toName = 'غرفة المقاصة';
    }
    return {
      id: tx.id.substring(0, 8).toUpperCase(),
      from: fromName,
      to: toName,
      amount: tx.amount,
      type: tx.type === 'settlement' ? 'تسوية' : 'ائتمان',
      time: new Date(tx.created_at).toLocaleString('ar-YE'),
      status: tx.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'
    };
  });

  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.to.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const auditLog = liveAuditLog.map(log => ({
    id: log.id,
    action: log.action,
    user: log.actor_id || 'النظام الآلي',
    target: log.target_id || '',
    time: new Date(log.created_at).toLocaleString('ar-YE'),
    type: log.action.includes('settlement') ? 'settlement' : 'update'
  }));

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'transactions', label: 'المعاملات', icon: Wallet },
    { id: 'risk', label: 'إدارة المخاطر', icon: AlertTriangle },
    { id: 'analytics', label: 'التحليلات', icon: PieChart },
    { id: 'audit', label: 'سجل التدقيق', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30" dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">C-ROUTE <span className="text-blue-500">ADMIN</span></span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all font-bold text-sm ${
                      active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiveUpdate(!liveUpdate)}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
                liveUpdate ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              <Activity className={`w-4 h-4 ${liveUpdate ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-bold">{liveUpdate ? 'بث مباشر نشط' : 'البث متوقف'}</span>
            </button>
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-900 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950" />
            </button>
            <div className="h-8 w-px bg-slate-800" />
            <button onClick={onBack} className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all group">
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <OverviewTab stats={stats} gmvTrend={GMV_TREND} />
          )}

          {activeTab === 'transactions' && (
            <TransactionsTab 
              {...{ searchQuery, setSearchQuery, filterType, setFilterType, showFilters, setShowFilters, paginatedTransactions, currentPage, setCurrentPage, totalPages }}
            />
          )}

          {activeTab === 'risk' && (
            <RiskTab riskMap={riskMap} />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalyticsTab transactionTypes={TRANSACTION_TYPES} settlementTimes={SETTLEMENT_TIMES} />
          )}

          {activeTab === 'audit' && (
            <AuditTab auditLog={auditLog} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
