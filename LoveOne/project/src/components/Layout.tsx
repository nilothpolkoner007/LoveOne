import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Music, Gift, MessageCircle, Calendar, User, Settings } from 'lucide-react';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex">
      {/* Sidebar Navigation */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Heart className="h-6 w-6 text-rose-500" />
          <span className="text-xl font-semibold text-gray-800">Couple Space</span>
        </div>
        
        <div className="space-y-2">
          <NavItem to="/" icon={<Heart />} text="Home" />
          <NavItem to="/chat" icon={<MessageCircle />} text="Chat" />
          <NavItem to="/music" icon={<Music />} text="Music" />
          <NavItem to="/gifts" icon={<Gift />} text="Gifts" />
          <NavItem to="/events" icon={<Calendar />} text="Events" />
          <NavItem to="/profile" icon={<User />} text="Profile" />
          <NavItem to="/settings" icon={<Settings />} text="Settings" />
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-semibold text-gray-800">Couple Space</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-8 mt-16 md:mt-0">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
          isActive ? 'bg-rose-50 text-rose-500' : 'text-gray-600 hover:bg-gray-50'
        }`
      }
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5' })}
      <span className="font-medium">{text}</span>
    </NavLink>
  );
}

export default Layout;