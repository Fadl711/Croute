import React from "react";
import { motion } from "motion/react";
import { 
  Activity, 
  MapPin, 
  Phone, 
  Globe, 
  Printer, 
  X, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Order, Shipment, OrderItem } from "../../lib/supabase";
import { InvoiceTemplate } from "./invoices/InvoiceTemplate";
import { printComponent } from "./invoices/PrintService";

interface InvoiceDocumentProps {
  data: Order | Shipment;
  type: "retailer_purchase" | "factory_sale" | "driver_receipt";
  onClose: () => void;
}

export default function InvoiceDocument({ data, type, onClose }: InvoiceDocumentProps) {
  const isOrder = "order_number" in data;
  const isShipment = "shipment_number" in data;
  
  const docNumber = isOrder ? data.order_number : (isShipment ? data.shipment_number : "N/A");
  const date = new Date(data.created_at).toLocaleDateString("ar-YE", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getTitle = () => {
    switch (type) {
      case "retailer_purchase": return "فاتورة مشتريات آجل";
      case "factory_sale": return "فاتورة مبيعات نقدية";
      case "driver_receipt": return "سند استلام وتسليم شحنة";
      default: return "وثيقة رسمية";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed": return "مكتملة";
      case "approved": return "معتمدة";
      case "in_transit": return "قيد التوصيل";
      case "pending_factory": return "قيد الانتظار";
      default: return status;
    }
  };

  const getItems = (): OrderItem[] => {
    const d = data as any;
    if (isOrder) return d.order_items || d.items || [];
    
    // For shipments, aggregate all items from all orders
    if (isShipment && d.orders) {
      const allOrders = Array.isArray(d.orders) ? d.orders : [d.orders];
      return allOrders.flatMap((o: any) => o.order_items || o.items || []);
    }
    
    return [];
  };

  const items = getItems();
  const total = isOrder ? data.total : (isShipment ? data.total_amount : 0);

  const handlePrint = () => {
    printComponent(<InvoiceTemplate data={data} type={type} />);
  };

  const getSenderName = () => {
    const d = data as any;
    return d.factory?.name || d.factory_name || "مصنع الإنتاج المعتمد";
  };

  const getReceiverName = () => {
    const d = data as any;
    if (type === "retailer_purchase") return d.retailer?.name || "التاجر المستلم";
    if (type === "driver_receipt") return d.driver?.name || "الكابتن السائق";
    
    // For shipments, retailer might be in the first order
    const firstOrderRetailer = d.orders?.[0]?.retailer?.name || d.orders?.retailer?.name;
    return firstOrderRetailer || "الجهة المستلمة";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-4 md:p-8 overflow-y-auto print:p-0 print:bg-white print:backdrop-blur-none print:relative print:z-0 print:block">
      {/* Action Buttons (Hidden on Print) */}
      <div className="fixed top-6 left-6 flex gap-3 print:hidden z-[110]">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-2xl shadow-blue-600/40 transition-all active:scale-95 text-lg"
        >
          <Printer className="w-6 h-6" />
          طباعة الفاتورة الرسمية
        </button>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-2xl backdrop-blur-md transition-all active:scale-95 border border-white/10"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-none print:shadow-none print:m-0"
        dir="rtl"
      >
        <InvoiceTemplate data={data} type={type} />
      </motion.div>
      
      {/* Global CSS for Print */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { 
            size: A4; 
            margin: 0; 
          }
          
          /* Force the print section to cover everything */
          #print-section {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            z-index: 9999999 !important;
            background: white !important;
            visibility: visible !important;
            display: block !important;
            margin: 0 !important;
            padding: 20mm !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Hide everything else visually without using display: none on parents */
          body > *:not(#root), #root > *:not(.invoice-parent) {
            /* We can't easily target the specific parent, so we'll just rely on the invoice being on top */
          }

          /* Better approach: hide everything else and only show the invoice path */
          header, nav, aside, footer, button, .no-print, .print\\:hidden {
            display: none !important;
          }

          /* Fix for flex/grid inside the invoice */
          #print-section .flex { display: flex !important; }
          #print-section .grid { display: grid !important; }
        }
      `}} />
    </div>
  );
}
