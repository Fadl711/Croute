import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Hash,
  Calendar,
  ShieldCheck,
  Printer,
} from "lucide-react";
import type { Order, Shipment, OrderItem } from "../../../../lib/supabase";

interface InvoiceTemplateProps {
  data: Order | Shipment;
  type: "retailer_purchase" | "factory_sale" | "driver_receipt";
}

export const InvoiceTemplate = React.forwardRef<
  HTMLDivElement,
  InvoiceTemplateProps
>(({ data, type }, ref) => {
  const isOrder = "order_number" in data;
  const isShipment = "shipment_number" in data;

  const docNumber = isOrder
    ? data.order_number
    : isShipment
    ? data.shipment_number
    : "N/A";
  const date = new Date(data.created_at).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const getTitle = () => {
    switch (type) {
      case "retailer_purchase":
        return { ar: "فاتورة شراء آجل", en: "PURCHASE INVOICE" };
      case "factory_sale":
        return { ar: "فاتورة مبيعات نقدية", en: "SALES INVOICE" };
      case "driver_receipt":
        return { ar: "سند استلام شحنة", en: "DELIVERY NOTE" };
      default:
        return { ar: "وثيقة رسمية", en: "OFFICIAL DOCUMENT" };
    }
  };

  const getSender = () => {
    const d = data as any;
    return {
      name: d.factory?.name || d.factory_name || "سي روت لوجيستيكس",
      address: d.factory?.city || "صنعاء، اليمن",
      phone: d.factory?.phone || "+967 777 000 000",
      email: d.factory?.email || "info@c-route.com",
    };
  };

  const getReceiver = () => {
    const d = data as any;
    const receiverData =
      type === "retailer_purchase"
        ? d.retailer
        : type === "driver_receipt"
        ? d.driver
        : d.orders?.[0]?.retailer || d.retailer;

    return {
      name: receiverData?.name || "الجهة المستلمة",
      address: receiverData?.city || "الموقع المعتمد",
      phone: receiverData?.phone || "غير مسجل",
      label: type === "driver_receipt" ? "الناقل (Carrier)" : "العميل (Client)",
    };
  };

  const getItems = (): OrderItem[] => {
    const d = data as any;
    if (isOrder) return d.order_items || d.items || [];
    if (isShipment) {
      if (d.orders) {
        const allOrders = Array.isArray(d.orders) ? d.orders : [d.orders];
        return allOrders.flatMap((o: any) => o.order_items || o.items || []);
      }
      if (d.shipment_items) return d.shipment_items;
    }
    return [];
  };

  const items = getItems();
  const total = isOrder ? data.total : isShipment ? data.total_amount : 0;
  const sender = getSender();
  const receiver = getReceiver();
  const titles = getTitle();

  return (
    <div
      ref={ref}
      className="bg-white p-[20mm] text-black font-sans print:p-0"
      dir="rtl"
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        color: "#1a1a1a",
      }}
    >
      {/* --- HEADER SECTION --- */}
      <div className="flex justify-between items-start border-b-[3px] border-black pb-8 mb-12">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 bg-white border-2 border-black flex items-center justify-center p-2">
            <img
              src="/src/assets/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1 text-[#0B1B3B]">C-ROUTE</h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1A73E8]">
              Logistics Solutions
            </p>
          </div>
        </div>

        <div className="text-left" dir="ltr">
          <h2 className="text-4xl font-black mb-1">{titles.en}</h2>
          <h2 className="text-2xl font-bold text-slate-400" dir="rtl">
            {titles.ar}
          </h2>
        </div>
      </div>

      {/* --- META INFORMATION BAR --- */}
      <div className="grid grid-cols-4 border border-black mb-12">
        <div className="border-l border-black p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Document No.
          </p>
          <p className="font-black text-lg">#{docNumber}</p>
        </div>
        <div className="border-l border-black p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Date of Issue
          </p>
          <p className="font-black text-lg">{date}</p>
        </div>
        <div className="border-l border-black p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Status
          </p>
          <p className="font-black text-sm uppercase px-2 py-0.5 bg-slate-100 inline-block">
            {data.status}
          </p>
        </div>
        <div className="p-2 flex justify-center items-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${docNumber}`}
            alt="QR Verification"
            className="w-16 h-16 opacity-90"
          />
        </div>
      </div>

      {/* --- ADDRESSES SECTION --- */}
      <div className="grid grid-cols-2 gap-20 mb-16">
        <div>
          <h3 className="text-xs font-black text-slate-400 border-b border-slate-200 pb-2 mb-4 uppercase tracking-widest text-right">
            من (From)
          </h3>
          <p className="text-xl font-black mb-2">{sender.name}</p>
          <div className="text-[13px] space-y-1.5 font-medium text-slate-600">
            <p className="flex items-center gap-2">
              <MapPin size={14} /> {sender.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={14} dir="ltr" /> {sender.phone}
            </p>
            <p className="flex items-center gap-2">
              <Mail size={14} /> {sender.email}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-black text-slate-400 border-b border-slate-200 pb-2 mb-4 uppercase tracking-widest text-right">
            إلى (To)
          </h3>
          <p className="text-xl font-black mb-2">{receiver.name}</p>
          <div className="text-[13px] space-y-1.5 font-medium text-slate-600">
            <p className="flex items-center gap-2">
              <MapPin size={14} /> {receiver.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={14} dir="ltr" /> {receiver.phone}
            </p>
            <p className="text-[10px] font-bold text-black mt-4 flex items-center gap-1">
              <ShieldCheck size={12} className="text-black" />
              SECURE LOGISTICS VERIFIED
            </p>
          </div>
        </div>
      </div>

      {/* --- ITEMS TABLE --- */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="border-y-2 border-black">
              <th className="py-4 text-right text-[11px] font-black uppercase">
                #
              </th>
              <th className="py-4 text-right text-[11px] font-black uppercase px-4">
                الوصف (Description)
              </th>
              <th className="py-4 text-center text-[11px] font-black uppercase">
                الكمية (Qty)
              </th>
              <th className="py-4 text-left text-[11px] font-black uppercase px-4">
                السعر (Price)
              </th>
              <th className="py-4 text-left text-[11px] font-black uppercase">
                الإجمالي (Total)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item, idx) => {
              const productName =
                (item as any).product?.name ||
                (item as any).products?.name ||
                "Product Item";
              return (
                <tr key={item.id}>
                  <td className="py-5 text-xs text-slate-400 font-bold">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="py-5 px-4">
                    <p className="font-black text-md">{productName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      REF: {item.product_id.split("-")[0]}
                    </p>
                  </td>
                  <td className="py-5 text-center font-black text-md">
                    {item.quantity}
                  </td>
                  <td className="py-5 px-4 text-left font-bold text-slate-600">
                    {item.unit_price.toLocaleString()}
                  </td>
                  <td className="py-5 text-left font-black text-md">
                    {(item.quantity * item.unit_price).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-black">
              <td colSpan={3} className="py-8">
                <div className="text-[10px] font-black text-slate-400 uppercase mb-1">
                  Declaration
                </div>
                <p className="text-[11px] font-bold text-slate-500 italic max-w-xs leading-relaxed">
                  بضاعة معتمدة وخاضعة لشروط النقل اللوجستي الدولي. يقر المستلم
                  باستلام الكميات المذكورة أعلاه بحالة جيدة.
                </p>
              </td>
              <td colSpan={2} className="py-8 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold px-1">
                    <span>SUBTOTAL</span>
                    <span>{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-black text-white p-4">
                    <span className="text-[10px] font-black tracking-widest">
                      TOTAL DUE
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black leading-none">
                        {total.toLocaleString()}
                      </span>
                      <span className="text-[10px] mr-1 font-bold">YER</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* --- SIGNATURE SECTION --- */}
      <div className="grid grid-cols-3 gap-12 mt-12 mb-20 text-center">
        <div className="space-y-12">
          <div className="border-b border-black mx-auto w-3/4"></div>
          <div>
            <p className="text-[11px] font-black uppercase">Prepared By</p>
            <p className="text-[10px] text-slate-400 font-bold">
              توقيع المسؤول
            </p>
          </div>
        </div>
        <div className="space-y-12">
          <div className="border-b border-black mx-auto w-3/4"></div>
          <div>
            <p className="text-[11px] font-black uppercase">Authorized Stamp</p>
            <p className="text-[10px] text-slate-400 font-bold">
              الختم المعتمد
            </p>
          </div>
        </div>
        <div className="space-y-12">
          <div className="border-b border-black mx-auto w-3/4"></div>
          <div>
            <p className="text-[11px] font-black uppercase">
              Customer Signature
            </p>
            <p className="text-[10px] text-slate-400 font-bold">
              توقيع المستلم
            </p>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-auto border-t border-slate-100 pt-8 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[9px] font-black tracking-[0.2em] text-slate-300 uppercase">
            C-Route Logistics Management System v2.1.0
          </p>
          <p className="text-[9px] font-black text-slate-300">
            © 2026 OFFICIAL DIGITAL RECORD. ALL RIGHTS RESERVED.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-900 uppercase">
              Verification
            </p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
              {data.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = "InvoiceTemplate";
