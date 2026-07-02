import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Factory,
  Store,
  Truck,
  Shield,
  ArrowLeft,
  Zap,
  TrendingDown,
  Network,
  Sparkles,
  CheckCircle,
  Eye,
  BarChart3,
  UserCircle2,
  ArrowRight,
  Map,
  Activity,
} from "lucide-react";
import {
  setActiveFactoryId,
  setActiveRetailerId,
  setActiveDriverId,
  setActiveAdminId,
} from "../../lib/supabase";

interface RoleSelectionProps {
  onSelectRole: (role: string) => void;
}

type RoleId = "factory" | "retailer" | "driver" | "admin";

interface Role {
  id: RoleId;
  title: string;
  tag?: string;
  description: string;
  cta: string;
  icon: typeof Factory;
  highlights: string[];
  investor: { metric: string; value: string; sub: string };
  primary?: boolean;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const [mode, setMode] = useState<"user" | "investor">("user");
  const [entering, setEntering] = useState<RoleId | null>(null);
  const [pickingIdentity, setPickingIdentity] = useState<RoleId | null>(null);

  const roles: Role[] = [
    {
      id: "factory",
      title: "المصنع",
      tag: "الأكثر استخداماً",
      description: "استلم مدفوعاتك فور الشحن وأدر توزيعك على الشبكة.",
      cta: "الدخول كمصنع",
      icon: Factory,
      highlights: ["رفع الشحنات", "تتبّع المدفوعات", "إدارة التوزيع"],
      investor: { metric: "هامش العمولة", value: "٢٫٤٪", sub: "لكل تسوية" },
      primary: true,
    },
    {
      id: "retailer",
      title: "التاجر",
      description: "اطلب البضائع بتسهيلات ائتمانية وتسليم أسرع.",
      cta: "الدخول كتاجر",
      icon: Store,
      highlights: ["طلب فوري", "ائتمان مرن", "توصيل أسرع"],
      investor: { metric: "متوسط الطلب", value: "١٢٥k", sub: "ر.ي / تاجر" },
    },
    {
      id: "driver",
      title: "السائق",
      description: "ضاعف عوائدك عبر مسارات مُحسّنة وشحنات مجمّعة.",
      cta: "الدخول كسائق",
      icon: Truck,
      highlights: ["تقليل الرحلات الفارغة", "مسارات أعلى ربحًا", "تسوية يومية"],
      investor: { metric: "استغلال السعة", value: "٧٨٪", sub: "+٢٢ نقطة" },
    },
    {
      id: "admin",
      title: "غرفة المقاصة",
      description: "راقب العمليات والمدفوعات لحظيًا.",
      cta: "الدخول للوحة",
      icon: Shield,
      highlights: ["مراقبة لحظية", "إدارة المخاطر", "تحليلات الأداء"],
      investor: { metric: "صافي التدفّق", value: "+١٨٪", sub: "م/م" },
    },
  ];

  const trust = [
    { icon: Zap, label: "تسوية فورية", value: "< ساعتان", sub: "بدل ٦٠ يوم" },
    { icon: TrendingDown, label: "خفض الكلفة", value: "٣٠٪", sub: "في الشحن" },
    {
      icon: Network,
      label: "شبكة مشتركة",
      value: "٤ مدن",
      sub: "مسارات تشاركية",
    },
  ];

