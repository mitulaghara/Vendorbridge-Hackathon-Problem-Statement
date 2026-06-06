// src/App.jsx
import React, { useState, useEffect } from 'react';
import { db } from './utils/mockData';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import AuthScreen from './components/auth/AuthScreen';

// Screen Components
import Dashboard from './components/screens/Dashboard';
import VendorManagement from './components/screens/VendorManagement';
import RFQCreation from './components/screens/RFQCreation';
import QuotationSubmission from './components/screens/QuotationSubmission';
import QuotationComparison from './components/screens/QuotationComparison';
import ApprovalWorkflow from './components/screens/ApprovalWorkflow';
import POInvoiceScreen from './components/screens/POInvoiceScreen';
import ActivityLogs from './components/screens/ActivityLogs';
import ReportsAnalytics from './components/screens/ReportsAnalytics';

// Custom Hooks
import { useNotifications } from './hooks/useNotifications';

export default function App() {
  // ── Database State ──────────────────────────────────────────────
  const [users, setUsers] = useState(db.getUsers());
  const [vendors, setVendors] = useState(db.getVendors());
  const [rfqs, setRFQs] = useState(db.getRFQs());
  const [quotes, setQuotes] = useState(db.getQuotations());
  const [logs, setLogs] = useState(db.getLogs());

  // ── App / Auth State ────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(true); // true for easy evaluation
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [activeScreen, setActiveScreen] = useState('dashboard');

  const [authFlow, setAuthFlow] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupForm, setSignupForm] = useState({
    name: '', email: '', password: '', role: 'Vendor',
    company: '', category: 'IT & Hardware', gst: '', phone: '', address: ''
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [authError, setAuthError] = useState('');

  // ── Notifications ───────────────────────────────────────────────
  const {
    notifications, showNotifications,
    addNotification, markAllRead, togglePanel
  } = useNotifications();

  // ── localStorage Sync ───────────────────────────────────────────
  useEffect(() => { db.setUsers(users); }, [users]);
  useEffect(() => { db.setVendors(vendors); }, [vendors]);
  useEffect(() => { db.setRFQs(rfqs); }, [rfqs]);
  useEffect(() => { db.setQuotations(quotes); }, [quotes]);
  useEffect(() => { db.setLogs(logs); }, [logs]);

  // ── Log Helper ──────────────────────────────────────────────────
  const handleAddLog = (action, details) => {
    const updated = db.addLog(currentUser.name, currentUser.role, action, details);
    setLogs(updated);
  };

  // ── Vendor Handlers ─────────────────────────────────────────────
  const handleAddVendor = (newVendor) => {
    setVendors(prev => [...prev, newVendor]);
    const newVendorUser = {
      email: newVendor.email, password: 'vendor123',
      name: newVendor.name, role: 'Vendor',
      company: newVendor.name, category: newVendor.category,
      gst: newVendor.gst, phone: newVendor.phone,
      address: newVendor.address, avatar: '🏭'
    };
    setUsers(prev => [...prev, newVendorUser]);
    handleAddLog('Vendor Registered', `Added vendor '${newVendor.name}' in '${newVendor.category}'`);
    alert(`Vendor registered!\nLogin — Email: ${newVendor.email} / Password: vendor123`);
  };

  const handleUpdateVendorStatus = (vendorId, status) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status } : v));
    const v = vendors.find(v => v.id === vendorId);
    handleAddLog('Vendor Status Changed', `Updated '${v?.name}' status to '${status}'`);
  };

  // ── RFQ Handlers ─────────────────────────────────────────────────
  const handleCreateRFQ = (newRFQ) => {
    setRFQs(prev => [newRFQ, ...prev]);
    handleAddLog('RFQ Created', `Created RFQ '${newRFQ.id}' — '${newRFQ.title}'`);
    addNotification(`New RFQ ${newRFQ.id} '${newRFQ.title}' assigned to you.`);
    setActiveScreen('dashboard');
    alert(`RFQ '${newRFQ.id}' created and broadcasted to assigned vendors!`);
  };

  // ── Quotation Handlers ───────────────────────────────────────────
  const handleSubmitQuotation = (newQuote) => {
    const existsIdx = quotes.findIndex(q => q.id === newQuote.id);
    if (existsIdx > -1) {
      setQuotes(prev => prev.map((q, i) => i === existsIdx ? newQuote : q));
      handleAddLog('Quotation Updated', `'${newQuote.vendorName}' updated quote for RFQ '${newQuote.rfqId}'`);
      alert('Your quotation has been updated successfully!');
    } else {
      setQuotes(prev => [newQuote, ...prev]);
      setRFQs(prev => prev.map(r => r.id === newQuote.rfqId ? { ...r, status: 'Quotations Received' } : r));
      handleAddLog('Quotation Submitted', `'${newQuote.vendorName}' submitted quote for RFQ '${newQuote.rfqId}'`);
      alert('Your quotation has been submitted successfully!');
    }
    setActiveScreen('dashboard');
  };

  const handleSubmitForApproval = (rfqId, quoteId) => {
    setRFQs(prev => prev.map(r => r.id === rfqId ? { ...r, status: 'Pending Approval', approvedQuoteId: quoteId } : r));
    const rfqObj = rfqs.find(r => r.id === rfqId);
    const quoteObj = quotes.find(q => q.id === quoteId);
    handleAddLog('Sent for Approval', `Quote from '${quoteObj?.vendorName}' for '${rfqObj?.title}' sent for sign-off`);
    addNotification(`RFQ ${rfqId} is awaiting your sign-off approval.`);
    setActiveScreen('dashboard');
  };

  // ── Approval Handlers ────────────────────────────────────────────
  const handleApproveRFQ = (rfqId, remarks) => {
    setRFQs(prev => prev.map(r =>
      r.id === rfqId ? { ...r, status: 'Approved', approvedBy: currentUser.name, approvalRemarks: remarks } : r
    ));
    const rfqObj = rfqs.find(r => r.id === rfqId);
    handleAddLog('Quotation Approved', `Approved quote for RFQ '${rfqObj?.title}'. Remarks: ${remarks}`);
    addNotification(`RFQ ${rfqId} approved. Ready to generate Purchase Order.`);
    setActiveScreen('dashboard');
    alert('Procurement request approved and signed off successfully!');
  };

  const handleRejectRFQ = (rfqId, remarks) => {
    setRFQs(prev => prev.map(r =>
      r.id === rfqId ? { ...r, status: 'Quotations Received', approvedQuoteId: null, approvalRemarks: remarks } : r
    ));
    const rfqObj = rfqs.find(r => r.id === rfqId);
    handleAddLog('Quotation Rejected', `Rejected quote for RFQ '${rfqObj?.title}'. Remarks: ${remarks}`);
    addNotification(`RFQ ${rfqId} bid was rejected by manager.`);
    setActiveScreen('dashboard');
    alert('Bid rejected. RFQ sent back to the Comparison Screen.');
  };

  // ── PO & Invoice Handlers ────────────────────────────────────────
  const handleGeneratePO = (rfqId) => {
    const poNumber = `PO-2026-000${Math.floor(Math.random() * 90) + 10}`;
    setRFQs(prev => prev.map(r => r.id === rfqId ? { ...r, status: 'PO Generated', poNumber } : r));
    const rfqObj = rfqs.find(r => r.id === rfqId);
    handleAddLog('PO Generated', `Generated Purchase Order ${poNumber} for RFQ '${rfqObj?.title}'`);
    alert(`Purchase Order ${poNumber} generated successfully!`);
  };

  const handleGenerateInvoice = (rfqId) => {
    const invoiceNumber = `INV-2026-000${Math.floor(Math.random() * 90) + 10}`;
    setRFQs(prev => prev.map(r => r.id === rfqId ? { ...r, status: 'Invoiced', invoiceNumber } : r));
    const rfqObj = rfqs.find(r => r.id === rfqId);
    const approvedQ = quotes.find(q => q.id === rfqObj?.approvedQuoteId);
    if (approvedQ) {
      setVendors(prev => prev.map(v =>
        v.id === approvedQ.vendorId ? { ...v, ordersCompleted: v.ordersCompleted + 1 } : v
      ));
    }
    handleAddLog('Invoice Generated', `Generated GST Tax Invoice ${invoiceNumber} for RFQ '${rfqObj?.title}'`);
    alert(`Tax Invoice ${invoiceNumber} generated successfully!`);
  };

  // ── Auth Handlers ────────────────────────────────────────────────
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    const found = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (!found) { setAuthError('User email address not found in system directory.'); return; }
    if (found.password !== loginPassword) { setAuthError('Invalid secure password credential.'); return; }
    setCurrentUser(found);
    setIsLoggedIn(true);
    setActiveScreen('dashboard');
    handleAddLog('Login Successful', 'User logged into ERP terminal');
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      setAuthError('Please fill out all mandatory fields.'); return;
    }
    if (users.some(u => u.email.toLowerCase() === signupForm.email.toLowerCase())) {
      setAuthError('Email already registered under an existing user.'); return;
    }
    let newUser = {
      name: signupForm.name, email: signupForm.email,
      password: signupForm.password, role: signupForm.role,
      avatar: signupForm.role === 'Vendor' ? '🏭' : signupForm.role === 'Admin' ? '⚙️' : '💼'
    };
    if (signupForm.role === 'Vendor') {
      if (!signupForm.company || !signupForm.gst || !signupForm.phone || !signupForm.address) {
        setAuthError('Vendor details (Company, GST, Phone, Address) are required.'); return;
      }
      setVendors(prev => [...prev, {
        id: `v-${Date.now()}`, name: signupForm.company,
        email: signupForm.email, category: signupForm.category,
        gst: signupForm.gst, phone: signupForm.phone,
        address: signupForm.address, rating: 5.0,
        status: 'Pending Verification', ordersCompleted: 0,
        successRate: 0, onTimeDelivery: 0
      }]);
      newUser = { ...newUser, company: signupForm.company, category: signupForm.category, gst: signupForm.gst, phone: signupForm.phone, address: signupForm.address };
    }
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setActiveScreen('dashboard');
    handleAddLog('User Signup', `Registered '${newUser.role}' — '${newUser.name}'`);
    if (newUser.role === 'Vendor') {
      alert("Account created! Your vendor profile is 'Pending Verification'. An admin will verify it shortly.");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    alert(`Reset Instructions Sent!\nA security token was dispatched to ${forgotEmail}.`);
    setAuthFlow('login');
  };

  const handleRoleChange = (e) => {
    const found = users.find(u => u.email === e.target.value);
    if (found) {
      setCurrentUser(found);
      setActiveScreen('dashboard');
      handleAddLog('Role Switch', `Switched to '${found.role}' — '${found.name}'`);
    }
  };

  const handleResetDB = () => {
    if (!window.confirm('Reset all mock databases to default values?')) return;
    const reset = db.resetAll();
    setUsers(reset.users);
    setVendors(reset.vendors);
    setRFQs(reset.rfqs);
    setQuotes(reset.quotations);
    setLogs(reset.logs);
    setCurrentUser(reset.users[0]);
    setActiveScreen('dashboard');
    alert('Database reset successfully!');
  };

  const handleLogout = () => {
    handleAddLog('Logout Successful', 'User logged out of ERP terminal');
    setIsLoggedIn(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  // ── Screen Router ────────────────────────────────────────────────
  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} rfqs={rfqs} vendors={vendors} quotes={quotes} logs={logs} onNavigate={setActiveScreen} />;
      case 'vendors':
        return <VendorManagement currentUser={currentUser} vendors={vendors} onAddVendor={handleAddVendor} onUpdateVendorStatus={handleUpdateVendorStatus} />;
      case 'rfq-creation':
        return <RFQCreation currentUser={currentUser} vendors={vendors} onCreateRFQ={handleCreateRFQ} />;
      case 'quotation-submission':
        return <QuotationSubmission currentUser={currentUser} rfqs={rfqs} quotes={quotes} onSubmitQuotation={handleSubmitQuotation} />;
      case 'quotation-comparison':
        return <QuotationComparison currentUser={currentUser} rfqs={rfqs} quotes={quotes} onSubmitForApproval={handleSubmitForApproval} />;
      case 'approvals':
        return <ApprovalWorkflow currentUser={currentUser} rfqs={rfqs} quotes={quotes} onApprove={handleApproveRFQ} onReject={handleRejectRFQ} />;
      case 'po-invoice':
        return <POInvoiceScreen currentUser={currentUser} rfqs={rfqs} quotes={quotes} onGeneratePO={handleGeneratePO} onGenerateInvoice={handleGenerateInvoice} />;
      case 'logs':
        return <ActivityLogs logs={logs} />;
      case 'reports':
        return <ReportsAnalytics rfqs={rfqs} vendors={vendors} quotes={quotes} />;
      default:
        return <div>Screen not found.</div>;
    }
  };

  // ── Auth Screen ──────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <AuthScreen
        authFlow={authFlow} setAuthFlow={setAuthFlow}
        loginEmail={loginEmail} setLoginEmail={setLoginEmail}
        loginPassword={loginPassword} setLoginPassword={setLoginPassword}
        signupForm={signupForm} setSignupForm={setSignupForm}
        forgotEmail={forgotEmail} setForgotEmail={setForgotEmail}
        authError={authError} setAuthError={setAuthError}
        onLogin={handleLoginSubmit}
        onSignup={handleSignupSubmit}
        onForgot={handleForgotPassword}
      />
    );
  }

  // ── Main ERP Layout ──────────────────────────────────────────────
  return (
    <div className="app-container">
      <Sidebar
        currentUser={currentUser}
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        onResetDB={handleResetDB}
      />
      <main className="main-content">
        <TopBar
          currentUser={currentUser}
          users={users}
          notifications={notifications}
          showNotifications={showNotifications}
          onRoleChange={handleRoleChange}
          onToggleNotifications={togglePanel}
          onMarkAllRead={markAllRead}
          onLogout={handleLogout}
        />
        <div className="content-body">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}
