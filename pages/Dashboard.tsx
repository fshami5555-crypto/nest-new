
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getSmartGreeting, getPeriodAdvice } from '../gemini';
import { Heart, Calendar, Sparkles, Scale, Users, Baby, ChevronLeft, MessageCircle, CloudSun, Clock, MapPin, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [greeting, setGreeting] = useState<string>('أهلاً بكِ في نست جيرل...');
  const [periodAdvice, setPeriodAdvice] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather] = useState({ temp: 24, status: 'مشمس' });

  useEffect(() => {
    getSmartGreeting(user).then(setGreeting).catch(() => setGreeting(`أهلاً بكِ يا ${user.name} في يومك الجميل!`));
    getPeriodAdvice(user).then(setPeriodAdvice);
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculatePeriod = () => {
    if (!user.lastPeriodDate) return "لم يتم التحديد";
    const last = new Date(user.lastPeriodDate);
    const today = new Date();
    const cycle = user.cycleLength || 28;
    const diff = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    const remaining = cycle - (diff % cycle);
    return remaining;
  };

  const calculatePregnancy = () => {
    if (!user.pregnancyDueDate) return "غير محدد";
    const due = new Date(user.pregnancyDueDate);
    const today = new Date();
    const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const weeksTotal = 40;
    const currentWeek = weeksTotal - Math.floor(diffDays / 7);
    return currentWeek > 0 ? currentWeek : 1;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24 animate-fadeIn">
      {/* Header Widget: Time & Weather */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 glass p-6 rounded-[2rem] flex items-center justify-between border-white border shadow-xl bg-gradient-to-l from-white/40 to-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner">
               <Clock size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">الوقت الحالي</p>
              <h4 className="text-2xl font-black text-slate-800">
                {currentTime.toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })}
              </h4>
            </div>
          </div>
          <div className="text-left">
            <p className="text-pink-400 font-bold text-xs">{currentTime.toLocaleDateString('ar-JO', { weekday: 'long' })}</p>
            <p className="text-gray-400 text-[10px]">{currentTime.toLocaleDateString('ar-JO')}</p>
          </div>
        </div>

        <div className="flex-1 glass p-6 rounded-[2rem] flex items-center justify-between border-white border shadow-xl bg-gradient-to-r from-blue-50/40 to-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
               <CloudSun size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">الطقس في عمان</p>
              <h4 className="text-2xl font-black text-slate-800">{weather.temp}° <span className="text-sm font-bold text-gray-500">{weather.status}</span></h4>
            </div>
          </div>
          <MapPin size={20} className="text-blue-300" />
        </div>
      </div>

      {/* AI Greeting Card */}
      <div className="relative glass p-8 rounded-[2.5rem] overflow-hidden border-2 border-pink-100 bg-gradient-to-br from-pink-50 to-white shadow-xl shadow-pink-100/20">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-pink-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg shadow-pink-200">
            <Sparkles size={14} /> ذكاء اصطناعي
          </div>
          <h2 className="text-2xl font-black text-gray-800 leading-tight">
             {greeting}
          </h2>
          {periodAdvice && (
            <div className="bg-white/60 p-4 rounded-2xl border border-pink-50 text-sm text-pink-700 font-medium leading-relaxed mt-4 animate-fadeIn">
               <Zap size={16} className="inline ml-2 text-yellow-500" />
               {periodAdvice}
            </div>
          )}
        </div>
        <div className="absolute top-[-30px] left-[-30px] opacity-10 rotate-12">
          <img src="https://i.ibb.co/TM561d6q/image.png" className="w-64 h-64 object-contain" alt="bg" />
        </div>
      </div>

      {/* Main Health Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Cycle / Pregnancy Main Display */}
        <div className="md:col-span-8">
           {user.status === 'حامل' ? (
            <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] opacity-50"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-1">
                   <p className="text-pink-100 text-xs font-black tracking-widest uppercase">أسبوع الحمل الحالي</p>
                   <h3 className="text-6xl font-black leading-none">{calculatePregnancy()}</h3>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md">
                   <Baby size={32} />
                </div>
              </div>

              <div className="relative z-10 mt-12 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-pink-100 text-[10px] font-bold">موعد الولادة المتوقع</p>
                  <p className="text-xl font-bold">{user.pregnancyDueDate || "لم يتم التحديد"}</p>
                </div>
                <Link to="/familycare" className="w-12 h-12 bg-white text-pink-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                   <ChevronLeft />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
               <div className="relative z-10 flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-pink-100 text-xs font-black tracking-widest uppercase">الأيام المتبقية للدورة</p>
                    <h3 className="text-6xl font-black leading-none">{calculatePeriod()}</h3>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md">
                     <Calendar size={32} />
                  </div>
               </div>

               <div className="relative z-10 mt-12 flex items-center justify-between">
                  <div className="flex gap-4">
                     <button className="bg-white text-pink-600 px-6 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-transform">بدأت الآن</button>
                     <div className="h-12 w-[1px] bg-white/20"></div>
                     <div>
                        <p className="text-pink-100 text-[10px] font-bold">طول دورتكِ</p>
                        <p className="text-lg font-bold">{user.cycleLength} يوم</p>
                     </div>
                  </div>
                  <Link to="/skincare" className="w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-2xl flex items-center justify-center transition-all backdrop-blur-sm">
                     <ChevronLeft />
                  </Link>
               </div>
            </div>
          )}
        </div>

        {/* Side Stats */}
        <div className="md:col-span-4 space-y-6">
           <div className="glass p-6 rounded-[2.2rem] border-white border shadow-xl flex flex-col justify-between bg-white/40">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500">
                    <Scale size={24} />
                 </div>
                 <div>
                    <p className="text-gray-400 text-[10px] font-black tracking-tighter">الوزن الحالي</p>
                    <p className="text-2xl font-black text-gray-800">{user.weight} كغم</p>
                 </div>
              </div>
              <div className="mt-8 pt-6 border-t border-pink-50 flex items-center justify-between">
                 <div className="flex -space-x-3 space-x-reverse">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/${i+20}/80/80`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="U" />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-pink-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-black shadow-lg">+12</div>
                 </div>
                 <p className="text-[10px] font-bold text-gray-400">نست جيرلز أونلاين</p>
              </div>
           </div>

           <Link to="/community" className="block group">
              <div className="glass p-6 rounded-[2.2rem] border-pink-200 border bg-pink-600 text-white shadow-xl shadow-pink-200/50 group-hover:-translate-y-1 transition-transform">
                 <div className="flex items-center justify-between mb-4">
                    <Users size={24} />
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                 </div>
                 <h4 className="font-black text-lg">مجتمع نست</h4>
                 <p className="text-pink-100 text-xs mt-1 font-medium">شاركي تجربتكِ مع نساء يشبهنكِ</p>
              </div>
           </Link>
        </div>
      </div>

      {/* Grid Menu: Sections */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'بشرتك', icon: Sparkles, color: 'text-rose-500', bg: 'bg-rose-100/50', to: '/skincare' },
          { label: 'الرشاقة', icon: Heart, color: 'text-orange-500', bg: 'bg-orange-100/50', to: '/fitness' },
          { label: 'الأسرة', icon: Baby, color: 'text-blue-500', bg: 'bg-blue-100/50', to: '/familycare' },
          { label: 'المتجر', icon: MessageCircle, color: 'text-indigo-500', bg: 'bg-indigo-100/50', to: '/store' },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="glass p-6 rounded-[2.2rem] flex flex-col items-center gap-4 hover:bg-white hover:scale-105 transition-all border border-white shadow-lg shadow-gray-200/20"
          >
            <div className={`${item.bg} ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner`}>
              <item.icon size={28} />
            </div>
            <span className="font-black text-gray-700">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* AI PsychChat Call-to-Action */}
      <Link to="/psych-chat" className="block group relative">
        <div className="glass p-8 rounded-[3rem] border-2 border-pink-200 shadow-2xl bg-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-pink-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-pink-200 group-hover:rotate-6 transition-transform">
               <MessageCircle size={40} />
            </div>
            <div className="flex-1 text-center sm:text-right">
               <h3 className="font-black text-2xl text-gray-800 mb-2">محتاجة تفضفضي؟</h3>
               <p className="text-gray-500 font-medium leading-relaxed max-w-md">نست هنا لتسمعكِ، تفهمكِ، وتواسيكِ في أي وقت بخصوصية تامة 🌸</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-full group-hover:bg-pink-100 transition-colors">
               <ChevronLeft className="text-pink-600" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Dashboard;
