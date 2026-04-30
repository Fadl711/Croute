import { motion } from 'motion/react';
import { FileText, ShieldCheck, User, Clock, AlertCircle } from 'lucide-react';

interface AuditTabProps {
  auditLog: any[];
}

export default function AuditTab({ auditLog }: AuditTabProps) {
  return (
    <motion.div
      key="audit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black mb-2">سجل التدقيق الرقمي (Immutable Audit Log)</h3>
            <p className="text-slate-500 text-sm">توثيق كامل لكل العمليات التي تمت على المنصة لأغراض الشفافية والرقابة</p>
          </div>
          <div className="flex gap-4">
             <button className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all text-sm">تنزيل السجل الكامل</button>
             <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                تحقق من التشفير
             </button>
          </div>
        </div>

        <div className="relative space-y-8">
          <div className="absolute right-8 top-0 bottom-0 w-px bg-slate-800" />
          
          {auditLog.length === 0 ? (
            <div className="text-center py-20 text-slate-500 italic">لا يوجد سجلات حتى الآن</div>
          ) : (
            auditLog.map((log) => (
              <div key={log.id} className="relative pr-16 group">
                <div className={`absolute right-6 top-1 w-4 h-4 rounded-full border-4 border-slate-900 z-10 ${
                  log.type === 'settlement' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} />
                
                <div className="bg-slate-950/50 border border-slate-800/50 p-6 rounded-3xl hover:border-blue-500/30 transition-all group-hover:bg-slate-900/50">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                         <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-slate-200">{log.action}</span>
                            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-mono tracking-tighter">ID: {log.id}</span>
                         </div>
                         <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                               <User className="w-3.5 h-3.5" />
                               <span>الفاعل: {log.user}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                               <Clock className="w-3.5 h-3.5" />
                               <span>{log.time}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="text-right">
                            <div className="text-[10px] text-slate-500 font-black uppercase mb-1">الهدف</div>
                            <div className="text-xs font-bold text-blue-400">{log.target || 'نظام غرفة المقاصة'}</div>
                         </div>
                         <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                            <AlertCircle className="w-5 h-5 text-slate-600" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
