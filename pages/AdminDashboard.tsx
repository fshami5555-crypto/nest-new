
import React, { useState, useEffect } from 'react';
import { UserProfile, Order, Article, Post } from '../types';
import { fsGetDocs, fsUpdateDoc, fsDeleteDoc } from '../firebase';
import { LayoutDashboard, ShoppingCart, FileText, Users, LogOut, Trash2, CheckCircle, Clock, Truck, Search } from 'lucide-react';

interface AdminDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'articles' | 'users' | 'community'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [ordersData, usersData, postsData] = await Promise.all([
      fsGetDocs<Order>("orders"),
      fsGetDocs<UserProfile>("users"),
      fsGetDocs<Post>("posts")
    ]);
    setOrders(ordersData);
    setUsers(usersData);
    setPosts(postsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    await fsUpdateDoc("orders", orderId, { status: newStatus });
    loadData();
  };

  const deleteOrder = async (id: string) => {
    if (window.confirm("حذف هذا الطلب؟")) {
      await fsDeleteDoc("orders", id);
      loadData();
    }
  };

  const deletePost = async (id: string) => {
    if (window.confirm("حذف هذا المنشور من المجتمع؟")) {
      await fsDeleteDoc("posts", id);
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <img src="https://i.ibb.co/TM561d6q/image.png" className="w-10" alt="Logo" />
          <h1 className="font-black text-xl tracking-tight text-pink-500">لوحة الإدارة</h1>
        </div>

        <div className="space-y-2 flex-1">
          {[
            { id: 'orders', label: 'إدارة الطلبات', icon: ShoppingCart },
            { id: 'community', label: 'الرقابة المجتمعية', icon: Users },
            { id: 'users', label: 'قاعدة المستخدمين', icon: LayoutDashboard },
            { id: 'articles', label: 'إدارة المحتوى', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === tab.id ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        <button 
          onClick={onLogout}
          className="mt-12 w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
        >
          <LogOut size={20} /> تسجيل خروج
        </button>
      </div>

      {/* Admin Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'orders' && 'طلبات الشراء'}
            {activeTab === 'community' && 'منشورات المجتمع'}
            {activeTab === 'users' && 'قائمة المستخدمات'}
            {activeTab === 'articles' && 'إدارة المقالات'}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-pink-600 font-bold animate-pulse">جاري تحميل البيانات من التخزين...</div>
        ) : (
          <>
            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 gap-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-500">#{order.id.slice(-5).toUpperCase()}</span>
                        <h3 className="font-bold text-slate-800">{order.customerName}</h3>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                          order.status === 'قيد الانتظار' ? 'bg-amber-100 text-amber-600' : 
                          order.status === 'تم الشحن' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">الهاتف: {order.phone} | المحافظة: {order.governorate}</p>
                      <p className="text-xs text-slate-400">العنوان: {order.address}</p>
                    </div>
                    <div className="flex flex-row md:flex-col justify-between items-end gap-2">
                      <p className="text-xl font-black text-pink-600">{order.total} JOD</p>
                      <div className="flex gap-2">
                        <button onClick={() => updateOrderStatus(order.id, 'تم الشحن')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Truck size={20} /></button>
                        <button onClick={() => updateOrderStatus(order.id, 'تم التوصيل')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><CheckCircle size={20} /></button>
                        <button onClick={() => deleteOrder(order.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'community' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
                    <button onClick={() => deletePost(post.id)} className="absolute top-4 left-4 text-rose-400 hover:text-rose-600">
                      <Trash2 size={18} />
                    </button>
                    <h4 className="text-sm font-bold text-slate-800">{post.authorName}</h4>
                    <p className="text-sm text-slate-600 line-clamp-3">{post.content}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 text-slate-500 text-sm">
                    <tr>
                      <th className="p-4 font-bold">الاسم</th>
                      <th className="p-4 font-bold">رقم الهاتف</th>
                      <th className="p-4 font-bold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="p-4 text-sm font-bold text-slate-800">{u.name}</td>
                        <td className="p-4 text-sm text-slate-500">{u.phone}</td>
                        <td className="p-4"><span className="bg-pink-50 text-pink-600 text-[10px] px-2 py-1 rounded-full font-bold">{u.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
