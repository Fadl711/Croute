import { useState, useMemo } from 'react';
import {
  ChevronLeft, LayoutDashboard, Package, GitMerge, UserCheck,
  Truck, Wallet, Plus, ArrowRight, Check, Clock, DollarSign,
  TrendingDown, Activity, Star, Zap, Lock, Unlock, RefreshCw,
  CircleDot, AlertCircle, Layers, Send, Search, X, MoreHorizontal,
  Eye, Trash2, Download, ArrowUpDown, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from '../../imports/c-route-logo.png';

interface CRouteMVPProps {
  onBack: () => void;
}

type ShipmentStatus = 'created' | 'assigned' | 'in_transit' | 'delivered';
type FundsStatus = 'INIT' | 'HELD' | 'LOCKED' | 'RELEASED';

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  size: number; // m³
  type: string;
  timeWindow: string;
  cost: number; // YER
  status: ShipmentStatus;
  funds: FundsStatus;
  routeId?: string;
  distributorId?: string;
  createdAt: string;
}

interface Distributor {
  id: string;
  name: string;
  pricePerM3: number;
  rating: number;
  available: boolean;
  capacity: number;
  city: string;
}

interface Route {
  id: string;
  shipmentIds: string[];
  consolidatedCost: number;
  distributorId?: string;
  status: ShipmentStatus;
}

const CITIES = ['صنعاء', 'عدن', 'تعز', 'الحديدة', 'إب', 'المكلا'];
const TYPES = ['مواد غذائية', 'مشروبات', 'حبوب', 'زيوت', 'ألبان'];

const RATE_PER_M3 = 18000; // YER
const PLATFORM_FEE_PCT = 0.10;
const DRIVER_PCT = 0.20;
const DISTRIBUTOR_PCT = 0.70;

const initialDistributors: Distributor[] = [
  { id: 'D-001', name: 'النقل السريع', pricePerM3: 14500, rating: 4.8, available: true, capacity: 24, city: 'صنعاء' },
  { id: 'D-002', name: 'مسارات اليمن', pricePerM3: 13800, rating: 4.6, available: true, capacity: 18, city: 'صنعاء' },
  { id: 'D-003', name: 'البركة للوجستيات', pricePerM3: 15200, rating: 4.9, available: true, capacity: 30, city: 'عدن' },
  { id: 'D-004', name: 'الأمين للنقل', pricePerM3: 12900, rating: 4.4, available: false, capacity: 16, city: 'تعز' },
  { id: 'D-005', name: 'شبكة الجنوب', pricePerM3: 14200, rating: 4.7, available: true, capacity: 22, city: 'عدن' },
];

const initialShipments: Shipment[] = [
  { id: 'SH-2401', origin: 'مصنع الحبوب — صنعاء', destination: 'عدن', size: 4.5, type: 'حبوب', timeWindow: '2026-05-02 / 08:00-14:00', cost: 81000, status: 'created', funds: 'HELD', createdAt: '2026-04-29' },
  { id: 'SH-2402', origin: 'مصنع الحبوب — صنعاء', destination: 'عدن', size: 3.0, type: 'حبوب', timeWindow: '2026-05-02 / 09:00-15:00', cost: 54000, status: 'created', funds: 'HELD', createdAt: '2026-04-29' },
  { id: 'SH-2403', origin: 'مصنع الزيوت — صنعاء', destination: 'عدن', size: 2.2, type: 'زيوت', timeWindow: '2026-05-02 / 10:00-16:00', cost: 39600, status: 'created', funds: 'HELD', createdAt: '2026-04-29' },
  { id: 'SH-2404', origin: 'مصنع الألبان — صنعاء', destination: 'تعز', size: 5.8, type: 'ألبان', timeWindow: '2026-05-03 / 06:00-12:00', cost: 104400, status: 'assigned', funds: 'LOCKED', distributorId: 'D-004', createdAt: '2026-04-28' },
  { id: 'SH-2405', origin: 'مصنع الحبوب — صنعاء', destination: 'الحديدة', size: 6.4, type: 'حبوب', timeWindow: '2026-05-01 / 07:00-13:00', cost: 115200, status: 'in_transit', funds: 'LOCKED', distributorId: 'D-001', createdAt: '2026-04-28' },
  { id: 'SH-2406', origin: 'مصنع الزيوت — صنعاء', destination: 'تعز', size: 3.6, type: 'زيوت', timeWindow: '2026-04-30 / 08:00-14:00', cost: 64800, status: 'delivered', funds: 'RELEASED', distributorId: 'D-004', createdAt: '2026-04-27' },
];

