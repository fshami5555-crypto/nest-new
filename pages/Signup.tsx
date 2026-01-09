
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fsAddDoc } from '../firebase';
import { UserProfile, UserStatus } from '../types';
import { Lock, User, Phone, Calendar, Ruler, Weight, Heart, X, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface SignupProps {
  onSignup: (user: UserProfile) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    status: 'عزباء',
    hasPeriod: true,
    isPeriodRegular: true,
    cycleLength: 28
  });
  const [loading, setLoading] = useState(false);
  const [assistantTip, setAssistantTip] = useState('أهلاً بكِ يا جميلة! أنا هنا لأساعدكِ في الانضمام لعالمنا.');
  const [tipLoading, setTipLoading] = useState(false);

  const assistantImage = "https://i.ibb.co/vvv21hQd/image.png";

  useEffect(() => {
    generateStepTip(step);
  }, [step]);

  const generateStepTip = async (currentStep: number) => {
    setTipLoading(true);
    const prompts = [
      "",
      "أعطِ نصيحة قصيرة جداً ومشجعة للمرأة عند إدخال اسمها ورقم هاتفها في تطبيق صحي.",
      "أعطِ نصيحة قصيرة جداً عن أهمية متابعة الطول والوزن بدقة للصحة العامة.",
      "أعطِ نصيحة قصيرة ودافئة للمرأة باختلاف حالتها الاجتماعية (عزباء، أم، حامل).",
      "أعطِ نصيحة قصيرة جداً عن أهمية تتبع الدورة الشهرية لصحة المرأة."
    ];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompts[currentStep],
      });
      setAssistantTip(response.text || "أنا معكِ في كل خطوة!");
    } catch (err) {
      setAssistantTip("أنا هنا لمساعدتكِ في رحلة صحتكِ!");
    } finally {
      setTipLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!formData.password) {
      alert("يرجى تعيين كلمة سر.");
      return;
    }
    setLoading(true);
    try {
      const res = await fsAddDoc("users", {
        ...formData,
        isAdmin: false,
        password: formData.password
      });
      onSignup({ ...formData, id: res.id } as UserProfile);
    } catch (err) {
      alert("حدث خطأ أثناء إنشاء الحساب.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-pink-50 to-rose-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-pink-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-rose-200/20 rounded-full blur-3xl"></div>

      {/* Exit Button */}
      <button 
        onClick={() => navigate('/login')}
        className="absolute top-6 right-6 p-3 bg-white/50 hover:bg-white text-gray-500 hover:text-pink-600 rounded-full shadow-lg transition-all z-20 group"
      >
        <X size={24} className="group-hover:rotate-90 transition-transform" />
      </button>

      {/* Assistant Persona Area */}
      <div className="w-full max-w-md mb-6 flex flex-col items-center animate-fadeIn">
        <div className="relative group">
          <div className="absolute inset-0 bg-pink-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <img 
            src={assistantImage} 
            alt="Assistant" 
            className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl"
          />
          <div className="absolute -bottom-2 -right-2 bg-pink-600 text-white p-2 rounded-full shadow-lg border-2 border-white z-20">
            <Sparkles size={16} />
          </div>
        </div>
        <div className="mt-4 relative bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-pink-100 shadow-xl max-w-[85%] text-center">
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white/80 rotate-45 border-l border-t border-pink-100"></div>
          <p className={`text-sm text-pink-700 font-bold leading-relaxed ${tipLoading ? 'animate-pulse opacity-50' : ''}`}>
            {assistantTip}
          </p>
        </div>
      </div>

      <div className="max-w-md w-full glass p-8 rounded-[2.5rem] shadow-2xl border-white/50 border relative z-10 transition-all duration-500">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-pink-600">إنشاء حساب</h2>
          <span className="text-pink-400 font-bold bg-pink-100/50 px-3 py-1 rounded-full text-xs">خطوة {step} من 4</span>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
              <input
                type="text"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pr-12 pl-4 py-4 rounded-2xl border border-pink-100 outline-none bg-white/50 focus:ring-4 focus:ring-pink-500/10 transition-all"
                placeholder="اسمكِ بالكامل"
              />
            </div>
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
              <input
                type="tel"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full pr-12 pl-4 py-4 rounded-2xl border border-pink-100 outline-none bg-white/50 focus:ring-4 focus:ring-pink-500/10 transition-all"
                placeholder="رقم الهاتف (07xxxxxxxx)"
              />
            </div>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
              <input
                type="password"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pr-12 pl-4 py-4 rounded-2xl border border-pink-100 outline-none bg-white/50 focus:ring-4 focus:ring-pink-500/10 transition-all"
                placeholder="تعيين كلمة سر"
              />
            </div>
            <button onClick={nextStep} className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-pink-200 mt-4 active:scale-95 transition-transform">التالي</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
             <div className="relative">
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
              <input
                type="date"
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="w-full pr-12 pl-4 py-4 rounded-2xl border border-pink-100 outline-none bg-white/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Ruler className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300" size={16} />
                <input
                  type="number"
                  placeholder="الطول (سم)"
                  onChange={(e) => setFormData({...formData, height: Number(e.target.value)})}
                  className="w-full pr-10 pl-4 py-4 rounded-2xl border border-pink-100 outline-none bg-white/50 text-sm"
                />
              </div>
              <div className="relative">
                <Weight className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300" size={16} />
                <input
                  type="number"
                  placeholder="الوزن (كغم)"
                  onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})}
                  className="w-full pr-10 pl-4 py-4 rounded-2xl border border-pink-100 outline-none bg-white/50 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={prevStep} className="flex-1 border-2 border-pink-200 text-pink-600 py-4 rounded-2xl font-bold active:scale-95 transition-transform">السابق</button>
              <button onClick={nextStep} className="flex-1 bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-pink-200 active:scale-95 transition-transform">التالي</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-gray-500 font-bold mb-2 text-center">ما هي حالتكِ الحالية؟</p>
            <div className="grid grid-cols-2 gap-3">
              {['عزباء', 'متزوجة', 'حامل', 'أم'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFormData({...formData, status: s as UserStatus})}
                  className={`py-4 rounded-2xl border-2 transition-all font-bold ${formData.status === s ? 'border-pink-600 bg-pink-600 text-white shadow-lg' : 'border-pink-50 bg-white/50 text-gray-400 hover:border-pink-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            
            {formData.status === 'حامل' && (
              <div className="pt-4 animate-fadeIn">
                <label className="block text-sm font-bold text-pink-600 mb-2">موعد الولادة المتوقع</label>
                <input
                  type="date"
                  onChange={(e) => setFormData({...formData, pregnancyDueDate: e.target.value})}
                  className="w-full px-4 py-4 rounded-2xl border border-pink-100 outline-none bg-white/50 font-medium"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button onClick={prevStep} className="flex-1 border-2 border-pink-200 text-pink-600 py-4 rounded-2xl font-bold active:scale-95 transition-transform">السابق</button>
              <button onClick={nextStep} className="flex-1 bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-pink-200 active:scale-95 transition-transform">التالي</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className="text-gray-800 font-bold mb-4 flex items-center justify-center gap-2">
                <Heart className="text-pink-600" size={20} />
                معلومات الدورة الشهرية
              </p>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl border border-pink-50 cursor-pointer hover:bg-white transition-all">
                   <input 
                    type="checkbox" 
                    checked={formData.hasPeriod} 
                    onChange={(e) => setFormData({...formData, hasPeriod: e.target.checked})}
                    className="w-6 h-6 accent-pink-600"
                   />
                   <span className="font-bold text-gray-700">هل تأتيكِ الدورة الشهرية؟</span>
                </label>

                {formData.hasPeriod && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFormData({...formData, isPeriodRegular: true})}
                        className={`py-3 rounded-xl border-2 font-bold ${formData.isPeriodRegular ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-pink-50 text-gray-400'}`}
                      >منتظمة</button>
                      <button
                        onClick={() => setFormData({...formData, isPeriodRegular: false})}
                        className={`py-3 rounded-xl border-2 font-bold ${!formData.isPeriodRegular ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-pink-50 text-gray-400'}`}
                      >غير منتظمة</button>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-400 mr-2">آخر موعد بدأت فيه الدورة</label>
                      <input
                        type="date"
                        onChange={(e) => setFormData({...formData, lastPeriodDate: e.target.value})}
                        className="w-full px-4 py-4 rounded-2xl border border-pink-100 outline-none bg-white font-medium focus:ring-2 focus:ring-pink-100 transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-400 mr-2">طول الدورة التقريبي (بالأيام)</label>
                      <input
                        type="number"
                        value={formData.cycleLength}
                        onChange={(e) => setFormData({...formData, cycleLength: Number(e.target.value)})}
                        className="w-full px-4 py-4 rounded-2xl border border-pink-100 outline-none bg-white font-medium focus:ring-2 focus:ring-pink-100 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 border-2 border-pink-200 text-pink-600 py-4 rounded-2xl font-bold active:scale-95 transition-transform">السابق</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-pink-200 active:scale-95 transition-transform">
                {loading ? 'جاري الحفظ...' : 'إتمام التسجيل'}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-8 text-pink-400/80 font-medium text-sm">نحن هنا لنهتم بكل تفاصيل صحتكِ 🌸</p>
    </div>
  );
};

export default Signup;
