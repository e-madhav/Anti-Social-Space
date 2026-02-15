import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, StickyNote, Calendar, CheckSquare, PenTool, Sparkles } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label, active, color }) => {
  const activeStyles = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 p-4 rounded-3xl transition-all font-bold ${
        active 
          ? `${activeStyles[color]} shadow-sm scale-105` 
          : 'text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-sm'
      }`}
    >
      <Icon size={24} strokeWidth={2.5} />
      <span className="text-lg">{label}</span>
    </Link>
  );
};

export default function Layout() {
  const location = useLocation();
  
  return (
    <div className="flex h-screen overflow-hidden bg-[#FFFBF0]">
      {/* Sidebar */}
      <aside className="w-72 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10 px-4">
          <div className="p-2 bg-orange-400 rounded-2xl text-white shadow-lg shadow-orange-200">
            <Sparkles size={24} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            MySpace
          </h1>
        </div>
        
        <nav className="space-y-3 flex-1">
          <NavItem to="/" icon={LayoutDashboard} label="Home" color="blue" active={location.pathname === '/'} />
          <NavItem to="/notes" icon={StickyNote} label="Notes" color="yellow" active={location.pathname === '/notes'} />
          <NavItem to="/planning" icon={PenTool} label="Plans" color="pink" active={location.pathname === '/planning'} />
          <NavItem to="/routine" icon={Calendar} label="Routine" color="purple" active={location.pathname === '/routine'} />
          <NavItem to="/todo" icon={CheckSquare} label="To-Do" color="green" active={location.pathname === '/todo'} />
        </nav>

        {/* Decor */}
        <div className="mt-auto bg-white p-6 rounded-3xl shadow-sm border border-orange-100">
          <p className="font-bold text-slate-700">✨ Pro Tip</p>
          <p className="text-sm text-slate-400 mt-1">Take a deep breath. You're doing great!</p>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}