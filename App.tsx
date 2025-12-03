import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import FinancesView from './components/FinancesView';
import HomeView from './components/HomeView';
import MeView from './components/MeView';
import InboxView from './components/InboxView';
import TeamView from './components/TeamView';
import OrgView from './components/OrgView';
import ResumeBuilderView from './components/ResumeBuilderView';
import SettingsView from './components/SettingsView';
import AdminView from './components/AdminView';
import ChatBot from './components/ChatBot';
import { NavItem } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<NavItem>(NavItem.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const renderContent = () => {
    switch (activeTab) {
      case NavItem.HOME:
        return <HomeView />;
      case NavItem.ME:
        return <MeView />;
      case NavItem.INBOX:
        return <InboxView />;
      case NavItem.TEAM:
        return <TeamView />;
      case NavItem.FINANCES:
        return <FinancesView />;
      case NavItem.ORG:
        return <OrgView />;
      case NavItem.ADMIN:
        return <AdminView />;
      case NavItem.RESUME:
        return <ResumeBuilderView />;
      case NavItem.SETTINGS:
        return <SettingsView currentTheme={theme} setTheme={setTheme} />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-200 font-sans selection:bg-cyan-500 selection:text-black relative overflow-hidden transition-colors duration-300">
      
      {/* --- Professional Moving Background Video (Dark Mode Only) --- */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-[-5] opacity-40 mix-blend-screen pointer-events-none hidden dark:block"
      >
        <source src="https://cdn.pixabay.com/video/2019/04/20/22908-331663189_large.mp4" type="video/mp4" />
      </video>

      {/* Overlay Gradients to Ensure Text Readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-[-4] pointer-events-none hidden dark:block"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-[-3] pointer-events-none hidden dark:block"></div>
      
      {/* Additional Shining CSS layer for extra depth */}
      <div className="bg-shine hidden dark:block"></div>
      
      {/* Main Container - Z-Index 10 to sit above background */}
      <div className="relative z-10 flex min-h-screen">
        
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Content Area */}
        <div 
          className={`flex flex-col flex-1 h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`} 
          id="main-content"
        >
          <div id="no-print-topbar">
            <TopBar />
          </div>

          <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
            {renderContent()}
          </main>
        </div>

      </div>

      {/* Global AI Chat Assistant */}
      <div id="no-print-chat">
        <ChatBot />
      </div>
    </div>
  );
}

export default App;