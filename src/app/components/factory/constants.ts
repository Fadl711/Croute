import {
  Truck, DollarSign, Package, Award, AlertCircle, Clock, TrendingUp
} from 'lucide-react';

export const UNITS = [
  { id: 'kg', name: 'كيلوجرام', symbol: 'كجم' },
  { id: 'g', name: 'جرام', symbol: 'جم' },
  { id: 'ton', name: 'طن', symbol: 'طن' },
  { id: 'liter', name: 'لتر', symbol: 'لتر' },
  { id: 'ml', name: 'ملليلتر', symbol: 'مل' },
  { id: 'carton', name: 'كرتون', symbol: 'كرتون' },
  { id: 'box', name: 'علبة', symbol: 'علبة' },
  { id: 'piece', name: 'قطعة', symbol: 'قطعة' },
  { id: 'bottle', name: 'عبوة', symbol: 'عبوة' },
  { id: 'pack', name: 'حزمة', symbol: 'حزمة' },
  { id: 'bag', name: 'كيس', symbol: 'كيس' },
  { id: 'can', name: 'علبة معدنية', symbol: 'علبة' },
  { id: 'jar', name: 'جركن', symbol: 'جركن' },
];

export const CATEGORIES = [
  { id: 'beverages', name: 'مشروبات', icon: '🥤', color: 'blue' },
  { id: 'food', name: 'منتجات غذائية', icon: '🍽️', color: 'green' },
  { id: 'dairy', name: 'ألبان ومشتقاتها', icon: '🥛', color: 'cyan' },
  { id: 'bakery', name: 'مخبوزات', icon: '🍞', color: 'amber' },
  { id: 'oils', name: 'زيوت وسمن', icon: '🫒', color: 'yellow' },
  { id: 'canned', name: 'معلبات', icon: '🥫', color: 'orange' },
  { id: 'grains', name: 'حبوب ومكرونة', icon: '🌾', color: 'lime' },
  { id: 'spices', name: 'توابل وبهارات', icon: '🌶️', color: 'red' },
  { id: 'sweets', name: 'حلويات', icon: '🍬', color: 'pink' },
  { id: 'cleaning', name: 'مواد تنظيف', icon: '🧹', color: 'purple' },
];

export const revenueSeries = [
  { m: 'يناير', rev: 78, set: 72, ret: 4 },
  { m: 'فبراير', rev: 84, set: 80, ret: 3 },
  { m: 'مارس', rev: 92, set: 86, ret: 5 },
  { m: 'أبريل', rev: 105, set: 99, ret: 4 },
  { m: 'مايو', rev: 118, set: 110, ret: 6 },
  { m: 'يونيو', rev: 124, set: 119, ret: 3 },
];

export const productMix = [
  { name: 'حبوب', value: 34, color: '#1A73E8' },
  { name: 'زيوت', value: 22, color: '#0B1B3B' },
  { name: 'ألبان', value: 18, color: '#15803D' },
  { name: 'معلبات', value: 14, color: '#B45309' },
  { name: 'أخرى', value: 12, color: '#94A3B8' },
];

export const topProducts = [
  { name: 'أرز بسمتي فاخر', units: 4820, revenue: 18400000, share: 92 },
  { name: 'زيت نباتي مكرر', units: 3210, revenue: 14600000, share: 76 },
  { name: 'سكر أبيض نقي', units: 2950, revenue: 11200000, share: 64 },
  { name: 'حليب مجفف', units: 1840, revenue: 9300000, share: 52 },
  { name: 'طحين فاخر', units: 1620, revenue: 7800000, share: 44 },
];

export const geoData = [
  { city: 'صنعاء', value: 4200 },
  { city: 'عدن', value: 3100 },
  { city: 'الحديدة', value: 2400 },
  { city: 'تعز', value: 1850 },
];

export const activityFeed = [
  { icon: Truck, title: 'شحنة SH-2487 سُلِّمت إلى تاجر صنعاء', sub: 'المسار A • تسوية فورية بقيمة ٤٫٢M ر.ي', time: 'منذ ٣د', tone: 'bg-blue-50 text-[#1A73E8]' },
  { icon: DollarSign, title: 'تسوية مالية مكتملة', sub: '٣٢ شحنة • إجمالي ١٢٫٨M ر.ي', time: 'منذ ١٥د', tone: 'bg-green-50 text-green-700' },
  { icon: Package, title: 'طلب جديد من مطاحن عدن', sub: '١٢٠ كرتون أرز بسمتي', time: 'منذ ٣٤د', tone: 'bg-amber-50 text-amber-700' },
  { icon: Truck, title: 'تجميع شحنة تعاونية', sub: 'المسار B • ٤ تجار في حمولة واحدة', time: 'منذ ١ﺳ', tone: 'bg-blue-50 text-[#1A73E8]' },
  { icon: Award, title: 'تجاوز هدف الشهر بنسبة ١٢٪', sub: 'إجمالي الإيرادات ١٢٤٫٨M ر.ي', time: 'منذ ٢ﺳ', tone: 'bg-blue-50 text-[#0B1B3B]' },
];

export const alerts = [
  { icon: AlertCircle, title: 'مخزون منخفض: زيت نباتي', sub: 'تبقّى ١٨ وحدة دون الحد الأدنى', cls: 'bg-amber-50 border-amber-100 text-amber-800' },
  { icon: Clock, title: 'تأخّر تسوية واحدة', sub: 'الشحنة SH-2461 — ٧ ساعات', cls: 'bg-red-50 border-red-100 text-red-800' },
  { icon: TrendingUp, title: 'ارتفاع طلب على المسار C', sub: 'فرصة لرفع التسعير ٤–٦٪', cls: 'bg-blue-50 border-blue-100 text-blue-800' },
];
