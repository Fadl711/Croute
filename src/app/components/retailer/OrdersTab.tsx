import { motion } from 'motion/react';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Eye, FileText, ChevronLeft, Calendar } from 'lucide-react';
import type { Order } from '../../../lib/supabase';

interface OrdersTabProps {
  orders: Order[];
}

export default function OrdersTab({ orders = [] }: OrdersTabProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending_factory':
        return { label: 'بانتظار المصنع', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock };
      case 'approved':
        return { label: 'تم القبول - قيد التجهيز', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Package };
      case 'in_transit':
        return { label: 'في الطريق إليك', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Truck };
      case 'delivered':
      case 'completed':
        return { label: 'تم التسليم بنجاح', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle };
      case 'cancelled':
        return { label: 'ملغي', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileText };
    }
  };

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-20"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#0B1B3B] mb-1">تتبع مشترياتي</h2>
          <p className="text-sm text-slate-500">راقب حالة طلباتك من المصانع مباشرة</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
             إجمالي الطلبات: {orders.length}
           </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-20 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">📦</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد طلبات حتى الآن</h3>
          <p className="text-slate-400 max-w-md mx-auto">عندما تقوم بالشراء من سوق الجملة، ستظهر طلباتك هنا لتتبع حالتها ومسار توصيلها.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const status = getStatusInfo(order.status);
            const StatusIcon = status.icon;
            
            return (
              <motion.div
                key={order.id}
                whileHover={{ scale: 1.005 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center gap-6"
              >
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center min-w-[100px]">
                  <StatusIcon className={`w-8 h-8 mb-2 ${status.color.split(' ')[1]}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">الحالة</span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h4 className="text-lg font-black text-slate-900">{order.order_number}</h4>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(order.created_at).toLocaleDateString('ar-YE')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{order.route || 'مسار قيد التحديد'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                       <Package className="w-3.5 h-3.5" />
                       <span>{order.items?.length || 0} منتجات</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-r border-slate-100 pt-4 md:pt-0 md:pr-8 mt-2 md:mt-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 mb-1">إجمالي المبلغ</div>
                    <div className="text-xl font-black text-slate-900 tabular-nums">
                      {order.total.toLocaleString()}
                      <span className="text-xs font-normal text-slate-400 mr-1">ر.ي</span>
                    </div>
                  </div>
                  <button className="bg-slate-900 hover:bg-[#1A73E8] text-white p-3 rounded-2xl transition-all shadow-lg shadow-slate-200 active:scale-95">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
