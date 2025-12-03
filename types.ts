export interface User {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  employeeId: string;
  department: string;
}

export interface SalaryDetails {
  annualCTC: number;
  monthlyGross: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  pfDeduction: number;
  taxDeduction: number;
  totalDeductions: number;
  netPay: number;
  currency: string;
}

export interface PayCycle {
  lastPaid: string;
  nextPayDate: string;
  daysToPay: number;
  nextIncrementDate: string;
  incrementCycle: string; // e.g., "April 2025"
}

export interface Payslip {
  id: string;
  month: string;
  year: number;
  amount: number;
  status: 'Paid' | 'Processing';
}

export enum NavItem {
  HOME = 'Home',
  ME = 'Me',
  INBOX = 'Inbox',
  TEAM = 'My Team',
  FINANCES = 'My Finances',
  ORG = 'Org',
  RESUME = 'Resume Builder',
  ADMIN = 'Admin Portal',
  SETTINGS = 'Settings'
}