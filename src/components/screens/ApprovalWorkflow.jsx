// src/components/ApprovalWorkflow.jsx
import React, { useState } from 'react';
import { Check, X, ShieldCheck, Clock, FileText, User, AlertCircle } from 'lucide-react';

export default function ApprovalWorkflow({ currentUser, rfqs, quotes, onApprove, onReject }) {
  const [activeRfqId, setActiveRfqId] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  // Get RFQs with status "Pending Approval"
  const pendingRFQs = rfqs.filter(r => r.status === 'Pending Approval');

  const handleSelectRFQ = (rfq) => {
    setActiveRfqId(rfq.id);
    setRemarks('');
    setError('');
  };

  const handleAction = (status) => {
    if (!remarks.trim()) {
      setError('Please provide review remarks/comments before decision.');
      return;
    }

    if (status === 'Approved') {
      onApprove(activeRfqId, remarks);
    } else {
      onReject(activeRfqId, remarks);
    }

    setActiveRfqId(null);
    setRemarks('');
    setError('');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="animate-fade">
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Procurement Review & Approvals
        </h1>
        <p className="text-secondary-color">
          Manager authorization dashboard. Review selected vendor quotes, verify budget specifications, and authorize purchase order generation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Side: Pending List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Pending Reviews Inbox
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '450px', overflowY: 'auto' }}>
            {pendingRFQs.map(rfq => {
              const quote = quotes.find(q => q.id === rfq.approvedQuoteId);
              
              // Calculate Quote Total Cost
              let totalCost = 0;
              if (quote) {
                quote.items.forEach(item => {
                  const rfqItem = rfq.items.find(ri => ri.id === item.itemId);
                  const qty = rfqItem ? rfqItem.quantity : 1;
                  totalCost += item.price * qty;
                });
              }

              return (
                <div 
                  key={rfq.id} 
                  style={{
                    padding: '1rem',
                    background: activeRfqId === rfq.id ? 'var(--primary-light)' : 'var(--bg-dark)',
                    border: `1px solid ${activeRfqId === rfq.id ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => handleSelectRFQ(rfq)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.85rem' }}>{rfq.id}</span>
                    <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>Awaiting Signoff</span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>{rfq.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Vendor: <strong>{quote?.vendorName || 'N/A'}</strong></span>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>{formatCurrency(totalCost)}</span>
                  </div>
                </div>
              );
            })}

            {pendingRFQs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No pending procurement approvals. Good job!
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Sign-off Form */}
        <div>
          {activeRfqId ? (
            (() => {
              const rfq = rfqs.find(r => r.id === activeRfqId);
              const quote = quotes.find(q => q.id === rfq.approvedQuoteId);

              // Calculate Quote Total Cost
              let totalCost = 0;
              if (quote) {
                quote.items.forEach(item => {
                  const rfqItem = rfq.items.find(ri => ri.id === item.itemId);
                  const qty = rfqItem ? rfqItem.quantity : 1;
                  totalCost += item.price * qty;
                });
              }

              return (
                <div className="card animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Title Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem' }}>Review RFQ: {rfq.title}</h3>
                      <p className="text-secondary-color" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        Requested by {rfq.creator} | Category: {rfq.category}
                      </p>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                  }}>
                    {/* RFQ specs */}
                    <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        Requested Specifications
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {rfq.items.map(item => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.name}</span>
                            <span style={{ fontWeight: 600 }}>x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quotation Details */}
                    <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        Selected Vendor Proposal
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between' }}>
                          <span>Vendor:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{quote?.vendorName}</strong>
                        </div>
                        <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between' }}>
                          <span>Timeline:</span>
                          <strong>{quote?.deliveryDays} Days</strong>
                        </div>
                        <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '0.35rem', marginTop: '0.25rem' }}>
                          <span>Proposal Total:</span>
                          <strong style={{ color: 'var(--success)' }}>{formatCurrency(totalCost)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Workflow Progress Timeline */}
                  <div style={{ padding: '0.5rem 0' }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                      Audit & Workflow State History
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '1.5rem' }}>
                      {/* Timeline track line */}
                      <div style={{
                        position: 'absolute',
                        left: '5px',
                        top: '5px',
                        bottom: '5px',
                        width: '2px',
                        background: 'var(--border-color)'
                      }}></div>

                      {/* State 1 */}
                      <div style={{ position: 'relative', fontSize: '0.8rem' }}>
                        <div style={{ position: 'absolute', left: '-21px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }}></div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>RFQ Broadcast Completed</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Authorized by Rahul Sharma on {new Date(rfq.createdDate).toLocaleDateString()}</p>
                      </div>

                      {/* State 2 */}
                      <div style={{ position: 'relative', fontSize: '0.8rem' }}>
                        <div style={{ position: 'absolute', left: '-21px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }}></div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Vendor Bidding Logged</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Proposal submitted by {quote?.vendorName} on {new Date(quote?.submittedDate).toLocaleDateString()}</p>
                      </div>

                      {/* State 3 */}
                      <div style={{ position: 'relative', fontSize: '0.8rem' }}>
                        <div style={{ position: 'absolute', left: '-21px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Pending Signoff</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Route assigned to Manager {currentUser.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sign-off Actions */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Sign-off Remarks / Audit Comments *</label>
                      <textarea
                        className="input-control"
                        placeholder="Provide reasoning for approval/rejection (e.g. Budget justification, compliance check)..."
                        style={{ minHeight: '80px', resize: 'vertical' }}
                        value={remarks}
                        onChange={(e) => {
                          setRemarks(e.target.value);
                          if (errors) setError('');
                        }}
                      />
                    </div>

                    {error && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '6px', background: 'var(--danger-light)', color: 'var(--danger)', fontSize: '0.85rem' }}>
                        <AlertCircle size={16} /> <span>{error}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ gap: '0.35rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}
                        onClick={() => handleAction('Rejected')}
                      >
                        <X size={16} /> Reject Bid
                      </button>
                      <button 
                        className="btn btn-success" 
                        style={{ gap: '0.35rem' }}
                        onClick={() => handleAction('Approved')}
                      >
                        <Check size={16} /> Approve & Signoff
                      </button>
                    </div>
                  </div>

                </div>
              );
            })()
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={48} className="text-secondary-color" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>Select Request for Sign-off</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: '350px' }}>
                Choose an item from the pending list on the left to review the proposed bidding details and timeline histories.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
