
import React from 'react';
import { Sparkles, Check } from 'lucide-react';

const SkinCare: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      <div className="glass p-8 rounded-3xl bg-gradient-to-r from-rose-50 to-pink-50 text-center">
        <Sparkles className="mx-auto text-pink-600 mb-4" size={48} />
        <h2 className="text-2xl font-black text-gray-800 mb-2">روتين جمالكِ اليومي</h2>
        <p className="text-gray-500 text-sm">مجموعة من النصائح والمقالات للعناية ببشرتكِ وإشراقكِ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "أفضل روتين للبشرة المختلطة", img: "https://picsum.photos/seed/skin1/600/400" },
          { title: "طرق الحماية من أشعة الشمس", img: "https://picsum.photos/seed/skin2/600/400" },
          { title: "أهمية ترطيب البشرة في الشتاء", img: "https://picsum.photos/seed/skin3/600/400" },
          { title: "ماسكات طبيعية لنضارة فورية", img: "https://picsum.photos/seed/skin4/600/400" },
        ].map((article, i) => (
          <div key={i} className="glass rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <img src={article.img} className="w-full h-48 object-cover" alt={article.title} />
            <div className="p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-2">{article.title}</h3>
              <p className="text-gray-500 text-sm mb-4">تعلمي كيف تعتنين ببشرتك بخطوات بسيطة ومنتجات متوفرة...</p>
              <button className="text-pink-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                اقرأي المقال <Check size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkinCare;
