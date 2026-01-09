
import React from 'react';
import { UserProfile } from '../types';
import { LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="glass sticky top-0 z-50 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="https://i.ibb.co/TM561d6q/image.png" className="w-10 h-10" alt="Nestgirl" />
        <span className="font-bold text-pink-600 text-xl">نست جيرل</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full text-pink-700 font-medium">
          <UserIcon size={18} />
          <span>{user.name}</span>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 text-gray-500 hover:text-pink-600 transition-colors"
        >
          <LogOut size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
