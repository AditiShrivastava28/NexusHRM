import React from 'react';
import { NavItem } from '../types';
import { IconHome, IconUser, IconWallet, IconUsers, IconBriefcase, IconBell, IconFileEdit, IconMenu, IconChevronLeft, IconSettings, IconShield } from './Icons';

interface SidebarProps {
  activeTab: NavItem;
  setActiveTab: (tab: NavItem) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {
  
  const menuItems = [
    { id: NavItem.HOME, icon: IconHome, label: 'Dashboard' },
    { id: NavItem.ME, icon: IconUser, label: 'Profile' },
    { id: NavItem.INBOX, icon: IconBell, label: 'Inbox' },
    { id: NavItem.TEAM, icon: IconUsers, label: 'My Team' },
    { id: NavItem.FINANCES, icon: IconWallet, label: 'Finances' },
    { id: NavItem.ORG, icon: IconBriefcase, label: 'Organization' },
    { id: NavItem.ADMIN, icon: IconShield, label: 'Admin Portal' },
    { id: NavItem.RESUME, icon: IconFileEdit, label: 'Resume AI' },
    { id: NavItem.SETTINGS, icon: IconSettings, label: 'Settings' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-white/60 dark:bg-black/40 backdrop-blur-xl border-r border-zinc-200 dark:border-white/5 flex flex-col z-20 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`} 
      id="main-sidebar"
    >
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-4 border-b border-zinc-200 dark:border-white/5 relative">
        <div className={`flex items-center gap-2.5 transition-opacity duration-300 ${!isOpen ? 'opacity-0 absolute' : 'opacity-100'}`}>
          <div className="relative w-8 h-8 flex items-center justify-center">
             <div className="absolute inset-0 bg-cyan-500 rounded-lg opacity-20 animate-pulse"></div>
             <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="text-white font-bold text-lg">N</span>
             </div>
          </div>
          <span className="text-zinc-800 dark:text-white font-bold text-xl tracking-tight whitespace-nowrap">NexusHR</span>
        </div>
        
        {/* Toggle Button - Shows logo when closed */}
        {!isOpen && (
           <div className="w-full flex justify-center">
             <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="text-white font-bold text-lg">N</span>
             </div>
           </div>
        )}

        {/* Toggle chevron */}
        <button 
          onClick={toggleSidebar} 
          className="absolute -right-3 top-6 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-white/10 rounded-full p-1 shadow-lg z-50 hover:bg-cyan-500 dark:hover:bg-cyan-600 transition-colors"
        >
          <IconChevronLeft className={`w-3 h-3 transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 overflow-y-auto custom-scrollbar overflow-x-hidden">
        <nav className="px-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden
                  ${isActive 
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                  }
                  ${!isOpen ? 'justify-center' : ''}
                `}
                title={!isOpen ? item.label : ''}
              >
                {isActive && isOpen && <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>}
                
                <item.icon className={`w-5 h-5 transition-colors shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white'}`} />
                
                <span className={`transition-all duration-300 whitespace-nowrap ${!isOpen ? 'opacity-0 w-0 translate-x-10 absolute' : 'opacity-100 w-auto translate-x-0'}`}>
                   {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile */}
      <div className="p-4 border-t border-zinc-200 dark:border-white/5">
        <div className={`bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors rounded-xl p-2 flex items-center gap-3 border border-transparent dark:border-white/5 cursor-pointer backdrop-blur-sm ${!isOpen ? 'justify-center' : ''}`}>
          <div className="relative shrink-0">
             <img src="https://picsum.photos/200" alt="Profile" className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-300 dark:ring-white/20" />
             <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full"></span>
          </div>
          <div className={`flex-1 min-w-0 transition-opacity duration-300 ${!isOpen ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">Alex Sterling</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] truncate tracking-wide">SENIOR DESIGNER</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;