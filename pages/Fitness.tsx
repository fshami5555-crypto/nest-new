
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { generateMealPlan } from '../gemini';
import { Utensils, Target, CheckCircle2, Loader2, Dumbbell } from 'lucide-react';

interface FitnessProps {
  user: UserProfile;
}

const Fitness: React.FC<FitnessProps> = ({ user }) => {
  const [goal, setGoal] = useState('خسارة وزن');
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const plan = await generateMealPlan(user, goal);
      setMealPlan(plan);
    } catch (err) {
      alert("عذراً، حدث خطأ أثناء توليد الجدول.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      <div className="glass p-8 rounded-3xl text-center">
        <Dumbbell className="mx-auto text-pink-600 mb-4" size={48} />
        <h2 className="text-2xl font-black text-gray-800 mb-2">رشاقتك تبدأ من هنا</h2>
        <p className="text-gray-500 text-sm">احصلي على جدول غذائي مصمم خصيصاً لكِ بواسطة الذكاء الاصطناعي بناءً على طولك ({user.height} سم) ووزنك ({user.weight} كغم).</p>
      </div>

      {!mealPlan ? (
        <div className="glass p-6 rounded-3xl space-y-6">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Target className="text-pink-600" /> اختاري هدفكِ الصحي
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['خسارة وزن', 'زيادة وزن', 'محافظة على الوزن', 'بناء عضلات', 'صحة عامة'].map(g => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`py-4 rounded-2xl border-2 transition-all font-bold ${goal === g ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-pink-100 text-gray-400'}`}
              >
                {g}
              </button>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-pink-200 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'توليد جدول الوجبات الذكي'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">جدول وجباتك الأسبوعي</h3>
            <button onClick={() => setMealPlan(null)} className="text-pink-600 text-sm font-bold">تغيير الهدف</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {mealPlan.days.map((day: any, idx: number) => (
              <div key={idx} className="glass p-6 rounded-3xl border-r-8 border-pink-500">
                <h4 className="font-black text-pink-600 text-lg mb-4">{day.dayName}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'الفطور', value: day.breakfast },
                    { label: 'الغداء', value: day.lunch },
                    { label: 'العشاء', value: day.dinner },
                    { label: 'وجبة خفيفة', value: day.snack },
                  ].map((meal, mIdx) => (
                    <div key={mIdx} className="bg-white/50 p-3 rounded-2xl border border-pink-50">
                      <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">{meal.label}</p>
                      <p className="text-xs text-gray-700 font-medium">{meal.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fitness Articles Placeholder */}
      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">مقالات تهمكِ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="glass p-4 rounded-3xl flex gap-4">
              <img src={`https://picsum.photos/seed/${i+50}/100/100`} className="w-24 h-24 rounded-2xl object-cover" alt="Article" />
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">تمارين الكارديو المنزلية للمبتدئات</h4>
                <p className="text-gray-500 text-[10px] line-clamp-2">تعلمي كيف تحافظين على نشاطك في المنزل بخطوات بسيطة وفعالة جداً..</p>
                <button className="text-pink-600 text-[10px] font-bold mt-2">اقرأي المزيد</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fitness;
