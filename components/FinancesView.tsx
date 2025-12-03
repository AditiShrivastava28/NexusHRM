import React, { useState } from 'react';
import { SALARY_INFO, PAY_CYCLE_INFO, RECENT_PAYSLIPS, formatCurrency } from '../constants';
import { IconDownload, IconEye, IconWallet, IconFileText } from './Icons';

const InfoCard = ({ title, children, className = "" }: { title: string, children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/5 p-6 shadow-sm dark:shadow-lg hover:border-cyan-500/20 transition-all duration-300 ${className}`}>
    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4 font-mono">{title}</h3>
    {children}
  </div>
);

const FinancesView: React.FC = () => {
  const [showSalary, setShowSalary] = useState(false);
  const downloadFile = (fileName: string) => alert(`Downloading ${fileName}...`);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Finances</h1><p className="text-zinc-500 dark:text-zinc-400 mt-1">Encrypted Payroll Data</p></div>
        <div className="flex items-center gap-3"><span className="text-xs text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/30 px-3 py-1 rounded border border-cyan-500/20 font-mono">FY 2024-2025</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InfoCard title="Annual CTC" className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><IconWallet className="w-24 h-24 text-cyan-500" /></div>
          <div className="relative z-10">
            <div className="flex items-baseline gap-2"><span className="text-3xl font-bold text-zinc-800 dark:text-white font-mono tracking-tight">{formatCurrency(SALARY_INFO.annualCTC)}</span><span className="text-zinc-500 text-sm">/ year</span></div>
            <div className="mt-6"><button onClick={() => downloadFile('CTC_Breakup.pdf')} className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-sm font-medium hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"><IconDownload className="w-4 h-4" /><span className="underline decoration-cyan-400/30 hover:decoration-cyan-400">Download Breakdown</span></button></div>
          </div>
        </InfoCard>

        <InfoCard title="Monthly Salary" className="lg:col-span-2">
           <div className="flex flex-col md:flex-row gap-8">
             <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-white/5"><span className="text-zinc-700 dark:text-zinc-300 font-medium">Gross Earnings</span><div className="flex items-center gap-3"><button onClick={() => setShowSalary(!showSalary)} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white"><IconEye className="w-4 h-4" /></button><span className="text-xl font-bold text-emerald-500 dark:text-emerald-400 font-mono">{showSalary ? formatCurrency(SALARY_INFO.monthlyGross) : '••••••'}</span></div></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 dark:bg-black/30 p-3 rounded-lg border border-zinc-200 dark:border-white/5"><p className="text-[10px] text-zinc-500 uppercase">Basic</p><p className="text-zinc-800 dark:text-zinc-200 font-mono">{showSalary ? formatCurrency(SALARY_INFO.basic) : '•••'}</p></div>
                  <div className="bg-zinc-50 dark:bg-black/30 p-3 rounded-lg border border-zinc-200 dark:border-white/5"><p className="text-[10px] text-zinc-500 uppercase">HRA</p><p className="text-zinc-800 dark:text-zinc-200 font-mono">{showSalary ? formatCurrency(SALARY_INFO.hra) : '•••'}</p></div>
                </div>
             </div>
             <div className="w-px bg-zinc-200 dark:bg-white/5 hidden md:block"></div>
             <div className="flex-1 space-y-4">
               <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-white/5"><span className="text-zinc-700 dark:text-zinc-300 font-medium">Deductions</span><span className="text-xl font-bold text-red-500 dark:text-red-400 font-mono">{showSalary ? `- ${formatCurrency(SALARY_INFO.totalDeductions)}` : '••••••'}</span></div>
               <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-white/5 border-dashed"><div className="flex justify-between items-end"><span className="text-cyan-600 dark:text-cyan-400 font-semibold text-sm uppercase tracking-wide">Take Home</span><span className="text-3xl font-bold text-zinc-900 dark:text-white font-mono">{showSalary ? formatCurrency(SALARY_INFO.netPay) : '••••••'}</span></div></div>
             </div>
           </div>
        </InfoCard>
      </div>

      <InfoCard title="Payslip History">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-zinc-500 border-b border-zinc-200 dark:border-white/5 uppercase tracking-wider">
                <th className="py-3 font-medium pl-2">Month</th>
                <th className="py-3 font-medium">Year</th>
                <th className="py-3 font-medium">Net Pay</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium text-right pr-2">Download</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_PAYSLIPS.map((payslip) => (
                <tr key={payslip.id} className="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors border-b border-zinc-200 dark:border-white/5 last:border-0">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-400 border border-zinc-200 dark:border-white/5"><IconFileText className="w-4 h-4" /></div>
                      <span className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">{payslip.month}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-zinc-500 dark:text-zinc-400 font-mono">{payslip.year}</td>
                  <td className="py-4 text-sm text-zinc-800 dark:text-white font-mono">{formatCurrency(payslip.amount)}</td>
                  <td className="py-4">
                     <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-1 rounded uppercase tracking-wide font-bold">{payslip.status}</span>
                  </td>
                  <td className="py-4 text-right pr-2">
                    <button 
                      onClick={() => downloadFile(`Payslip_${payslip.month}_${payslip.year}.pdf`)} 
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-black/40 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg border border-zinc-200 dark:border-white/10 hover:border-cyan-500/30 transition-all text-xs font-medium"
                    >
                       <IconDownload className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfoCard>
    </div>
  );
};

export default FinancesView;