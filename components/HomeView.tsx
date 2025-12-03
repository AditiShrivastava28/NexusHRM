import React, { useState, useEffect } from 'react';
import { 
  IconClock, IconSun, IconCalendar, IconCheckCircle, IconMessage, IconBriefcase, 
  IconCoffee, IconPlay, IconStopCircle, IconChevronLeft, IconChevronRight, IconX,
  IconMapPin, IconFileText, IconWallet
} from './Icons';
import { CURRENT_USER } from '../constants';

// --- Types for Local Data ---
interface LeaveEntry {
  date: string; // YYYY-MM-DD
  users: Array<{ name: string; avatar: string; type: string }>;
}

// --- Mock Data ---
const MOCK_LEAVES: LeaveEntry[] = [
  { date: '2024-11-20', users: [{ name: 'Sarah Jenkins', avatar: 'https://picsum.photos/200?random=11', type: 'Sick Leave' }] },
  { date: '2024-11-22', users: [{ name: 'Mike Ross', avatar: 'https://picsum.photos/200?random=12', type: 'Privilege Leave' }] },
  { date: '2024-11-25', users: [{ name: 'Jessica P.', avatar: 'https://picsum.photos/200?random=13', type: 'WFH' }, { name: 'Louis Litt', avatar: 'https://picsum.photos/200?random=14', type: 'Casual Leave' }] },
  { date: '2024-11-28', users: [{ name: 'Harvey Specter', avatar: 'https://picsum.photos/200?random=15', type: 'Client Visit' }] },
];

// --- Reusable Components ---

