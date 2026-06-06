// src/constants/navigation.js
import {
  LayoutDashboard, Users, FilePlus2, Eye,
  GitPullRequest, FileText, ShieldCheck, BarChart3, Settings
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    screen: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['all']
  },
  {
    screen: 'vendors',
    label: 'Vendor Directory',
    icon: Users,
    roles: ['all']
  },
  {
    screen: 'rfq-creation',
    label: 'Create RFQ',
    icon: FilePlus2,
    roles: ['Procurement Officer']
  },
  {
    screen: 'quotation-submission',
    label: 'Submit Bids',
    icon: GitPullRequest,
    roles: ['Vendor']
  },
  {
    screen: 'quotation-comparison',
    label: 'Compare Bids',
    icon: Eye,
    roles: ['Procurement Officer']
  },
  {
    screen: 'approvals',
    label: 'Review Approvals',
    icon: ShieldCheck,
    roles: ['Manager / Approver']
  },
  {
    screen: 'po-invoice',
    label: 'PO & Invoices',
    icon: FileText,
    roles: ['Procurement Officer', 'Vendor']
  },
  {
    screen: 'logs',
    label: 'System Audit Logs',
    icon: Settings,
    roles: ['Procurement Officer', 'Manager / Approver', 'Admin']
  },
  {
    screen: 'reports',
    label: 'Spend Analytics',
    icon: BarChart3,
    roles: ['Procurement Officer', 'Manager / Approver', 'Admin']
  }
];
