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

    const roleToEnter = pickingIdentity;
    setPickingIdentity(null);
    setEntering(roleToEnter);
    setTimeout(() => onSelectRole(roleToEnter), 2200);
  };

  const enteringRole = roles.find((r) => r.id === entering);

  return (
    <div
      className="h-screen w-full flex flex-col xl:flex-row bg-[#0B1B3B] overflow-hidden"
      dir="rtl"
      style={{ fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif' }}
    >
      {/* 
        ================================================================
        RIGHT PANEL: BRANDING (Fixed 100vh)
        ================================================================
      */}
      <div className="relative w-full xl:w-[40%] h-[35vh] xl:h-screen p-6 md:p-10 lg:p-12 flex flex-col justify-between text-white shrink-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#1A73E8]/5 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1A73E8] flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="tracking-[0.15em] font-black text-lg">
                C-ROUTE
              </div>
              <div className="text-[9px] text-[#1A73E8] font-bold">
                LOGISTICS SYSTEM
              </div>
            </div>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            البنية التشغيلية <br />
            <span className="text-white/40">لتجارة الجملة</span>
          </h1>
          <p className="text-white/50 text-sm max-w-sm font-medium leading-relaxed">
            منظومة تقنية تُوحّد سلاسل الإمداد: شحنٌ ذكي، تسوياتٌ فورية، وتمويلٌ
            تشغيلي.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="relative z-10 grid grid-cols-3 xl:grid-cols-1 gap-3 xl:gap-4 mt-4 xl:mt-0">
          {trust.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <Icon className="w-4 h-4 text-[#1A73E8]" />
                <div className="overflow-hidden">
                  <div className="text-sm xl:text-xl font-bold truncate">
                    {t.value}
                  </div>
                  <div className="text-[10px] text-white/40 font-bold truncate uppercase">
                    {t.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 
        ================================================================
        LEFT PANEL: ACTIONS (Fixed 100vh)
        ================================================================
      */}
      <div className="relative w-full xl:w-[60%] h-[65vh] xl:h-screen bg-white xl:rounded-r-[2.5rem] p-6 md:p-10 lg:p-12 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Upper Nav */}
        <div className="flex items-center justify-between mb-6 xl:mb-0">
          <h2 className="text-[#0B1B3B] text-xl xl:text-2xl font-black">
            اختر صفتك للدخول
          </h2>

          <div className="flex items-center p-1 bg-slate-100 rounded-full">
            <button
              onClick={() => setMode("user")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === "user"
                  ? "bg-[#1A73E8] text-white shadow-md"
                  : "text-slate-500"
              }`}
            >
              التشغيل
            </button>
            <button
              onClick={() => setMode("investor")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === "investor"
                  ? "bg-[#0B1B3B] text-white shadow-md"
                  : "text-slate-500"
              }`}
            >
              المستثمر
            </button>
          </div>
        </div>

        {/* Roles Grid - Responsive Flex */}
        <div className="flex-1 flex flex-col justify-center gap-3 xl:gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isPrimary = role.primary;
            return (
              <motion.button
                key={role.id}
                onClick={() => handleEnter(role.id)}
                whileHover={{ x: -8 }}
                className={`group relative flex items-center gap-4 p-4 xl:p-6 rounded-2xl border transition-all duration-300 ${
                  isPrimary
                    ? "border-[#1A73E8]/20 bg-blue-50/10 shadow-sm hover:border-[#1A73E8]"
                    : "border-slate-100 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-12 h-12 xl:w-16 xl:h-16 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                    isPrimary
                      ? "bg-[#1A73E8] text-white"
                      : "bg-slate-100 text-slate-400 group-hover:bg-[#0B1B3B] group-hover:text-white"
                  }`}
                >
                  <Icon className="w-6 h-6 xl:w-8 xl:h-8" strokeWidth={1.5} />
                </div>

                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#0B1B3B] font-bold xl:text-lg">
                      {role.title}
                    </span>
                    {isPrimary && (
                      <span className="bg-blue-100 text-[#1A73E8] text-[9px] px-1.5 py-0.5 rounded font-black">
                        أساسي
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] xl:text-xs text-slate-500 font-medium leading-tight line-clamp-1 xl:line-clamp-none">
                    {role.description}
                  </p>
                </div>

                {/* Status/Investor Info */}
                <div className="hidden sm:flex items-center gap-4 border-r border-slate-100 pr-4">
                  <AnimatePresence mode="wait">
                    {mode === "investor" ? (
                      <motion.div
                        key="inv"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-left"
                        dir="ltr"
                      >
                        <div className="text-[9px] text-[#1A73E8] font-bold">
                          {role.investor.metric}
                        </div>
                        <div className="text-sm xl:text-lg font-black text-[#0B1B3B]">
                          {role.investor.value}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="usr"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-[#1A73E8] font-bold text-xs"
                      >
                        <span>{role.cta}</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