const STATUS_META: Record<ShipmentStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  created: { label: 'تم الإنشاء', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', dot: 'bg-slate-400' },
  assigned: { label: 'تم الإسناد', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
  in_transit: { label: 'قيد التوصيل', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500' },
  delivered: { label: 'تم التسليم', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500' },
};

const FUNDS_META: Record<FundsStatus, { label: string; cls: string }> = {
  INIT: { label: 'INIT', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
  HELD: { label: 'HELD', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  LOCKED: { label: 'LOCKED', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  RELEASED: { label: 'RELEASED', cls: 'bg-green-50 text-green-700 border-green-200' },
};

const fmt = (n: number) => n.toLocaleString('en-US');

export default function CRouteMVP({ onBack }: CRouteMVPProps) {
  const [tab, setTab] = useState<'dashboard' | 'shipments' | 'consolidation' | 'assignment' | 'tracking' | 'clearing'>('dashboard');
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [distributors] = useState<Distributor[]>(initialDistributors);
  const [activity, setActivity] = useState<{ id: string; text: string; time: string; tone: string }[]>([
    { id: 'a1', text: 'الشحنة SH-2406 تم تسليمها — تسوية ٦٤٬٨٠٠ ر.ي', time: 'منذ ١٢د', tone: 'green' },
    { id: 'a2', text: 'الشحنة SH-2405 انطلقت إلى الحديدة', time: 'منذ ٤٥د', tone: 'orange' },
    { id: 'a3', text: 'إسناد SH-2404 إلى الأمين للنقل', time: 'منذ ١ﺳ', tone: 'blue' },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);
  const [trackingId, setTrackingId] = useState<string>('SH-2405');
  const [clearingId, setClearingId] = useState<string>('SH-2406');

  // Shipment management state
  const [shipSearch, setShipSearch] = useState('');
  const [shipFilter, setShipFilter] = useState<'all' | ShipmentStatus>('all');
  const [shipSort, setShipSort] = useState<'newest' | 'cost_desc' | 'cost_asc'>('newest');
  const [shipSelected, setShipSelected] = useState<string[]>([]);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // ============== Derived KPIs ==============
  const totalShipments = shipments.length;
  const activeRoutes = routes.length + shipments.filter(s => s.status === 'in_transit' && !s.routeId).length;
  const fundsHeld = shipments.filter(s => s.funds === 'HELD' || s.funds === 'LOCKED').reduce((sum, s) => sum + s.cost, 0);
  const baselineCost = shipments.reduce((sum, s) => sum + s.cost, 0);
  const consolidatedSavings = routes.reduce((sum, r) => {
    const original = r.shipmentIds.reduce((acc, id) => acc + (shipments.find(s => s.id === id)?.cost || 0), 0);
    return sum + (original - r.consolidatedCost);
  }, 0);
  const savingsPct = baselineCost > 0 ? (consolidatedSavings / baselineCost) * 100 : 0;

  // ============== Helpers ==============
  const pushActivity = (text: string, tone: string) => {
    setActivity(prev => [{ id: `a${Date.now()}`, text, time: 'الآن', tone }, ...prev].slice(0, 8));
  };

  const updateShipment = (id: string, patch: Partial<Shipment>) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const deleteShipment = (id: string) => {
    setShipments(prev => prev.filter(s => s.id !== id));
    setShipSelected(prev => prev.filter(x => x !== id));
    pushActivity(`حُذفت الشحنة ${id}`, 'slate');
  };

  const exportCSV = (rows: Shipment[]) => {
    const header = ['id', 'origin', 'destination', 'size', 'type', 'status', 'funds', 'cost', 'distributor', 'createdAt'];
    const lines = rows.map(s => [
      s.id, s.origin, s.destination, s.size, s.type, s.status, s.funds, s.cost,
      distributors.find(d => d.id === s.distributorId)?.name || '', s.createdAt
    ].join(','));
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `shipments-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const filteredShipments = useMemo(() => {
    let rows = shipments;
    if (shipFilter !== 'all') rows = rows.filter(s => s.status === shipFilter);
    if (shipSearch.trim()) {
      const q = shipSearch.trim().toLowerCase();
      rows = rows.filter(s =>
        s.id.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
      );
    }
    rows = [...rows];
    if (shipSort === 'newest') rows.sort((a, b) => b.id.localeCompare(a.id));
    if (shipSort === 'cost_desc') rows.sort((a, b) => b.cost - a.cost);
    if (shipSort === 'cost_asc') rows.sort((a, b) => a.cost - b.cost);
    return rows;
  }, [shipments, shipSearch, shipFilter, shipSort]);

  const statusCounts = useMemo(() => ({
    all: shipments.length,
    created: shipments.filter(s => s.status === 'created').length,
    assigned: shipments.filter(s => s.status === 'assigned').length,
    in_transit: shipments.filter(s => s.status === 'in_transit').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
  }), [shipments]);

  const allFilteredSelected = filteredShipments.length > 0 && filteredShipments.every(s => shipSelected.includes(s.id));
  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setShipSelected(prev => prev.filter(id => !filteredShipments.find(s => s.id === id)));
    } else {
      setShipSelected(prev => Array.from(new Set([...prev, ...filteredShipments.map(s => s.id)])));
    }
  };
  const toggleSelectOne = (id: string) => {
    setShipSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const bulkAdvance = () => {
    shipSelected.forEach(id => advanceState(id));
    setShipSelected([]);
  };
  const bulkDelete = () => {
    if (!confirm(`حذف ${shipSelected.length} شحنة؟`)) return;
    shipSelected.forEach(id => {
      setShipments(prev => prev.filter(s => s.id !== id));
    });
    setShipSelected([]);
  };
  const quickAssignBest = (id: string) => {
    const s = shipments.find(x => x.id === id);
    if (!s) return;
    const candidate = [...distributors]
      .filter(d => d.available && d.capacity >= s.size)
      .sort((a, b) => (a.pricePerM3 - b.pricePerM3))[0];
    if (!candidate) {
      pushActivity(`لا يوجد موزّع متاح لـ ${id}`, 'amber');
      return;
    }
    handleAssign(id, candidate.id);
  };

  // ============== Create Shipment ==============
  const [form, setForm] = useState({
    origin: 'مصنع الحبوب — صنعاء',
    destination: 'عدن',
    timeWindow: '2026-05-04 / 08:00-14:00',
    size: 3.5,
    type: 'حبوب',
  });
  const pricePreview = Math.round(form.size * RATE_PER_M3);

  const handleCreate = () => {
    const id = `SH-${2407 + shipments.filter(s => s.id.startsWith('SH-24')).length - initialShipments.length}`;
    const newId = `SH-${(2406 + shipments.length - initialShipments.length + 1).toString()}`;
    const ship: Shipment = {
      id: newId,
      origin: form.origin,
      destination: form.destination,
      size: form.size,
      type: form.type,
      timeWindow: form.timeWindow,
      cost: pricePreview,
      status: 'created',
      funds: 'HELD',
      createdAt: '2026-04-30',
    };
    setShipments(prev => [ship, ...prev]);
    pushActivity(`شحنة جديدة ${newId} — ${form.destination} • ${fmt(pricePreview)} ر.ي`, 'blue');
    setShowCreate(false);
  };

  // ============== Consolidation ==============
  const mergeCandidates = useMemo(() => {
    // Group created shipments by destination + same-day window
    const groups: Record<string, Shipment[]> = {};
    shipments.filter(s => s.status === 'created' && !s.routeId).forEach(s => {
      const day = s.timeWindow.split(' / ')[0];
      const key = `${s.destination}__${day}`;
      groups[key] = groups[key] || [];
      groups[key].push(s);
    });
    return Object.entries(groups).filter(([, arr]) => arr.length >= 2);
  }, [shipments]);

  const toggleMergeSelect = (id: string) => {
    setSelectedForMerge(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleMerge = (ids: string[]) => {
    const selected = shipments.filter(s => ids.includes(s.id));
    if (selected.length < 2) return;
    const totalSize = selected.reduce((a, b) => a + b.size, 0);
    const original = selected.reduce((a, b) => a + b.cost, 0);
    // Consolidation discount: pay base rate on total size + 18% efficiency cut
    const consolidated = Math.round(totalSize * RATE_PER_M3 * 0.82);
    const routeId = `RT-${100 + routes.length + 1}`;
    setRoutes(prev => [...prev, { id: routeId, shipmentIds: ids, consolidatedCost: consolidated, status: 'created' }]);
    setShipments(prev => prev.map(s => ids.includes(s.id) ? { ...s, routeId } : s));
    pushActivity(`دمج ${ids.length} شحنات في ${routeId} — توفير ${fmt(original - consolidated)} ر.ي`, 'green');
    setSelectedForMerge([]);
  };

  // ============== Assignment ==============
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const unassigned = shipments.filter(s => s.status === 'created');
  const assignableTarget = assignTarget || unassigned[0]?.id || null;

  const handleAssign = (shipmentId: string, distributorId: string) => {
    const dist = distributors.find(d => d.id === distributorId);
    updateShipment(shipmentId, { status: 'assigned', funds: 'LOCKED', distributorId });
    pushActivity(`إسناد ${shipmentId} إلى ${dist?.name}`, 'blue');
  };

  // ============== Tracking — state machine ==============
  const trackingShip = shipments.find(s => s.id === trackingId);
  const advanceState = (id: string) => {
    const s = shipments.find(x => x.id === id);
    if (!s) return;
    const order: ShipmentStatus[] = ['created', 'assigned', 'in_transit', 'delivered'];
    const next = order[order.indexOf(s.status) + 1];
    if (!next) return;
    const patch: Partial<Shipment> = { status: next };
    if (next === 'delivered') patch.funds = 'RELEASED';
    if (next === 'in_transit') patch.funds = 'LOCKED';
    updateShipment(id, patch);
    pushActivity(`${id} → ${STATUS_META[next].label}`, next === 'delivered' ? 'green' : next === 'in_transit' ? 'orange' : 'blue');
  };

  const resetState = (id: string) => {
    updateShipment(id, { status: 'created', funds: 'HELD', distributorId: undefined });
    pushActivity(`${id} أُعيد إلى حالة الإنشاء`, 'slate');
  };

  // ============== Clearing ==============
  const clearingShip = shipments.find(s => s.id === clearingId);
  const ledger = clearingShip ? {
    distributor: Math.round(clearingShip.cost * DISTRIBUTOR_PCT),
    driver: Math.round(clearingShip.cost * DRIVER_PCT),
    platform: Math.round(clearingShip.cost * PLATFORM_FEE_PCT),
  } : null;

  const simulatePayment = (id: string) => {
    updateShipment(id, { funds: 'HELD' });
    pushActivity(`دفعة ${id} وصلت إلى البنك (HELD)`, 'amber');
  };
  const releaseFunds = (id: string) => {
    const s = shipments.find(x => x.id === id);
    if (!s) return;
    if (s.status !== 'delivered') {
      updateShipment(id, { status: 'delivered', funds: 'RELEASED' });
    } else {
      updateShipment(id, { funds: 'RELEASED' });
    }
    pushActivity(`الإفراج عن أموال ${id} — توزيع ${fmt(s.cost)} ر.ي`, 'green');
  };

  const tabs = [
    { id: 'dashboard', label: 'لوحة الأدمن', icon: LayoutDashboard },
    { id: 'shipments', label: 'إدارة الشحنات', icon: Package },
    { id: 'consolidation', label: 'محرّك الدمج', icon: GitMerge },
    { id: 'assignment', label: 'الإسناد', icon: UserCheck },
    { id: 'tracking', label: 'التتبّع', icon: Truck },
    { id: 'clearing', label: 'غرفة المقاصة', icon: Wallet },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1500px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoImg} alt="C-Route" className="h-8 w-auto" />
            <div className="w-px h-5 bg-slate-200" />
            <button onClick={onBack} className="text-slate-500 hover:text-slate-900 flex items-center gap-1.5 text-sm">
              <ChevronLeft className="w-4 h-4" />
              العودة
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest text-slate-400">MVP</span>
              <h1 className="text-base text-slate-900">منصة C-Route — غرفة المقاصة اللوجستية</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-[11px] text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              النظام مباشر
            </span>
            <div className="text-xs text-slate-500">Admin · C-Route Operator</div>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-[1500px] mx-auto px-6 flex gap-0 border-t border-slate-100">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-4 py-3 text-sm flex items-center gap-2 transition-colors ${
                  active ? 'text-[#1A73E8]' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {active && <motion.div layoutId="mvpTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A73E8]" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {/* ============================ DASHBOARD ============================ */}
          {tab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Kpi label="إجمالي الشحنات" value={fmt(totalShipments)} icon={Package} tone="slate" />
                <Kpi label="المسارات النشطة" value={fmt(activeRoutes)} icon={Activity} tone="blue" />
                <Kpi label="نسبة التوفير" value={`${savingsPct.toFixed(1)}٪`} icon={TrendingDown} tone="green" sub={`${fmt(consolidatedSavings)} ر.ي`} />
                <Kpi label="أموال محتجزة (Clearing)" value={fmt(fundsHeld)} icon={Lock} tone="amber" sub="ر.ي عند البنك" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-slate-900">توزيع حالات الشحنات</h3>
                    <span className="text-xs text-slate-400">live</span>
                  </div>
                  <div className="space-y-2">
                    {(['created', 'assigned', 'in_transit', 'delivered'] as ShipmentStatus[]).map(st => {
                      const count = shipments.filter(s => s.status === st).length;
                      const pct = totalShipments > 0 ? (count / totalShipments) * 100 : 0;
                      const m = STATUS_META[st];
                      return (
                        <div key={st} className="flex items-center gap-3">
                          <div className="w-28 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${m.dot}`} />
                            <span className="text-xs text-slate-700">{m.label}</span>
                          </div>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${m.dot}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 tabular-nums w-8 text-left">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-slate-900">حالة الأموال</h3>
                    <Wallet className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="space-y-3">
                    {(['HELD', 'LOCKED', 'RELEASED'] as FundsStatus[]).map(f => {
                      const total = shipments.filter(s => s.funds === f).reduce((a, b) => a + b.cost, 0);
                      const count = shipments.filter(s => s.funds === f).length;
                      return (
                        <div key={f} className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-md border text-[11px] ${FUNDS_META[f].cls}`}>{f}</span>
                          <div className="text-left">
                            <div className="text-sm text-slate-900 tabular-nums">{fmt(total)}</div>
                            <div className="text-[10px] text-slate-400">{count} معاملة</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-slate-900">النشاط المباشر</h3>
                  <span className="text-[10px] tracking-widest text-slate-400">LIVE FEED</span>
                </div>
                <div className="space-y-2">
                  {activity.map(a => (
                    <div key={a.id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        a.tone === 'green' ? 'bg-green-500' : a.tone === 'orange' ? 'bg-orange-500' :
                        a.tone === 'blue' ? 'bg-blue-500' : a.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      <span className="text-sm text-slate-700 flex-1">{a.text}</span>
                      <span className="text-[11px] text-slate-400">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================ SHIPMENTS ============================ */}
          {tab === 'shipments' && (
            <motion.div key="shipments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg text-slate-900">إدارة الشحنات</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{shipments.length} شحنة في النظام · {filteredShipments.length} ضمن الفلتر الحالي</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportCSV(filteredShipments)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    تصدير CSV
                  </button>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="px-4 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-lg text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    إنشاء شحنة
                  </button>
                </div>
              </div>

              {/* Filter chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {([
                  { id: 'all', label: 'الكل', count: statusCounts.all, dot: 'bg-slate-400' },
                  { id: 'created', label: 'تم الإنشاء', count: statusCounts.created, dot: STATUS_META.created.dot },
                  { id: 'assigned', label: 'تم الإسناد', count: statusCounts.assigned, dot: STATUS_META.assigned.dot },
                  { id: 'in_transit', label: 'قيد التوصيل', count: statusCounts.in_transit, dot: STATUS_META.in_transit.dot },
                  { id: 'delivered', label: 'تم التسليم', count: statusCounts.delivered, dot: STATUS_META.delivered.dot },
                ] as const).map(c => {
                  const active = shipFilter === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setShipFilter(c.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        active ? 'bg-[#0B1B3B] text-white border-[#0B1B3B]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      {c.label}
                      <span className={`tabular-nums ${active ? 'text-white/70' : 'text-slate-400'}`}>{c.count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Toolbar */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={shipSearch}
                    onChange={e => setShipSearch(e.target.value)}
                    placeholder="ابحث برقم الشحنة، الوجهة، النوع..."
                    className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1A73E8]"
                  />
                  {shipSearch && (
                    <button onClick={() => setShipSearch('')} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={shipSort}
                    onChange={e => setShipSort(e.target.value as any)}
                    className="px-2 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700"
                  >
                    <option value="newest">الأحدث</option>
                    <option value="cost_desc">الأعلى تكلفة</option>
                    <option value="cost_asc">الأقل تكلفة</option>
                  </select>
                </div>

                {shipSelected.length > 0 && (
                  <div className="flex items-center gap-2 ms-auto pl-2 border-r border-slate-200 pr-3">
                    <span className="text-xs text-slate-600">{shipSelected.length} محدّد</span>
                    <button
                      onClick={bulkAdvance}
                      className="px-3 py-1.5 text-xs bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-md flex items-center gap-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      تقدّم الحالة
                    </button>
                    <button
                      onClick={bulkDelete}
                      className="px-3 py-1.5 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md flex items-center gap-1 hover:bg-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف
                    </button>
                    <button onClick={() => setShipSelected([])} className="text-xs text-slate-500 hover:text-slate-900">إلغاء</button>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-right text-xs text-slate-500">
                      <th className="px-3 py-3 w-8">
                        <input
                          type="checkbox"
                          checked={allFilteredSelected}
                          onChange={toggleSelectAll}
                          className="rounded border-slate-300"
                        />
                      </th>
                      <th className="px-3 py-3">رقم الشحنة</th>
                      <th className="px-3 py-3">المنشأ → الوجهة</th>
                      <th className="px-3 py-3">الحجم / النوع</th>
                      <th className="px-3 py-3">الموزّع</th>
                      <th className="px-3 py-3">الحالة</th>
                      <th className="px-3 py-3">الأموال</th>
                      <th className="px-3 py-3 text-left">التكلفة (ر.ي)</th>
                      <th className="px-3 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShipments.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">
                          <Filter className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                          لا توجد شحنات مطابقة. جرّب تعديل الفلاتر أو البحث.
                        </td>
                      </tr>
                    )}
                    {filteredShipments.map(s => {
                      const m = STATUS_META[s.status];
                      const sel = shipSelected.includes(s.id);
                      const dist = distributors.find(d => d.id === s.distributorId);
                      const canAdvance = s.status !== 'delivered';
                      return (
                        <tr key={s.id} className={`border-b border-slate-100 hover:bg-slate-50/60 ${sel ? 'bg-blue-50/40' : ''}`}>
                          <td className="px-3 py-3">
                            <input
                              type="checkbox"
                              checked={sel}
                              onChange={() => toggleSelectOne(s.id)}
                              className="rounded border-slate-300"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <button onClick={() => setDrawerId(s.id)} className="text-[#1A73E8] tabular-nums hover:underline">{s.id}</button>
                            <div className="text-[10px] text-slate-400 mt-0.5">{s.createdAt}</div>
                          </td>
                          <td className="px-3 py-3 text-slate-700">
                            <div className="text-xs text-slate-500">{s.origin}</div>
                            <div className="flex items-center gap-1 text-sm"><ArrowRight className="w-3 h-3 text-slate-300" />{s.destination}</div>
                          </td>
                          <td className="px-3 py-3 text-slate-600">
                            <div className="tabular-nums">{s.size} م³</div>
                            <div className="text-xs text-slate-400">{s.type}</div>
                          </td>
                          <td className="px-3 py-3 text-slate-600 text-xs">
                            {dist ? dist.name : <span className="text-slate-400">— غير مُسند</span>}
                          </td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] ${m.bg} ${m.color} ${m.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                              {m.label}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`px-2 py-0.5 rounded-md border text-[10px] tabular-nums ${FUNDS_META[s.funds].cls}`}>{s.funds}</span>
                          </td>
                          <td className="px-3 py-3 text-slate-900 tabular-nums text-left">{fmt(s.cost)}</td>
                          <td className="px-3 py-3 relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)}
                              className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {openMenuId === s.id && (
                              <>
                                <div className="fixed inset-0 z-30" onClick={() => setOpenMenuId(null)} />
                                <div className="absolute left-0 top-10 z-40 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-sm">
                                  <MenuItem icon={Eye} label="عرض التفاصيل" onClick={() => { setDrawerId(s.id); setOpenMenuId(null); }} />
                                  {s.status === 'created' && (
                                    <MenuItem icon={Zap} label="إسناد سريع (الأرخص)" onClick={() => { quickAssignBest(s.id); setOpenMenuId(null); }} />
                                  )}
                                  {s.status === 'created' && (
                                    <MenuItem icon={UserCheck} label="اختر موزّعًا..." onClick={() => { setAssignTarget(s.id); setTab('assignment'); setOpenMenuId(null); }} />
                                  )}
                                  {canAdvance && (
                                    <MenuItem icon={ArrowRight} label={`→ ${STATUS_META[(['created','assigned','in_transit','delivered'] as ShipmentStatus[])[(['created','assigned','in_transit','delivered'] as ShipmentStatus[]).indexOf(s.status)+1]].label}`} onClick={() => { advanceState(s.id); setOpenMenuId(null); }} />
                                  )}
                                  <MenuItem icon={Truck} label="فتح التتبّع" onClick={() => { setTrackingId(s.id); setTab('tracking'); setOpenMenuId(null); }} />
                                  <MenuItem icon={Wallet} label="فتح في المقاصة" onClick={() => { setClearingId(s.id); setTab('clearing'); setOpenMenuId(null); }} />
                                  <MenuItem icon={RefreshCw} label="إعادة تعيين" onClick={() => { resetState(s.id); setOpenMenuId(null); }} />
                                  <div className="border-t border-slate-100 my-1" />
                                  <MenuItem icon={Trash2} label="حذف الشحنة" danger onClick={() => { if (confirm(`حذف ${s.id}؟`)) deleteShipment(s.id); setOpenMenuId(null); }} />
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {filteredShipments.length > 0 && (
                    <tfoot className="bg-slate-50 border-t border-slate-200">
                      <tr className="text-xs text-slate-600">
                        <td colSpan={7} className="px-3 py-2.5 text-right">إجمالي ({filteredShipments.length})</td>
                        <td className="px-3 py-2.5 text-left tabular-nums text-slate-900">
                          {fmt(filteredShipments.reduce((a, b) => a + b.cost, 0))}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </motion.div>
          )}

          {/* ============================ CONSOLIDATION ============================ */}
          {tab === 'consolidation' && (
            <motion.div key="consolidation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <div>
                <h2 className="text-lg text-slate-900">محرّك الدمج</h2>
                <p className="text-xs text-slate-500 mt-0.5">الشحنات المتوافقة (نفس الوجهة + نفس النافذة الزمنية) قابلة للدمج في مسار واحد</p>
              </div>

              {mergeCandidates.length === 0 && routes.length === 0 && (
                <div className="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
                  لا توجد شحنات قابلة للدمج حالياً. أنشئ شحنتين بنفس الوجهة والنافذة الزمنية.
                </div>
              )}

              {mergeCandidates.map(([key, group]) => {
                const [dest, day] = key.split('__');
                const ids = group.map(g => g.id);
                const selected = ids.filter(id => selectedForMerge.includes(id));
                const original = group.reduce((a, b) => a + b.cost, 0);
                const totalSize = group.reduce((a, b) => a + b.size, 0);
                const consolidated = Math.round(totalSize * RATE_PER_M3 * 0.82);
                const savings = original - consolidated;
                const pct = (savings / original) * 100;

                return (
                  <div key={key} className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Layers className="w-5 h-5 text-[#1A73E8]" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-900">مرشّح للدمج → {dest}</div>
                          <div className="text-[11px] text-slate-500">{day} • {group.length} شحنات • {totalSize.toFixed(1)} م³</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMerge(selected.length >= 2 ? selected : ids)}
                        className="px-4 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-lg text-sm flex items-center gap-2"
                      >
                        <GitMerge className="w-4 h-4" />
                        دمج {selected.length >= 2 ? `(${selected.length})` : 'الكل'}
                      </button>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-8 space-y-2">
                        {group.map(s => {
                          const isSel = selectedForMerge.includes(s.id);
                          return (
                            <button
                              key={s.id}
                              onClick={() => toggleMergeSelect(s.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                isSel ? 'border-[#1A73E8] bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSel ? 'bg-[#1A73E8] border-[#1A73E8]' : 'border-slate-300'}`}>
                                {isSel && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <div className="flex-1 text-right">
                                <div className="text-sm text-slate-900">{s.id} • {s.type}</div>
                                <div className="text-[11px] text-slate-500">{s.origin} → {s.destination} • {s.size} م³</div>
                              </div>
                              <div className="text-sm tabular-nums text-slate-700">{fmt(s.cost)} ر.ي</div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="col-span-4 bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 rounded-lg p-4 space-y-3">
                        <div className="text-[10px] tracking-widest text-slate-400">SAVINGS PREVIEW</div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">قبل الدمج</span>
                          <span className="text-slate-700 tabular-nums line-through">{fmt(original)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">بعد الدمج</span>
                          <span className="text-slate-900 tabular-nums">{fmt(consolidated)}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                          <span className="text-xs text-slate-500">التوفير</span>
                          <span className="text-base text-green-600 tabular-nums">{fmt(savings)} ر.ي · {pct.toFixed(1)}٪</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {routes.length > 0 && (
                <div>
                  <h3 className="text-sm text-slate-900 mb-3">المسارات المُنشأة ({routes.length})</h3>
                  <div className="space-y-2">
                    {routes.map(r => {
                      const ships = shipments.filter(s => r.shipmentIds.includes(s.id));
                      const original = ships.reduce((a, b) => a + b.cost, 0);
                      return (
                        <div key={r.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                              <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-sm text-slate-900">{r.id} — {ships.length} شحنات → {ships[0]?.destination}</div>
                              <div className="text-[11px] text-slate-500">{r.shipmentIds.join(' · ')}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="text-left">
                              <div className="text-[10px] text-slate-400">الأصلي</div>
                              <div className="text-slate-500 line-through tabular-nums">{fmt(original)}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300" />
                            <div className="text-left">
                              <div className="text-[10px] text-slate-400">المدمج</div>
                              <div className="text-slate-900 tabular-nums">{fmt(r.consolidatedCost)}</div>
                            </div>
                            <div className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs tabular-nums">
                              −{fmt(original - r.consolidatedCost)} ر.ي
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ============================ ASSIGNMENT ============================ */}
          {tab === 'assignment' && (
            <motion.div key="assignment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <div>
                <h2 className="text-lg text-slate-900">إسناد موزّع</h2>
                <p className="text-xs text-slate-500 mt-0.5">اختر شحنة في حالة "تم الإنشاء" ثم اختر الموزّع المناسب</p>
              </div>

              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-4 bg-white border border-slate-200 rounded-xl p-4">
                  <div className="text-xs text-slate-500 mb-3">شحنات تنتظر الإسناد ({unassigned.length})</div>
                  <div className="space-y-2">
                    {unassigned.length === 0 && (
                      <div className="text-xs text-slate-400 py-6 text-center">لا توجد شحنات بانتظار الإسناد</div>
                    )}
                    {unassigned.map(s => {
                      const sel = (assignableTarget) === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setAssignTarget(s.id)}
                          className={`w-full text-right p-3 rounded-lg border transition-colors ${
                            sel ? 'border-[#1A73E8] bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-900">{s.id}</span>
                            <span className="text-xs text-slate-500 tabular-nums">{fmt(s.cost)} ر.ي</span>
                          </div>
                          <div className="text-[11px] text-slate-500">{s.destination} • {s.size} م³ • {s.type}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="col-span-8 bg-white border border-slate-200 rounded-xl p-4">
                  <div className="text-xs text-slate-500 mb-3">الموزّعون المتاحون</div>
                  <div className="space-y-2">
                    {distributors.map(d => {
                      const ship = shipments.find(s => s.id === assignableTarget);
                      const estimatedCost = ship ? Math.round(d.pricePerM3 * ship.size) : 0;
                      const canAssign = !!ship && d.available && d.capacity >= (ship?.size || 0);
                      return (
                        <div key={d.id} className={`p-4 rounded-lg border ${d.available ? 'border-slate-200' : 'border-slate-200 bg-slate-50/50 opacity-60'}`}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 text-xs">
                              {d.id.split('-')[1]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-900">{d.name}</span>
                                <span className="text-[10px] text-slate-500">· {d.city}</span>
                              </div>
                              <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  {d.rating}
                                </span>
                                <span>سعر/م³: {fmt(d.pricePerM3)} ر.ي</span>
                                <span>سعة: {d.capacity} م³</span>
                                <span className={d.available ? 'text-green-600' : 'text-slate-400'}>
                                  {d.available ? '● متاح' : '○ مشغول'}
                                </span>
                              </div>
                            </div>
                            <div className="text-left">
                              {ship && (
                                <div className="text-[11px] text-slate-500 mb-1">عرض السعر</div>
                              )}
                              <div className="text-sm text-slate-900 tabular-nums">{ship ? `${fmt(estimatedCost)} ر.ي` : '—'}</div>
                            </div>
                            <button
                              disabled={!canAssign}
                              onClick={() => assignableTarget && handleAssign(assignableTarget, d.id)}
                              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 ${
                                canAssign ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <Send className="w-3.5 h-3.5" />
                              إسناد
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================ TRACKING ============================ */}
          {tab === 'tracking' && (
            <motion.div key="tracking" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg text-slate-900">تتبّع التسليم</h2>
                  <p className="text-xs text-slate-500 mt-0.5">آلة الحالة (State Machine) — انتقل بين المراحل لمحاكاة التنفيذ</p>
                </div>
                <select
                  value={trackingId}
                  onChange={e => setTrackingId(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  {shipments.map(s => (
                    <option key={s.id} value={s.id}>{s.id} → {s.destination}</option>
                  ))}
                </select>
              </div>

              {trackingShip && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <div className="text-xs text-slate-500">الشحنة</div>
                      <div className="text-base text-slate-900 mt-0.5">{trackingShip.id} • {trackingShip.origin} → {trackingShip.destination}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{trackingShip.size} م³ • {trackingShip.type} • {fmt(trackingShip.cost)} ر.ي</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md border text-[11px] ${FUNDS_META[trackingShip.funds].cls}`}>{trackingShip.funds}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between mb-8">
                    {(['created', 'assigned', 'in_transit', 'delivered'] as ShipmentStatus[]).map((st, i, arr) => {
                      const order = arr.indexOf(trackingShip.status);
                      const isPast = i <= order;
                      const isCurrent = i === order;
                      const m = STATUS_META[st];
                      return (
                        <div key={st} className="flex-1 flex items-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                              isPast ? `${m.dot} text-white` : 'bg-slate-100 text-slate-400'
                            } ${isCurrent ? 'ring-4 ring-offset-2 ring-blue-100' : ''}`}>
                              {isPast ? <Check className="w-4 h-4" /> : <CircleDot className="w-4 h-4" />}
                            </div>
                            <div className={`text-xs ${isPast ? 'text-slate-900' : 'text-slate-400'}`}>{m.label}</div>
                          </div>
                          {i < arr.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 ${i < order ? m.dot : 'bg-slate-200'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => advanceState(trackingShip.id)}
                      disabled={trackingShip.status === 'delivered'}
                      className={`px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 ${
                        trackingShip.status === 'delivered'
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                      }`}
                    >
                      <ArrowRight className="w-4 h-4" />
                      الانتقال للحالة التالية
                    </button>
                    <button
                      onClick={() => resetState(trackingShip.id)}
                      className="px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      إعادة تعيين
                    </button>
                  </div>

                  {trackingShip.status === 'delivered' && (
                    <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <div className="text-sm text-green-800">تم التسليم — الأموال أُفرج عنها للموزّع والسائق ومنصّة C-Route</div>
                        <div className="text-[11px] text-green-700 mt-0.5">انتقل إلى تبويب "غرفة المقاصة" لمراجعة التوزيع</div>
                      </div>
                      <button onClick={() => { setClearingId(trackingShip.id); setTab('clearing'); }} className="text-xs text-green-700 underline">
                        فتح المقاصة
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ============================ CLEARING ============================ */}
          {tab === 'clearing' && (
            <motion.div key="clearing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg text-slate-900">غرفة المقاصة المالية</h2>
                  <p className="text-xs text-slate-500 mt-0.5">دورة حياة الأموال: INIT → HELD → LOCKED → RELEASED — البنك هو الحارس الفعلي</p>
                </div>
                <select
                  value={clearingId}
                  onChange={e => setClearingId(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  {shipments.map(s => (
                    <option key={s.id} value={s.id}>{s.id} • {s.funds}</option>
                  ))}
                </select>
              </div>

              {clearingShip && ledger && (
                <div className="grid grid-cols-12 gap-5">
                  {/* Transaction panel */}
                  <div className="col-span-5 bg-white border border-slate-200 rounded-xl p-5">
                    <div className="text-[10px] tracking-widest text-slate-400 mb-1">TRANSACTION</div>
                    <div className="text-base text-slate-900 mb-4">{clearingShip.id}</div>

                    <div className="space-y-3 text-sm">
                      <Row label="مدفوع من المصنع" value={`${fmt(clearingShip.cost)} ر.ي`} />
                      <Row label="الوجهة" value={clearingShip.destination} />
                      <Row label="حالة التسليم" value={STATUS_META[clearingShip.status].label} />
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-slate-600">حالة الأموال</span>
                        <span className={`px-3 py-1 rounded-md border text-xs tabular-nums ${FUNDS_META[clearingShip.funds].cls}`}>
                          {clearingShip.funds}
                        </span>
                      </div>
                    </div>

                    {/* Funds lifecycle bar */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                        <span>INIT</span><span>HELD</span><span>LOCKED</span><span>RELEASED</span>
                      </div>
                      <div className="flex gap-1">
                        {(['INIT', 'HELD', 'LOCKED', 'RELEASED'] as FundsStatus[]).map((f) => {
                          const order = ['INIT', 'HELD', 'LOCKED', 'RELEASED'].indexOf(clearingShip.funds);
                          const i = ['INIT', 'HELD', 'LOCKED', 'RELEASED'].indexOf(f);
                          const reached = i <= order;
                          return (
                            <div key={f} className={`flex-1 h-2 rounded-full ${
                              reached
                                ? f === 'RELEASED' ? 'bg-green-500'
                                : f === 'LOCKED' ? 'bg-blue-500'
                                : f === 'HELD' ? 'bg-amber-500'
                                : 'bg-slate-300'
                                : 'bg-slate-100'
                            }`} />
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => simulatePayment(clearingShip.id)}
                        disabled={clearingShip.funds === 'RELEASED'}
                        className="px-3 py-2.5 rounded-lg text-sm bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <Lock className="w-4 h-4" />
                        محاكاة الدفع
                      </button>
                      <button
                        onClick={() => releaseFunds(clearingShip.id)}
                        disabled={clearingShip.funds === 'RELEASED' || clearingShip.funds === 'INIT'}
                        className="px-3 py-2.5 rounded-lg text-sm bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <Unlock className="w-4 h-4" />
                        الإفراج عن الأموال
                      </button>
                    </div>
                  </div>

                  {/* Ledger breakdown */}
                  <div className="col-span-7 bg-white border border-slate-200 rounded-xl p-5">
                    <div className="text-[10px] tracking-widest text-slate-400 mb-1">LEDGER · DISTRIBUTION</div>
                    <div className="text-base text-slate-900 mb-4">توزيع التسوية</div>

                    <div className="space-y-3">
                      <LedgerRow label="الموزّع (Distributor)" pct={DISTRIBUTOR_PCT * 100} amount={ledger.distributor} color="bg-[#1A73E8]" />
                      <LedgerRow label="السائق (Driver)" pct={DRIVER_PCT * 100} amount={ledger.driver} color="bg-blue-300" />
                      <LedgerRow label="عمولة C-Route (Platform Fee)" pct={PLATFORM_FEE_PCT * 100} amount={ledger.platform} color="bg-[#0B1B3B]" />
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm text-slate-600">الإجمالي</span>
                      <span className="text-base text-slate-900 tabular-nums">{fmt(ledger.distributor + ledger.driver + ledger.platform)} ر.ي</span>
                    </div>

                    {/* Before / After */}
                    <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                      <BalanceCard
                        title="رصيد الموزّع"
                        before={clearingShip.funds === 'RELEASED' ? 0 : ledger.distributor}
                        after={clearingShip.funds === 'RELEASED' ? ledger.distributor : 0}
                        released={clearingShip.funds === 'RELEASED'}
                      />
                      <BalanceCard
                        title="رصيد السائق"
                        before={clearingShip.funds === 'RELEASED' ? 0 : ledger.driver}
                        after={clearingShip.funds === 'RELEASED' ? ledger.driver : 0}
                        released={clearingShip.funds === 'RELEASED'}
                      />
                      <BalanceCard
                        title="رصيد C-Route"
                        before={clearingShip.funds === 'RELEASED' ? 0 : ledger.platform}
                        after={clearingShip.funds === 'RELEASED' ? ledger.platform : 0}
                        released={clearingShip.funds === 'RELEASED'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* All settlements list */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-sm text-slate-900 mb-3">سجل التسويات</div>
                <div className="space-y-1.5">
                  {shipments.map(s => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setClearingId(s.id)} className="text-[#1A73E8] tabular-nums">{s.id}</button>
                        <span className="text-slate-500 text-xs">{s.destination}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 tabular-nums text-xs">{fmt(s.cost)} ر.ي</span>
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] ${FUNDS_META[s.funds].cls}`}>{s.funds}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Shipment Dialog */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg" dir="rtl"
            >
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base text-slate-900">إنشاء شحنة جديدة</h3>
                <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-700 text-sm">إغلاق</button>
              </div>
              <div className="p-5 space-y-3">
                <Field label="المنشأ">
                  <input value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="الوجهة">
                    <select value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="النوع">
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                      {TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="النافذة الزمنية">
                  <input value={form.timeWindow} onChange={e => setForm({ ...form, timeWindow: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono" />
                </Field>
                <Field label="الحجم (م³)">
                  <input type="number" step="0.1" min="0.5" value={form.size} onChange={e => setForm({ ...form, size: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm tabular-nums" />
                </Field>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-blue-700">السعر التقديري (Auto)</div>
                    <div className="text-[10px] text-blue-600/70 mt-0.5">{fmt(RATE_PER_M3)} ر.ي / م³ × {form.size}</div>
                  </div>
                  <div className="text-lg text-[#0B1B3B] tabular-nums">{fmt(pricePreview)} ر.ي</div>
                </div>
              </div>
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex gap-2 justify-end">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-100">إلغاء</button>
                <button onClick={handleCreate} className="px-4 py-2 text-sm bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-lg flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> إنشاء + احتجاز الأموال
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shipment Detail Drawer */}
      <AnimatePresence>
        {drawerId && (() => {
          const s = shipments.find(x => x.id === drawerId);
          if (!s) return null;
          const m = STATUS_META[s.status];
          const dist = distributors.find(d => d.id === s.distributorId);
          const order: ShipmentStatus[] = ['created', 'assigned', 'in_transit', 'delivered'];
          const idx = order.indexOf(s.status);
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 flex justify-start"
              onClick={() => setDrawerId(null)}
            >
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                onClick={e => e.stopPropagation()}
                className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl" dir="rtl"
              >
                <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
                  <div>
                    <div className="text-[10px] tracking-widest text-slate-400">SHIPMENT</div>
                    <div className="text-base text-slate-900 tabular-nums">{s.id}</div>
                  </div>
                  <button onClick={() => setDrawerId(null)} className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] ${m.bg} ${m.color} ${m.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                      {m.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] tabular-nums ${FUNDS_META[s.funds].cls}`}>{s.funds}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Info label="المنشأ" value={s.origin} />
                    <Info label="الوجهة" value={s.destination} />
                    <Info label="الحجم" value={`${s.size} م³`} />
                    <Info label="النوع" value={s.type} />
                    <Info label="النافذة الزمنية" value={s.timeWindow} mono />
                    <Info label="تاريخ الإنشاء" value={s.createdAt} />
                    <Info label="الموزّع" value={dist ? dist.name : '— غير مُسند'} />
                    <Info label="التكلفة" value={`${fmt(s.cost)} ر.ي`} bold />
                  </div>

                  {/* Mini timeline */}
                  <div>
                    <div className="text-[10px] tracking-widest text-slate-400 mb-2">TIMELINE</div>
                    <div className="space-y-2">
                      {order.map((st, i) => {
                        const meta = STATUS_META[st];
                        const past = i <= idx;
                        return (
                          <div key={st} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${past ? `${meta.dot} text-white` : 'bg-slate-100 text-slate-400'}`}>
                              {past ? <Check className="w-3 h-3" /> : <CircleDot className="w-3 h-3" />}
                            </div>
                            <span className={`text-sm ${past ? 'text-slate-900' : 'text-slate-400'}`}>{meta.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {s.status === 'created' && (
                      <button onClick={() => { quickAssignBest(s.id); }} className="px-3 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-lg text-xs flex items-center justify-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" /> إسناد سريع
                      </button>
                    )}
                    {s.status !== 'delivered' && (
                      <button onClick={() => advanceState(s.id)} className="px-3 py-2 bg-[#0B1B3B] hover:bg-[#13265A] text-white rounded-lg text-xs flex items-center justify-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5" /> الحالة التالية
                      </button>
                    )}
                    <button onClick={() => { setTrackingId(s.id); setTab('tracking'); setDrawerId(null); }} className="px-3 py-2 border border-slate-200 rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50">
                      <Truck className="w-3.5 h-3.5" /> التتبّع
                    </button>
                    <button onClick={() => { setClearingId(s.id); setTab('clearing'); setDrawerId(null); }} className="px-3 py-2 border border-slate-200 rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50">
                      <Wallet className="w-3.5 h-3.5" /> المقاصة
                    </button>
                    <button onClick={() => resetState(s.id)} className="px-3 py-2 border border-slate-200 rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50">
                      <RefreshCw className="w-3.5 h-3.5" /> إعادة تعيين
                    </button>
                    <button onClick={() => { if (confirm(`حذف ${s.id}؟`)) { deleteShipment(s.id); setDrawerId(null); } }} className="px-3 py-2 border border-red-200 bg-red-50 text-red-700 rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-red-100">
                      <Trash2 className="w-3.5 h-3.5" /> حذف
                    </button>
                  </div>

                  {/* Settlement preview */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-[10px] tracking-widest text-slate-400 mb-2">SETTLEMENT PREVIEW</div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between"><span className="text-slate-600">الموزّع (70٪)</span><span className="tabular-nums">{fmt(Math.round(s.cost * 0.7))} ر.ي</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-600">السائق (20٪)</span><span className="tabular-nums">{fmt(Math.round(s.cost * 0.2))} ر.ي</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-600">C-Route (10٪)</span><span className="tabular-nums">{fmt(Math.round(s.cost * 0.1))} ر.ي</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

// ===== Sub components =====

function MenuItem({ icon: Icon, label, onClick, danger }: { icon: any; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-right px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-xs ${danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700'}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function Info({ label, value, mono, bold }: { label: string; value: string; mono?: boolean; bold?: boolean }) {
  return (
    <div>
      <div className="text-[10px] text-slate-400 mb-0.5">{label}</div>
      <div className={`text-slate-900 ${mono ? 'font-mono text-xs' : ''} ${bold ? 'tabular-nums' : ''}`}>{value}</div>
    </div>
  );
}

function Kpi({ label, value, icon: Icon, tone, sub }: { label: string; value: string; icon: any; tone: 'slate' | 'blue' | 'green' | 'amber'; sub?: string }) {
  const toneCls = {
    slate: 'bg-slate-100 text-slate-700',
    blue: 'bg-blue-50 text-[#1A73E8]',
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
  }[tone];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${toneCls}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl text-slate-900 tabular-nums">{value}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-900 tabular-nums">{value}</span>
    </div>
  );
}

function LedgerRow({ label, pct, amount, color }: { label: string; pct: number; amount: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-slate-700">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 tabular-nums">{pct}٪</span>
          <span className="text-slate-900 tabular-nums">{fmt(amount)} ر.ي</span>
        </div>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function BalanceCard({ title, before, after, released }: { title: string; before: number; after: number; released: boolean }) {
  return (
    <div className="border border-slate-200 rounded-lg p-3">
      <div className="text-[10px] text-slate-400 mb-1">{title}</div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 tabular-nums line-through">{fmt(before)}</span>
        <ArrowRight className="w-3 h-3 text-slate-300" />
        <span className={`tabular-nums ${released ? 'text-green-600' : 'text-slate-900'}`}>{fmt(after)}</span>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
