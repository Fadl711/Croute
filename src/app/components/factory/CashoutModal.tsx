import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, DollarSign, AlertCircle, Zap, Check } from 'lucide-react';

interface CashoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  factoryBalance: number;
  requestCashout: (amount: number, bank: string, account: string) => Promise<any>;
}

export default function CashoutModal({ isOpen, onClose, factoryBalance, requestCashout }: CashoutModalProps) {
  const [cashoutAmount, setCashoutAmount] = useState('');
  const [cashoutBank, setCashoutBank] = useState('بنك التضامن الإسلامي');
  const [cashoutAccount, setCashoutAccount] = useState('•••• ٤٢٨١');
  const [cashoutProcessing, setCashoutProcessing] = useState(false);
  const [cashoutResult, setCashoutResult] = useState<{success?: boolean; net?: number; fee?: number; error?: string} | null>(null);

  const handleCashout = async () => {
    const amount = parseInt(cashoutAmount.replace(/[^0-9]/g, ''));
    if (!amount || amount <= 0) return;
    setCashoutProcessing(true);
    setCashoutResult(null);
    const result = await requestCashout(amount, cashoutBank, cashoutAccount);
    setCashoutResult(result);
    setCashoutProcessing(false);
    if (result.success) {
      setTimeout(() => {
        onClose();
        setCashoutAmount('');
        setCashoutResult(null);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0B1B3B]/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-[#0B1B3B] p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-5 h-5" />
            <span className="text-sm tracking-wider">سحب فوري</span>
          </div>
          <div className="text-[11px] text-white/70 mb-1">الرصيد المتاح</div>
          <div className="text-3xl tabular-nums">
            {factoryBalance.toLocaleString('ar-YE')} <span className="text-base text-white/70">ر.ي</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {cashoutResult?.success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl text-[#0B1B3B] mb-2">تم السحب بنجاح!</h3>
              <p className="text-slate-500 mb-1">المبلغ المحوّل</p>
              <p className="text-3xl text-emerald-600 tabular-nums">
                {cashoutResult.net?.toLocaleString()} <span className="text-sm text-slate-400">ر.ي</span>
              </p>
              <p className="text-xs text-slate-400 mt-2">
                رسوم المعالجة: {cashoutResult.fee?.toLocaleString()} ر.ي (3%)
              </p>
            </motion.div>
          ) : (
            <>
              {/* Amount Input */}
              <div>
                <label className="text-sm text-slate-600 mb-2 block">مبلغ السحب (ر.ي)</label>
                <input
                  type="text"
                  value={cashoutAmount}
                  onChange={(e) => setCashoutAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="أدخل المبلغ..."
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0B1B3B] text-lg text-center tabular-nums focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition"
                />
                {/* Quick amounts */}
                <div className="flex gap-2 mt-2">
                  {[1000000, 5000000, 10000000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setCashoutAmount(String(amt))}
                      className="flex-1 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-600 hover:bg-[#1A73E8]/10 hover:text-[#1A73E8] transition"
                    >
                      {(amt / 1000000).toFixed(0)}M
                    </button>
                  ))}
                </div>
              </div>

              {/* Fee Preview */}
              {cashoutAmount && parseInt(cashoutAmount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">المبلغ</span>
                    <span className="text-[#0B1B3B] tabular-nums">{parseInt(cashoutAmount).toLocaleString()} ر.ي</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-700">رسوم المعالجة (3%)</span>
                    <span className="text-amber-700 tabular-nums">-{Math.ceil(parseInt(cashoutAmount) * 0.03).toLocaleString()} ر.ي</span>
                  </div>
                  <div className="border-t border-amber-200 pt-2 flex justify-between">
                    <span className="text-sm font-medium text-[#0B1B3B]">المبلغ الصافي</span>
                    <span className="text-lg text-emerald-600 tabular-nums">
                      {(parseInt(cashoutAmount) - Math.ceil(parseInt(cashoutAmount) * 0.03)).toLocaleString()} ر.ي
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Bank Account */}
              <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0B1B3B] rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#0B1B3B]">{cashoutBank}</div>
                  <div className="text-xs text-slate-400">{cashoutAccount}</div>
                </div>
              </div>

              {cashoutResult?.error && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {cashoutResult.error}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleCashout}
                disabled={cashoutProcessing || !cashoutAmount || parseInt(cashoutAmount) <= 0}
                className="w-full py-4 bg-gradient-to-l from-[#0B1B3B] to-[#1A73E8] text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {cashoutProcessing ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> جاري المعالجة...</>
                ) : (
                  <><Zap className="w-5 h-5" /> تأكيد السحب الفوري</>
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
