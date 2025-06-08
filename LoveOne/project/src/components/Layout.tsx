import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Music, Gift, MessageCircle, Calendar, User, Settings } from 'lucide-react';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col md:flex-row'>
      {/* Desktop Sidebar */}
      <nav className='hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4'>
        <div className='flex items-center space-x-2 mb-8'>
          <Heart className='h-6 w-6 text-rose-500' />
          <span className='text-xl font-semibold text-gray-800'>Couple Space</span>
        </div>

        <div className='space-y-2'>
          <NavItem to='/' icon={<Heart />} text='Home' />
          <NavItem to='/chat' icon={<MessageCircle />} text='Chat' />
          <NavItem to='/music' icon={<Music />} text='Music' />
          <NavItem to='/gifts' icon={<Gift />} text='Gifts' />
          <NavItem to='/events' icon={<Calendar />} text='Events' />
          <NavItem to='/profile' icon={<User />} text='Profile' />
          <NavItem to='/settings' icon={<Settings />} text='Settings' />
        </div>
      </nav>

      {/* Main Content */}
      <main className='flex-1 px-4 pb-20 md:pb-8 md:px-8'>
        <div className='max-w-5xl mx-auto pt-6 md:pt-12'>{children}</div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className='md:hidden fixed bottom-10 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around py-2 text-xs'>
        <MobileNavItem to='/' icon={<Heart />} />
        <MobileNavItem to='/chat' icon={<MessageCircle />} />
        <MobileNavItem to='/music' icon={<Music />} />
        <MobileNavItem to='/gifts' icon={<Gift />} />
        <MobileNavItem to='/events' icon={<Calendar />} />
        <MobileNavItem to='/profile' icon={<User />} />
      </nav>
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
      <span className='font-medium'>{text}</span>
    </NavLink>
  );
}

function MobileNavItem({ to, icon }: { to: string; icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center space-y-1 px-1 ${
          isActive ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
        }`
      }
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5' })}
    </NavLink>
  );
}

export default Layout;
