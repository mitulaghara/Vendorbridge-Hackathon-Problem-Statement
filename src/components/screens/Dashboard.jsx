// src/components/Dashboard.jsx
import React from 'react';
import { 
  FileText, Users, CheckSquare, DollarSign, 
  ArrowRight, Clock, Plus, BarChart2, CheckCircle2 
} from 'lucide-react';

export default function Dashboard({ 
  currentUser, 
  rfqs, 
  vendors, 
  quotes, 
  logs, 
  onNavigate 
}) {
  // Compute basic stats
  const activeRFQsCount = rfqs.filter(r => r.status !== 'Draft' && r.status !== 'Invoiced').length;
  const totalVendorsCount = vendors.filter(v => v.status === 'Active').length;
  const pendingApprovalsCount = rfqs.filter(r => r.status === 'Quotations Received' && quotes.some(q => q.rfqId === r.id && q.status === 'Submitted')).length;
  
  // Calculate total spent (from approved invoices)
  const approvedQuotes = quotes.filter(q => q.status === 'Approved');
  const totalSpent = rfqs.reduce((acc, rfq) => {
    if (rfq.status === 'Invoiced' || rfq.status === 'PO Generated') {
      const q = quotes.find(q => q.id === rfq.approvedQuoteId);
      if (q) {
        const totalCost = q.items.reduce((sum, item) => {
          const rfqItem = rfq.items.find(ri => ri.id === item.itemId);
          return sum + (item.price * (rfqItem ? rfqItem.quantity : 1));
        }, 0);
        return acc + totalCost;
      }
    }
    return acc;
  }, 0);

  const formattedSpent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(totalSpent);

  // Filter pending lists based on roles
  const recentLogs = logs.slice(0, 5);
  const pendingRFQs = rfqs.filter(r => r.status === 'Quotations Received').slice(0, 3);
  const activeBidding = rfqs.filter(r => r.status === 'Sent to Vendors' || r.status === 'Quotations Received').slice(0, 3);

  // Quick Action Handlers
  const renderQuickActions = () => {
    const role = currentUser.role;
    if (role === 'Procurement Officer') {
      return (
        <>
          <button className="btn btn-primary" onClick={() => onNavigate('rfq-creation')}>
            <Plus size={16} /> Create RFQ
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('quotation-comparison')}>
            <BarChart2 size={16} /> Compare Quotations
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('vendors')}>
            <Users size={16} /> Manage Vendors
          </button>
        </>
      );
    } else if (role === 'Vendor') {
      return (
        <>
          <button className="btn btn-primary" onClick={() => onNavigate('quotation-submission')}>
            <Clock size={16} /> Submit Quotation
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('po-invoice')}>
            <FileText size={16} /> View Purchase Orders
          </button>
        </>
      );
    } else if (role === 'Manager / Approver') {
      return (
        <>
          <button className="btn btn-primary" onClick={() => onNavigate('approvals')}>
            <CheckCircle2 size={16} /> Pending Approvals
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('reports')}>
            <BarChart2 size={16} /> View Spend Analytics
          </button>
        </>
      );
    } else if (role === 'Admin') {
      return (
        <>
          <button className="btn btn-primary" onClick={() => onNavigate('vendors')}>
            <Plus size={16} /> Register Vendor
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('logs')}>
            <FileText size={16} /> View Audit Logs
          </button>
        </>
      );
    }
  };

  return (
    <div className="animate-fade">
      {/* Welcome Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-secondary-color">
            Logged in as <strong style={{ color: 'var(--primary)' }}>{currentUser.role}</strong>. Here is the procurement status overview.
          </p>
        </div>
        
        {/* Quick Stats Summary */}
        <div className="no-print" style={{ display: 'flex', gap: '0.75rem' }}>
          {renderQuickActions()}
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Card 1 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            background: 'var(--primary-light)', 
            color: 'var(--primary)', 
            padding: '1rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={28} />
          </div>
          <div>
            <p className="text-secondary-color" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Active RFQs</p>
            <h3 style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>{activeRFQsCount}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            background: 'var(--success-light)', 
            color: 'var(--success)', 
            padding: '1rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={28} />
          </div>
          <div>
            <p className="text-secondary-color" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Verified Vendors</p>
            <h3 style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>{totalVendorsCount}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            background: 'var(--warning-light)', 
            color: 'var(--warning)', 
            padding: '1rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckSquare size={28} />
          </div>
          <div>
            <p className="text-secondary-color" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Pending Approvals</p>
            <h3 style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>{pendingApprovalsCount}</h3>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            background: 'var(--info-light)', 
            color: 'var(--info)', 
            padding: '1rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-secondary-color" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Total Spent</p>
            <h3 style={{ fontSize: '1.8rem', marginTop: '0.25rem', color: 'var(--success)' }}>{formattedSpent}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Layout splits */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem'
      }}>
        {/* Left Side: Procurement Workflows */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem' }}>
              {currentUser.role === 'Vendor' ? 'Active Bidding RFQs' : 'Recent RFQs'}
            </h3>
            <button 
              className="btn-icon" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', cursor: 'pointer' }}
              onClick={() => onNavigate(currentUser.role === 'Vendor' ? 'quotation-submission' : 'quotation-comparison')}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>RFQ ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(currentUser.role === 'Vendor' ? activeBidding : rfqs.slice(0, 5)).map(rfq => (
                  <tr key={rfq.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{rfq.id}</td>
                    <td>{rfq.title}</td>
                    <td>{rfq.category}</td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={12} className="text-secondary-color" />
                      {new Date(rfq.deadline).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge badge-${
                        rfq.status === 'Draft' ? 'draft' :
                        rfq.status === 'Sent to Vendors' ? 'sent' :
                        rfq.status === 'Quotations Received' ? 'quotes' :
                        rfq.status === 'Approved' ? 'approved' :
                        rfq.status === 'PO Generated' ? 'po' :
                        rfq.status === 'Invoiced' ? 'invoiced' : 'draft'
                      }`}>
                        {rfq.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(currentUser.role === 'Vendor' ? activeBidding : rfqs).length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No active RFQs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Activity log and actions */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Activity Timeline</h3>
            <button 
              className="btn-icon" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', cursor: 'pointer' }}
              onClick={() => onNavigate('logs')}
            >
              Full Log <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '320px' }}>
            {recentLogs.map((log, index) => (
              <div key={log.id} style={{
                display: 'flex',
                gap: '0.75rem',
                paddingBottom: index === recentLogs.length - 1 ? '0' : '1rem',
                borderBottom: index === recentLogs.length - 1 ? 'none' : '1px solid var(--border-color)',
                fontSize: '0.85rem'
              }}>
                <div style={{ fontSize: '1.1rem', marginTop: '0.1rem' }}>
                  {log.action.includes('Approved') ? '✅' :
                   log.action.includes('Created') ? '📝' :
                   log.action.includes('Submitted') ? '⚡' :
                   log.action.includes('Generated') ? '📄' : '⚙️'}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{log.details}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    <span>{log.user} ({log.role})</span>
                    <span>•</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
