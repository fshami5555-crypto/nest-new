
import React, { useState } from 'react';
import { UserProfile, Product, CartItem } from '../types';
import { fsAddDoc } from '../firebase';
import { ShoppingBag, ShoppingCart, X, CreditCard, MapPin, Truck } from 'lucide-react';

const PRODUCTS: Product[] = [
  { id: '1', name: 'سيروم فيتامين سي', price: 15, imageUrl: 'https://picsum.photos/seed/p1/400/400', description: 'نضارة فورية لبشرتكِ', category: 'عناية' },
  { id: '2', name: 'مجموعة العناية بالأم', price: 45, imageUrl: 'https://picsum.photos/seed/p2/400/400', description: 'كل ما تحتاجه الأم بعد الولادة', category: 'أسرة' },
  { id: '3', name: 'مكملات غذائية طبيعية', price: 25, imageUrl: 'https://picsum.photos/seed/p3/400/400', description: 'طاقة ونشاط طوال اليوم', category: 'رشاقة' },
  { id: '4', name: 'مرطب شفاه وردي', price: 5, imageUrl: 'https://picsum.photos/seed/p4/400/400', description: 'ترطيب عميق ولون جذاب', category: 'جمال' },
];

const JORDAN_GOVERNORATES = ["عمان", "الزرقاء", "إربد", "المفرق", "جرش", "عجلون", "البلقاء", "مادبا", "الكرك", "الطفيلة", "معان", "العقبة"];

interface StoreProps {
  user: UserProfile;
}

const Store: React.FC<StoreProps> = ({ user }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({ governorate: 'عمان', address: '' });
  const [ordering, setOrdering] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 3;

  const handlePlaceOrder = async () => {
    setOrdering(true);
    try {
      await fsAddDoc("orders", {
        userId: user.id,
        customerName: user.name,
        phone: user.phone,
        items: cart,
        total: total + shippingFee,
        status: 'قيد الانتظار',
        governorate: shippingInfo.governorate,
        address: shippingInfo.address
      });
      alert("تم استلام طلبكِ بنجاح! سنتصل بكِ قريباً.");
      setCart([]);
      setShowCart(false);
      setCheckoutStep(1);
    } catch (err) {
      alert("حدث خطأ أثناء الطلب.");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800">متجر نست</h2>
          <p className="text-gray-500 text-sm">منتجات مختارة بعناية لجمالكِ وصحتكِ</p>
        </div>
        <button 
          onClick={() => setShowCart(true)}
          className="relative bg-pink-600 text-white p-4 rounded-2xl shadow-lg shadow-pink-200"
        >
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -left-2 bg-yellow-400 text-pink-800 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {PRODUCTS.map(product => (
          <div key={product.id} className="glass rounded-3xl overflow-hidden group">
            <div className="relative overflow-hidden aspect-square">
              <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
              <div className="absolute top-2 right-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase">{product.category}</div>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{product.name}</h3>
              <p className="text-[10px] text-gray-400 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-pink-600 font-black">{product.price} JOD</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-pink-100 text-pink-600 p-2 rounded-xl hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="glass max-w-md w-full rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-pink-600 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <ShoppingCart size={20} /> سلة التسوق
              </h3>
              <button onClick={() => {setShowCart(false); setCheckoutStep(1);}}><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {checkoutStep === 1 ? (
                <>
                  {cart.length > 0 ? (
                    cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-white/50 p-3 rounded-2xl">
                        <div>
                          <p className="font-bold text-sm text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.price} JOD × {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 p-2"><X size={16} /></button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">السلة فارغة حالياً</div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <MapPin size={16} className="text-pink-600" /> المحافظة
                    </label>
                    <select
                      value={shippingInfo.governorate}
                      onChange={(e) => setShippingInfo({...shippingInfo, governorate: e.target.value})}
                      className="w-full bg-pink-50 border border-pink-100 rounded-xl p-3 outline-none"
                    >
                      {JORDAN_GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Truck size={16} className="text-pink-600" /> العنوان التفصيلي
                    </label>
                    <textarea
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="w-full bg-pink-50 border border-pink-100 rounded-xl p-3 outline-none"
                      rows={3}
                      placeholder="اسم الشارع، رقم البناية، علامة مميزة..."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t border-pink-50 space-y-4">
              <div className="flex justify-between items-center font-bold text-gray-800">
                <span>الإجمالي</span>
                <span className="text-pink-600 text-xl">{total > 0 ? total + shippingFee : 0} JOD</span>
              </div>
              <p className="text-[10px] text-gray-400 text-center">* شامل رسوم التوصيل (3 JOD)</p>
              
              {checkoutStep === 1 ? (
                <button 
                  disabled={cart.length === 0}
                  onClick={() => setCheckoutStep(2)}
                  className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-pink-200 disabled:opacity-50"
                >
                  إتمام الطلب
                </button>
              ) : (
                <div className="flex gap-2">
                   <button 
                    onClick={() => setCheckoutStep(1)}
                    className="flex-1 border border-pink-200 text-pink-600 py-4 rounded-2xl font-bold"
                  >
                    السابق
                  </button>
                  <button 
                    disabled={ordering || !shippingInfo.address}
                    onClick={handlePlaceOrder}
                    className="flex-[2] bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-pink-200 flex items-center justify-center gap-2"
                  >
                    {ordering ? 'جاري الإرسال...' : 'تأكيد الشراء'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
