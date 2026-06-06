// src/components/QuotationComparison.jsx
import React, { useState } from 'react';
import { BarChart3, Star, Clock, DollarSign, ShieldAlert, ArrowUpRight, Award } from 'lucide-react';

export default function QuotationComparison({ currentUser, rfqs, quotes, onSubmitForApproval }) {
  const [selectedRfqId, setSelectedRfqId] = useState('');
  const [sortBy, setSortBy] = useState('totalPrice');

  // Filter RFQs that have status "Quotations Received" or "Sent to Vendors" (having quotes)
  const availableRFQs = rfqs.filter(r => 
    r.status === 'Sent to Vendors' || 
    r.status === 'Quotations Received' || 
    r.status === 'Pending Approval' || 
    r.status === 'Approved' || 
    r.status === 'PO Generated' || 
    r.status === 'Invoiced'
  );

  const selectedRfq = rfqs.find(r => r.id === selectedRfqId);

  // Get quotations for the selected RFQ
  const rfqQuotes = quotes.filter(q => q.rfqId === selectedRfqId);

  // Calculate totals and find best matches
  const processedQuotes = rfqQuotes.map(quote => {
    // Total price
    let totalCost = 0;
    quote.items.forEach(item => {
      const rfqItem = selectedRfq?.items.find(ri => ri.id === item.itemId);
      const qty = rfqItem ? rfqItem.quantity : 1;
      totalCost += item.price * qty;
    });

    return {
      ...quote,
      totalCost
    };
  });

  // Find lowest price and fastest timeline
  let lowestCostId = null;
  let fastestDeliveryId = null;

  if (processedQuotes.length > 0) {
    // Lowest Cost
    const sortedByCost = [...processedQuotes].sort((a, b) => a.totalCost - b.totalCost);
    lowestCostId = sortedByCost[0].id;

    // Fastest delivery
    const sortedByTimeline = [...processedQuotes].sort((a, b) => a.deliveryDays - b.deliveryDays);
    fastestDeliveryId = sortedByTimeline[0].id;
  }

  // Sort the final quotes based on UI filter
  const sortedQuotes = [...processedQuotes].sort((a, b) => {
    if (sortBy === 'totalPrice') {
      return a.totalCost - b.totalCost;
    } else if (sortBy === 'deliveryDays') {
      return a.deliveryDays - b.deliveryDays;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  const handleSendToManager = (quote) => {
    const confirmSend = window.confirm(`Are you sure you want to submit the quotation from "${quote.vendorName}" for approval?`);
    if (confirmSend) {
      onSubmitForApproval(selectedRfqId, quote.id);
    }
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
          Quotation Comparison Engine
        </h1>
        <p className="text-secondary-color">
          Analyze vendor proposals side-by-side. Our engine automatically flags the lowest cost and fastest delivery timeline bids.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Selector Header Bar */}
        <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexGrow: 1 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              Select Active RFQ:
            </span>
            <select
              className="input-control"
              style={{ maxWidth: '400px' }}
              value={selectedRfqId}
              onChange={(e) => setSelectedRfqId(e.target.value)}
            >
              <option value="">-- Choose an RFQ to Compare Bids --</option>
              {availableRFQs.map(r => (
                <option key={r.id} value={r.id}>
                  [{r.id}] {r.title} ({r.category})
                </option>
              ))}
            </select>
          </div>

          {selectedRfqId && rfqQuotes.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sort Bids:</span>
              <select
                className="input-control"
                style={{ width: '180px', padding: '0.5rem 1rem' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="totalPrice">Lowest Total Price</option>
                <option value="deliveryDays">Fastest Delivery</option>
                <option value="rating">Highest Vendor Rating</option>
              </select>
            </div>
          )}
        </div>

        {/* Content displays */}
        {selectedRfqId ? (
          rfqQuotes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Selected RFQ specs breakdown */}
              <div className="card" style={{ background: 'var(--bg-dark)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>RFQ Specifications Summary</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.85rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Description:</span>
                    <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>{selectedRfq.description}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Target Budget:</span>
                    <p style={{ marginTop: '0.25rem', fontWeight: 600 }}>
                      {formatCurrency(selectedRfq.items.reduce((sum, item) => sum + (item.targetPrice * item.quantity), 0))}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Bidding Deadline:</span>
                    <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>{new Date(selectedRfq.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Workflow State:</span>
                    <p style={{ marginTop: '0.25rem' }}>
                      <span className={`badge badge-${
                        selectedRfq.status === 'Sent to Vendors' ? 'sent' :
                        selectedRfq.status === 'Quotations Received' ? 'quotes' :
                        selectedRfq.status === 'Approved' ? 'approved' :
                        selectedRfq.status === 'PO Generated' ? 'po' :
                        selectedRfq.status === 'Invoiced' ? 'invoiced' : 'pending'
                      }`}>
                        {selectedRfq.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid Side-by-Side Comparison */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(320px, 1fr))`,
                gap: '1.5rem',
                alignItems: 'stretch'
              }}>
                {sortedQuotes.map(quote => {
                  const isLowestCost = quote.id === lowestCostId;
                  const isFastestDelivery = quote.id === fastestDeliveryId;
                  const isQuoteSelectedForApproval = selectedRfq.approvedQuoteId === quote.id;
                  
                  let cardClass = "card";
                  if (isLowestCost) cardClass += " highlight-green";
                  else if (isFastestDelivery) cardClass += " highlight-blue";

                  return (
                    <div 
                      key={quote.id} 
                      className={cardClass}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1.25rem',
                        borderWidth: isLowestCost || isFastestDelivery ? '2px' : '1px',
                        marginTop: isLowestCost || isFastestDelivery ? '10px' : '0' // space for overlay labels
                      }}
                    >
                      {/* Vendor Meta */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem' }}>{quote.vendorName}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                            <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center' }}>
                              <Star size={12} fill="currentColor" />
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                              {quote.rating} Rating Profile
                            </span>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Bid: {quote.id}
                        </span>
                      </div>

                      {/* Items pricing checklist */}
                      <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0' }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Line Item Bids</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {quote.items.map(qItem => {
                            const rfqItem = selectedRfq.items.find(ri => ri.id === qItem.itemId);
                            return (
                              <div key={qItem.itemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                  {rfqItem ? rfqItem.name : 'Unknown Item'} <span style={{ color: 'var(--text-muted)' }}>x{rfqItem ? rfqItem.quantity : 1}</span>
                                </span>
                                <span style={{ fontWeight: 600 }}>
                                  {formatCurrency(qItem.price)} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>unit</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Comparative parameters */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                        <div style={{ background: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '6px' }}>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Lead Timeline</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem', fontWeight: 600 }}>
                            <Clock size={12} className="text-secondary-color" />
                            <span>{quote.deliveryDays} Days</span>
                          </div>
                        </div>
                        <div style={{ background: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '6px' }}>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Total Cost</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem', fontWeight: 700, color: 'var(--success)' }}>
                            <DollarSign size={12} />
                            <span>{formatCurrency(quote.totalCost)}</span>
                          </div>
                        </div>
                      </div>

                      {quote.notes && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-dark)', padding: '0.5rem', borderRadius: '4px', borderLeft: '3px solid var(--border-color)' }}>
                          <strong>Notes:</strong> {quote.notes}
                        </div>
                      )}

                      {/* Selector Workflow buttons */}
                      {currentUser.role === 'Procurement Officer' && (
                        <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                          {selectedRfq.status === 'Sent to Vendors' || selectedRfq.status === 'Quotations Received' ? (
                            <button
                              className="btn btn-primary"
                              style={{ width: '100%', gap: '0.35rem' }}
                              onClick={() => handleSendToManager(quote)}
                            >
                              Select & Send for Approval <ArrowUpRight size={14} />
                            </button>
                          ) : isQuoteSelectedForApproval ? (
                            <div style={{
                              textAlign: 'center',
                              padding: '0.5rem',
                              background: 'var(--success-light)',
                              color: 'var(--success)',
                              borderRadius: '6px',
                              fontWeight: 600,
                              fontSize: '0.85rem'
                            }}>
                              Selected for Approval
                            </div>
                          ) : (
                            <div style={{
                              textAlign: 'center',
                              padding: '0.5rem',
                              background: 'var(--bg-dark)',
                              color: 'var(--text-muted)',
                              borderRadius: '6px',
                              fontSize: '0.85rem'
                            }}>
                              Locked (Status: {selectedRfq.status})
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-secondary)' }}>
              <ShieldAlert size={48} className="text-secondary-color" style={{ marginBottom: '1.25rem', opacity: 0.5 }} />
              <h3>No Quotations Received Yet</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: '400px', marginInside: 'auto' }}>
                Vendors invited to this RFQ have not submitted bidding values yet. Log in as assigned vendors to submit bids.
              </p>
            </div>
          )
        ) : (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <BarChart3 size={48} className="text-secondary-color" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>Select RFQ Project to Compare</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: '350px' }}>
              Choose a project from the top dropdown list to evaluate bidding proposals side-by-side.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
