// src/components/ReportsAnalytics.jsx
import React, { useState } from 'react';
import { TrendingUp, Award, DollarSign, Download, BarChart2, Star, Percent } from 'lucide-react';

export default function ReportsAnalytics({ rfqs, vendors, quotes }) {
  const [reportType, setReportType] = useState('spend'); // 'spend' | 'vendors'

  // Calculations for Reports
  // 1. Category Spend calculations
  const spendByCategory = {
    'IT & Hardware': 0,
    'Services': 0,
    'Logistics': 0,
    'Office Supplies': 0,
    'Construction': 0
  };

  let totalSpentVal = 0;
  let savingsVal = 0; // Difference between Target budget and Final Bid for approved items

  rfqs.forEach(rfq => {
    if (rfq.status === 'Invoiced' || rfq.status === 'PO Generated') {
      const q = quotes.find(q => q.id === rfq.approvedQuoteId);
      if (q) {
        let quoteTotal = 0;
        let rfqTargetTotal = 0;

        q.items.forEach(item => {
          const rfqItem = rfq.items.find(ri => ri.id === item.itemId);
          const qty = rfqItem ? rfqItem.quantity : 1;
          quoteTotal += item.price * qty;
          rfqTargetTotal += (rfqItem ? rfqItem.targetPrice : item.price) * qty;
        });

        spendByCategory[rfq.category] = (spendByCategory[rfq.category] || 0) + quoteTotal;
        totalSpentVal += quoteTotal;
        
        if (rfqTargetTotal > quoteTotal) {
          savingsVal += (rfqTargetTotal - quoteTotal);
        }
      }
    }
  });

  const categories = Object.keys(spendByCategory);
  const categoryValues = Object.values(spendByCategory);
  const hasSpend = totalSpentVal > 0;

  // 2. Monthly Spend Mock Data for Bar Chart
  const monthlyData = [
    { month: 'Jan', amount: 120000 },
    { month: 'Feb', amount: 250000 },
    { month: 'Mar', amount: 180000 },
    { month: 'Apr', amount: totalSpentVal > 0 ? Math.floor(totalSpentVal * 0.4) : 462000 }, // Warehouse shipping month
    { month: 'May', amount: totalSpentVal > 0 ? Math.floor(totalSpentVal * 0.6) : 320000 }, // Developers laptop month
    { month: 'Jun', amount: totalSpentVal }
  ];

  const maxMonthVal = Math.max(...monthlyData.map(d => d.amount), 500000);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleExportPerformance = () => {
    const csvRows = [
      ['Vendor Name', 'Category', 'Rating', 'Orders Completed', 'Success Rate (%)', 'On-Time Delivery (%)']
    ];

    vendors.forEach(v => {
      csvRows.push([
        v.name,
        v.category,
        v.rating,
        v.ordersCompleted,
        v.successRate,
        v.onTimeDelivery
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendor_performance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Doughnut Chart Math Helpers
  let accumulatedAngle = 0;
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'];

  const getDoughnutSlices = () => {
    if (!hasSpend) return null;
    return categories.map((cat, idx) => {
      const val = spendByCategory[cat];
      if (val === 0) return null;
      
      const percentage = val / totalSpentVal;
      const angle = percentage * 360;
      
      // Arc coordinates
      const radius = 70;
      const cx = 100;
      const cy = 100;
      
      const startAngle = accumulatedAngle;
      const endAngle = accumulatedAngle + angle;
      accumulatedAngle = endAngle;

      const x1 = cx + radius * Math.cos((startAngle - 90) * Math.PI / 180);
      const y1 = cy + radius * Math.sin((startAngle - 90) * Math.PI / 180);
      const x2 = cx + radius * Math.cos((endAngle - 90) * Math.PI / 180);
      const y2 = cy + radius * Math.sin((endAngle - 90) * Math.PI / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

      return (
        <path
          key={cat}
          d={pathData}
          fill="none"
          stroke={colors[idx % colors.length]}
          strokeWidth="20"
          style={{ transition: 'stroke-width 0.2s', cursor: 'pointer' }}
          title={`${cat}: ${formatCurrency(val)}`}
        />
      );
    }).filter(Boolean);
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            Reports & Spend Analytics
          </h1>
          <p className="text-secondary-color">
            Analyze organization spending patterns, compare item cost budgets, and review vendor compliance profiles.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${reportType === 'spend' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setReportType('spend')}
          >
            <TrendingUp size={16} /> Spend Analytics
          </button>
          <button 
            className={`btn ${reportType === 'vendors' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setReportType('vendors')}
          >
            <Award size={16} /> Vendor Performance
          </button>
        </div>
      </div>

      {/* KPI Stats cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* KPI 1 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '0.75rem', borderRadius: '8px' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Outlay</p>
            <h4 style={{ fontSize: '1.25rem', marginTop: '0.15rem' }}>{formatCurrency(totalSpentVal)}</h4>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px' }}>
            <Percent size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simulated Savings</p>
            <h4 style={{ fontSize: '1.25rem', color: 'var(--success)', marginTop: '0.15rem' }}>{formatCurrency(savingsVal)}</h4>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--info-light)', color: 'var(--info)', padding: '0.75rem', borderRadius: '8px' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg. Contract Size</p>
            <h4 style={{ fontSize: '1.25rem', marginTop: '0.15rem' }}>
              {formatCurrency(totalSpentVal > 0 ? totalSpentVal / rfqs.filter(r => r.status === 'Invoiced' || r.status === 'PO Generated').length : 154000)}
            </h4>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--warning-light)', color: 'var(--warning)', padding: '0.75rem', borderRadius: '8px' }}>
            <Award size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top Category</p>
            <h4 style={{ fontSize: '1.25rem', marginTop: '0.15rem' }}>
              {categories.sort((a,b) => spendByCategory[b] - spendByCategory[a])[0]}
            </h4>
          </div>
        </div>
      </div>

      {reportType === 'spend' ? (
        /* SPEND ANALYTICS LAYOUT */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          {/* Left panel: Monthly Spend Bar Chart */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Monthly Procurement Trends
            </h3>

            {/* Custom SVG Bar Chart */}
            <div style={{ width: '100%', height: '280px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0' }}>
              {monthlyData.map(item => {
                const heightPercent = (item.amount / maxMonthVal) * 80; // keep max bar at 80% height for padding
                return (
                  <div key={item.month} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {item.amount > 100000 ? `${(item.amount / 1000).toFixed(0)}k` : formatCurrency(item.amount)}
                    </span>
                    <div style={{
                      width: '100%',
                      maxWidth: '45px',
                      height: `${heightPercent}%`,
                      background: 'linear-gradient(to top, var(--primary), #a5b4fc)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.5s ease',
                      boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)'
                    }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Doughnut breakdown */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Outlay Share by Category
            </h3>

            {hasSpend ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
                {/* SVG Ring */}
                <svg width="180" height="180" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="var(--border-color)" strokeWidth="20" />
                  {getDoughnutSlices()}
                </svg>

                {/* Legend list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {categories.map((cat, idx) => {
                    const value = spendByCategory[cat];
                    if (value === 0) return null;
                    return (
                      <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors[idx % colors.length] }}></div>
                        <span style={{ color: 'var(--text-secondary)' }}>{cat}:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{((value / totalSpentVal) * 100).toFixed(0)}%</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Create a Purchase Order & Invoice first to view category distribution charts.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VENDOR PERFORMANCE REPORT CARD */
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Supplier Compliance Rating Grid</h3>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.35rem' }} onClick={handleExportPerformance}>
              <Download size={14} /> Download Performance report
            </button>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>Core Category</th>
                  <th>Quality Rating</th>
                  <th>Orders Filled</th>
                  <th>SLA Compliance (%)</th>
                  <th>On-Time Delivery (%)</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>{v.name}</td>
                    <td>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        background: 'var(--primary-light)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>{v.category}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{v.rating}</strong>
                        <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                      </div>
                    </td>
                    <td>{v.ordersCompleted} orders</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flexGrow: 1, background: 'var(--bg-dark)', height: '6px', borderRadius: '3px', minWidth: '60px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <div style={{ background: v.successRate > 95 ? 'var(--success)' : 'var(--warning)', width: `${v.successRate}%`, height: '100%', borderRadius: '3px' }}></div>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{v.successRate}%</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flexGrow: 1, background: 'var(--bg-dark)', height: '6px', borderRadius: '3px', minWidth: '60px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <div style={{ background: v.onTimeDelivery > 95 ? 'var(--success)' : 'var(--warning)', width: `${v.onTimeDelivery}%`, height: '100%', borderRadius: '3px' }}></div>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{v.onTimeDelivery}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
