import { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin, Truck, Factory as FactoryIcon, Activity, Layers,
  Maximize2, Compass, TrendingUp, Sparkles
} from 'lucide-react';

type City = {
  id: string;
  name: string;
  // Map coordinate (within 0..1000 viewBox X / 0..600 viewBox Y)
  x: number;
  y: number;
  demand: number; // 0..100 — heat intensity
  retailers: number;
  revenue: number; // millions
  isHub?: boolean;
};

const CITIES: City[] = [
  { id: 'sanaa', name: 'صنعاء', x: 580, y: 280, demand: 96, retailers: 184, revenue: 48.2, isHub: true },
  { id: 'aden', name: 'عدن', x: 540, y: 480, demand: 78, retailers: 112, revenue: 31.6 },
  { id: 'taiz', name: 'تعز', x: 510, y: 410, demand: 64, retailers: 86, revenue: 22.4 },
  { id: 'hudaydah', name: 'الحديدة', x: 430, y: 320, demand: 58, retailers: 74, revenue: 18.9 },
  { id: 'mukalla', name: 'المكلا', x: 760, y: 460, demand: 32, retailers: 38, revenue: 9.7 },
  { id: 'ibb', name: 'إب', x: 540, y: 360, demand: 46, retailers: 52, revenue: 12.3 },
];

// Factory origin point (Sana'a hub for the demo)
const FACTORY = { x: 580, y: 280 };

// Stylized Yemen outline (simplified, decorative)
const YEMEN_PATH =
  'M 320 260 L 380 220 L 460 200 L 540 195 L 640 200 L 740 215 L 820 240 L 870 290 L 880 360 L 850 420 L 800 470 L 720 510 L 620 525 L 520 530 L 430 520 L 360 490 L 320 440 L 305 380 L 305 320 Z';

