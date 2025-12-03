import { User, SalaryDetails, PayCycle, Payslip } from './types';

export const CURRENT_USER: User = {
  id: 'EMP-2024001',
  name: 'Alex Sterling',
  role: 'Senior Product Designer',
  avatarUrl: 'https://picsum.photos/200',
  employeeId: 'NEX-4421',
  department: 'Design & Experience'
};

export const SALARY_INFO: SalaryDetails = {
  annualCTC: 3200000,
  monthlyGross: 266666,
  basic: 133333,
  hra: 66666,
  specialAllowance: 66667,
  pfDeduction: 12000,
  taxDeduction: 24500,
  totalDeductions: 36500,
  netPay: 230166,
  currency: 'INR'
};

export const PAY_CYCLE_INFO: PayCycle = {
  lastPaid: '31 Oct, 2024',
  nextPayDate: '30 Nov, 2024',
  daysToPay: 12,
  nextIncrementDate: '01 Apr, 2025',
  incrementCycle: 'Annual'
};

export const RECENT_PAYSLIPS: Payslip[] = [
  { id: '1', month: 'October', year: 2024, amount: 230166, status: 'Paid' },
  { id: '2', month: 'September', year: 2024, amount: 230166, status: 'Paid' },
  { id: '3', month: 'August', year: 2024, amount: 228500, status: 'Paid' },
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const COMPANY_POLICIES = `
NexusHR Company Policies:
1. Working Hours: 9:00 AM to 6:00 PM (9 hours), Monday to Friday. Flexible timing allowed ±1 hour.
2. Attendance: Minimum 8 hours of work logged is required for a 'Present' status.
3. Work From Home (WFH): Employees are entitled to 2 days of WFH per week, subject to manager approval.
4. Leave Policy:
   - Sick Leave (SL): 10 days per year.
   - Casual Leave (CL): 12 days per year.
   - Privilege Leave (PL): 18 days per year (accrued monthly).
   - Maternity Leave: 26 weeks paid.
   - Paternity Leave: 2 weeks paid.
5. Salary Cycle: Salary is credited on the last working day of the month.
6. Tax Deductions: TDS is deducted as per the old/new regime chosen by the employee in April.
7. Expense Claims: Must be submitted by the 25th of each month. Approved claims are paid with salary.
8. Insurance: Group Medical Cover of ₹5 Lakhs for employee + spouse + 2 children.
9. Notice Period: 2 months for confirmed employees.
`;