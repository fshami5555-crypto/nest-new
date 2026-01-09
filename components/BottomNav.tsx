
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, ShoppingBag, Users, Utensils } from 'lucide-react';

const BottomNav: React.FC = () => {
  const items = [
    { to: '/', icon: Home, label: 'الرئيسية' },
    { to: '/fitness', icon: Utensils, label: 'الرشاقة' },
    { to: '/psych-chat', icon: MessageCircle, label: 'المستشار' },
    { to: '/community', icon: Users, label: 'المجتمع' },
    { to: '/store', icon: ShoppingBag, label: 'المتجر' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-lg">
      <div className="glass bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-[0_20px_50px_rgba(255,182,193,0.3)] px-4 py-3 flex justify-around items-center gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center transition-all duration-300 group
              ${isActive ? 'text-pink-600 scale-110' : 'text-gray-400 hover:text-pink-400'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-pink-100 shadow-inner' : 'bg-transparent'}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[9px] font-black mt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 w-1 h-1 bg-pink-600 rounded-full animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
