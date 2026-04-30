import { X, Upload } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { CATEGORIES, UNITS } from './constants';

interface ProductFormData {
  name: string;
  category: string;
  unit: string;
  quantity: number;
  price: number;
  barcode: string;
  minStock: number;
  expiryDate: string;
  description: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: any | null;
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  onSave: () => void;
  onReset: () => void;
}

export default function AddProductModal({
  isOpen,
  onOpenChange,
  editingProduct,
  formData,
  setFormData,
  onSave,
  onReset
}: AddProductModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50" dir="rtl">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <Dialog.Title className="text-xl text-slate-900">
              {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
            </Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">اسم المنتج *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                placeholder="مثال: أرز بسمتي فاخر"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">الفئة *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  <option value="">اختر الفئة</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">الوحدة *</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  <option value="">اختر الوحدة</option>
                  {UNITS.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">الكمية *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">السعر (ريال) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">الباركود</label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="6281234567890"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">الحد الأدنى للمخزون *</label>
                <input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">تاريخ الانتهاء</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none"
                rows={3}
                placeholder="وصف المنتج..."
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">صورة المنتج</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-1">اضغط لرفع صورة أو اسحبها هنا</p>
                <p className="text-xs text-slate-400">PNG, JPG حتى 10MB</p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3">
            <button
              onClick={() => {
                onOpenChange(false);
                onReset();
              }}
              className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={onSave}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
