import React, { useState } from 'react';
import { 
  IconSearch, IconPlus, IconTrash, IconFileEdit, IconCheckCircle, IconXCircle, 
  IconShield, IconUsers, IconChevronLeft, IconKey, IconUserCheck, IconBriefcase,
  IconWallet, IconFileText, IconLaptop, IconHistory, IconMapPin, IconMail, IconSmartphone
} from './Icons';
import { CURRENT_USER } from '../constants';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  email: string;
  status: 'Active' | 'Inactive' | 'Notice Period' | 'Probation';
  avatar: string;
  joinDate: string;
  location: string;
  manager: string;
}

const AdminView: React.FC = () => {
  // Mock Data
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'EMP-001', name: CURRENT_USER.name, role: CURRENT_USER.role, department: CURRENT_USER.department, salary: 3200000, email: 'alex@nexushr.com', status: 'Active', avatar: CURRENT_USER.avatarUrl, joinDate: 'Jan 2022', location: 'New York', manager: 'David Miller' },
    { id: 'EMP-002', name: 'Sarah Jenkins', role: 'Product Manager', department: 'Product', salary: 2800000, email: 'sarah@nexushr.com', status: 'Active', avatar: 'https://picsum.photos/200?random=11', joinDate: 'Mar 2023', location: 'London', manager: 'Alex Sterling' },
    { id: 'EMP-003', name: 'Mike Ross', role: 'Frontend Developer', department: 'Engineering', salary: 2400000, email: 'mike@nexushr.com', status: 'Probation', avatar: 'https://picsum.photos/200?random=12', joinDate: 'Oct 2024', location: 'Remote', manager: 'Jessica Pearson' },
    { id: 'EMP-004', name: 'Jessica Pearson', role: 'VP of Engineering', department: 'Engineering', salary: 5500000, email: 'jessica@nexushr.com', status: 'Active', avatar: 'https://picsum.photos/200?random=13', joinDate: 'Jan 2018', location: 'New York', manager: 'CEO' },
    { id: 'EMP-005', name: 'Louis Litt', role: 'QA Lead', department: 'Engineering', salary: 2100000, email: 'louis@nexushr.com', status: 'Inactive', avatar: 'https://picsum.photos/200?random=14', joinDate: 'Jun 2020', location: 'New York', manager: 'Jessica Pearson' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Profile' | 'Job' | 'Documents' | 'Assets' | 'Time'>('Overview');

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateEmployee = (id: string, field: keyof Employee, value: any) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
    if (selectedEmp && selectedEmp.id === id) {
      setSelectedEmp(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleAction = (action: string) => {
    if (!selectedEmp) return;
    if (action === 'delete') {
      if (window.confirm(`Permanently delete ${selectedEmp.name}?`)) {
        setEmployees(prev => prev.filter(e => e.id !== selectedEmp.id));
        setSelectedEmp(null);
      }
    } else if (action === 'password') {
       alert(`Password reset link sent to ${selectedEmp.email}`);
    } else if (action === 'terminate') {
       if (window.confirm("Mark this employee as Inactive?")) {
          handleUpdateEmployee(selectedEmp.id, 'status', 'Inactive');
       }
    }
  };

  // --- Sub-components for Detailed View ---

  const renderOverview = (emp: Employee) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
             <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Quick Stats</h3>
             <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-black/40 rounded-xl border border-zinc-200 dark:border-white/5">
                   <p className="text-xs text-zinc-500 uppercase font-bold">Tenure</p>
                   <p className="text-lg font-mono text-zinc-800 dark:text-white mt-1">2.4 Yrs</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-black/40 rounded-xl border border-zinc-200 dark:border-white/5">
                   <p className="text-xs text-zinc-500 uppercase font-bold">Leave Bal</p>
                   <p className="text-lg font-mono text-zinc-800 dark:text-white mt-1">12 Days</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-black/40 rounded-xl border border-zinc-200 dark:border-white/5">
                   <p className="text-xs text-zinc-500 uppercase font-bold">Status</p>
                   <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-bold rounded ${emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {emp.status}
                   </span>
                </div>
             </div>
          </div>
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
             <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Timeline</h3>
             <div className="space-y-4 border-l-2 border-zinc-200 dark:border-white/10 ml-2 pl-4">
                <div className="relative">
                   <div className="absolute -left-[21px] top-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-white dark:border-black"></div>
                   <p className="text-sm text-zinc-800 dark:text-white font-medium">Promoted to Senior Role</p>
                   <p className="text-xs text-zinc-500">Jan 2024</p>
                </div>
                <div className="relative">
                   <div className="absolute -left-[21px] top-1 w-3 h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full border-2 border-white dark:border-black"></div>
                   <p className="text-sm text-zinc-800 dark:text-white font-medium">Joined the company</p>
                   <p className="text-xs text-zinc-500">{emp.joinDate}</p>
                </div>
             </div>
          </div>
       </div>
       <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
             <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Admin Actions</h3>
             <div className="space-y-2">
                <button onClick={() => handleAction('password')} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-white/10">
                   <IconKey className="w-4 h-4 text-amber-500" /> Reset Password
                </button>
                <button onClick={() => alert("Verification Email Sent")} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-white/10">
                   <IconUserCheck className="w-4 h-4 text-emerald-500" /> Verify Identity
                </button>
                <div className="h-px bg-zinc-100 dark:bg-white/5 my-2"></div>
                <button onClick={() => handleUpdateEmployee(emp.id, 'status', 'Notice Period')} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-white/10">
                   <IconHistory className="w-4 h-4 text-orange-500" /> Put on Notice Period
                </button>
                <button onClick={() => handleAction('terminate')} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-500/20">
                   <IconXCircle className="w-4 h-4" /> Terminate Employee
                </button>
             </div>
          </div>
       </div>
    </div>
  );

  const renderProfileTab = (emp: Employee) => (
     <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Personal Details</h3>
        <div className="grid grid-cols-2 gap-6">
           <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Full Name</label>
              <input type="text" value={emp.name} onChange={(e) => handleUpdateEmployee(emp.id, 'name', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
           </div>
           <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Email Address</label>
              <input type="email" value={emp.email} onChange={(e) => handleUpdateEmployee(emp.id, 'email', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
           </div>
           <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Location</label>
              <div className="relative">
                 <IconMapPin className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                 <input type="text" value={emp.location} onChange={(e) => handleUpdateEmployee(emp.id, 'location', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
              </div>
           </div>
           <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Mobile</label>
              <div className="relative">
                 <IconSmartphone className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                 <input type="text" defaultValue="+1 (555) 000-0000" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
              </div>
           </div>
           <div className="col-span-2 flex justify-end mt-4">
              <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-sm">Save Changes</button>
           </div>
        </div>
     </div>
  );

  const renderJobTab = (emp: Employee) => (
     <div className="space-y-6">
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
           <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2"><IconBriefcase className="w-5 h-5 text-cyan-600" /> Job Information</h3>
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Designation</label>
                 <input type="text" value={emp.role} onChange={(e) => handleUpdateEmployee(emp.id, 'role', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Department</label>
                 <select value={emp.department} onChange={(e) => handleUpdateEmployee(emp.id, 'department', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-500">
                     <option>Engineering</option><option>Product</option><option>Design</option><option>HR</option><option>Sales</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Reporting Manager</label>
                 <input type="text" value={emp.manager} onChange={(e) => handleUpdateEmployee(emp.id, 'manager', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Employment Type</label>
                 <select className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-500">
                     <option>Full Time</option><option>Part Time</option><option>Contract</option>
                 </select>
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2"><IconWallet className="w-5 h-5 text-emerald-500" /> Compensation</h3>
              <button className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline">View Salary History</button>
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Annual CTC</label>
                 <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-400 text-sm">₹</span>
                    <input type="number" value={emp.salary} onChange={(e) => handleUpdateEmployee(emp.id, 'salary', parseInt(e.target.value))} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Effective From</label>
                 <input type="date" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
              </div>
           </div>
           <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-end">
               <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm">Update Salary</button>
           </div>
        </div>
     </div>
  );

  const renderDocumentsTab = () => (
     <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2"><IconFileText className="w-5 h-5 text-indigo-500" /> Document Verification</h3>
        <div className="space-y-3">
           {['Passport / ID', 'Degree Certificate', 'Previous Relieving Letter'].map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-200 dark:border-white/5">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-white/5 rounded-lg text-zinc-400"><IconFileText className="w-5 h-5" /></div>
                    <div>
                       <p className="text-sm font-bold text-zinc-900 dark:text-white">{doc}</p>
                       <p className="text-xs text-zinc-500">Uploaded Jan 15, 2024</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 rounded-lg text-xs font-bold">View</button>
                    <button className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-xs font-bold flex items-center gap-1">
                       <IconCheckCircle className="w-3.5 h-3.5" /> Verify
                    </button>
                 </div>
              </div>
           ))}
        </div>
     </div>
  );

  const renderAssetsTab = () => (
     <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2"><IconLaptop className="w-5 h-5 text-amber-500" /> Assigned Assets</h3>
           <button className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold flex items-center gap-2 hover:opacity-90">
              <IconPlus className="w-4 h-4" /> Assign New Asset
           </button>
        </div>
        <div className="space-y-3">
           <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-200 dark:border-white/5">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-white dark:bg-white/5 rounded-lg text-zinc-400"><IconLaptop className="w-5 h-5" /></div>
                 <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">MacBook Pro 16"</p>
                    <p className="text-xs text-zinc-500">Serial: C02XYZ123 • Assigned Jan 2022</p>
                 </div>
              </div>
              <button className="text-xs font-bold text-red-500 hover:underline">Revoke</button>
           </div>
        </div>
     </div>
  );


  // --- Main Render Switch ---

  if (selectedEmp) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
         {/* Detail Header */}
         <div className="flex items-center justify-between">
            <button onClick={() => setSelectedEmp(null)} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-bold uppercase tracking-wide">
               <IconChevronLeft className="w-4 h-4" /> Back to List
            </button>
            <div className="flex gap-2">
               <button onClick={() => handleAction('delete')} className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"><IconTrash className="w-5 h-5" /></button>
            </div>
         </div>

         <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
               <img src={selectedEmp.avatar} alt="" className="w-24 h-24 rounded-2xl border-4 border-zinc-100 dark:border-zinc-800 shadow-lg object-cover" />
               <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{selectedEmp.name}</h1>
                  <p className="text-zinc-500 text-lg mt-1 flex items-center justify-center md:justify-start gap-2">
                     {selectedEmp.role} <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></span> {selectedEmp.department}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                     <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <IconMail className="w-4 h-4" /> {selectedEmp.email}
                     </div>
                     <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <IconMapPin className="w-4 h-4" /> {selectedEmp.location}
                     </div>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-2">
                  <span className={`px-4 py-1.5 rounded-lg font-bold text-sm border uppercase tracking-wide ${selectedEmp.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                     {selectedEmp.status}
                  </span>
                  <p className="text-xs text-zinc-500">ID: {selectedEmp.id}</p>
               </div>
            </div>

            <div className="flex gap-6 mt-8 border-b border-zinc-200 dark:border-white/5 overflow-x-auto">
               {['Overview', 'Profile', 'Job', 'Documents', 'Assets', 'Time'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-white'}`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
         </div>
         
         {/* Detail Content */}
         <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'Overview' && renderOverview(selectedEmp)}
            {activeTab === 'Profile' && renderProfileTab(selectedEmp)}
            {activeTab === 'Job' && renderJobTab(selectedEmp)}
            {activeTab === 'Documents' && renderDocumentsTab()}
            {activeTab === 'Assets' && renderAssetsTab()}
            {activeTab === 'Time' && (
               <div className="text-center py-12 bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm text-zinc-500">
                  <IconHistory className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Attendance & Leave History Module</p>
               </div>
            )}
         </div>
      </div>
    );
  }

  // --- List View ---

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
             <IconShield className="w-6 h-6 text-cyan-600 dark:text-cyan-400" /> Admin Portal
           </h1>
           <p className="text-zinc-500 dark:text-zinc-400 mt-1">Employee Directory & Management</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search employees..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-cyan-500 w-64 shadow-sm"
              />
           </div>
           <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all">
              <IconPlus className="w-4 h-4" /> Add Employee
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl text-cyan-600 dark:text-cyan-400"><IconUsers className="w-6 h-6" /></div>
               <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Employees</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1 font-mono">{employees.length}</p>
         </div>
         <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-violet-50 dark:bg-violet-500/10 rounded-xl text-violet-600 dark:text-violet-400"><IconCheckCircle className="w-6 h-6" /></div>
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Active Status</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1 font-mono">{employees.filter(e => e.status === 'Active').length}</p>
         </div>
         <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400"><IconShield className="w-6 h-6" /></div>
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Departments</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1 font-mono">{new Set(employees.map(e => e.department)).size}</p>
         </div>
      </div>

      {/* Employee List Table */}
      <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 dark:bg-white/5 text-xs uppercase text-zinc-500 dark:text-zinc-400 font-medium border-b border-zinc-200 dark:border-white/5">
              <tr>
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Role & Dept</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Manager</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
               {filteredEmployees.map(emp => (
                 <tr key={emp.id} className="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedEmp(emp)}>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <img src={emp.avatar} className="w-10 h-10 rounded-full border border-zinc-200 dark:border-white/10" alt="" />
                          <div>
                             <p className="text-sm font-bold text-zinc-900 dark:text-white">{emp.name}</p>
                             <p className="text-xs text-zinc-500">{emp.id}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm font-medium text-zinc-900 dark:text-white">{emp.role}</p>
                       <p className="text-xs text-zinc-500">{emp.department}</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                          {emp.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm text-zinc-900 dark:text-white">{emp.manager}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="px-3 py-1.5 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 rounded-lg text-xs font-bold transition-colors">
                          View Profile
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

export default AdminView;
