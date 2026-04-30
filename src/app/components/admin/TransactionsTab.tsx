import { motion } from 'motion/react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, Wallet } from 'lucide-react';

interface TransactionsTabProps {
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  filterType: string;
  setFilterType: (f: string) => void;
  showFilters: boolean;
  setShowFilters: (b: boolean) => void;
  paginatedTransactions: any[];
  currentPage: number;
  setCurrentPage: (p: number) => void;
  totalPages: number;
}

export default function TransactionsTab(props: TransactionsTabProps) {
  const { 
    searchQuery, setSearchQuery, filterType, setFilterType,
    showFilters, setShowFilters, paginatedTransactions,
    currentPage, setCurrentPage, totalPages 
  } = props;

  return (
    <motion.div
      key="transactions"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="بحث برقم العملية، المتجر، أو المصنع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border-slate-800 focus:border-blue-500 rounded-2xl pr-12 pl-4 py-4 text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-4 rounded-2xl border transition-all ${showFilters ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button className="flex-1 md:flex-none bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-slate-800 transition-all">
            <Download className="w-5 h-5" />
            تصدير CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">المعرف</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">من</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">إلى</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">المبلغ</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">النوع</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">الحالة</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">التوقيت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-blue-500/5 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="font-mono text-blue-400 font-bold">#{tx.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-slate-700" />
                       <span className="text-sm font-bold">{tx.from}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-blue-500" />
                       <span className="text-sm font-bold">{tx.to}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-black tabular-nums">{tx.amount.toLocaleString()} ر.ي</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      tx.type === 'تسوية' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      tx.type === 'ائتمان' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {tx.status === 'مكتمل' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : tx.status === 'قيد المعالجة' ? (
                        <Clock className="w-4 h-4 text-amber-500 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">{tx.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500">{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
           <div className="text-xs text-slate-500">عرض صفحة {currentPage} من {totalPages}</div>
           <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 hover:bg-slate-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                 {[...Array(totalPages)].map((_, i) => (
                   <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i+1 ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-500'}`}
                   >
                     {i + 1}
                   </button>
                 ))}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 hover:bg-slate-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
