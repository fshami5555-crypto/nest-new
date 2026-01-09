
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../types';
import { fsGetDocs } from '../firebase';
import { Lock, Phone } from 'lucide-react';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Admin Check
      if (phone === '0781285431' && password === 'admin123') {
        onLogin({
          id: 'admin',
          name: 'مدير النظام',
          phone: '0781285431',
          birthDate: '',
          height: 0,
          weight: 0,
          status: 'عزباء',
          isAdmin: true,
          hasPeriod: true,
          isPeriodRegular: true,
          cycleLength: 28
        });
        return;
      }

      const users = await fsGetDocs<UserProfile>("users");
      const user = users.find(u => u.phone === phone);

      if (!user) {
        setError('رقم الهاتف غير مسجل.');
      } else if (user.password !== password) {
        setError('كلمة السر غير صحيحة.');
      } else {
        onLogin(user);
      }
    } catch (err) {
      setError('حدث خطأ أثناء الدخول.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="max-w-md w-full glass p-8 rounded-[2.5rem] shadow-2xl border-white/50 border">
        <div className="text-center mb-8">
          <img src="https://i.ibb.co/TM561d6q/image.png" className="w-16 mx-auto mb-4" alt="Logo" />
          <h1 className="text-3xl font-black text-pink-600">دخول نست جيرل</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="رقم الهاتف"
            className="w-full p-4 rounded-2xl border border-pink-100 outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة السر"
            className="w-full p-4 rounded-2xl border border-pink-100 outline-none"
            required
          />
          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
          <button className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg">دخول</button>
        </form>
        <p className="text-center mt-6 text-gray-500">ليس لديكِ حساب؟ <Link to="/signup" className="text-pink-600 font-bold">انضمي الآن</Link></p>
      </div>
    </div>
  );
};

export default Login;
