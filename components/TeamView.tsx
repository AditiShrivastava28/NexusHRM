import React, { useState, useRef, useEffect } from 'react';
import { IconMessage, IconMapPin, IconSearch, IconChevronLeft, IconSend, IconCheckCircle, IconBriefcase } from './Icons';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  status: 'Working' | 'On Leave' | 'Meeting' | 'Remote';
  location: string;
  img: string;
  isOnline: boolean;
}

interface ChatMessage {
  id: string;
  senderId: number | 'me';
  text: string;
  time: string;
}

const TeamView: React.FC = () => {
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const [chatInput, setChatInput] = useState('');
  
  // Mock Team Data
  const teamMembers: TeamMember[] = [
    { id: 1, name: 'Alex Sterling', role: 'Senior Product Designer', status: 'Working', location: 'NYC', img: 'https://picsum.photos/200?random=10', isOnline: true },
    { id: 2, name: 'Sarah Jenkins', role: 'Product Manager', status: 'On Leave', location: 'London', img: 'https://picsum.photos/200?random=11', isOnline: false },
    { id: 3, name: 'Mike Ross', role: 'Frontend Developer', status: 'Working', location: 'Remote', img: 'https://picsum.photos/200?random=12', isOnline: true },
    { id: 4, name: 'Jessica Pearson', role: 'VP of Engineering', status: 'Meeting', location: 'NYC', img: 'https://picsum.photos/200?random=13', isOnline: true },
    { id: 5, name: 'Louis Litt', role: 'QA Lead', status: 'Working', location: 'NYC', img: 'https://picsum.photos/200?random=14', isOnline: true },
    { id: 6, name: 'Rachel Zane', role: 'Legal Consultant', status: 'Remote', location: 'Toronto', img: 'https://picsum.photos/200?random=15', isOnline: false },
  ];

  // Chat State
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({
    3: [
      { id: '1', senderId: 3, text: 'Hey, did you check the latest PR?', time: '09:30 AM' },
      { id: '2', senderId: 'me', text: 'On it right now!', time: '09:32 AM' },
    ],
    4: [
      { id: '1', senderId: 4, text: 'Meeting starts in 5 minutes.', time: '10:55 AM' }
    ]
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeMember) scrollToBottom();
  }, [messages, activeMember]);

  const handleSendMessage = () => {
    if (!chatInput.trim() || !activeMember) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeMember.id]: [...(prev[activeMember.id] || []), newMessage]
    }));
    setChatInput('');
  };

  const currentMessages = activeMember ? (messages[activeMember.id] || []) : [];

  // --- Render Chat Interface ---
  if (activeMember) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-zinc-900 overflow-hidden absolute inset-0 z-20">
        {/* Chat Header */}
        <div className="h-16 border-b border-zinc-200 dark:border-white/10 flex items-center px-6 bg-white/50 dark:bg-black/20 backdrop-blur-md">
          <button 
            onClick={() => setActiveMember(null)}
            className="mr-4 p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full text-zinc-500 dark:text-zinc-400 transition-colors"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <img src={activeMember.img} alt={activeMember.name} className="w-10 h-10 rounded-full border border-zinc-200 dark:border-white/10" />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-black ${activeMember.isOnline ? 'bg-emerald-500' : 'bg-zinc-400'}`}></div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{activeMember.name}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              {activeMember.role} • <span className={activeMember.isOnline ? 'text-emerald-500' : 'text-zinc-500'}>{activeMember.isOnline ? 'Online' : 'Offline'}</span>
            </p>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-zinc-50/50 dark:bg-black/20">
          <div className="text-center text-xs text-zinc-400 my-4 uppercase tracking-widest font-mono">Today</div>
          {currentMessages.length === 0 && (
             <div className="text-center py-10">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                   <IconBriefcase className="w-6 h-6 text-zinc-400" />
                </div>
                <p className="text-zinc-500 text-sm">Start a conversation with {activeMember.name.split(' ')[0]}</p>
             </div>
          )}
          {currentMessages.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  isMe 
                    ? 'bg-cyan-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-white/5 rounded-bl-none'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-cyan-200' : 'text-zinc-400'}`}>{msg.time}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Footer */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-white/10">
          <div className="relative">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..." 
              className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-400"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              <IconSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Team List ---
  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">My Team</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Design & Experience Department</p>
        </div>
        <div className="relative">
           <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
           <input 
              type="text" 
              placeholder="Search team..." 
              className="bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-cyan-500 w-64 placeholder:text-zinc-400"
           />
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 dark:bg-white/5 text-xs uppercase text-zinc-500 dark:text-zinc-400 font-medium sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {teamMembers.map((member) => (
                <tr key={member.id} className="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <img src={member.img} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-white/10" />
                         <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-black ${member.isOnline ? 'bg-emerald-500' : 'bg-zinc-400'}`}></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{member.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border
                        ${member.status === 'Working' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
                          member.status === 'On Leave' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' : 
                          member.status === 'Meeting' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' :
                          'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20'
                        }
                     `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                           member.status === 'Working' ? 'bg-emerald-500' : 
                           member.status === 'On Leave' ? 'bg-red-500' : 
                           member.status === 'Meeting' ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}></span>
                        {member.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <IconMapPin className="w-4 h-4 text-zinc-400" />
                        {member.location}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button 
                       onClick={() => setActiveMember(member)}
                       className="p-2 text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-all"
                       title="Send Message"
                     >
                        <IconMessage className="w-5 h-5" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamView;