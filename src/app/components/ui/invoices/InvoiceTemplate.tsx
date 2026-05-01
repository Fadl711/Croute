import React from 'react';
import { MapPin, Phone, Globe, Package, User, Hash, Calendar } from 'lucide-react';
import type { Order, Shipment, OrderItem } from '../../../../lib/supabase';

interface InvoiceTemplateProps {
  data: Order | Shipment;
  type: "retailer_purchase" | "factory_sale" | "driver_receipt";
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ data, type }, ref) => {
  const isOrder = "order_number" in data;
  const isShipment = "shipment_number" in data;
  
  const docNumber = isOrder ? data.order_number : (isShipment ? data.shipment_number : "N/A");
  const date = new Date(data.created_at).toLocaleDateString("ar-YE", {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  const getTitle = () => {
    switch (type) {
      case "retailer_purchase": return "فاتورة شراء آجل (Purchase Invoice)";
      case "factory_sale": return "فاتورة مبيعات نقدية (Sales Invoice)";
      case "driver_receipt": return "سند استلام شحنة (Delivery Note)";
      default: return "وثيقة رسمية";
    }
  };

  const getSender = () => {
    const d = data as any;
    return {
      name: d.factory?.name || d.factory_name || "مصنع الإنتاج المعتمد",
      address: "المنطقة الصناعية - صنعاء",
      phone: "+967 1 234 567"
    };
  };

  const getReceiver = () => {
    const d = data as any;
    if (type === "retailer_purchase") return { name: d.retailer?.name || "التاجر المستلم", label: "العميل (Receiver)" };
    if (type === "driver_receipt") return { name: d.driver?.name || "الكابتن السائق", label: "الناقل (Carrier)" };
    
    const firstOrderRetailer = d.orders?.[0]?.retailer?.name || d.orders?.retailer?.name;
    return { name: firstOrderRetailer || "الجهة المستلمة", label: "العميل (Receiver)" };
  };

  const getItems = (): OrderItem[] => {
    const d = data as any;
    if (isOrder) return d.order_items || d.items || [];
    if (isShipment && d.orders) {
      const allOrders = Array.isArray(d.orders) ? d.orders : [d.orders];
      return allOrders.flatMap((o: any) => o.order_items || o.items || []);
    }
    return [];
  };

  const items = getItems();
  const total = isOrder ? data.total : (isShipment ? data.total_amount : 0);
  const sender = getSender();
  const receiver = getReceiver();

  return (
    <div 
      ref={ref} 
      className="bg-white p-[15mm] text-slate-900 font-sans leading-tight" 
      dir="rtl"
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      {/* 1. Official Header */}
      <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 border-2 border-slate-900 p-2 flex items-center justify-center">
             <img src="/src/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter">C-ROUTE LOGISTICS</h1>
            <p className="text-xs font-bold text-slate-500">نظام إدارة سلاسل التوريد والخدمات اللوجستية المتكامل</p>
          </div>
        </div>
        <div className="text-left" dir="ltr">
          <h2 className="text-2xl font-black uppercase underline decoration-2 underline-offset-8">{getTitle()}</h2>
        </div>
      </div>

      {/* 2. Document Meta Grid */}
      <div className="grid grid-cols-2 gap-0 border-2 border-slate-900 mb-8">
        <div className="border-l-2 border-slate-900 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xs text-slate-500">رقم الوثيقة:</span>
            <span className="font-black text-lg">{docNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-xs text-slate-500">تاريخ الإصدار:</span>
            <span className="font-black">{date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-xs text-slate-500">الحالة:</span>
            <span className="font-black uppercase text-xs">{data.status}</span>
          </div>
        </div>
        <div className="p-4 bg-slate-50 flex items-center justify-center">
           <div className="text-center">
             <div className="text-[10px] font-black text-slate-400 mb-1">VERIFICATION QR</div>
             <img 
               src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${docNumber}`} 
               alt="QR"
               className="w-16 h-16 mix-blend-multiply"
             />
           </div>
        </div>
      </div>

      {/* 3. Entities Grid */}
      <div className="grid grid-cols-2 gap-0 border-2 border-slate-900 mb-8">
        <div className="border-l-2 border-slate-900 p-4">
          <h3 className="text-[10px] font-black bg-slate-900 text-white px-2 py-1 mb-3 inline-block">الجهة المرسلة (SENDER)</h3>
          <div className="font-black text-lg mb-1">{sender.name}</div>
          <div className="text-sm text-slate-600 space-y-1 font-medium">
            <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {sender.address}</p>
            <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {sender.phone}</p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-[10px] font-black bg-slate-200 text-slate-900 px-2 py-1 mb-3 inline-block">{receiver.label}</h3>
          <div className="font-black text-lg mb-1">{receiver.name}</div>
          <div className="text-xs text-slate-400 italic">تم التحقق من الهوية رقمياً عبر المنصة</div>
        </div>
      </div>

      {/* 4. Products Table */}
      <div className="border-2 border-slate-900 mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-2 border-l border-white/20 text-right text-xs">#</th>
              <th className="p-2 border-l border-white/20 text-right text-xs">اسم الصنف (Description)</th>
              <th className="p-2 border-l border-white/20 text-center text-xs">الكمية</th>
              <th className="p-2 border-l border-white/20 text-left text-xs">السعر</th>
              <th className="p-2 text-left text-xs">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const productName = (item as any).product?.name || (item as any).products?.name || "منتج تجاري";
              return (
                <tr key={item.id} className="border-t border-slate-900">
                  <td className="p-2 border-l border-slate-900 text-xs font-bold text-center">{idx + 1}</td>
                  <td className="p-2 border-l border-slate-900">
                    <div className="text-sm font-black">{productName}</div>
                    <div className="text-[9px] text-slate-400">ID: {item.product_id.split('-')[0]}</div>
                  </td>
                  <td className="p-2 border-l border-slate-900 text-center font-bold">{item.quantity}</td>
                  <td className="p-2 border-l border-slate-900 text-left font-medium">{item.unit_price.toLocaleString()}</td>
                  <td className="p-2 text-left font-black">{(item.quantity * item.unit_price).toLocaleString()}</td>
                </tr>
              );
            })}
            {/* Empty rows to maintain professional look */}
            {[...Array(Math.max(0, 8 - items.length))].map((_, i) => (
              <tr key={`empty-${i}`} className="border-t border-slate-200 h-10">
                <td className="border-l border-slate-200"></td>
                <td className="border-l border-slate-200"></td>
                <td className="border-l border-slate-200"></td>
                <td className="border-l border-slate-200"></td>
                <td></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-900 bg-slate-50">
              <td colSpan={3} className="p-4 border-l-2 border-slate-900">
                <div className="text-[10px] font-black text-slate-500 mb-1">المبلغ بالتفقيط:</div>
                <div className="text-xs font-bold italic underline decoration-slate-300">فقط لا غير.</div>
              </td>
              <td className="p-4 text-left border-l-2 border-slate-900">
                <div className="text-[10px] font-black text-slate-500 mb-1">المجموع النهائي</div>
                <div className="text-2xl font-black">{total.toLocaleString()} <span className="text-[10px]">ر.ي</span></div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 5. Terms and Conditions */}
      <div className="grid grid-cols-3 gap-0 border-2 border-slate-900 mb-8 h-32">
        <div className="border-l-2 border-slate-900 p-3 text-center flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400">توقيع المستلم</span>
          <div className="h-px bg-slate-200 w-2/3 mx-auto" />
        </div>
        <div className="border-l-2 border-slate-900 p-3 text-center flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400">توقيع الناقل</span>
          <div className="h-px bg-slate-200 w-2/3 mx-auto" />
        </div>
        <div className="p-3 text-center flex flex-col justify-between relative overflow-hidden">
          <span className="text-[10px] font-black uppercase text-slate-400">ختم الشركة</span>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 rotate-12">
            <div className="w-20 h-20 border-4 border-blue-600 rounded-full flex items-center justify-center font-black text-blue-600 text-[10px]">C-ROUTE</div>
          </div>
          <div className="h-px bg-slate-200 w-2/3 mx-auto" />
        </div>
      </div>

      <div className="text-[9px] text-slate-400 text-center font-medium">
        هذه الوثيقة صادرة آلياً من نظام C-ROUTE المتكامل ولا تحتاج لختم يدوي في حال التحقق عبر QR CODE.
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
