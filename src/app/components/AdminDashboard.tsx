import { useState, useEffect } from 'react';
import {
  Globe, DollarSign, TrendingUp, AlertTriangle, Activity, Users, Package,
  Wallet, Settings, Download, Search, Filter, Bell, Clock, CheckCircle,
  XCircle, TrendingDown, BarChart3, PieChart, MapPin, Zap, FileText,
  ChevronDown, Calendar, ArrowUpRight, ArrowDownRight, Eye, ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  onBack: () => void;
}

// Static chart data — kept outside the component so recharts gets stable
// references and doesn't churn keys on every parent rerender.
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
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [liveUpdate, setLiveUpdate] = useState(true);

  // Simulated live stats with auto-update
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

  // Auto-update stats every 5 seconds
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
    { retailer: 'متجر الوفاء', risk: 'عالي', color: 'bg-red-500', score: 45, credit: 100000, used: 98000 },
    { retailer: 'سوبر ماركت البركة', risk: 'منخفض', color: 'bg-green-500', score: 91, credit: 280000, used: 145000 },
  ];

  const allTransactions = [
    { id: 'TX-8821', from: 'غرفة المقاصة', to: 'مصنع الحبوب', amount: 425000, type: 'تسوية', time: 'منذ 5 دقائق', status: 'مكتمل', fee: 4250 },
    { id: 'TX-8820', from: 'متجر الأمل', to: 'غرفة المقاصة', amount: 120000, type: 'ائتمان', time: 'منذ 12 دقيقة', status: 'مكتمل', fee: 1200 },
    { id: 'TX-8819', from: 'غرفة المقاصة', to: 'مصنع السلوى', amount: 360000, type: 'تسوية', time: 'منذ 18 دقيقة', status: 'مكتمل', fee: 3600 },
    { id: 'TX-8818', from: 'سوبر ماركت النور', to: 'غرفة المقاصة', amount: 95000, type: 'ائتمان', time: 'منذ 25 دقيقة', status: 'مكتمل', fee: 950 },
    { id: 'TX-8817', from: 'غرفة المقاصة', to: 'مصنع الألبان', amount: 280000, type: 'تسوية', time: 'منذ 32 دقيقة', status: 'قيد المعالجة', fee: 2800 },
    { id: 'TX-8816', from: 'بقالة السلام', to: 'غرفة المقاصة', amount: 75000, type: 'ائتمان', time: 'منذ 45 دقيقة', status: 'مكتمل', fee: 750 },
    { id: 'TX-8815', from: 'غرفة المقاصة', to: 'مصنع المشروبات', amount: 520000, type: 'تسوية', time: 'منذ ساعة', status: 'مكتمل', fee: 5200 },
    { id: 'TX-8814', from: 'محلات الفرح', to: 'غرفة المقاصة', amount: 165000, type: 'ائتمان', time: 'منذ ساعة و10 دقائق', status: 'مكتمل', fee: 1650 },
  ];

  const gmvTrend = GMV_TREND;
  const transactionTypes = TRANSACTION_TYPES;
  const settlementTimes = SETTLEMENT_TIMES;

  // Audit log
  const auditLog = [
    { id: 1, action: 'تسوية مالية', user: 'النظام الآلي', target: 'TX-8821', time: 'منذ 5 دقائق', type: 'settlement' },
    { id: 2, action: 'موافقة ائتمان', user: 'أحمد المدير', target: 'متجر الأمل', time: 'منذ 15 دقيقة', type: 'approval' },
    { id: 3, action: 'تحديث حد ائتماني', user: 'سارة المالية', target: 'سوبر ماركت النور', time: 'منذ 23 دقيقة', type: 'update' },
    { id: 4, action: 'تسوية مالية', user: 'النظام الآلي', target: 'TX-8819', time: 'منذ 28 دقيقة', type: 'settlement' },
    { id: 5, action: 'إضافة مستخدم', user: 'أحمد المدير', target: 'محمد السائق', time: 'منذ 35 دقيقة', type: 'user' },
  ];

  // Filter transactions
  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.to.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'transactions', label: 'المعاملات', icon: Wallet },
    { id: 'risk', label: 'إدارة المخاطر', icon: AlertTriangle },
    { id: 'analytics', label: 'التحليلات', icon: PieChart },
    { id: 'audit', label: 'سجل التدقيق', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white" dir="rtl">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>العودة</span>
              </button>
              <div className="w-px h-6 bg-slate-700" />
              <h1 className="text-2xl bg-gradient-to-l from-blue-400 to-sky-400 bg-clip-text text-transparent">
                غرفة المقاصة - C-Route
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLiveUpdate(!liveUpdate)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  liveUpdate
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <Activity className={`w-4 h-4 ${liveUpdate ? 'animate-pulse' : ''}`} />
                <span className="text-sm">{liveUpdate ? 'مباشر' : 'متوقف'}</span>
              </button>
              <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slate-400" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50 sticky top-[73px] z-40">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 transition-all relative ${
                    activeTab === tab.id
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-l from-blue-400 to-sky-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm text-blue-200">إجمالي حجم التداول</h3>
                      <DollarSign className="w-8 h-8 text-blue-200" />
                    </div>
                    <p className="text-4xl mb-2">{stats.gmv.toLocaleString()}</p>
                    <p className="text-sm text-blue-200">ريال يمني</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-blue-200">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>+12.5% من الأمس</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm text-green-200">التسويات اليومية</h3>
                      <TrendingUp className="w-8 h-8 text-green-200" />
                    </div>
                    <p className="text-4xl mb-2">{stats.dailySettlements.toLocaleString()}</p>
                    <p className="text-sm text-green-200">ريال يمني</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-green-200">
                      <Clock className="w-3 h-3" />
                      <span>متوسط {stats.avgSettlementTime} ساعة</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm text-blue-200">متوسط التوفير</h3>
                      <TrendingDown className="w-8 h-8 text-blue-200" />
                    </div>
                    <p className="text-4xl mb-2">{stats.costSavings}%</p>
                    <p className="text-sm text-blue-200">في تكاليف الشحن</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-blue-200">
                      <Zap className="w-3 h-3" />
                      <span>مسارات تعاونية</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm text-amber-200">رسوم المنصة</h3>
                      <Wallet className="w-8 h-8 text-amber-200" />
                    </div>
                    <p className="text-4xl mb-2">{stats.platformFee.toLocaleString()}</p>
                    <p className="text-sm text-amber-200">ريال يمني (اليوم)</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-amber-200">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>+8.3% من الأمس</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* GMV Trend Chart */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-blue-400" />
                      اتجاه حجم التداول (آخر 7 أيام)
                    </h2>
                    <button className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>تصدير</span>
                    </button>
                  </div>
                  <ResponsiveContainer width="100%" height={300} key="gmv-chart">
                    <AreaChart data={gmvTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          direction: 'rtl'
                        }}
                        labelStyle={{ color: '#F1F5F9' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="gmv"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fill="#3B82F6"
                        fillOpacity={0.2}
                        name="حجم التداول"
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Live Activity */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <h2 className="text-xl mb-6 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-green-400" />
                    النشاط المباشر
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm">المستخدمون النشطون</div>
                          <div className="text-xs text-slate-400">في الوقت الحالي</div>
                        </div>
                      </div>
                      <div className="text-2xl text-blue-400">{stats.activeUsers}</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Package className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <div className="text-sm">الشحنات النشطة</div>
                          <div className="text-xs text-slate-400">قيد التوصيل</div>
                        </div>
                      </div>
                      <div className="text-2xl text-green-400">{stats.activeShipments}</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm">المعاملات اليوم</div>
                          <div className="text-xs text-slate-400">إجمالي</div>
                        </div>
                      </div>
                      <div className="text-2xl text-blue-400">{stats.totalTransactions}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* World Map */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl flex items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-400" />
                    الحركة اللوجستية - اليمن
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-400">تحديث مباشر</div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="relative h-96 bg-gradient-to-br from-slate-950 to-blue-950 rounded-xl overflow-hidden border border-slate-800/50">
                  <div className="absolute inset-0">
                    <svg className="absolute inset-0 w-full h-full">
                      {/* Sanaa */}
                      <motion.circle
                        key="city-sanaa"
                        cx="40%" cy="45%" r="8" fill="#3B82F6" opacity="0.8"
                        animate={{ r: [8, 14, 8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      {/* Aden */}
                      <motion.circle
                        key="city-aden"
                        cx="60%" cy="65%" r="6" fill="#10B981" opacity="0.8"
                        animate={{ r: [6, 12, 6] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      />
                      {/* Taiz */}
                      <motion.circle
                        key="city-taiz"
                        cx="50%" cy="55%" r="7" fill="#F59E0B" opacity="0.8"
                        animate={{ r: [7, 13, 7] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      />
                      {/* Hodeidah */}
                      <motion.circle
                        key="city-hodeidah"
                        cx="30%" cy="52%" r="6" fill="#8B5CF6" opacity="0.8"
                        animate={{ r: [6, 11, 6] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                      />

                      {/* Animated Routes */}
                      <motion.line
                        key="route-1"
                        x1="40%" y1="45%" x2="60%" y2="65%"
                        stroke="#3B82F6" strokeWidth="2"
                        strokeDasharray="8,4" opacity="0.5"
                        animate={{ strokeDashoffset: [0, -12] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      />
                      <motion.line
                        key="route-2"
                        x1="40%" y1="45%" x2="50%" y2="55%"
                        stroke="#10B981" strokeWidth="2"
                        strokeDasharray="8,4" opacity="0.5"
                        animate={{ strokeDashoffset: [0, -12] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.3 }}
                      />
                      <motion.line
                        key="route-3"
                        x1="30%" y1="52%" x2="40%" y2="45%"
                        stroke="#8B5CF6" strokeWidth="2"
                        strokeDasharray="8,4" opacity="0.5"
                        animate={{ strokeDashoffset: [0, -12] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.6 }}
                      />
                      <motion.line
                        key="route-4"
                        x1="50%" y1="55%" x2="60%" y2="65%"
                        stroke="#F59E0B" strokeWidth="2"
                        strokeDasharray="8,4" opacity="0.5"
                        animate={{ strokeDashoffset: [0, -12] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.9 }}
                      />
                    </svg>

                    {/* City Labels */}
                    <div className="absolute" style={{ top: '43%', right: '38%' }}>
                      <div className="bg-slate-900/90 backdrop-blur border border-blue-500/30 px-3 py-1.5 rounded-lg text-sm">
                        <div className="text-blue-400 mb-0.5">صنعاء</div>
                        <div className="text-xs text-slate-400">48 شحنة نشطة</div>
                      </div>
                    </div>
                    <div className="absolute" style={{ top: '63%', right: '58%' }}>
                      <div className="bg-slate-900/90 backdrop-blur border border-green-500/30 px-3 py-1.5 rounded-lg text-sm">
                        <div className="text-green-400 mb-0.5">عدن</div>
                        <div className="text-xs text-slate-400">23 شحنة نشطة</div>
                      </div>
                    </div>
                    <div className="absolute" style={{ top: '53%', right: '48%' }}>
                      <div className="bg-slate-900/90 backdrop-blur border border-amber-500/30 px-3 py-1.5 rounded-lg text-sm">
                        <div className="text-amber-400 mb-0.5">تعز</div>
                        <div className="text-xs text-slate-400">12 شحنة نشطة</div>
                      </div>
                    </div>
                    <div className="absolute" style={{ top: '50%', right: '28%' }}>
                      <div className="bg-slate-900/90 backdrop-blur border border-blue-500/30 px-3 py-1.5 rounded-lg text-sm">
                        <div className="text-blue-400 mb-0.5">الحديدة</div>
                        <div className="text-xs text-slate-400">6 شحنات نشطة</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
                    <div className="bg-slate-900/80 backdrop-blur border border-slate-700/50 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-slate-400">شحنات نشطة</span>
                      </div>
                      <div className="text-xl text-blue-400">{stats.activeShipments}</div>
                    </div>
                    <div className="bg-slate-900/80 backdrop-blur border border-slate-700/50 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-slate-400">مدن مغطاة</span>
                      </div>
                      <div className="text-xl text-green-400">4</div>
                    </div>
                    <div className="bg-slate-900/80 backdrop-blur border border-slate-700/50 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-slate-400">متوسط التوفير</span>
                      </div>
                      <div className="text-xl text-blue-400">30%</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-green-400" />
                  المعاملات المالية
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-colors text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    <span>فلاتر</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    <span>تصدير</span>
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ابحث برقم المعاملة، المرسل، أو المستلم..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-3"
                  >
                    {['all', 'تسوية', 'ائتمان'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          filterType === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {type === 'all' ? 'الكل' : type}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm text-slate-400">رقم المعاملة</th>
                      <th className="px-4 py-3 text-right text-sm text-slate-400">من</th>
                      <th className="px-4 py-3 text-right text-sm text-slate-400">إلى</th>
                      <th className="px-4 py-3 text-right text-sm text-slate-400">المبلغ</th>
                      <th className="px-4 py-3 text-right text-sm text-slate-400">الرسوم</th>
                      <th className="px-4 py-3 text-right text-sm text-slate-400">النوع</th>
                      <th className="px-4 py-3 text-right text-sm text-slate-400">الحالة</th>
                      <th className="px-4 py-3 text-right text-sm text-slate-400">الوقت</th>
                      <th className="px-4 py-3 text-right text-sm text-slate-400">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {paginatedTransactions.map((tx) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-4 text-blue-400 font-mono text-sm">{tx.id}</td>
                        <td className="px-4 py-4 text-sm">{tx.from}</td>
                        <td className="px-4 py-4 text-sm">{tx.to}</td>
                        <td className="px-4 py-4 text-green-400 text-sm">{tx.amount.toLocaleString()} ر.ي</td>
                        <td className="px-4 py-4 text-amber-400 text-sm">{tx.fee.toLocaleString()} ر.ي</td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            tx.type === 'تسوية'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                            tx.status === 'مكتمل'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {tx.status === 'مكتمل' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-400 text-sm">{tx.time}</td>
                        <td className="px-4 py-4">
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  عرض {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} من {filteredTransactions.length} معاملة
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'risk' && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Credit Risk Monitor */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <h2 className="text-xl mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    مراقبة مخاطر الائتمان
                  </h2>

                  <div className="space-y-4">
                    {riskMap.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-800/50 rounded-xl p-5 hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                            <span className="text-lg">{item.retailer}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-slate-400">الحد الائتماني</div>
                              <div className="text-sm">{item.credit.toLocaleString()} ر.ي</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-400">المستخدم</div>
                              <div className="text-sm text-amber-400">{item.used.toLocaleString()} ر.ي</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-700 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${item.color} transition-all duration-500`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-400 w-12 text-left">{item.score}/100</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.risk === 'منخفض' ? 'bg-green-500/20 text-green-400' :
                            item.risk === 'متوسط' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            مخاطر {item.risk}
                          </span>
                          <span className="text-xs text-slate-400">
                            متاح: {(item.credit - item.used).toLocaleString()} ر.ي
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Risk Summary */}
                <div className="space-y-6">
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                    <h3 className="text-lg mb-4">ملخص المخاطر</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm">منخفض</span>
                        </div>
                        <span className="text-xl text-green-400">4</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">متوسط</span>
                        </div>
                        <span className="text-xl text-yellow-400">1</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-sm">عالي</span>
                        </div>
                        <span className="text-xl text-red-400">1</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                    <h3 className="text-lg mb-4">إجمالي الائتمان</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">إجمالي الحدود</span>
                          <span className="text-lg">1,280,000 ر.ي</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">المستخدم</span>
                          <span className="text-lg text-amber-400">768,000 ر.ي</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">المتاح</span>
                          <span className="text-lg text-green-400">512,000 ر.ي</span>
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-full h-3">
                        <div className="bg-gradient-to-l from-amber-500 to-amber-600 h-3 rounded-full" style={{ width: '60%' }} />
                      </div>
                      <div className="text-sm text-slate-400 text-center">60% مستخدم</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transaction Types Distribution */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl flex items-center gap-2">
                      <PieChart className="w-6 h-6 text-blue-400" />
                      توزيع أنواع المعاملات
                    </h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300} key="pie-chart">
                    <RechartsPie>
                      <Pie
                        data={transactionTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {transactionTypes.map((entry, index) => (
                          <Cell key={`pie-cell-${entry.name}-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          direction: 'rtl'
                        }}
                      />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {transactionTypes.map((type) => (
                      <div key={type.name} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                          <span className="text-sm text-slate-400">{type.name}</span>
                        </div>
                        <div className="text-xl">{type.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settlement Time Distribution */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl flex items-center gap-2">
                      <Clock className="w-6 h-6 text-blue-400" />
                      توزيع أوقات التسوية
                    </h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300} key="settlement-chart">
                    <BarChart data={settlementTimes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="range" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          direction: 'rtl'
                        }}
                      />
                      <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} name="عدد المعاملات" isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-400">متوسط وقت التسوية</span>
                    </div>
                    <div className="text-3xl text-blue-400">{stats.avgSettlementTime} ساعة</div>
                    <div className="text-xs text-slate-400 mt-1">أسرع بـ 97% من النظام التقليدي (60 يوم)</div>
                  </div>
                </div>

                {/* Transactions Trend */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                      اتجاه المعاملات (آخر 7 أيام)
                    </h2>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">أسبوعي</button>
                      <button className="px-3 py-1 text-sm text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">شهري</button>
                      <button className="px-3 py-1 text-sm text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">سنوي</button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300} key="transactions-trend-chart">
                    <LineChart data={gmvTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          direction: 'rtl'
                        }}
                      />
                      <Line type="monotone" dataKey="transactions" stroke="#10B981" strokeWidth={3} name="المعاملات" isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  سجل التدقيق
                </h2>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-colors text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>فلترة بالتاريخ</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    <span>تصدير السجل</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {auditLog.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: log.id * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800/70 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      log.type === 'settlement' ? 'bg-green-500/20' :
                      log.type === 'approval' ? 'bg-blue-500/20' :
                      log.type === 'update' ? 'bg-amber-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      {log.type === 'settlement' && <DollarSign className="w-5 h-5 text-green-400" />}
                      {log.type === 'approval' && <CheckCircle className="w-5 h-5 text-blue-400" />}
                      {log.type === 'update' && <Settings className="w-5 h-5 text-amber-400" />}
                      {log.type === 'user' && <Users className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{log.action}</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-blue-400">{log.target}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Users className="w-3 h-3" />
                        <span>{log.user}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{log.time}</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-slate-400" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