  const identities = {
    factory: [
      { id: "a1000000-0000-0000-0000-000000000001", name: "مصنع حبوب شملان" },
      { id: "a1000000-0000-0000-0000-000000000002", name: "مصنع زيوت الأمانة" },
      { id: "a1000000-0000-0000-0000-000000000003", name: "مطاحن السنابل" },
      { id: "a1000000-0000-0000-0000-000000000004", name: "مصنع ألبان صافي" },
    ],
    retailer: [
      {
        id: "b1000000-0000-0000-0000-000000000001",
        name: "سوبرماركت الأمل - شملان",
      },
      { id: "b1000000-0000-0000-0000-000000000002", name: "متاجر النور - حدة" },
      {
        id: "b1000000-0000-0000-0000-000000000003",
        name: "بقالة السلام - الحصبة",
      },
      {
        id: "b1000000-0000-0000-0000-000000000004",
        name: "مؤسسة البركة - الستين",
      },
    ],
    driver: [
      { id: "c1000000-0000-0000-0000-000000000001", name: "عبدالله الشملاني" },
      { id: "c1000000-0000-0000-0000-000000000002", name: "محمد القاضي" },
      { id: "c1000000-0000-0000-0000-000000000003", name: "أحمد الحميري" },
    ],
    admin: [{ id: "admin-system", name: "النظام المركزي" }],
  };

  const handleEnter = (id: RoleId) => {
    if (entering) return;
    setPickingIdentity(id);
  };

  const confirmIdentity = (id: string) => {
    if (!pickingIdentity) return;
    if (pickingIdentity === "factory") setActiveFactoryId(id);
    if (pickingIdentity === "retailer") setActiveRetailerId(id);
    if (pickingIdentity === "driver") setActiveDriverId(id);
    if (pickingIdentity === "admin") setActiveAdminId(id);

    const roleToEnter = pickingIdentity;
    setPickingIdentity(null);
    setEntering(roleToEnter);
    setTimeout(() => onSelectRole(roleToEnter), 2200);
  };

  const enteringRole = roles.find((r) => r.id === entering);

