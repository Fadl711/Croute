import * as Dialog from '@radix-ui/react-dialog';
import { ShoppingCart, X, Truck, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import type { CartItem } from './RetailerDashboard';
import { getProductImage } from './utils';

interface CartDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  cartItemsCount: number;
  groupedByRoute: Record<string, CartItem[]>;
  updateQuantity: (id: string, q: number) => void;
  removeFromCart: (id: string) => void;
  cartTotal: number;
  isCheckingOut: boolean;
  onCheckout: () => void;
}

export default function CartDialog(props: CartDialogProps) {
  const {
    isOpen, onOpenChange, cart, cartItemsCount, groupedByRoute,
    updateQuantity, removeFromCart, cartTotal, isCheckingOut, onCheckout
  } = props;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-0 left-0 bottom-0 bg-white w-full max-w-md shadow-2xl z-50 overflow-y-auto" dir="rtl">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <Dialog.Title className="text-xl text-slate-900 flex items-center gap-2 font-bold">
              <ShoppingCart className="w-5 h-5 text-[#1A73E8]" />
              السلة ({cartItemsCount} منتج)
            </Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-24 px-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🛒</div>
              <h3 className="text-lg text-slate-900 font-bold mb-2">السلة فارغة</h3>
              <p className="text-sm text-slate-400">ابدأ بإضافة منتجات مذهلة من السوق لعملك</p>
            </div>
          ) : (
            <>
              <div className="p-6 space-y-6">
                {Object.entries(groupedByRoute).map(([route, items]) => (
                  <div key={route} className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/60">
                      <Truck className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-bold text-slate-900">{route}</span>
                      <span className="text-xs text-slate-500 mr-auto bg-white px-2 py-1 rounded-lg border border-slate-100">
                        {items.length} منتجات
                      </span>
                    </div>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                          <div className="w-14 h-14 rounded-lg bg-slate-50 flex items-center justify-center text-2xl border border-slate-100">
                            {getProductImage(item.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 mb-0.5 truncate">{item.name}</h4>
                            <div className="text-xs text-[#1A73E8] font-bold mb-3">{item.price.toLocaleString()} ر.ي</div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                                <button
                                  onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                                  className="w-7 h-7 rounded-md bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm w-10 text-center font-bold">{item.cartQuantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                                  className="w-7 h-7 rounded-md bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-left shrink-0">
                            <div className="text-sm font-black text-slate-900 tabular-nums">
                              {(item.price * item.cartQuantity).toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400">ر.ي</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>المجموع الفرعي</span>
                    <span className="tabular-nums font-medium">{cartTotal.toLocaleString()} ر.ي</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-emerald-600 font-bold">
                    <span>خصم المسارات المجمّعة (٣٠٪)</span>
                    <span className="tabular-nums">-{(cartTotal * 0.3).toLocaleString()} ر.ي</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">الإجمالي النهائي</span>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#1A73E8] tabular-nums">
                        {(cartTotal * 0.7).toLocaleString()} <span className="text-xs font-normal">ر.ي</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={onCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-[#1A73E8] hover:bg-[#0B1B3B] disabled:bg-slate-300 text-white py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{isCheckingOut ? 'جاري معالجة الطلب...' : 'تأكيد الطلب بالائتمان'}</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                  🔒 جميع المعاملات مؤمنة بضمان C-Route • فترة سماح ٤٥ يوم
                </p>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
