// src/components/QuotationSubmission.jsx
import React, { useState } from 'react';
import { Clock, Send, CheckCircle, Edit, AlertCircle } from 'lucide-react';

export default function QuotationSubmission({ currentUser, rfqs, quotes, onSubmitQuotation }) {
  const [activeRfqId, setActiveRfqId] = useState(null);
  
  // Form states
  const [itemPrices, setItemPrices] = useState({}); // itemId -> price
  const [itemComments, setItemComments] = useState({}); // itemId -> comment
  const [deliveryDays, setDeliveryDays] = useState(5);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Find vendor details from current logged in user
  const vendorCompany = currentUser.company || '';

  // Get RFQs assigned to this vendor
  // A vendor is assigned if their vendor ID matches. Since our users mapping maps `vendor1` to `Acme Industrial Services` which has ID `v-acme`:
  // Let's resolve the vendor ID based on user company:
  const vendorIdMap = {
    "Acme Industrial Services": "v-acme",
    "Zenith IT Solutions": "v-zenith",
    "Apex Logistics": "v-apex",
    "Global Office Supplies": "v-global",
  };
  const activeVendorId = vendorIdMap[vendorCompany] || 'v-unknown';

  // Filter RFQs assigned to this vendor
  const assignedRFQs = rfqs.filter(rfq => 
    rfq.assignedVendors.includes(activeVendorId) && 
    rfq.status !== 'Draft'
  );

  const handleSelectRFQ = (rfq) => {
    setActiveRfqId(rfq.id);
    setError('');
    
    // Check if there is an existing quotation submitted by this vendor
    const existingQuote = quotes.find(q => q.rfqId === rfq.id && q.vendorId === activeVendorId);
    
    if (existingQuote) {
      // Load existing quote data for editing
      const prices = {};
      const comments = {};
      existingQuote.items.forEach(it => {
        prices[it.itemId] = it.price;
        comments[it.itemId] = it.comment || '';
      });
      setItemPrices(prices);
      setItemComments(comments);
      setDeliveryDays(existingQuote.deliveryDays);
      setNotes(existingQuote.notes || '');
    } else {
      // Clear forms
      const prices = {};
      const comments = {};
      rfq.items.forEach(it => {
        prices[it.id] = '';
        comments[it.id] = '';
      });
      setItemPrices(prices);
      setItemComments(comments);
      setDeliveryDays(5);
      setNotes('');
    }
  };

  const handlePriceChange = (itemId, priceVal) => {
    setItemPrices({
      ...itemPrices,
      [itemId]: priceVal
    });
  };

  const handleCommentChange = (itemId, commentVal) => {
    setItemComments({
      ...itemComments,
      [itemId]: commentVal
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const rfq = rfqs.find(r => r.id === activeRfqId);
    if (!rfq) return;

    // Validate prices
    const invalidPrice = rfq.items.some(item => {
      const price = itemPrices[item.id];
      return !price || parseFloat(price) <= 0;
    });

    if (invalidPrice) {
      setError('Please provide a valid price (greater than 0) for all requested items.');
      return;
    }

    if (!deliveryDays || deliveryDays <= 0) {
      setError('Please provide a valid delivery timeline (number of days).');
      return;
    }

    // Prepare quotation payload
    const quoteId = `Q-${rfq.id.replace('RFQ-', '')}-${activeVendorId.toUpperCase()}`;
    const formattedItems = rfq.items.map(item => ({
      itemId: item.id,
      price: parseFloat(itemPrices[item.id]),
      comment: itemComments[item.id] || ''
    }));

    onSubmitQuotation({
      id: quoteId,
      rfqId: rfq.id,
      vendorId: activeVendorId,
      vendorName: vendorCompany,
      submittedDate: new Date().toISOString().split('T')[0],
      items: formattedItems,
      deliveryDays: parseInt(deliveryDays),
      notes,
      status: 'Submitted',
      rating: currentUser.rating || 4.5
    });

    setActiveRfqId(null);
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Vendor Bidding Panel
        </h1>
        <p className="text-secondary-color">
          Review active requests assigned to <strong>{vendorCompany || 'your company'}</strong> and submit competitive bids.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Panel: RFQ List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Assigned RFQ Bidding Board
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '450px', overflowY: 'auto' }}>
            {assignedRFQs.map(rfq => {
              const hasQuote = quotes.some(q => q.rfqId === rfq.id && q.vendorId === activeVendorId);
              const quoteDetails = quotes.find(q => q.rfqId === rfq.id && q.vendorId === activeVendorId);
              const isApproved = rfq.approvedQuoteId === quoteDetails?.id;
              
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
                    position: 'relative'
                  }}
                  onClick={() => handleSelectRFQ(rfq)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.85rem' }}>{rfq.id}</span>
                    <div>
                      {isApproved ? (
                        <span className="badge badge-approved" style={{ fontSize: '0.65rem' }}>Contract Awarded</span>
                      ) : hasQuote ? (
                        <span className="badge badge-draft" style={{ fontSize: '0.65rem', background: 'var(--success-light)', color: 'var(--success)' }}>Submitted (Editable)</span>
                      ) : (
                        <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>Pending Bid</span>
                      )}
                    </div>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>{rfq.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Deadline: {new Date(rfq.deadline).toLocaleDateString()}</span>
                    <span>Items: {rfq.items.length}</span>
                  </div>
                </div>
              );
            })}

            {assignedRFQs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No RFQs currently assigned to your profile.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Quotation Form */}
        <div>
          {activeRfqId ? (
            (() => {
              const rfq = rfqs.find(r => r.id === activeRfqId);
              const hasQuote = quotes.some(q => q.rfqId === rfq.id && q.vendorId === activeVendorId);
              const quoteDetails = quotes.find(q => q.rfqId === rfq.id && q.vendorId === activeVendorId);
              const isLocked = rfq.status === 'Approved' || rfq.status === 'PO Generated' || rfq.status === 'Invoiced';

              return (
                <div className="card animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem' }}>{rfq.title}</h3>
                      <p className="text-secondary-color" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        RFQ ID: {rfq.id} | Deadline: {new Date(rfq.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    {isLocked && (
                      <span className="badge badge-rejected" style={{ gap: '0.25rem' }}>
                        <AlertCircle size={12} /> Closed for bidding
                      </span>
                    )}
                  </div>

                  {rfq.description && (
                    <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Scope / Requirement Brief:</p>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>{rfq.description}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Item Checklist prices */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Itemized Bidding Prices</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {rfq.items.map(item => (
                          <div key={item.id} style={{
                            background: 'var(--bg-dark)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '1rem',
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr',
                            alignItems: 'center',
                            gap: '1rem'
                          }}>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.description || 'No specs description'}</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quantity</p>
                              <p style={{ fontWeight: 'bold', marginTop: '0.2rem' }}>{item.quantity}</p>
                            </div>
                            <div>
                              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                                Unit Price (₹) *
                              </label>
                              <input
                                type="number"
                                min="1"
                                className="input-control"
                                style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                                disabled={isLocked}
                                value={itemPrices[item.id] || ''}
                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                placeholder="Enter Price"
                                required
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline & Notes */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Delivery Timeline (Days) *</label>
                        <input
                          type="number"
                          min="1"
                          className="input-control"
                          disabled={isLocked}
                          value={deliveryDays}
                          onChange={(e) => setDeliveryDays(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Vendor Remarks / Warranties</label>
                        <input
                          type="text"
                          className="input-control"
                          placeholder="e.g. Terms, support, warranty parameters..."
                          disabled={isLocked}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    </div>

                    {error && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '6px', background: 'var(--danger-light)', color: 'var(--danger)', fontSize: '0.85rem' }}>
                        <AlertCircle size={16} /> <span>{error}</span>
                      </div>
                    )}

                    {!isLocked && (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => setActiveRfqId(null)}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          style={{ gap: '0.5rem' }}
                        >
                          {hasQuote ? <Edit size={16} /> : <Send size={16} />}
                          {hasQuote ? 'Update Quotation' : 'Submit Quotation'}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              );
            })()
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Clock size={48} className="text-secondary-color" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>No RFQ Selected</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: '350px' }}>
                Select an assigned request from the list on the left to submit a quotation or update your existing bid.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