const Modal = ({ title, isOpen, onClose, children }: { title: string; isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.2)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-zinc-200 dark:border-white/5">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

const CalendarWidget = ({ 
  selectedDate, 
  onDateSelect, 
  events = [] 
}: { 
  selectedDate: Date | null, 
  onDateSelect: (d: Date) => void,
  events?: LeaveEntry[] 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const days = [];
  const totalDays = daysInMonth(currentMonth);
  const startDay = firstDayOfMonth(currentMonth); 

  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const hasEvent = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find(e => e.date === dateStr);
  };

  return (
    <div className="bg-zinc-50 dark:bg-black/20 rounded-xl p-4 border border-zinc-200 dark:border-white/5">
       <div className="flex justify-between items-center mb-4">
         <button onClick={prevMonth} className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-white/5 rounded"><IconChevronLeft className="w-5 h-5" /></button>
         <span className="font-semibold text-zinc-800 dark:text-zinc-100">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
         <button onClick={nextMonth} className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-white/5 rounded"><IconChevronRight className="w-5 h-5" /></button>
       </div>
       <div className="grid grid-cols-7 gap-1 mb-2 text-center">
         {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[10px] text-zinc-400 font-bold uppercase font-mono">{d}</span>)}
       </div>
       <div className="grid grid-cols-7 gap-1">
         {days.map((day, idx) => {
           if (!day) return <div key={`empty-${idx}`}></div>;
           
           const event = hasEvent(day);
           const selected = isSelected(day);

           return (
             <button 
               key={day}
               onClick={() => onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
               className={`h-8 w-8 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all relative
                 ${selected 
                   ? 'bg-cyan-600 text-white shadow-lg dark:shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                   : 'text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'}
               `}
             >
               {day}
               {event && !selected && (
                 <span className="absolute bottom-1 w-1 h-1 bg-violet-500 rounded-full"></span>
               )}
             </button>
           );
         })}
       </div>
    </div>
  );
};


const HomeView: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'WORKING' | 'BREAK'>('IDLE');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastBreakStart, setLastBreakStart] = useState<number | null>(null);
  const [totalBreakMs, setTotalBreakMs] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [activeModal, setActiveModal] = useState<'NONE' | 'WFH' | 'APPLY_LEAVE' | 'REGULARIZE' | 'EXPENSE' | 'HELP'>('NONE');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Quick Action Form States
  const [formInputs, setFormInputs] = useState<any>({});

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    setStartTime(Date.now());
    setStatus('WORKING');
  };

  const handleBreak = () => {
    setLastBreakStart(Date.now());
    setStatus('BREAK');
  };

  const handleResume = () => {
    if (lastBreakStart) {
      setTotalBreakMs(prev => prev + (Date.now() - lastBreakStart));
      setLastBreakStart(null);
    }
    setStatus('WORKING');
  };

  const handleClockOut = () => {
    if (window.confirm("Are you sure you want to clock out for the day?")) {
      if (status === 'BREAK' && lastBreakStart) {
        setTotalBreakMs(prev => prev + (Date.now() - lastBreakStart));
      }
      setStatus('IDLE');
      setStartTime(null);
      setLastBreakStart(null);
      setTotalBreakMs(0);
      alert("Clocked out successfully!");
    }
  };

  let workMs = 0;
  let totalMs = 0;
  let currentBreakMs = 0;

  if (startTime) {
    totalMs = now - startTime;
    if (status === 'BREAK' && lastBreakStart) {
      currentBreakMs = now - lastBreakStart;
    }
    workMs = totalMs - totalBreakMs - currentBreakMs;
  }

  const formatTime = (ms: number) => {
    if (ms < 0) ms = 0;
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const workProgress = Math.min((workMs / (8 * 3600000)) * 100, 100);
  const totalProgress = Math.min((totalMs / (9 * 3600000)) * 100, 100);
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const liveClock = new Date(now).toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Get leaves for the selected date on the side calendar
  const selectedDateStr = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : '';
  const selectedDateLeaves = MOCK_LEAVES.find(l => l.date === selectedDateStr)?.users || [];

  const handleFormChange = (key: string, value: string) => {
    setFormInputs((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = () => {
    alert(`Request submitted successfully!`);
    setActiveModal('NONE');
    setFormInputs({});
  };

  // --- Modal Forms ---
  const renderWFHContent = () => (
    <div className="space-y-6">
      <p className="text-zinc-500 dark:text-zinc-400 text-sm">Select dates for remote work request.</p>
      <div className="flex justify-center">
         <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </div>
      <div>
        <label className="block text-xs text-zinc-500 mb-2 font-medium uppercase font-mono">Reason</label>
        <textarea 
          placeholder="Why are you requesting WFH?"
          className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl p-3 text-sm text-zinc-900 dark:text-white focus:border-cyan-500/50 outline-none resize-none h-24 placeholder:text-zinc-400"
        />
      </div>
      <button onClick={handleFormSubmit} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20">Submit Request</button>
    </div>
  );

  const renderApplyLeaveForm = () => (
    <div className="space-y-5">
        <div>
           <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Leave Type</label>
           <select className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none">
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Privilege Leave</option>
           </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">From Date</label>
              <input type="date" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none" />
           </div>
           <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">To Date</label>
              <input type="date" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none" />
           </div>
        </div>
        <div>
           <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Reason</label>
           <textarea rows={3} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none resize-none" placeholder="Enter reason..."></textarea>
        </div>
        <button onClick={handleFormSubmit} className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-500/20">Apply Leave</button>
    </div>
  );

  const renderRegularizeForm = () => (
     <div className="space-y-5">
        <p className="text-sm text-zinc-500">Correct your attendance for a specific past date.</p>
        <div>
           <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Select Date</label>
           <input type="date" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Check-in</label>
              <input type="time" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none" />
           </div>
           <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Check-out</label>
              <input type="time" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none" />
           </div>
        </div>
        <div>
           <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Reason for correction</label>
           <input type="text" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none" placeholder="e.g. Forgot ID Card" />
        </div>
        <button onClick={handleFormSubmit} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">Submit Regularization</button>
     </div>
  );

  const renderExpenseForm = () => (
     <div className="space-y-5">
        <div>
           <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Expense Title</label>
           <input type="text" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none" placeholder="e.g. Client Dinner" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Amount</label>
               <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
                  <input type="number" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none" placeholder="0.00" />
               </div>
            </div>
            <div>
               <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Date</label>
               <input type="date" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none" />
            </div>
        </div>
        <div>
           <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Receipt</label>
           <div className="border border-dashed border-zinc-300 dark:border-white/20 rounded-xl p-6 text-center text-sm text-zinc-500 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
              Click to upload receipt image
           </div>
        </div>
        <button onClick={handleFormSubmit} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20">Claim Expense</button>
     </div>
  );

  const renderHelpForm = () => (
     <div className="space-y-5">
        <div>
           <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Department</label>
           <select className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none">
              <option>IT Support</option>
              <option>HR Queries</option>
              <option>Payroll</option>
              <option>Admin / Facilities</option>
           </select>
        </div>
        <div>
           <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Subject</label>
           <input type="text" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none" placeholder="Brief issue summary" />
        </div>
        <div>
           <label className="block text-xs text-zinc-500 mb-1.5 uppercase font-bold">Description</label>
           <textarea rows={4} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none resize-none" placeholder="Describe your issue..."></textarea>
        </div>
        <button onClick={handleFormSubmit} className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-pink-500/20">Raise Ticket</button>
     </div>
  );

  const renderModalContent = () => {
    switch (activeModal) {
      case 'WFH': return renderWFHContent();
      case 'APPLY_LEAVE': return renderApplyLeaveForm();
      case 'REGULARIZE': return renderRegularizeForm();
      case 'EXPENSE': return renderExpenseForm();
      case 'HELP': return renderHelpForm();
      default: return null;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <Modal title={activeModal.replace('_', ' ')} isOpen={activeModal !== 'NONE'} onClose={() => setActiveModal('NONE')}>
        {renderModalContent()}
      </Modal>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/30 border border-cyan-500/20 px-2 py-0.5 rounded uppercase tracking-wider font-mono">{currentDate}</span>
           </div>
           <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-1 tracking-tight">Good Morning, {CURRENT_USER.name.split(' ')[0]}</h1>
        </div>
        {status === 'IDLE' && (
           <button onClick={() => setActiveModal('WFH')} className="px-5 py-2.5 bg-white hover:bg-zinc-50 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-200 rounded-lg text-sm font-medium transition-all border border-zinc-200 dark:border-white/10 flex items-center gap-2 hover:border-cyan-500/30 shadow-sm">
             <IconBriefcase className="w-4 h-4" /> Request WFH
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Attendance Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-8 shadow-sm dark:shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] opacity-10 dark:opacity-20 -mr-20 -mt-20 transition-colors duration-1000 pointer-events-none
              ${status === 'WORKING' ? 'bg-cyan-500' : status === 'BREAK' ? 'bg-violet-500' : 'bg-zinc-500'}`} 
            />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
               <div className="flex-1">
                  <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest font-mono mb-2">Attendance Status</h3>
                  {status === 'IDLE' ? (
                     <div className="py-4">
                       <p className="text-5xl font-bold text-zinc-800 dark:text-zinc-100 font-mono tracking-tighter tabular-nums">{liveClock}</p>
                       <p className="text-zinc-500 mt-2 text-sm flex items-center gap-2">
                         <span className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"></span> Ready to start your day?
                       </p>
                     </div>
                  ) : (
                     <div className="py-2">
                       <div className="flex items-baseline gap-3">
                          <p className={`text-6xl font-mono font-bold tracking-tighter tabular-nums ${status === 'BREAK' ? 'text-violet-500 dark:text-violet-400' : 'text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]'}`}>
                             {formatTime(workMs)}
                          </p>
                       </div>
                       <div className="flex gap-8 mt-6 text-sm">
                          <div><p className="text-zinc-500 text-xs uppercase mb-1">Gross</p><p className="text-zinc-700 dark:text-zinc-300 font-mono">{formatTime(totalMs)}</p></div>
                          <div><p className="text-zinc-500 text-xs uppercase mb-1">Break</p><p className="text-violet-500 dark:text-violet-400 font-mono">{formatTime(totalBreakMs + (status === 'BREAK' ? currentBreakMs : 0))}</p></div>
                          <div>
                             <p className="text-zinc-500 text-xs uppercase mb-1">State</p>
                             <div className="flex items-center gap-2">
                               <span className={`w-2 h-2 rounded-full ${status === 'BREAK' ? 'bg-violet-500 animate-pulse' : 'bg-cyan-500 animate-pulse'}`}></span>
                               <span className="text-zinc-700 dark:text-zinc-200 font-medium">{status}</span>
                             </div>
                          </div>
                       </div>
                     </div>
                  )}
               </div>

               <div className="w-full md:w-auto flex flex-col gap-3 min-w-[200px]">
                  {status === 'IDLE' && (
                     <button onClick={handleClockIn} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                       <IconClock className="w-5 h-5" /> Clock In
                     </button>
                  )}
                  {status === 'WORKING' && (
                    <>
                      <button onClick={handleBreak} className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-700 text-violet-600 dark:text-violet-300 rounded-xl font-medium transition-colors border border-zinc-200 dark:border-white/5 flex items-center justify-center gap-2"><IconCoffee className="w-5 h-5" /> Pause</button>
                      <button onClick={handleClockOut} className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-xl font-medium transition-colors border border-red-200 dark:border-red-500/20 flex items-center justify-center gap-2"><IconStopCircle className="w-5 h-5" /> Stop</button>
                    </>
                  )}
                  {status === 'BREAK' && (
                    <>
                      <button onClick={handleResume} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"><IconPlay className="w-5 h-5" /> Resume</button>
                      <button onClick={handleClockOut} className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-200 dark:border-red-500/20 flex items-center justify-center gap-2"><IconStopCircle className="w-5 h-5" /> Stop</button>
                    </>
                  )}
               </div>
            </div>

            {status !== 'IDLE' && (
               <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                     <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500 mb-2"><span>Target (8h)</span><span className="text-cyan-600 dark:text-cyan-400">{Math.round(workProgress)}%</span></div>
                     <div className="h-1.5 bg-zinc-200 dark:bg-black/50 rounded-full overflow-hidden border border-zinc-200 dark:border-white/5"><div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000" style={{ width: `${workProgress}%` }}></div></div>
                  </div>
                  <div>
                     <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500 mb-2"><span>Gross (9h)</span><span className="text-zinc-500 dark:text-zinc-400">{Math.round(totalProgress)}%</span></div>
                     <div className="h-1.5 bg-zinc-200 dark:bg-black/50 rounded-full overflow-hidden border border-zinc-200 dark:border-white/5"><div className="h-full bg-zinc-400 dark:bg-zinc-600 transition-all duration-1000" style={{ width: `${totalProgress}%` }}></div></div>
                  </div>
               </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Stat Card 1 */}
            <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm hover:border-cyan-500/30 transition-colors">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Attendance</p>
                  <p className="text-3xl font-bold text-zinc-800 dark:text-white font-mono">21<span className="text-zinc-500 dark:text-zinc-600 text-xl">/23</span></p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded inline-block border border-emerald-200 dark:border-emerald-500/20">On Track</p>
                </div>
                <div className="p-3 bg-zinc-100 dark:bg-black/40 rounded-xl border border-zinc-200 dark:border-white/5 text-emerald-500 dark:text-emerald-400 h-fit"><IconCheckCircle className="w-6 h-6" /></div>
              </div>
            </div>
             {/* Stat Card 2 */}
            <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm hover:border-violet-500/30 transition-colors">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Leave Bal</p>
                  <p className="text-3xl font-bold text-zinc-800 dark:text-white font-mono">12<span className="text-xs text-zinc-500 ml-1">days</span></p>
                  <p className="text-xs text-violet-600 dark:text-violet-400 mt-2 bg-violet-50 dark:bg-violet-500/10 px-2 py-0.5 rounded inline-block border border-violet-200 dark:border-violet-500/20">Available</p>
                </div>
                <div className="p-3 bg-zinc-100 dark:bg-black/40 rounded-xl border border-zinc-200 dark:border-white/5 text-violet-500 dark:text-violet-400 h-fit"><IconSun className="w-6 h-6" /></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-6 shadow-sm">
             <h3 className="text-zinc-800 dark:text-zinc-200 font-semibold mb-6 text-sm uppercase tracking-wide">Quick Actions</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Apply Leave', icon: IconSun, color: 'text-violet-500 dark:text-violet-400', action: 'APPLY_LEAVE' },
                { label: 'Regularize', icon: IconClock, color: 'text-emerald-500 dark:text-emerald-400', action: 'REGULARIZE' },
                { label: 'Expense', icon: IconBriefcase, color: 'text-amber-500 dark:text-amber-400', action: 'EXPENSE' },
                { label: 'Help Desk', icon: IconMessage, color: 'text-pink-500 dark:text-pink-400', action: 'HELP' }
              ].map(item => (
                <button key={item.label} onClick={() => setActiveModal(item.action as any)} className="flex flex-col items-center justify-center gap-3 p-4 bg-zinc-50 dark:bg-black/20 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/5 transition-all group shadow-sm dark:shadow-none">
                   <div className={`p-2 rounded-lg bg-white dark:bg-black/40 group-hover:scale-110 transition-transform ${item.color} border border-zinc-100 dark:border-transparent`}><item.icon className="w-6 h-6" /></div>
                   <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">{item.label}</span>
                </button>
              ))}
             </div>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-6 shadow-sm flex flex-col h-fit">
             <h3 className="text-zinc-800 dark:text-zinc-200 font-bold mb-4 text-xs uppercase tracking-widest border-b border-zinc-200 dark:border-white/5 pb-2">Team Calendar</h3>
             
             {/* Mini Calendar in Sidebar */}
             <div className="mb-6 flex justify-center">
                 <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} events={MOCK_LEAVES} />
             </div>

             <div className="flex items-center justify-between mb-2">
                 <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide">On Leave • {selectedDate?.toLocaleDateString()}</h4>
                 <span className="text-[10px] bg-zinc-100 dark:bg-white/10 px-2 py-0.5 rounded-full text-zinc-500">{selectedDateLeaves.length}</span>
             </div>

             <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                {selectedDateLeaves.length > 0 ? (
                  selectedDateLeaves.map((user, idx) => (
                   <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-200 dark:border-white/5 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                       <img src={user.avatar} className="w-10 h-10 rounded-lg border border-zinc-300 dark:border-white/10 opacity-90 dark:opacity-75" />
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{user.name}</p>
                          <p className="text-[10px] text-red-500 dark:text-red-400 uppercase tracking-wide truncate">{user.type}</p>
                       </div>
                   </div>
                  ))
                ) : (
                  <div className="p-4 text-center border border-dashed border-zinc-300 dark:border-white/10 rounded-xl text-zinc-400 text-sm">
                     No one is on leave today.
                  </div>
                )}
             </div>
           </div>

           <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-6 shadow-sm">
             <h3 className="text-zinc-800 dark:text-zinc-200 font-bold mb-4 text-xs uppercase tracking-widest border-b border-zinc-200 dark:border-white/5 pb-2">Upcoming Holidays</h3>
             <div className="space-y-3">
               <div className="flex gap-3 items-center p-3 bg-zinc-50 dark:bg-black/20 rounded-xl border-l-2 border-amber-500">
                  <div className="text-center min-w-[2.5rem]"><span className="block text-[10px] text-zinc-500 font-bold uppercase">Dec</span><span className="block text-lg text-zinc-800 dark:text-white font-bold font-mono">25</span></div>
                  <div><p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Christmas</p><p className="text-[10px] text-zinc-500 uppercase">Wednesday</p></div>
               </div>
               <div className="flex gap-3 items-center p-3 bg-zinc-50 dark:bg-black/20 rounded-xl border-l-2 border-cyan-500">
                  <div className="text-center min-w-[2.5rem]"><span className="block text-[10px] text-zinc-500 font-bold uppercase">Jan</span><span className="block text-lg text-zinc-800 dark:text-white font-bold font-mono">01</span></div>
                  <div><p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">New Year's Day</p><p className="text-[10px] text-zinc-500 uppercase">Monday</p></div>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default HomeView;