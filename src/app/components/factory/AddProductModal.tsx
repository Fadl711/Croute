import React from 'react';
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
  image_url?: string | null;
}

interface AddProductModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: any | null;
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  onSave: () => void;
  onReset: () => void;
  onImageChange: (file: File | null) => void;
}

export default function AddProductModal({
  isOpen,
  onOpenChange,
  editingProduct,
  formData,
  setFormData,
  onSave,
  onReset,
  onImageChange
}: AddProductModalProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const removeImage = () => {
    onImageChange(null);
    setFormData({ ...formData, image_url: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50" dir="rtl">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <Dialog.Title className="text-xl text-slate-900 font-bold">
              {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
            </Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2 font-bold">صورة المنتج</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300 group/upload ${
                  formData.image_url 
                    ? 'border-emerald-500 h-64 shadow-inner bg-slate-50' 
                    : 'border-slate-200 h-40 hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer shadow-sm'
                }`}
              >
                {formData.image_url ? (
                  <>
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                       <div className="flex flex-col items-center gap-2 text-white">
                         <Upload className="w-8 h-8" />
                         <span className="text-xs font-bold">تغيير الصورة</span>
                       </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-4 left-4 bg-red-500/90 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110 z-20"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[10px] font-black py-2 text-center uppercase tracking-widest">
                      تم اختيار الصورة بنجاح
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-900 font-black">اضغط لرفع صورة المنتج</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG حتى 10MB</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2 font-medium">اسم المنتج *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="مثال: أرز بسمتي فاخر"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2 font-medium">الفئة *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                >
                  <option value="">اختر الفئة</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2 font-medium">الوحدة *</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                >
                  <option value="">اختر الوحدة</option>
                  {UNITS.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2 font-medium">الكمية *</label>
                <input
                  type="number"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value === '' ? 0 : Number(e.target.value) })}
                  onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2 font-medium">السعر (ريال) *</label>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? 0 : Number(e.target.value) })}
                  onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2 font-medium">الباركود</label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="6281234567890"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2 font-medium">الحد الأدنى للمخزون *</label>
                <input
                  type="number"
                  value={formData.minStock || ''}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value === '' ? 0 : Number(e.target.value) })}
                  onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2 font-medium">تاريخ الانتهاء</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2 font-medium">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none shadow-sm"
                rows={2}
                placeholder="وصف المنتج..."
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-slate-50/90 backdrop-blur-md border-t border-slate-200 px-6 py-4 flex gap-3 z-30">
            <button
              onClick={() => {
                onOpenChange(false);
                onReset();
              }}
              className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold shadow-sm active:scale-95"
            >
              إلغاء
            </button>
            <button
              onClick={onSave}
              className="flex-1 px-4 py-3 bg-[#0B1B3B] text-white rounded-xl hover:bg-[#1A73E8] transition-all font-bold shadow-lg shadow-blue-900/10 active:scale-95"
            >
              {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
