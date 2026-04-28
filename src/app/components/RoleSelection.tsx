import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
} from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: string) => void;
}

type RoleId = 'factory' | 'retailer' | 'driver' | 'admin';

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
  const [mode, setMode] = useState<'user' | 'investor'>('user');
  const [entering, setEntering] = useState<RoleId | null>(null);

  const roles: Role[] = [
    {
      id: 'factory',
      title: 'المصنع',
      tag: 'الأكثر استخداماً',
      description: 'استلم مدفوعاتك فور الشحن وأدر توزيعك على الشبكة.',
      cta: 'الدخول كمصنع',
      icon: Factory,
      highlights: ['رفع الشحنات', 'تتبّع المدفوعات', 'إدارة التوزيع'],
      investor: { metric: 'هامش العمولة', value: '٢٫٤٪', sub: 'لكل تسوية' },
      primary: true,
    },
    {
      id: 'retailer',
      title: 'التاجر',
      description: 'اطلب البضائع بتسهيلات ائتمانية وتسليم أسرع.',
      cta: 'الدخول كتاجر',
      icon: Store,
      highlights: ['طلب فوري', 'ائتمان مرن', 'توصيل أسرع'],
      investor: { metric: 'متوسط الطلب', value: '١٢٥k', sub: 'ر.ي / تاجر' },
    },
    {
      id: 'driver',
      title: 'السائق',
      description: 'ضاعف عوائدك عبر مسارات مُحسّنة وشحنات مجمّعة.',
      cta: 'الدخول كسائق',
      icon: Truck,
      highlights: ['تقليل الرحلات الفارغة', 'مسارات أعلى ربحًا', 'تسوية يومية'],
      investor: { metric: 'استغلال السعة', value: '٧٨٪', sub: '+٢٢ نقطة' },
    },
    {
      id: 'admin',
      title: 'غرفة المقاصة',
      description: 'راقب العمليات والمدفوعات والأداء اللوجستي لحظيًا.',
      cta: 'الدخول للوحة',
      icon: Shield,
      highlights: ['مراقبة لحظية', 'إدارة المخاطر', 'تحليلات الأداء'],
      investor: { metric: 'صافي التدفّق', value: '+١٨٪', sub: 'م/م' },
    },
  ];

  const trust = [
    { icon: Zap, label: 'تسوية فورية', value: '< ساعتان', sub: 'بدل ٦٠ يوم' },
    { icon: TrendingDown, label: 'خفض الكلفة', value: '٣٠٪', sub: 'في الشحن' },
    { icon: Network, label: 'شبكة مشتركة', value: '٤ مدن', sub: 'مسارات تشاركية' },
  ];

  const handleEnter = (id: RoleId) => {
    if (entering) return;
    setEntering(id);
    setTimeout(() => onSelectRole(id), 2200);
  };

  const enteringRole = roles.find((r) => r.id === entering);

  return (
    <div
      className="min-h-screen w-full bg-white relative overflow-hidden flex flex-col"
      dir="rtl"
      style={{ fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif' }}
    >
      {/* Background accents */}
      <div className="absolute top-[-220px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#1A73E8]/[0.07] rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0B1B3B 1px, transparent 1px), linear-gradient(to bottom, #0B1B3B 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Top bar */}
      <header className="relative px-10 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1A73E8] flex items-center justify-center shadow-md shadow-[#1A73E8]/25">
            <div className="w-3.5 h-3.5 rounded-[4px] bg-white" />
          </div>
          <div className="leading-tight">
            <div className="tracking-[0.22em] text-[#0B1B3B] text-[13px]">C-ROUTE</div>
            <div className="text-[10px] text-slate-400 tracking-wider">غرفة المقاصة الذكية</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-full text-[11px]">
            <button
              onClick={() => setMode('user')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                mode === 'user' ? 'bg-white shadow-sm text-[#0B1B3B]' : 'text-slate-500'
              }`}
            >
              <Eye className="w-3 h-3" />
              عرض المستخدم
            </button>
            <button
              onClick={() => setMode('investor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                mode === 'investor'
                  ? 'bg-[#0B1B3B] text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              عرض المستثمر
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-10 pt-10 pb-6 max-w-6xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-5">
          <span className="w-1 h-1 rounded-full bg-[#1A73E8]" />
          <span className="text-[11px] tracking-wider text-[#1A73E8]">منصّة المقاصة وسلسلة الإمداد</span>
        </div>
        <h1
          className="text-[#0B1B3B] leading-[1.15] mb-3"
          style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)', fontWeight: 600 }}
        >
          <span className="text-[#1A73E8]">C-Route</span> · البنية التشغيلية لتجارة الجملة في اليمن
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-[14px] leading-relaxed">
          منظومة تقنية تُوحّد سلاسل الإمداد في دورة واحدة: شحنٌ ذكي، تسوياتٌ مالية فورية، وتمويلٌ تشغيلي. ادخل من بوابتك وابدأ العمل بكفاءة.
        </p>
      </section>

      {/* Trust strip */}
      <section className="relative px-10 pb-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-3">
          {trust.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-100"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#1A73E8]" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#0B1B3B] text-base">{t.value}</span>
                    <span className="text-[11px] text-slate-500">{t.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{t.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role cards — 2x2 equal grid */}
      <section className="relative px-10 pb-10 max-w-5xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          {roles.map((role) => {
            const Icon = role.icon;
            const isPrimary = role.primary;
            return (
              <motion.button
                key={role.id}
                onClick={() => handleEnter(role.id)}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`group relative text-right rounded-2xl bg-white border border-slate-200 hover:border-[#1A73E8]/50 shadow-[0_4px_18px_-12px_rgba(11,27,59,0.18)] hover:shadow-[0_24px_50px_-22px_rgba(26,115,232,0.30)] transition-all duration-300 flex flex-col p-5 overflow-hidden ${
                  isPrimary ? 'ring-1 ring-[#1A73E8]/15' : ''
                }`}
              >
                {isPrimary && role.tag && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] tracking-wider text-[#1A73E8]">
                    <Sparkles className="w-2.5 h-2.5" />
                    {role.tag}
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 group-hover:bg-[#1A73E8] flex items-center justify-center transition-colors">
                    <Icon
                      className="w-5 h-5 text-[#1A73E8] group-hover:text-white transition-colors"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="text-[#0B1B3B] text-[16px]">{role.title}</h3>
                </div>

                <p className="text-[12.5px] text-slate-500 leading-relaxed mb-3">
                  {role.description}
                </p>

                <AnimatePresence>
                  {mode === 'investor' && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="flex items-center justify-between mb-3 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] text-slate-500 tracking-wider">{role.investor.metric}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[#1A73E8] text-[12px]">{role.investor.value}</span>
                        <span className="text-[9px] text-slate-400">{role.investor.sub}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[12px] text-[#1A73E8]">{role.cta}</span>
                  <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-[#1A73E8] group-hover:-translate-x-1 transition-all" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-10 py-3 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-400">
        <span>© ٢٠٢٦ C-Route — منصّة المقاصة وسلسلة الإمداد</span>
        <span className="hidden md:inline">صنعاء • عدن • تعز • الحديدة</span>
      </footer>

      {/* Entering overlay */}
      <AnimatePresence>
        {entering && enteringRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B1B3B]/85 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              dir="rtl"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1A73E8] flex items-center justify-center mb-4">
                <enteringRole.icon className="w-7 h-7 text-white" strokeWidth={1.75} />
              </div>
              <div className="text-[11px] tracking-[0.25em] text-slate-400 mb-1">جارٍ الدخول</div>
              <h3 className="text-[#0B1B3B] mb-1 text-xl">بصفة {enteringRole.title}</h3>
              <p className="text-sm text-slate-500 mb-5">يمكنك من هنا:</p>
              <div className="flex flex-col gap-2 mb-6">
                {enteringRole.highlights.map((h) => (
                  <div
                    key={h}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50/60 border border-blue-100 text-sm text-[#0B1B3B]"
                  >
                    <CheckCircle className="w-4 h-4 text-[#1A73E8]" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                  className="h-full bg-[#1A73E8]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