export default function SupplyChainIntel() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [layer, setLayer] = useState<'heat' | 'flow' | 'both'>('both');
  const [region, setRegion] = useState<'all' | 'north' | 'south' | 'coast'>('all');

  const showHeat = layer === 'heat' || layer === 'both';
  const showFlow = layer === 'flow' || layer === 'both';

  const hoveredCity = CITIES.find((c) => c.id === hovered);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span className="text-[10px] tracking-[0.3em] text-slate-400">SUPPLY CHAIN & MARKET INTELLIGENCE</span>
          </div>
          <h3 className="text-[#0B1B3B] text-lg">منصّة الذكاء اللوجستي والسوقي</h3>
          <p className="text-xs text-slate-500 mt-0.5">رؤية لحظية لتدفّق المنتجات وكثافة الطلب عبر المحافظات</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Region selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
            {([
              { id: 'all', label: 'كل المناطق' },
              { id: 'north', label: 'الشمال' },
              { id: 'south', label: 'الجنوب' },
              { id: 'coast', label: 'الساحل' },
            ] as const).map((r) => (
              <button
                key={r.id}
                onClick={() => setRegion(r.id)}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  region === r.id ? 'bg-white text-[#0B1B3B] shadow-sm border border-slate-100' : 'text-slate-500'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Layer toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
            {([
              { id: 'both', label: 'الكل' },
              { id: 'heat', label: 'كثافة الطلب' },
              { id: 'flow', label: 'مسارات التوزيع' },
            ] as const).map((l) => (
              <button
                key={l.id}
                onClick={() => setLayer(l.id)}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  layer === l.id ? 'bg-[#0B1B3B] text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-12">
        {/* Map */}
        <div className="col-span-12 lg:col-span-9 relative bg-gradient-to-br from-slate-50 via-white to-blue-50/40 min-h-[460px]">
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #0B1B3B 1px, transparent 1px), linear-gradient(to bottom, #0B1B3B 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Compass */}
          <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-slate-200 flex items-center justify-center shadow-sm">
            <Compass className="w-4 h-4 text-slate-500" />
          </div>

          {/* Live indicator */}
          <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur border border-slate-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[10px] tracking-wider text-slate-600">تحديث لحظي</span>
          </div>

          <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="yemen-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EFF6FF" />
                <stop offset="100%" stopColor="#DBEAFE" />
              </linearGradient>
              <radialGradient id="heat-strong" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1A73E8" stopOpacity={0.55} />
                <stop offset="60%" stopColor="#1A73E8" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#1A73E8" stopOpacity={0} />
              </radialGradient>
              <radialGradient id="heat-mid" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
              </radialGradient>
              <radialGradient id="heat-low" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#15803D" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#15803D" stopOpacity={0} />
              </radialGradient>
              <linearGradient id="flow-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1A73E8" stopOpacity={0} />
                <stop offset="50%" stopColor="#1A73E8" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#1A73E8" stopOpacity={0} />
              </linearGradient>
              <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="0" dy="2" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.25" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Yemen outline */}
            <path
              d={YEMEN_PATH}
              fill="url(#yemen-fill)"
              stroke="#1A73E8"
              strokeOpacity={0.35}
              strokeWidth={1.5}
              strokeDasharray="0"
            />
            <path
              d={YEMEN_PATH}
              fill="none"
              stroke="#0B1B3B"
              strokeOpacity={0.1}
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />

            {/* Heat blobs per city */}
            {showHeat &&
              CITIES.map((c) => {
                const radius = 40 + (c.demand / 100) * 80;
                const grad =
                  c.demand > 75 ? 'heat-strong' : c.demand > 45 ? 'heat-mid' : 'heat-low';
                return (
                  <circle
                    key={`heat-${c.id}`}
                    cx={c.x}
                    cy={c.y}
                    r={radius}
                    fill={`url(#${grad})`}
                  />
                );
              })}

            {/* Flow paths from factory to other cities */}
            {showFlow &&
              CITIES.filter((c) => c.id !== 'sanaa').map((c, idx) => {
                const midX = (FACTORY.x + c.x) / 2;
                const midY = (FACTORY.y + c.y) / 2 - 40;
                const d = `M ${FACTORY.x} ${FACTORY.y} Q ${midX} ${midY} ${c.x} ${c.y}`;
                return (
                  <g key={`flow-${c.id}`}>
                    <path
                      d={d}
                      fill="none"
                      stroke="#1A73E8"
                      strokeOpacity={0.18}
                      strokeWidth={2}
                      strokeDasharray="4 6"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-40"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </path>
                    {/* Animated truck dot */}
                    <circle r="4" fill="#1A73E8" filter="url(#soft-shadow)">
                      <animateMotion
                        dur={`${4 + idx * 0.6}s`}
                        repeatCount="indefinite"
                        path={d}
                        rotate="auto"
                      />
                    </circle>
                    <circle r="7" fill="#1A73E8" fillOpacity={0.18}>
                      <animateMotion
                        dur={`${4 + idx * 0.6}s`}
                        repeatCount="indefinite"
                        path={d}
                      />
                    </circle>
                  </g>
                );
              })}

            {/* City nodes */}
            {CITIES.map((c) => {
              const isHub = c.isHub;
              const isHovered = hovered === c.id;
              return (
                <g
                  key={c.id}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                >
                  {/* Pulse */}
                  {isHub && (
                    <circle cx={c.x} cy={c.y} r="14" fill="#1A73E8" fillOpacity={0.15}>
                      <animate attributeName="r" from="14" to="32" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="fill-opacity" from="0.4" to="0" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Outer ring */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isHub ? 14 : 9}
                    fill="white"
                    stroke={isHub ? '#1A73E8' : '#0B1B3B'}
                    strokeWidth={isHub ? 3 : 2}
                    filter="url(#soft-shadow)"
                  />
                  {/* Inner dot */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isHub ? 6 : 3.5}
                    fill={isHub ? '#1A73E8' : '#0B1B3B'}
                  />

                  {/* Label */}
                  <g transform={`translate(${c.x + 18}, ${c.y - 6})`}>
                    <rect
                      x={-4}
                      y={-12}
                      width={c.name.length * 11 + 14}
                      height={22}
                      rx={6}
                      fill={isHovered ? '#0B1B3B' : 'white'}
                      stroke={isHovered ? '#0B1B3B' : '#E5E9F2'}
                      strokeWidth={1}
                    />
                    <text
                      x={3}
                      y={3}
                      fontSize={11}
                      fill={isHovered ? 'white' : '#0B1B3B'}
                      style={{ fontFamily: 'inherit' }}
                    >
                      {c.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredCity && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 bg-[#0B1B3B] text-white rounded-2xl p-4 min-w-[240px] shadow-xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] tracking-[0.25em] text-white/60">
                  {hoveredCity.isHub ? 'مركز رئيسي' : 'سوق إقليمي'}
                </span>
                <MapPin className="w-3.5 h-3.5 text-[#1A73E8]" />
              </div>
              <div className="text-lg mb-3">{hoveredCity.name}</div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="text-[10px] text-white/50 mb-0.5">الطلب</div>
                  <div className="text-sm">{hoveredCity.demand}٪</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/50 mb-0.5">التجار</div>
                  <div className="text-sm">{hoveredCity.retailers}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/50 mb-0.5">الإيرادات</div>
                  <div className="text-sm">{hoveredCity.revenue}M</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Legend (heat scale) */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-xl border border-slate-200 p-3 w-44 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] tracking-wider text-slate-500">كثافة الطلب</span>
              <Layers className="w-3 h-3 text-slate-400" />
            </div>
            <div
              className="h-2 rounded-full mb-1"
              style={{
                background:
                  'linear-gradient(to left, rgba(21,128,61,0.4), rgba(245,158,11,0.55), rgba(26,115,232,0.85))',
              }}
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>منخفض</span>
              <span>متوسط</span>
              <span>مرتفع</span>
            </div>
          </div>
        </div>

        {/* Side panel: KPI per region & flow stats */}
        <div className="col-span-12 lg:col-span-3 border-r border-slate-100 p-5 space-y-4 bg-slate-50/30">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-2">FLOW SUMMARY</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-xl border border-slate-100 p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <Truck className="w-3 h-3 text-[#1A73E8]" />
                  شحنات نشطة
                </div>
                <div className="text-lg text-[#0B1B3B] tabular-nums">٧٤</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <Activity className="w-3 h-3 text-[#15803D]" />
                  مسارات حيّة
                </div>
                <div className="text-lg text-[#0B1B3B] tabular-nums">١٢</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <FactoryIcon className="w-3 h-3 text-[#0B1B3B]" />
                  منشآت ربط
                </div>
                <div className="text-lg text-[#0B1B3B] tabular-nums">٦</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <TrendingUp className="w-3 h-3 text-amber-600" />
                  نموّ الطلب
                </div>
                <div className="text-lg text-[#0B1B3B] tabular-nums">+١٤٪</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.25em] text-slate-400 mb-2">CITY DEMAND RANK</div>
            <div className="space-y-2">
              {[...CITIES].sort((a, b) => b.demand - a.demand).slice(0, 5).map((c, i) => (
                <div
                  key={c.id}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100 hover:border-[#1A73E8]/30 transition-colors cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[10px] flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-xs text-[#0B1B3B]">{c.name}</span>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-[#1A73E8] to-[#0B1B3B]"
                      style={{ width: `${c.demand}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 tabular-nums w-7 text-left">{c.demand}٪</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-2.5 rounded-xl bg-[#0B1B3B] text-white text-xs flex items-center justify-center gap-2 hover:bg-[#1A73E8] transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
            تكبير الخريطة
          </button>
        </div>
      </div>
    </div>
  );
}
