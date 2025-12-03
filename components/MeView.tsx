import React, { useState } from 'react';
import { CURRENT_USER } from '../constants';
import { 
  IconMapPin, IconMessage, IconUser, IconBriefcase, IconCalendar, IconSparkles, 
  IconPlus, IconTrash, IconLaptop, IconMonitor, IconSmartphone, IconMail, 
  IconHome, IconFilePlus, IconCheckCircle, IconCloudUpload, IconX, IconDownload
} from './Icons';
import { GoogleGenAI } from "@google/genai";

const EditProfileModal = ({ isOpen, onClose, data, onSave }: { isOpen: boolean; onClose: () => void; data: any; onSave: (d: any) => void }) => {
  const [formData, setFormData] = useState(data);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-white/10">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Edit Profile</h3>
          <button onClick={onClose} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <IconX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
           <div>
              <h4 className="text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs text-zinc-500 mb-1.5 uppercase">Date of Birth</label>
                    <input type="text" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none transition-colors" />
                 </div>
                 <div>
                    <label className="block text-xs text-zinc-500 mb-1.5 uppercase">Gender</label>
                    <select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none transition-colors">
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs text-zinc-500 mb-1.5 uppercase">Marital Status</label>
                    <select value={formData.maritalStatus} onChange={(e) => handleChange('maritalStatus', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none transition-colors">
                      <option>Single</option><option>Married</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs text-zinc-500 mb-1.5 uppercase">Blood Group</label>
                    <input type="text" value={formData.bloodGroup} onChange={(e) => handleChange('bloodGroup', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none transition-colors" />
                 </div>
              </div>
           </div>
           
           <div>
              <h4 className="text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">Contact & Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="md:col-span-2">
                    <label className="block text-xs text-zinc-500 mb-1.5 uppercase">Current Address</label>
                    <textarea rows={3} value={formData.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none transition-colors resize-none" />
                 </div>
                 <div>
                    <label className="block text-xs text-zinc-500 mb-1.5 uppercase">Personal Email</label>
                    <input type="email" value={formData.personalEmail} onChange={(e) => handleChange('personalEmail', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none transition-colors" />
                 </div>
                 <div>
                    <label className="block text-xs text-zinc-500 mb-1.5 uppercase">Mobile</label>
                    <input type="text" value={formData.mobile} onChange={(e) => handleChange('mobile', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white text-sm focus:border-cyan-500 outline-none transition-colors" />
                 </div>
              </div>
           </div>
        </div>

        <div className="p-6 border-t border-zinc-200 dark:border-white/10 flex justify-end gap-3 bg-zinc-50 dark:bg-black/20 rounded-b-2xl">
           <button onClick={onClose} className="px-5 py-2.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm font-medium transition-colors">Cancel</button>
           <button onClick={() => onSave(formData)} className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const MeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Profile', 'Job', 'Documents', 'Assets'];
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Profile Data State
  const [profileData, setProfileData] = useState({
    dob: '15 Aug, 1990', gender: 'Male', maritalStatus: 'Single', bloodGroup: 'O+', nationality: 'American',
    location: 'New York, USA', personalEmail: 'alex.sterling.personal@gmail.com', mobile: '+1 (555) 987-6543',
    address: '404, Silicon Valley Apartments, Tech Park Road, San Francisco, CA 94107'
  });
  
  const [aboutText, setAboutText] = useState("Senior Product Designer with over 7 years of experience. Expert in user-centered design, prototyping, and design systems. Passionate about creating intuitive and accessible digital experiences.");
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // Jobs State
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Senior Product Designer', company: 'NexusHR Tech', from: 'Jan 2022', to: 'Present', desc: 'Leading design system architecture and UX strategy for enterprise products.' },
    { id: 2, title: 'Product Designer', company: 'Creative Solutions', from: 'Jun 2018', to: 'Dec 2021', desc: 'Designed core mobile applications and improved user retention by 25%.' }
  ]);
  const [showAddJob, setShowAddJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', from: '', to: '', desc: '' });

  // Documents State
  const [documents, setDocuments] = useState([
     { id: 1, name: 'Passport / National ID', category: 'Identity', status: 'Uploaded', date: 'Jan 10, 2024' },
     { id: 2, name: 'Degree Certificate', category: 'Education', status: 'Uploaded', date: 'Jan 12, 2024' },
     { id: 3, name: 'Previous Relieving Letter', category: 'Experience', status: 'Pending', date: '-' },
     { id: 4, name: 'Tax Declaration Form', category: 'Finance', status: 'Pending', date: '-' },
  ]);

  // Assets Mock Data
  const assets = [
    { id: 1, name: 'MacBook Pro 16"', type: 'Laptop', serial: 'C02XYZ123', assigned: 'Jan 15, 2024', icon: IconLaptop },
    { id: 2, name: 'Dell UltraSharp 27"', type: 'Monitor', serial: 'DEL-456-789', assigned: 'Jan 15, 2024', icon: IconMonitor },
    { id: 3, name: 'iPhone 15 Test Device', type: 'Mobile', serial: 'IMEI-998877', assigned: 'Feb 10, 2024', icon: IconSmartphone },
  ];
  
  const handleEnhanceProfile = async () => {
    if (!process.env.API_KEY) return;
    setIsEnhancing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Rewrite pro summary for ${CURRENT_USER.name}, ${CURRENT_USER.role}. Draft: "${aboutText}". Make it tech-focused and executive.`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      if (response.text) setAboutText(response.text.trim());
    } finally { setIsEnhancing(false); }
  };

  const handleAddJob = () => {
    if (!newJob.title || !newJob.company) return;
    setJobs([{ id: Date.now(), ...newJob }, ...jobs]);
    setShowAddJob(false);
    setNewJob({ title: '', company: '', from: '', to: '', desc: '' });
  };

  const handleUploadDoc = (id: number) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'Uploading...' } : d));
    setTimeout(() => {
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'Uploaded', date: new Date().toLocaleDateString() } : d));
    }, 1500);
  };

  // --- Render Sections ---

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-6 shadow-sm">
             <h3 className="text-zinc-800 dark:text-zinc-200 font-semibold mb-4 text-sm uppercase tracking-wide">Reporting To</h3>
             <div className="flex items-center gap-3">
                <img src="https://picsum.photos/200?random=55" alt="Manager" className="w-10 h-10 rounded-lg border border-zinc-300 dark:border-white/10" />
                <div><p className="text-sm font-medium text-zinc-900 dark:text-white">David Miller</p><p className="text-xs text-zinc-500">Director of Product</p></div>
             </div>
          </div>
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-6 shadow-sm">
             <h3 className="text-zinc-800 dark:text-zinc-200 font-semibold mb-4 text-sm uppercase tracking-wide">Work Info</h3>
             <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400"><IconBriefcase className="w-4 h-4 text-cyan-500" /> Full Time</div>
                <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400"><IconMapPin className="w-4 h-4 text-cyan-500" /> New York HQ</div>
                <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400"><IconCalendar className="w-4 h-4 text-cyan-500" /> Joined Jan 2022</div>
             </div>
          </div>
       </div>
       <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-6 relative shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-zinc-900 dark:text-zinc-200 font-semibold text-lg">About</h3>
              <button onClick={handleEnhanceProfile} disabled={isEnhancing} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-xs font-bold transition-all disabled:opacity-50">
                {isEnhancing ? <span className="animate-pulse">Processing...</span> : <><IconSparkles className="w-3.5 h-3.5" /> AI Enhance</>}
              </button>
            </div>
            <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/5 rounded-xl p-4 text-zinc-800 dark:text-zinc-300 text-sm leading-relaxed focus:outline-none focus:border-cyan-500/50 transition-all resize-y min-h-[120px]" />
          </div>
          
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-6 shadow-sm">
             <h3 className="text-zinc-900 dark:text-zinc-200 font-semibold text-lg mb-4">Skills</h3>
             <div className="flex flex-wrap gap-2">
               {['Product Design', 'Figma', 'Prototyping', 'User Research', 'Design Systems', 'React', 'Frontend'].map(skill => (
                 <span key={skill} className="px-3 py-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors cursor-default">{skill}</span>
               ))}
             </div>
          </div>
       </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-8 shadow-sm">
       <div className="flex justify-between items-center mb-8 border-b border-zinc-200 dark:border-white/10 pb-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Profile Details</h2>
          <button onClick={() => setIsEditModalOpen(true)} className="text-cyan-600 dark:text-cyan-400 text-sm font-medium hover:underline">Edit Details</button>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
          <div>
             <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Personal</h3>
             <div className="space-y-4">
                <div className="grid grid-cols-3 border-b border-zinc-100 dark:border-white/5 pb-2">
                   <span className="text-sm text-zinc-500">Date of Birth</span>
                   <span className="col-span-2 text-sm text-zinc-900 dark:text-white font-medium">{profileData.dob}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-zinc-100 dark:border-white/5 pb-2">
                   <span className="text-sm text-zinc-500">Gender</span>
                   <span className="col-span-2 text-sm text-zinc-900 dark:text-white font-medium">{profileData.gender}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-zinc-100 dark:border-white/5 pb-2">
                   <span className="text-sm text-zinc-500">Marital Status</span>
                   <span className="col-span-2 text-sm text-zinc-900 dark:text-white font-medium">{profileData.maritalStatus}</span>
                </div>
                <div className="grid grid-cols-3 pb-2">
                   <span className="text-sm text-zinc-500">Blood Group</span>
                   <span className="col-span-2 text-sm text-zinc-900 dark:text-white font-medium">{profileData.bloodGroup}</span>
                </div>
             </div>
          </div>

          <div>
             <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Contact</h3>
             <div className="space-y-4">
                <div className="grid grid-cols-3 border-b border-zinc-100 dark:border-white/5 pb-2">
                   <span className="text-sm text-zinc-500">Personal Email</span>
                   <span className="col-span-2 text-sm text-zinc-900 dark:text-white font-medium">{profileData.personalEmail}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-zinc-100 dark:border-white/5 pb-2">
                   <span className="text-sm text-zinc-500">Mobile</span>
                   <span className="col-span-2 text-sm text-zinc-900 dark:text-white font-medium">{profileData.mobile}</span>
                </div>
                <div className="grid grid-cols-3 pb-2">
                   <span className="text-sm text-zinc-500">Work Email</span>
                   <span className="col-span-2 text-sm text-zinc-900 dark:text-white font-medium">{CURRENT_USER.id.toLowerCase()}@nexushr.com</span>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 mt-4">
             <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Address</h3>
             <div className="bg-zinc-50 dark:bg-black/20 rounded-xl p-4 border border-zinc-200 dark:border-white/5 flex gap-4">
                <div className="p-2 bg-white dark:bg-white/10 rounded-lg h-fit text-zinc-400"><IconHome className="w-5 h-5" /></div>
                <div>
                   <p className="text-sm text-zinc-900 dark:text-white font-medium mb-1">Current Residence</p>
                   <p className="text-sm text-zinc-500 leading-relaxed">{profileData.address}</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderJob = () => (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Employment History</h2>
         <button onClick={() => setShowAddJob(!showAddJob)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">
            <IconPlus className="w-4 h-4" /> Add Previous Job
         </button>
       </div>

       {showAddJob && (
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-6 shadow-xl animate-in fade-in slide-in-from-top-4">
             <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Add Experience</h3>
             <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Job Title" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500" />
                <input type="text" placeholder="Company Name" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500" />
                <input type="text" placeholder="From (e.g. Jan 2020)" value={newJob.from} onChange={e => setNewJob({...newJob, from: e.target.value})} className="bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500" />
                <input type="text" placeholder="To (e.g. Dec 2021)" value={newJob.to} onChange={e => setNewJob({...newJob, to: e.target.value})} className="bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500" />
             </div>
             <textarea placeholder="Description" value={newJob.desc} onChange={e => setNewJob({...newJob, desc: e.target.value})} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500 mb-4 resize-none" rows={3}></textarea>
             <div className="flex justify-end gap-2">
                <button onClick={() => setShowAddJob(false)} className="px-4 py-2 text-zinc-500 text-sm">Cancel</button>
                <button onClick={handleAddJob} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold">Save</button>
             </div>
          </div>
       )}

       <div className="relative border-l-2 border-zinc-200 dark:border-white/10 ml-4 space-y-8 pb-8">
          {jobs.map((job, idx) => (
             <div key={job.id} className="relative pl-8 group">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-black group-hover:bg-cyan-500 group-hover:scale-125 transition-all"></div>
                <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-6 shadow-sm group-hover:border-cyan-500/30 transition-colors">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{job.title}</h3>
                      <span className="text-xs font-mono text-zinc-500 bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded border border-zinc-200 dark:border-white/10">{job.from} - {job.to}</span>
                   </div>
                   <p className="text-cyan-600 dark:text-cyan-400 font-medium text-sm mb-3">{job.company}</p>
                   <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{job.desc}</p>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderDocuments = () => (
     <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">My Documents</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {documents.map(doc => (
              <div key={doc.id} className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-5 shadow-sm hover:border-cyan-500/30 transition-all group">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-zinc-50 dark:bg-black/40 rounded-xl text-zinc-400 group-hover:text-cyan-500 transition-colors">
                       <IconFilePlus className="w-6 h-6" />
                    </div>
                    {doc.status === 'Uploaded' ? (
                       <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200 dark:border-emerald-500/20 uppercase">Uploaded</span>
                    ) : (
                       <span className="bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-1 rounded border border-amber-200 dark:border-amber-500/20 uppercase">{doc.status}</span>
                    )}
                 </div>
                 <h3 className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">{doc.name}</h3>
                 <p className="text-xs text-zinc-500 mb-4">{doc.category} • {doc.date !== '-' ? doc.date : 'Missing'}</p>
                 
                 {doc.status === 'Pending' ? (
                    <button onClick={() => handleUploadDoc(doc.id)} className="w-full py-2 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-zinc-200 dark:border-white/5">
                       <IconCloudUpload className="w-4 h-4" /> Upload
                    </button>
                 ) : (
                    <div className="flex gap-2">
                       <button className="flex-1 py-2 bg-zinc-50 dark:bg-black/20 text-zinc-400 rounded-lg text-xs font-medium border border-zinc-200 dark:border-white/5 hover:text-cyan-500 hover:border-cyan-500/30 transition-colors flex items-center justify-center gap-1">
                          <IconDownload className="w-3 h-3" /> View
                       </button>
                       {doc.status === 'Uploading...' && <span className="text-xs text-zinc-500 animate-pulse my-auto">Processing...</span>}
                    </div>
                 )}
              </div>
           ))}
        </div>
     </div>
  );

  const renderAssets = () => (
     <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Assigned Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {assets.map(asset => (
              <div key={asset.id} className="bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-6 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                 
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl flex items-center justify-center mb-4 text-zinc-500 dark:text-zinc-300 group-hover:text-cyan-500 transition-colors">
                       <asset.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-lg">{asset.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{asset.type} • {asset.serial}</p>
                    <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-between items-center">
                       <span className="text-xs text-zinc-400">Assigned {asset.assigned}</span>
                       <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                    </div>
                 </div>
              </div>
           ))}
        </div>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} data={profileData} onSave={(d) => { setProfileData(d); setIsEditModalOpen(false); }} />
      <div className="relative">
        <div className="h-48 w-full bg-gradient-to-r from-cyan-900 to-black relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
        <div className="px-8 pb-6">
          <div className="relative flex flex-col md:flex-row items-end -mt-12 mb-6 gap-6">
             <div className="relative">
               <img src={CURRENT_USER.avatarUrl} alt="Profile" className="w-32 h-32 rounded-2xl border-4 border-white dark:border-black shadow-2xl" />
               <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-black rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
             </div>
             <div className="flex-1 mb-2">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{CURRENT_USER.name}</h1>
                <p className="text-cyan-600 dark:text-cyan-400 font-medium font-mono text-sm">{CURRENT_USER.role} <span className="text-zinc-500">at</span> {CURRENT_USER.department}</p>
             </div>
             <div className="flex gap-3 mb-2">
                <button onClick={() => setIsEditModalOpen(true)} className="px-4 py-2 bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 text-zinc-800 dark:text-white rounded-lg border border-zinc-200 dark:border-white/10 font-medium text-sm transition-colors shadow-sm">Edit Profile</button>
             </div>
          </div>
          <div className="flex border-b border-zinc-200 dark:border-white/10 overflow-x-auto">
             {tabs.map(tab => (
               <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/20'}`}>{tab}</button>
             ))}
          </div>
        </div>
      </div>
      <div className="p-8 min-h-[500px]">
         {activeTab === 'Overview' && renderOverview()}
         {activeTab === 'Profile' && renderProfile()}
         {activeTab === 'Job' && renderJob()}
         {activeTab === 'Documents' && renderDocuments()}
         {activeTab === 'Assets' && renderAssets()}
      </div>
    </div>
  );
};

export default MeView;