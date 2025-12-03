import React, { useState, useRef, useEffect } from 'react';
import { 
  IconDownload, IconCloudUpload, IconSparkles, IconLayout, IconBulb, 
  IconImage, IconPlus, IconMinus, IconTrash, IconMagic, IconCode, IconTerminal, 
  IconFiles, IconSearch, IconSplit, IconCheckCircle, IconChevronLeft, IconChevronRight, IconPrinter,
  IconMaximize, IconMinimize, IconFileText
} from './Icons';
import { CURRENT_USER } from '../constants';
import { GoogleGenAI } from "@google/genai";

// --- Sub-components defined OUTSIDE to prevent focus loss on re-render ---

const SectionHeader = ({ title, icon: Icon }: any) => (
  <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-200 dark:border-white/10">
     <div className="p-1.5 bg-cyan-100 dark:bg-cyan-500/20 rounded text-cyan-600 dark:text-cyan-400">
       <Icon className="w-4 h-4" />
     </div>
     <h3 className="font-bold text-zinc-900 dark:text-white text-sm uppercase tracking-wide">{title}</h3>
  </div>
);

const FormField = ({ label, value, onChange, multiline = false, onEnhance, isEnhancing }: any) => (
  <div className="flex flex-col gap-1.5 mb-4 group">
     <div className="flex justify-between items-center">
       <label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase">{label}</label>
       {onEnhance && (
          <button 
            onClick={() => onEnhance()}
            disabled={isEnhancing}
            className="text-cyan-600 dark:text-cyan-400 text-[10px] flex items-center gap-1 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 px-2 py-0.5 rounded transition-colors"
          >
             {isEnhancing ? <span className="animate-pulse">Enhancing...</span> : <><IconSparkles className="w-3 h-3" /> Enhance</>}
          </button>
       )}
     </div>
     {multiline ? (
        <textarea 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl p-3 text-sm text-zinc-900 dark:text-white focus:border-cyan-500/50 outline-none resize-y min-h-[100px] transition-all"
        />
     ) : (
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-cyan-500/50 outline-none transition-all"
        />
     )}
  </div>
);

