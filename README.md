<div align="center">

<img src="https://img.shields.io/badge/VendorBridge-ERP-6366f1?style=for-the-badge&logo=react&logoColor=white" alt="VendorBridge ERP" />

# 🏢 VendorBridge ERP
### *Enterprise Procurement & Vendor Management Platform*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Lucide](https://img.shields.io/badge/Lucide-Icons-F56565?style=flat-square&logo=lucide&logoColor=white)](https://lucide.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **A full-stack-like, single-page Enterprise Resource Planning (ERP) web application** that digitizes and automates end-to-end procurement workflows — from vendor onboarding to Purchase Order generation and invoice issuance.

---

[✨ Features](#-features) • [🚀 Getting Started](#-getting-started) • [🎭 Demo Credentials](#-demo-credentials) • [🗂️ Project Structure](#️-project-structure) • [📸 Screens](#-application-screens) • [🔄 Workflow](#-procurement-workflow)

</div>

---

## 🏆 Hackathon Submission

This project was built as a solution to the **VendorBridge Hackathon Problem Statement** — a challenge to design and develop a centralized, role-based ERP system that streamlines the complete procurement cycle between an enterprise and its vendor ecosystem.

> 📄 See the full problem statement: [`Vendorbridge Hackathon Problem Statement.pdf`](./Vendorbridge%20Hackathon%20Problem%20Statement%20(1).pdf)

---

## ✨ Features

### 🔐 Authentication & Role Management
- **Multi-role Login System** — Procurement Officer, Manager/Approver, Vendor, and Admin
- **Signup Flow** — New vendors can self-register with full company profile (GST, phone, address, category)
- **Forgot Password** — Security token dispatch simulation
- **Role Switcher** — Evaluator-friendly quick-switch between roles without re-logging in

### 📊 Smart Dashboard
- Real-time KPI cards: Active RFQs, Total Vendors, Pending Approvals, Monthly Spend
- Role-aware content display (each role sees relevant data)
- Recent activity feed and procurement status summaries

### 🏭 Vendor Management
- Vendor registration with full corporate profiles
- Status workflow: `Pending Verification → Active → Suspended`
- Vendor performance tracking: ratings, orders completed, success rate, on-time delivery

### 📋 RFQ (Request For Quotation) Creation
- Dynamic item/line-item builder with quantities and specifications
- Vendor assignment from the verified vendor pool
- Deadline management and RFQ broadcasting

### 💼 Quotation Submission (Vendor Portal)
- Vendors see and respond to their assigned RFQs
- Itemized quote submission with unit price and remarks
- Edit/update submitted quotes before deadline

### 🔍 Quotation Comparison
- Side-by-side comparison of all received vendor bids
- Auto-highlight of lowest bids per line item
- One-click "Send for Approval" to the Manager

### ✅ Approval Workflow
- Manager-level sign-off on shortlisted bids
- Approve with remarks or Reject and send back to comparison
- Full audit trail of approval decisions

### 📦 PO & Invoice Generation
- Auto-generate numbered Purchase Orders (`PO-2026-XXXX`)
- GST Tax Invoice generation (`INV-2026-XXXX`) after PO confirmation
- Printable PO/Invoice layouts

### 📝 Activity Logs
- Immutable, timestamped audit log of every system action
- Filterable by user, role, and action type

### 📈 Reports & Analytics
- Spend analysis charts and vendor performance dashboards
- Category-wise procurement breakdowns
- Historical procurement trend data

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** `v18+`
- **npm** `v9+`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mitulaghara/Vendorbridge-Hackathon-Problem-Statement.git

# 2. Navigate into the project directory
cd Vendorbridge-Hackathon-Problem-Statement

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at **`http://localhost:5173`**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎭 Demo Credentials

The application ships with pre-seeded mock data for easy evaluation. Use the following credentials on the login screen:

| Role | Email | Password |
|------|-------|----------|
| 🧑‍💼 **Procurement Officer** | `officer@vendorbridge.com` | `officer123` |
| 👔 **Manager / Approver** | `manager@vendorbridge.com` | `manager123` |
| 🏭 **Vendor** | `vendor1@vendorbridge.com` | `vendor123` |

> 💡 **Tip:** Use the **Role Switcher** dropdown in the top navigation bar to instantly switch between roles and explore the full procurement lifecycle without logging out.

---

## 🗂️ Project Structure

```
vendorbridge-erp/
├── 📄 index.html                     # App entry point & SEO meta tags
├── 📄 package.json                   # Dependencies & npm scripts
├── 📄 vite.config.js                 # Vite bundler configuration
├── 📄 eslint.config.js               # ESLint rules
│
└── src/
    ├── 📄 main.jsx                   # React DOM render root
    ├── 📄 App.jsx                    # Root component, state management & routing
    ├── 📄 App.css                    # Component-level styles
    ├── 📄 index.css                  # Global design tokens & utility classes
    │
    ├── components/
    │   ├── 📄 Dashboard.jsx          # KPI overview & activity summary
    │   ├── 📄 VendorManagement.jsx   # Vendor registry & status management
    │   ├── 📄 RFQCreation.jsx        # RFQ builder & vendor assignment
    │   ├── 📄 QuotationSubmission.jsx # Vendor bid submission portal
    │   ├── 📄 QuotationComparison.jsx # Multi-vendor bid comparison table
    │   ├── 📄 ApprovalWorkflow.jsx   # Manager approval/rejection interface
    │   ├── 📄 POInvoiceScreen.jsx    # Purchase Order & Invoice generation
    │   ├── 📄 ActivityLogs.jsx       # Immutable audit trail viewer
    │   └── 📄 ReportsAnalytics.jsx   # Spend analytics & vendor metrics
    │
    └── utils/
        └── 📄 mockData.js            # In-memory database with localStorage sync
```

---

## 📸 Application Screens

| Screen | Description |
|--------|-------------|
| **Login / Signup** | Secure role-based authentication with sandbox credentials |
| **Dashboard** | Role-aware KPI cards, RFQ status overview, recent activity |
| **Vendor Management** | Vendor directory with verification workflow |
| **RFQ Creation** | Dynamic multi-item RFQ builder with vendor assignment |
| **Quotation Submission** | Vendor portal for bid submission & updates |
| **Quotation Comparison** | Side-by-side bid analysis with lowest-bid highlighting |
| **Approval Workflow** | Manager sign-off interface with remarks & rejection |
| **PO & Invoice** | Auto-numbered PO and GST invoice generation |
| **Activity Logs** | Full system audit trail with filtering |
| **Reports & Analytics** | Procurement analytics and vendor performance metrics |

---

## 🔄 Procurement Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    VENDORBRIDGE PROCUREMENT FLOW                      │
└─────────────────────────────────────────────────────────────────────┘

  [1] Vendor Registers / Admin Verifies Vendor Profile
           │
           ▼
  [2] Procurement Officer Creates RFQ
      └─ Assigns verified vendors, sets deadline & specifications
           │
           ▼
  [3] Vendors Submit Quotations
      └─ Each vendor submits itemized bid through their portal
           │
           ▼
  [4] Officer Compares Quotations
      └─ Side-by-side analysis, selects best bid
           │
           ▼
  [5] Officer Sends for Manager Approval
           │
           ▼
  [6] Manager Approves / Rejects
      ├─ Rejected → Back to Step [4]
      └─ Approved ↓
           │
           ▼
  [7] Officer Generates Purchase Order (PO)
           │
           ▼
  [8] Officer Generates GST Tax Invoice
           │
           ▼
  [9] Activity Logged → Reports Updated ✅
```

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI framework with hooks-based state management | 19.x |
| **Vite** | Ultra-fast build tool & dev server | 8.x |
| **Lucide React** | Modern SVG icon library | 1.x |
| **Vanilla CSS** | Custom design system with CSS variables | — |
| **LocalStorage** | Client-side data persistence for mock DB | — |

---

## 🏗️ Architecture Highlights

- **Single-Page Application (SPA)** with client-side routing via state
- **In-memory Mock Database** (`mockData.js`) synced to `localStorage` for session persistence
- **Role-based Access Control (RBAC)** — UI conditionally renders based on `currentUser.role`
- **Prop-drilling Architecture** — centralized state in `App.jsx`, passed down to feature components
- **Event-driven State Updates** — all CRUD operations propagate through handler functions
- **No Backend Required** — fully self-contained, runs entirely in the browser

---

## 📋 Future Enhancements

- [ ] 🔗 REST API integration with Node.js / Express backend
- [ ] 🗄️ PostgreSQL / MongoDB database for persistent storage
- [ ] 📧 Email notification system for approval workflows
- [ ] 📱 Mobile-responsive design improvements
- [ ] 🧪 Unit & integration test suite (Jest + React Testing Library)
- [ ] 🔒 JWT-based authentication with refresh tokens
- [ ] 📊 Advanced analytics with Chart.js or Recharts

---

## 👩‍💻 Author

**Mitul Aghara**

Built with ❤️ for the **VendorBridge Hackathon**

---

<div align="center">

**⭐ If you find this project useful, please give it a star! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/mitulaghara/Vendorbridge-Hackathon-Problem-Statement?style=social)](https://github.com/mitulaghara/Vendorbridge-Hackathon-Problem-Statement)

</div>
