
import React from 'react';
import { Baby, HeartPulse } from 'lucide-react';

const FamilyCare: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
       <div className="glass p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 text-center">
        <Baby className="mx-auto text-blue-600 mb-4" size={48} />
        <h2 className="text-2xl font-black text-gray-800 mb-2">عائلتكِ في أمان</h2>
        <p className="text-gray-500 text-sm">نصائح تربوية، رعاية المواليد، ودليل كامل للأمهات الجدد</p>
      </div>

      <div className="space-y-4">
        {[
          { title: "تنظيم نوم الرضيع: دليل شامل", desc: "نصائح عملية لمساعدة طفلكِ (ولكِ أيضاً) على النوم بهدوء ليلاً.", category: "رعاية الطفل" },
          { title: "التغذية السليمة خلال فترة الرضاعة", desc: "ما هي الأطعمة التي تزيد من إدرار الحليب وتحسن صحتكِ وصحة طفلكِ؟", category: "صحة الأم" },
          { title: "تطور الجنين أسبوعاً بأسبوع", desc: "رحلة ممتعة تتابعين فيها مراحل نمو طفلكِ داخل الرحم.", category: "الحمل" },
        ].map((item, i) => (
          <div key={i} className="glass p-6 rounded-3xl flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-full sm:w-40 h-32 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
               <HeartPulse size={40} className="text-blue-500" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase">{item.category}</span>
              <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
              <button className="text-blue-600 font-bold text-sm mt-2">عرض التفاصيل</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyCare;
