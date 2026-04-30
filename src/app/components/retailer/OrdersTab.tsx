import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Eye, FileText, ChevronLeft, Calendar } from 'lucide-react';
import type { Order } from '../../../lib/supabase';

interface OrdersTabProps {
  orders: Order[];
}

export default function OrdersTab({ orders = [] }: OrdersTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="bg-slate-900 hover:bg-[#1A73E8] text-white p-3 rounded-2xl transition-all shadow-lg shadow-slate-200 active:scale-95"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal - Classic Professional Design */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh] border border-slate-200"
            >
              {/* Invoice Header */}
              <div className="p-8 border-b-2 border-dashed border-slate-100 flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest mb-1">C-Route Official Invoice</div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">فاتورة ضريبية</h3>
                  <div className="mt-4 space-y-1">
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-bold text-slate-700">رقم الفاتورة:</span>
                      <span className="tabular-nums">{selectedOrder.order_number}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-bold text-slate-700">التاريخ:</span>
                      <span className="tabular-nums">{new Date(selectedOrder.created_at).toLocaleDateString('ar-YE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border-2 ${getStatusInfo(selectedOrder.status).color}`}>
                    {getStatusInfo(selectedOrder.status).label}
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="mt-6 p-2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Invoice Body */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-8">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">تفاصيل المنتجات</h4>
                  <div className="space-y-0">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                      <div className="col-span-6">المنتج</div>
                      <div className="col-span-2 text-center">الكمية</div>
                      <div className="col-span-4 text-left">الإجمالي</div>
                    </div>
                    
                    {/* Items */}
                    {(() => {
                      const items = (selectedOrder as any).order_items || (selectedOrder as any).items || [];
                      return items.map((item: any) => {
                        // Handle different join names and formats
                        const productData = item.products || item.product;
                        const product = Array.isArray(productData) ? productData[0] : productData;
                        const productName = product?.name || 'منتج مجهول';
                        
                        return (
                          <div key={item.id} className="grid grid-cols-12 gap-4 py-4 border-b border-slate-50 items-center">
                            <div className="col-span-6">
                              <div className="text-sm font-bold text-slate-800">{productName}</div>
                              <div className="text-[10px] text-slate-400 tabular-nums">سعر الوحدة: {item.unit_price.toLocaleString()} ر.ي</div>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="text-xs font-bold text-slate-700 tabular-nums">×{item.quantity}</span>
                            </div>
                            <div className="col-span-4 text-left">
                              <span className="text-sm font-black text-slate-900 tabular-nums">{(item.quantity * item.unit_price).toLocaleString()} ر.ي</span>
                            </div>
                          </div>
                        );
                      });
                    })()}

                    {((selectedOrder as any).order_items || (selectedOrder as any).items || []).length === 0 && (
                      <div className="py-8 text-center text-slate-400 text-xs italic">
                        لا توجد تفاصيل متوفرة لهذه الفاتورة
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t-2 border-slate-100">
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase mb-2">طريقة الدفع</h5>
                    <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      ائتمان C-Route المباشر
                    </div>
                  </div>
                  <div className="text-left">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase mb-2">مسار التوصيل</h5>
                    <div className="text-sm font-bold text-slate-700">{selectedOrder.route || 'قيد الجدولة'}</div>
                  </div>
                </div>
              </div>

              {/* Invoice Footer */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 relative">
                {/* Stamp effect */}
                <div className="absolute top-1/2 left-12 -translate-y-1/2 opacity-10 -rotate-12 pointer-events-none">
                  <div className="border-4 border-slate-900 p-2 rounded-xl text-center">
                    <div className="text-xl font-black text-slate-900">APPROVED</div>
                    <div className="text-[8px] font-bold text-slate-900">C-ROUTE SYSTEM V1.0</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>المبلغ الصافي</span>
                    <span className="tabular-nums">{(selectedOrder.total / 0.7).toLocaleString()} ر.ي</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
                    <span>خصم المسار (30%-)</span>
                    <span className="tabular-nums">-{( (selectedOrder.total / 0.7) - selectedOrder.total ).toLocaleString()} ر.ي</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2" />
                  <div className="flex justify-between items-end">
                    <div className="text-sm font-black text-slate-900">الإجمالي النهائي</div>
                    <div className="text-3xl font-black text-slate-900 tabular-nums">
                      {selectedOrder.total.toLocaleString()}
                      <span className="text-xs font-normal text-slate-400 mr-2 uppercase">YER</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Decorative Edge */}
              <div className="h-2 bg-slate-100 w-full flex overflow-hidden">
                {Array.from({length: 20}).map((_, i) => (
                  <div key={i} className="min-w-[20px] h-4 bg-white rounded-full -mt-2 mx-1 shadow-inner" />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