  return (
    <div
      className="min-h-screen w-full flex flex-col xl:flex-row bg-[#0B1B3B] overflow-x-hidden relative"
      dir="rtl"
      style={{ fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif' }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none" />
      {/* 
        ================================================================
        RIGHT PANEL: BRANDING (Fixed 100vh)
        ================================================================
      */}
      <div className="relative w-full xl:w-[38%] min-h-[40vh] xl:h-screen p-8 md:p-12 lg:p-16 flex flex-col justify-between text-white shrink-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#1A73E8]/5 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-12 xl:mb-0">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-16 h-16 md:w-28 md:h-28 rounded-3xl bg-white p-3.5 md:p-5.5 flex items-center justify-center shadow-[0_20px_50px_rgba(26,115,232,0.3)] border border-white/20"
            >
              <img src="/logo.png" alt="C-Route Logo" className="w-full h-full object-contain" />
            </motion.div>
            <div>
              <div className="tracking-[0.2em] font-black text-lg md:text-2xl text-white">
                C-ROUTE
              </div>
              <div className="text-[10px] md:text-xs text-[#4285F4] font-black tracking-[0.3em] uppercase">
                Enterprise Logistics
              </div>
            </div>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 mb-12 xl:mb-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3 h-3" />
            <span>Next-Gen Supply Chain</span>
          </motion.div>
          <h1 className="text-3xl md:text-6xl font-black leading-[1.1] mb-6">
            مستقبل <br />
            <span className="text-white/30">الإمداد الذكي</span>
          </h1>
          <p className="text-white/60 text-sm md:text-lg max-w-sm font-medium leading-relaxed">
            منصة متكاملة لإدارة التدفقات النقدية واللوجستية في بيئة تقنية موحدة.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="relative z-10 grid grid-cols-1 gap-4 xl:max-w-xs">
          {trust.map((t, idx) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Icon className="w-5 h-5 text-[#4285F4]" />
                </div>
                <div>
                  <div className="text-lg xl:text-2xl font-black">{t.value}</div>
                  <div className="text-[10px] text-white/30 font-black uppercase tracking-tighter">
                    {t.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 
        ================================================================
        LEFT PANEL: ACTIONS (Fixed 100vh)
        ================================================================
      */}
      <div className="relative w-full xl:w-[62%] min-h-[60vh] xl:h-screen bg-slate-50 xl:rounded-r-[3rem] p-8 md:p-12 lg:p-16 flex flex-col justify-between shadow-[-50px_0_100px_rgba(0,0,0,0.3)] z-20 overflow-y-auto">
        {/* Upper Nav */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-[#0B1B3B] text-2xl xl:text-4xl font-black tracking-tight mb-2">
              بوابات الوصول
            </h2>
            <p className="text-slate-400 text-sm font-bold">اختر نوع الحساب لبدء الجلسة</p>
          </div>

          <div className="flex items-center p-1.5 bg-slate-200/50 rounded-2xl border border-slate-200">
            <button
              onClick={() => setMode("user")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${
                mode === "user"
                  ? "bg-white text-[#1A73E8] shadow-xl shadow-blue-900/10"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              التشغيل
            </button>
            <button
              onClick={() => setMode("investor")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${
                mode === "investor"
                  ? "bg-[#0B1B3B] text-white shadow-xl shadow-slate-900/20"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              المستثمر
            </button>
          </div>
        </div>

        {/* Roles Grid - Responsive Flex */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6 py-6">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            const isPrimary = role.primary;
            return (
              <motion.button
                key={role.id}
                onClick={() => handleEnter(role.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative flex flex-col items-start gap-6 p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${
                  isPrimary
                    ? "border-[#1A73E8]/20 bg-white shadow-[0_30px_60px_rgba(26,115,232,0.08)] hover:border-[#1A73E8]"
                    : "border-transparent bg-white shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:border-slate-200"
                }`}
              >
                <div
                  className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                    isPrimary
                      ? "bg-[#1A73E8] text-white shadow-blue-500/30"
                      : "bg-slate-100 text-slate-400 group-hover:bg-[#0B1B3B] group-hover:text-white"
                  }`}
                >
                  <Icon className="w-8 h-8" strokeWidth={2} />
                </div>

                <div className="flex-1 text-right w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#0B1B3B] font-black text-xl xl:text-2xl">
                      {role.title}
                    </span>
                    {isPrimary && (
                      <span className="bg-blue-50 text-[#1A73E8] text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                        Most Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6">
                    {role.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                    <AnimatePresence mode="wait">
                      {mode === "investor" ? (
                        <motion.div
                          key="inv"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-left"
                          dir="ltr"
                        >
                          <div className="text-[10px] text-[#1A73E8] font-black uppercase tracking-widest mb-1">
                            {role.investor.metric}
                          </div>
                          <div className="text-xl font-black text-[#0B1B3B]">
                            {role.investor.value}
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2 text-[#1A73E8] font-black text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                          <span>{role.cta}</span>
                          <ArrowLeft className="w-5 h-5" />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <div>© 2026 C-Route Systems</div>
          <div className="flex gap-4">
            <span className="text-[#1A73E8]">Status: Online</span>
            <span>Region: Yemen</span>
          </div>
        </div>
      </div>

      {/* Identity Modal */}
      <AnimatePresence>
        {pickingIdentity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#0B1B3B]/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setPickingIdentity(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-black text-[#0B1B3B]">
                  اختر الحساب
                </h3>
                <button
                  onClick={() => setPickingIdentity(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto">
                {identities[pickingIdentity].map((identity) => (
                  <button
                    key={identity.id}
                    onClick={() => confirmIdentity(identity.id)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#1A73E8] hover:bg-blue-50/50 transition-all text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#1A73E8]">
                        <UserCircle2 className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-[#0B1B3B] text-sm">
                        {identity.name}
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-300" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entering Loader */}
      <AnimatePresence>
        {entering && enteringRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[#0B1B3B] flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl bg-[#1A73E8] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(26,115,232,0.4)]"
            >
              <enteringRole.icon className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-white text-2xl font-black mb-2">
              بوابة {enteringRole.title}
            </h3>
            <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-8">
              Establishing Secure Connection
            </p>
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
                className="h-full bg-[#1A73E8]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
