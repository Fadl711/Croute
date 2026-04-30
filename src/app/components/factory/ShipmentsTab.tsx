import { motion } from 'motion/react';
import { PackageCheck, Package, MapPin } from 'lucide-react';
import type { Shipment, Order } from '../../../lib/supabase';

interface ShipmentsTabProps {
  shipments: Shipment[];
  incomingOrders: Order[];
  onAcceptOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string) => void;
}

export default function ShipmentsTab({ shipments, incomingOrders, onAcceptOrder, onRejectOrder }: ShipmentsTabProps) {
  return (
    <motion.div
      key="shipments"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Incoming Orders Section */}
      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
        <h2 className="text-xl mb-4 font-semibold text-slate-800 flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-500" />
          طلبات جديدة بانتظار الاعتماد
          {incomingOrders.length > 0 && (
            <span className="bg-amber-100 text-amber-700 text-sm px-2 py-0.5 rounded-full">
              {incomingOrders.length}
            </span>
          )}
        </h2>
        
        {incomingOrders.length === 0 ? (
          <p className="text-slate-500 text-center py-6">لا توجد طلبات جديدة حالياً</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomingOrders.map(order => (
              <div key={order.id} className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow border-r-4 border-r-amber-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{order.order_number}</div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      {order.route || 'مسار غير محدد'}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[#1A73E8] bg-white px-2 py-1 rounded-lg border border-blue-50">
                    {order.total.toLocaleString('ar-YE')} <span className="text-[9px] text-slate-500 font-normal">ر.ي</span>
                  </div>
                </div>

                {/* Details list */}
                <div className="flex-1 space-y-2 mb-4 mt-2">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">تفاصيل المنتجات</div>
                  <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                    {order.items?.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-[11px] bg-white/50 p-1.5 rounded-md border border-amber-100/30">
                        <span className="text-slate-700 font-medium">
                          {item.product?.name || 'منتج مجهول'} 
                          <span className="text-amber-600 mr-1">×{item.quantity}</span>
                        </span>
                        <span className="text-slate-500">{(item.unit_price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto pt-2">
                  <button 
                    onClick={() => onAcceptOrder(order.id)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-amber-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <PackageCheck className="w-4 h-4" />
                    اعتماد الطلب وتجهيز الشحنة
                  </button>
                  <button 
                    onClick={() => onRejectOrder(order.id)}
                    className="w-full mt-2 bg-red-50 text-red-600 py-2 rounded-xl text-[10px] font-bold hover:bg-red-100 transition-all border border-red-100"
                  >
                    إلغاء الطلب
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Existing Shipments Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl mb-6 font-semibold text-slate-800">الشحنات الصادرة (Active Shipments)</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 rounded-tr-xl">رقم الشحنة</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">المسار</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">تاريخ الإنشاء</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">الحالة</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 rounded-tl-xl">إجمالي المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-4 text-emerald-600 font-medium">{shipment.shipment_number}</td>
                  <td className="px-4 py-4 text-slate-700">{shipment.route || 'مسار غير محدد'}</td>
                  <td className="px-4 py-4 text-slate-500 text-sm">{new Date(shipment.created_at).toLocaleDateString('ar-YE')}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      shipment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {shipment.status === 'completed' ? 'مكتملة' : 
                       shipment.status === 'in_transit' ? 'في الطريق' : 'قيد التجهيز'}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-800">{shipment.total_amount.toLocaleString('ar-YE')} ر.ي</td>
                </tr>
              ))}
              {shipments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    لا توجد شحنات حالية
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
