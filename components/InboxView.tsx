import React from 'react';
import { IconCheckCircle, IconXCircle, IconClock, IconFileText } from './Icons';

const InboxView: React.FC = () => {
  const tasks = [
    {
      id: 1,
      type: 'Leave Request',
      title: 'Sick Leave - 2 Days',
      requester: 'Emily Chen',
      date: 'Today, 10:30 AM',
      avatar: 'https://picsum.photos/200?random=1',
      details: 'Feeling unwell, visiting the doctor.'
    },
    {
      id: 2,
      type: 'Attendance',
      title: 'Regularization Request',
      requester: 'Michael Scott',
      date: 'Yesterday, 4:15 PM',
      avatar: 'https://picsum.photos/200?random=2',
      details: 'Forgot to clock out on Nov 12.'
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto h-full">
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Inbox</h1>
         <div className="flex gap-2">
            <span className="bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white text-xs font-bold px-3 py-1 rounded-full">2 Pending</span>
            <span className="bg-zinc-100 dark:bg-slate-800 text-zinc-500 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full border border-zinc-200 dark:border-slate-700">Archived</span>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white dark:bg-slate-800 rounded-xl border border-zinc-200 dark:border-slate-700/50 p-6 flex flex-col md:flex-row md:items-center gap-6 hover:border-zinc-300 dark:hover:border-slate-600 transition-colors shadow-sm dark:shadow-none">
             
             {/* Icon/Type Indicator */}
             <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-slate-700">
                {task.type === 'Leave Request' ? <IconClock className="w-6 h-6 text-amber-500" /> : <IconFileText className="w-6 h-6 text-blue-500" />}
             </div>

             <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                   <h3 className="font-semibold text-zinc-900 dark:text-white">{task.title}</h3>
                   <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-slate-700 text-zinc-500 dark:text-slate-300 uppercase tracking-wide">{task.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-slate-400">
                   <img src={task.avatar} alt={task.requester} className="w-4 h-4 rounded-full" />
                   <span className="text-zinc-800 dark:text-slate-300 font-medium">{task.requester}</span>
                   <span>•</span>
                   <span>{task.date}</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-slate-500 mt-2 bg-zinc-50 dark:bg-slate-900/50 p-2 rounded border border-zinc-200 dark:border-slate-800/50">{task.details}</p>
             </div>

             <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-500/20 font-medium text-sm">
                   <IconCheckCircle className="w-4 h-4" /> Approve
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors border border-red-200 dark:border-red-500/20 font-medium text-sm">
                   <IconXCircle className="w-4 h-4" /> Reject
                </button>
             </div>

          </div>
        ))}

        {/* Empty State Placeholder for Notifications */}
        <div className="mt-8 text-center py-12 border-2 border-dashed border-zinc-300 dark:border-slate-800 rounded-xl">
           <div className="w-16 h-16 bg-zinc-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconCheckCircle className="w-8 h-8 text-zinc-400 dark:text-slate-600" />
           </div>
           <p className="text-zinc-500 dark:text-slate-400 font-medium">You are all caught up!</p>
           <p className="text-sm text-zinc-400 dark:text-slate-600">No new notifications to display.</p>
        </div>
      </div>
    </div>
  );
};

export default InboxView;