const ResumeBuilderView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  // Resume Options State
  const [showPhoto, setShowPhoto] = useState(false); 
  
  // Preview Zoom State
  const [zoom, setZoom] = useState(0.45); 
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Data State
  const [data, setData] = useState({
    name: CURRENT_USER.name,
    role: CURRENT_USER.role,
    email: 'alex.sterling@example.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/alexsterling',
    location: 'New York, USA',
    summary: 'An accomplished professional with a proven track record of designing, developing, and deploying robust applications. Proficient in modern frameworks, building scalable APIs, and generating insightful reports. A collaborative team player adept at problem-solving and delivering high-quality solutions within Agile environments.',
    skills: 'Programming & Frameworks: React, TypeScript, Node.js, Tailwind CSS\nTools & Platforms: Git, Figma, VS Code, Docker\nSoft Skills: Leadership, Communication, Agile Methodology',
    experience: [
      { id: 1, title: 'Senior Product Designer', company: 'NexusHR Tech', date: 'Jan 2022 - Present', desc: '• Leading design system architecture using Figma and React.\n• Developed and maintained component libraries for enterprise products.\n• Collaborated with cross-functional teams to design and deploy scalable UI services.' },
      { id: 2, title: 'Product Designer', company: 'Creative Solutions', date: 'Jun 2018 - Dec 2021', desc: '• Implemented features for the core mobile application, significantly improving user retention.\n• Worked on user dashboards utilizing analytics APIs to streamline data visualization.\n• Contributed to the design system for seamless integration across platforms.' }
    ],
    education: [
      { id: 1, degree: 'B.Des in Interaction Design', school: 'Parsons School of Design', year: '2014 - 2018' }
    ],
    customSections: [] as { id: string, title: string, content: string }[]
  });

  // AI State
  const [enhancingField, setEnhancingField] = useState<string | null>(null);

  // --- Handlers ---
  const handleInputChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleAiEnhance = async (fieldPath: string, currentText: string, context: string) => {
    if (!process.env.API_KEY) return;
    setEnhancingField(fieldPath);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
      Role: Expert Resume Editor.
      Task: Polish the following text for a professional resume.
      
      Strict Constraints:
      1. Output ONLY the rewritten text. No conversational filler.
      2. Do NOT add new facts, dates, or skills not present in the input.
      3. Keep the length roughly the same as the original (±10%). Do not expand significantly.
      4. Improve grammar, use strong action verbs, and make it punchy.
      
      Context: ${context}
      
      Input Text:
      "${currentText}"
      `;
      
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      if (response.text) {
         if (fieldPath === 'summary') handleInputChange('summary', response.text.trim());
         if (fieldPath.startsWith('exp_')) {
            const id = parseInt(fieldPath.split('_')[1]);
            const newExp = data.experience.map(e => e.id === id ? { ...e, desc: response.text!.trim() } : e);
            setData(prev => ({ ...prev, experience: newExp }));
         }
      }
    } catch (err) {
      console.error("AI Error", err);
    } finally {
      setEnhancingField(null);
    }
  };

  // Experience Handlers
  const handleExpChange = (id: number, field: string, value: string) => {
    const newExp = data.experience.map(e => e.id === id ? { ...e, [field]: value } : e);
    setData(prev => ({ ...prev, experience: newExp }));
  };
  const addExperience = () => {
    const newId = Math.max(...data.experience.map(e => e.id), 0) + 1;
    setData(prev => ({ ...prev, experience: [...prev.experience, { id: newId, title: 'Job Title', company: 'Company', date: 'Date', desc: '• Description of responsibilities...' }] }));
  };
  const removeExperience = (id: number) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  // Education Handlers
  const handleEduChange = (id: number, field: string, value: string) => {
    const newEdu = data.education.map(e => e.id === id ? { ...e, [field]: value } : e);
    setData(prev => ({ ...prev, education: newEdu }));
  };
  const addEducation = () => {
    const newId = Math.max(...data.education.map(e => e.id), 0) + 1;
    setData(prev => ({ ...prev, education: [...prev.education, { id: newId, degree: 'Degree', school: 'School', year: 'Year' }] }));
  };
  const removeEducation = (id: number) => {
    setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  // Custom Section Handlers
  const addCustomSection = () => {
    const newId = Date.now().toString();
    setData(prev => ({ ...prev, customSections: [...prev.customSections, { id: newId, title: 'New Section', content: 'Details here...' }] }));
  };
  const updateCustomSection = (id: string, field: 'title' | 'content', value: string) => {
     const newSec = data.customSections.map(s => s.id === id ? { ...s, [field]: value } : s);
     setData(prev => ({ ...prev, customSections: newSec }));
  };
  const removeCustomSection = (id: string) => {
    setData(prev => ({ ...prev, customSections: prev.customSections.filter(s => s.id !== id) }));
  };

  const handlePrint = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.print();
    }, 500);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.05, 1.2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.05, 0.3));
  const handleFit = () => setZoom(0.45);
  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  return (
    <div className="h-screen flex w-full overflow-hidden bg-zinc-50 dark:bg-black">
      
      {/* --- Left Panel: Editor (Exact 50%) --- */}
      <div className={`flex flex-col border-r border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 ${isFullScreen ? 'hidden' : 'w-1/2'}`} id="no-print-form">
         
         {/* Header */}
         <div className="h-16 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-6 bg-white/50 dark:bg-black/20 backdrop-blur-sm shrink-0">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2"><IconFileText className="w-5 h-5 text-cyan-600" /> Resume Builder</h2>
            <div className="flex items-center gap-2">
               <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold shadow-lg hover:opacity-90 transition-opacity">
                  <IconPrinter className="w-4 h-4" /> Print / PDF
               </button>
            </div>
         </div>

         {/* Scrollable Form Area */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            
            {/* Template Settings */}
            <div className="mb-8 p-5 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-zinc-200 dark:border-white/5">
               <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Configuration</h3>
                  <label className="flex items-center gap-3 cursor-pointer select-none group">
                     <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Show Profile Photo</span>
                     <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ${showPhoto ? 'bg-cyan-600' : 'bg-zinc-300 dark:bg-zinc-700'}`} onClick={() => setShowPhoto(!showPhoto)}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${showPhoto ? 'translate-x-5' : 'translate-x-0'}`}></div>
                     </div>
                  </label>
               </div>
            </div>

            {/* Profile Section */}
            <div className="mb-8">
               <SectionHeader title="Profile & Contact" icon={IconLayout} />
               <div className="grid grid-cols-2 gap-4">
                  <FormField label="Full Name" value={data.name} onChange={(v: string) => handleInputChange('name', v)} />
                  <FormField label="Current Role" value={data.role} onChange={(v: string) => handleInputChange('role', v)} />
                  <FormField label="Email" value={data.email} onChange={(v: string) => handleInputChange('email', v)} />
                  <FormField label="Phone" value={data.phone} onChange={(v: string) => handleInputChange('phone', v)} />
                  <div className="col-span-2">
                     <FormField label="LinkedIn / Portfolio" value={data.linkedin} onChange={(v: string) => handleInputChange('linkedin', v)} />
                     <FormField label="Location" value={data.location} onChange={(v: string) => handleInputChange('location', v)} />
                  </div>
               </div>
               <FormField 
                  label="Professional Summary" 
                  value={data.summary} 
                  onChange={(v: string) => handleInputChange('summary', v)} 
                  multiline 
                  onEnhance={() => handleAiEnhance('summary', data.summary, 'Professional Resume Summary')}
                  isEnhancing={enhancingField === 'summary'}
               />
            </div>

            {/* Skills */}
            <div className="mb-8">
               <SectionHeader title="Skills" icon={IconBulb} />
               <FormField label="Skills & Certifications" value={data.skills} onChange={(v: string) => handleInputChange('skills', v)} multiline />
            </div>

            {/* Experience */}
            <div className="mb-8">
               <div className="flex justify-between items-center mb-6 pb-2 border-b border-zinc-200 dark:border-white/10">
                  <SectionHeader title="Work Experience" icon={IconFiles} />
                  <button onClick={addExperience} className="text-cyan-600 dark:text-cyan-400 text-xs font-bold flex items-center gap-1 hover:underline">
                     <IconPlus className="w-3 h-3" /> Add Job
                  </button>
               </div>
               <div className="space-y-6">
                  {data.experience.map((exp) => (
                     <div key={exp.id} className="p-4 bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-200 dark:border-white/5 relative group">
                        <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-colors"><IconTrash className="w-4 h-4" /></button>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                           <FormField label="Job Title" value={exp.title} onChange={(v: string) => handleExpChange(exp.id, 'title', v)} />
                           <FormField label="Company" value={exp.company} onChange={(v: string) => handleExpChange(exp.id, 'company', v)} />
                        </div>
                        <div className="mb-3">
                           <FormField label="Duration" value={exp.date} onChange={(v: string) => handleExpChange(exp.id, 'date', v)} />
                        </div>
                        <FormField 
                           label="Description (Bullet Points)" 
                           value={exp.desc} 
                           onChange={(v: string) => handleExpChange(exp.id, 'desc', v)} 
                           multiline 
                           onEnhance={() => handleAiEnhance(`exp_${exp.id}`, exp.desc, `Resume Job Description for ${exp.title} at ${exp.company}`)}
                           isEnhancing={enhancingField === `exp_${exp.id}`}
                        />
                     </div>
                  ))}
               </div>
            </div>

            {/* Education */}
            <div className="mb-8">
               <div className="flex justify-between items-center mb-6 pb-2 border-b border-zinc-200 dark:border-white/10">
                   <SectionHeader title="Education" icon={IconBulb} />
                   <button onClick={addEducation} className="text-cyan-600 dark:text-cyan-400 text-xs font-bold flex items-center gap-1 hover:underline">
                     <IconPlus className="w-3 h-3" /> Add Education
                   </button>
               </div>
               <div className="space-y-4">
                  {data.education.map((edu) => (
                     <div key={edu.id} className="p-4 bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-200 dark:border-white/5 relative">
                        <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-colors"><IconTrash className="w-4 h-4" /></button>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                           <FormField label="Degree" value={edu.degree} onChange={(v: string) => handleEduChange(edu.id, 'degree', v)} />
                           <FormField label="School" value={edu.school} onChange={(v: string) => handleEduChange(edu.id, 'school', v)} />
                        </div>
                        <FormField label="Year / Grade" value={edu.year} onChange={(v: string) => handleEduChange(edu.id, 'year', v)} />
                     </div>
                  ))}
               </div>
            </div>

            {/* Custom Sections */}
            <div className="mb-8">
               <div className="flex justify-between items-center mb-6 pb-2 border-b border-zinc-200 dark:border-white/10">
                   <SectionHeader title="Custom Sections" icon={IconSplit} />
                   <button onClick={addCustomSection} className="text-cyan-600 dark:text-cyan-400 text-xs font-bold flex items-center gap-1 hover:underline">
                     <IconPlus className="w-3 h-3" /> Add Section
                   </button>
               </div>
               {data.customSections.map((sec) => (
                  <div key={sec.id} className="p-4 bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-200 dark:border-white/5 relative mb-4">
                     <button onClick={() => removeCustomSection(sec.id)} className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-colors"><IconTrash className="w-4 h-4" /></button>
                     <div className="mb-3">
                        <FormField label="Section Title" value={sec.title} onChange={(v: string) => updateCustomSection(sec.id, 'title', v)} />
                     </div>
                     <FormField label="Content" value={sec.content} onChange={(v: string) => updateCustomSection(sec.id, 'content', v)} multiline />
                  </div>
               ))}
            </div>

         </div>
      </div>

      {/* --- Right Panel: Live Preview (Exact 50%) --- */}
      <div className={`
         ${isFullScreen ? 'fixed inset-0 z-50 h-screen w-screen' : 'w-1/2 relative h-full'}
         bg-zinc-100 dark:bg-zinc-950 p-4 overflow-hidden flex flex-col transition-all duration-300 border-l border-zinc-200 dark:border-white/5
      `}>
         
         {/* Controls Toolbar */}
         <div className="absolute top-6 right-8 z-50 flex items-center gap-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md p-1.5 rounded-lg shadow-lg border border-zinc-200 dark:border-white/10" id="no-print-form">
            
            <button 
              onClick={handleFit} 
              className="px-3 py-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded text-xs font-bold text-zinc-600 dark:text-zinc-300 transition-colors"
              title="Fit A4 to Screen"
            >
               Fit
            </button>
            <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 mx-1"></div>
            
            <button onClick={handleZoomOut} className="p-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded text-zinc-600 dark:text-zinc-300"><IconMinus className="w-4 h-4" /></button>
            <span className="text-xs font-mono w-10 text-center my-auto text-zinc-500 dark:text-zinc-400">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded text-zinc-600 dark:text-zinc-300"><IconPlus className="w-4 h-4" /></button>
            
            <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 mx-1"></div>
            
            <button 
              onClick={toggleFullScreen} 
              className="p-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded text-zinc-600 dark:text-zinc-300 transition-colors"
              title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
               {isFullScreen ? <IconMinimize className="w-4 h-4" /> : <IconMaximize className="w-4 h-4" />}
            </button>
         </div>

         {/* Preview Area */}
         <div className={`flex-1 overflow-auto custom-scrollbar flex justify-center p-8 bg-zinc-200/50 dark:bg-black/40 backdrop-blur-sm ${isFullScreen ? 'items-center' : 'items-start pt-12'}`}>
            <div 
               id="resume-preview" 
               className="bg-white text-black shadow-2xl transition-transform duration-200 ease-out origin-top print:shadow-none print:transform-none print:m-0 print:w-full print:h-auto print:origin-top-left"
               style={{ 
                 width: '210mm', 
                 minHeight: '297mm',
                 transform: `scale(${zoom})`,
                 transformOrigin: 'top center',
                 marginBottom: 'auto'
               }}
            >
               <ResumeContent data={data} showPhoto={showPhoto} />
            </div>
         </div>
      </div>

    </div>
  );
};

// --- Left Aligned Professional Style with Divider ---
const ResumeContent = ({ data, showPhoto }: any) => {
  return (
      <div className="min-h-[297mm] p-[15mm] bg-white text-black font-sans leading-relaxed">
         
         {/* Header Section */}
         <div className="flex justify-between items-start">
             <div className="w-full text-left">
                <h1 className="text-3xl font-bold text-black uppercase mb-2 tracking-tight">{data.name}</h1>
                <div className="text-sm text-gray-800 font-medium mb-1 flex flex-wrap gap-x-2 gap-y-1 items-center">
                   <span>{data.role}</span>
                   <span className="text-gray-400">|</span>
                   <span>{data.email}</span>
                   <span className="text-gray-400">|</span>
                   <span>{data.phone}</span>
                </div>
                <div className="text-sm text-gray-800 font-medium flex flex-wrap gap-x-2 gap-y-1 items-center">
                   <span>{data.linkedin}</span>
                   <span className="text-gray-400">|</span>
                   <span>{data.location}</span>
                </div>
             </div>
             
             {showPhoto && (
                 <div className="ml-6 shrink-0">
                    <img src={CURRENT_USER.avatarUrl} alt="Profile" className="w-24 h-24 object-cover border border-gray-200 rounded-sm" />
                 </div>
             )}
         </div>

         {/* Divider Line */}
         <div className="w-full border-b border-gray-300 my-5"></div>

         {/* Professional Summary */}
         {data.summary && (
            <div className="mb-6 text-left">
               <p className="text-sm text-black leading-normal">{data.summary}</p>
            </div>
         )}

         {/* Work Experience */}
         <div className="mb-6 text-left">
            <h3 className="text-base font-bold text-black mb-3 uppercase tracking-wide">Work Experience</h3>
            <div className="space-y-4">
               {data.experience.map((exp: any) => (
                  <div key={exp.id}>
                     <div className="text-sm text-black mb-1">
                        <span className="font-bold">{exp.company}</span>
                        <span className="mx-1.5 text-gray-400">|</span>
                        <span className="font-bold">{exp.title}</span>
                        <span className="mx-1.5 text-gray-400">|</span>
                        <span className="font-semibold text-gray-700">{exp.date}</span>
                     </div>
                     <div className="text-sm text-black leading-snug pl-1 whitespace-pre-wrap">
                        {exp.desc}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Skills & Certifications */}
         <div className="mb-6 text-left">
            <h3 className="text-base font-bold text-black mb-3 uppercase tracking-wide">Skills & Certifications</h3>
            <div className="text-sm text-black leading-relaxed whitespace-pre-wrap">
              {data.skills}
            </div>
         </div>

         {/* Education */}
         <div className="mb-6 text-left">
            <h3 className="text-base font-bold text-black mb-3 uppercase tracking-wide">Education</h3>
            <div className="space-y-2">
               {data.education.map((edu: any) => (
                  <div key={edu.id} className="text-sm text-black">
                      <span className="font-bold">{edu.school}</span>
                      <span className="mx-1.5 text-gray-400">|</span>
                      <span>{edu.degree}</span>
                      <span className="mx-1.5 text-gray-400">|</span>
                      <span className="text-gray-700">{edu.year}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Custom Sections */}
         {data.customSections.map((sec: any) => (
             <div key={sec.id} className="mb-6 text-left">
               <h3 className="text-base font-bold text-black mb-3 uppercase tracking-wide">{sec.title}</h3>
               <p className="text-sm text-black leading-normal whitespace-pre-wrap">{sec.content}</p>
            </div>
         ))}
         
      </div>
  );
};

export default ResumeBuilderView;