// src/components/POInvoiceScreen.jsx
import React, { useState } from 'react';
import { FileText, Printer, Download, Mail, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export default function POInvoiceScreen({ 
  currentUser, 
  rfqs, 
  quotes, 
  onGeneratePO, 
  onGenerateInvoice 
}) {
  const [activeRfqId, setActiveRfqId] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null); // 'drafting' | 'sending' | 'success' | null
  
  // Get RFQs in relevant states
  const documentRFQs = rfqs.filter(r => 
    r.status === 'Approved' || 
    r.status === 'PO Generated' || 
    r.status === 'Invoiced'
  );

  const handleSelectRFQ = (rfq) => {
    setActiveRfqId(rfq.id);
    setEmailStatus(null);
  };

  const activeRfq = rfqs.find(r => r.id === activeRfqId);
  const quote = quotes.find(q => q.id === activeRfq?.approvedQuoteId);

  // Math calculations
  let subtotal = 0;
  let taxRate = 0.18; // 18% GST
  let cgst = 0;
  let sgst = 0;
  let totalTax = 0;
  let totalAmount = 0;

  if (activeRfq && quote) {
    quote.items.forEach(item => {
      const rfqItem = activeRfq.items.find(ri => ri.id === item.itemId);
      const qty = rfqItem ? rfqItem.quantity : 1;
      subtotal += item.price * qty;
    });

    cgst = subtotal * (taxRate / 2); // 9%
    sgst = subtotal * (taxRate / 2); // 9%
    totalTax = cgst + sgst;
    totalAmount = subtotal + totalTax;
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert("Simulated PDF Download: The official PDF has been compiled and downloaded successfully!");
  };

  const handleSendEmail = () => {
    setEmailStatus('drafting');
    
    // Simulate multi-stage email workflow
    setTimeout(() => {
      setEmailStatus('sending');
      setTimeout(() => {
        setEmailStatus('success');
        setTimeout(() => {
          setEmailStatus(null);
          alert(`Email sent successfully to: info@${quote.vendorName.toLowerCase().replace(/\s+/g, '')}.com`);
        }, 1500);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="animate-fade">
      {/* Title */}
      <div className="no-print" style={{ marginBottom: '2rem' }}>
        <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Purchase Orders & Invoices
        </h1>
        <p className="text-secondary-color">
          Convert approved bids into legal PO documents and generate standard GST tax invoices for accounting printout or email.
        </p>
      </div>

      <div className="app-container-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.5fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Side Selector */}
        <div className="card no-print" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Document Manager Inbox
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '480px', overflowY: 'auto' }}>
            {documentRFQs.map(rfq => {
              const rfqQuote = quotes.find(q => q.id === rfq.approvedQuoteId);
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
                    <span className={`badge badge-${
                      rfq.status === 'Approved' ? 'approved' :
                      rfq.status === 'PO Generated' ? 'po' : 'invoiced'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {rfq.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>{rfq.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Vendor: <strong>{rfqQuote?.vendorName}</strong></span>
                  </div>
                </div>
              );
            })}

            {documentRFQs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active approved contracts found to generate documents.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Document Viewer */}
        <div style={{ flexGrow: 1 }}>
          {activeRfqId && activeRfq && quote ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Process Trigger Banner */}
              <div className="card no-print" style={{ 
                background: 'rgba(99, 102, 241, 0.05)', 
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Workflow Document Generation Action</h4>
                  <p className="text-secondary-color" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    Current status: <strong>{activeRfq.status}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {activeRfq.status === 'Approved' && currentUser.role === 'Procurement Officer' && (
                    <button 
                      className="btn btn-primary" 
                      onClick={() => onGeneratePO(activeRfq.id)}
                    >
                      Generate Purchase Order (PO)
                    </button>
                  )}
                  {activeRfq.status === 'PO Generated' && currentUser.role === 'Procurement Officer' && (
                    <button 
                      className="btn btn-primary" 
                      onClick={() => onGenerateInvoice(activeRfq.id)}
                    >
                      Generate Tax Invoice
                    </button>
                  )}
                  {activeRfq.status === 'Invoiced' && (
                    <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={16} /> Fully Documented & Invoiced
                    </span>
                  )}
                </div>
              </div>

              {/* PDF Document Viewer Container */}
              {(activeRfq.status === 'PO Generated' || activeRfq.status === 'Invoiced') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* Action buttons panel */}
                  <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" onClick={handlePrint}>
                      <Printer size={16} /> Print
                    </button>
                    <button className="btn btn-secondary" onClick={handleDownloadPDF}>
                      <Download size={16} /> Download
                    </button>
                    <button className="btn btn-secondary" onClick={handleSendEmail}>
                      <Mail size={16} /> Send Email
                    </button>
                  </div>

                  {/* Document Sheet layout */}
                  <div className="card invoice-print-container" style={{
                    background: 'white',
                    color: '#0f172a',
                    padding: '3rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                  }}>
                    {/* Document Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.5rem' }}>
                      <div>
                        <h2 className="invoice-print-header" style={{ fontSize: '1.8rem', color: '#1e293b', fontWeight: 800 }}>
                          VENDORBRIDGE CORP
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', lineHeight: '1.4' }}>
                          701, Capital Trade Center, BKC<br />
                          Mumbai, MH - 400051<br />
                          GSTIN: 27VNDRBR1024Z3E
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <h3 className="invoice-print-header" style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 700 }}>
                          {activeRfq.status === 'Invoiced' ? 'TAX INVOICE' : 'PURCHASE ORDER'}
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          Doc No: <strong>{activeRfq.status === 'Invoiced' ? activeRfq.invoiceNumber : activeRfq.poNumber}</strong>
                        </p>
                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                          Date: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Addresses row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', fontSize: '0.85rem' }}>
                      <div>
                        <p style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                          Issued To (Vendor)
                        </p>
                        <p style={{ fontWeight: 'bold', color: '#1e293b', marginTop: '0.25rem', fontSize: '1rem' }}>{quote.vendorName}</p>
                        <p style={{ color: '#64748b', marginTop: '0.25rem', lineHeight: '1.4' }}>
                          GSTIN: {quote.gst || 'Pending verification'}<br />
                          Contact Email: {quote.vendorId}@vendorbridge.com
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                          Delivery & Billing Location
                        </p>
                        <p style={{ fontWeight: 'bold', color: '#1e293b', marginTop: '0.25rem', fontSize: '1rem' }}>Vendorbridge Corp HQ</p>
                        <p style={{ color: '#64748b', marginTop: '0.25rem', lineHeight: '1.4' }}>
                          BKC Plaza, Block-G, Bandra Kurla Complex<br />
                          Mumbai, MH - 400051<br />
                          Tel: +91 22 4567 8901
                        </p>
                      </div>
                    </div>

                    {/* Main Items Table */}
                    <table className="invoice-print-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: '#64748b' }}>Item & Specifications</th>
                          <th style={{ textAlign: 'center', padding: '0.75rem 0.5rem', color: '#64748b' }}>Qty</th>
                          <th style={{ textAlign: 'right', padding: '0.75rem 0.5rem', color: '#64748b' }}>Unit Rate</th>
                          <th style={{ textAlign: 'right', padding: '0.75rem 0.5rem', color: '#64748b' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quote.items.map(it => {
                          const rfqItem = activeRfq.items.find(ri => ri.id === it.itemId);
                          return (
                            <tr key={it.itemId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '0.75rem 0.5rem' }}>
                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{rfqItem ? rfqItem.name : 'Unknown Item'}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{rfqItem?.description}</div>
                              </td>
                              <td style={{ textAlign: 'center', padding: '0.75rem 0.5rem', color: '#1e293b' }}>{rfqItem?.quantity}</td>
                              <td style={{ textAlign: 'right', padding: '0.75rem 0.5rem', color: '#1e293b' }}>{formatCurrency(it.price)}</td>
                              <td style={{ textAlign: 'right', padding: '0.75rem 0.5rem', color: '#1e293b', fontWeight: 600 }}>
                                {formatCurrency(it.price * (rfqItem ? rfqItem.quantity : 1))}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Tax breakdown & Calculations */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #e2e8f0', paddingTop: '1.5rem', marginTop: 'auto' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '300px', lineHeight: '1.4' }}>
                        <p style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>Terms & Conditions</p>
                        <p>1. Payments will be disbursed within 30 days of invoice receipt.<br />
                           2. Delivery should comply with the agreed Lead Timeline of {quote.deliveryDays} days.<br />
                           3. Disputes subject to local Mumbai jurisdiction.</p>
                      </div>
                      <div className="invoice-print-totals" style={{ minWidth: '280px', fontSize: '0.85rem', color: '#1e293b' }}>
                        <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                          <span>Subtotal:</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', padding: '0.25rem 0', color: '#64748b' }}>
                          <span>CGST (9.0%):</span>
                          <span>{formatCurrency(cgst)}</span>
                        </div>
                        <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', padding: '0.25rem 0', color: '#64748b' }}>
                          <span>SGST (9.0%):</span>
                          <span>{formatCurrency(sgst)}</span>
                        </div>
                        <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', padding: '0.25rem 0', borderTop: '1px dashed #e2e8f0', borderBottom: '2px solid #1e293b', marginTop: '0.5rem', paddingBottom: '0.5rem' }}>
                          <strong style={{ fontSize: '1rem' }}>Total Amount (INR):</strong>
                          <strong style={{ fontSize: '1rem', color: '#10b981' }}>{formatCurrency(totalAmount)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="card no-print" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <FileText size={48} className="text-secondary-color" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>Select Workflow Contract</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: '350px' }}>
                Choose an approved vendor bid from the left sidebar to generate official PO documents and tax invoices.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Simulated Email Modal Loader Overlay */}
      {emailStatus && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
            {emailStatus === 'drafting' && (
              <div className="animate-fade">
                <div className="pulse-loader">✍️</div>
                <h3 style={{ marginTop: '1rem' }}>Drafting Email...</h3>
                <p className="text-secondary-color" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Compiling purchase specs and totals.
                </p>
              </div>
            )}
            {emailStatus === 'sending' && (
              <div className="animate-fade">
                <div className="pulse-loader">✈️</div>
                <h3 style={{ marginTop: '1rem' }}>Sending Invoice PDF...</h3>
                <p className="text-secondary-color" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Uploading file attachment to Mail Gateway.
                </p>
              </div>
            )}
            {emailStatus === 'success' && (
              <div className="animate-fade">
                <div className="pulse-loader" style={{ background: 'var(--success)' }}>🚀</div>
                <h3 style={{ marginTop: '1rem', color: 'var(--success)' }}>Email Transmitted!</h3>
                <p className="text-secondary-color" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Successfully routed to {quote.vendorName} gateway.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
