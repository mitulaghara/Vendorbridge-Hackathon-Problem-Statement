// src/components/ActivityLogs.jsx
import React, { useState } from 'react';
import { Shield, Search, Calendar, Filter, FileSpreadsheet } from 'lucide-react';

export default function ActivityLogs({ logs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const actionTypes = [
    'All',
    'RFQ Created',
    'Quotation Submitted',
    'Sent for Approval',
    'Quotation Approved',
    'PO Generated',
    'Invoice Generated'
  ];

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getEmojiForAction = (action) => {
    if (action.includes('Created')) return '📝';
    if (action.includes('Submitted')) return '⚡';
    if (action.includes('Approved')) return '✅';
    if (action.includes('Rejected')) return '❌';
    if (action.includes('PO Generated')) return '📄';
    if (action.includes('Invoice')) return '💵';
    return '⚙️';
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const csvRows = [
      ['Timestamp', 'User', 'Role', 'Action', 'Details']
    ];
    
    filteredLogs.forEach(log => {
      csvRows.push([
        new Date(log.timestamp).toLocaleString(),
        log.user,
        log.role,
        log.action,
        log.details.replace(/"/g, '""') // escape double quotes
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendorbridge_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            System Audit Logs
          </h1>
          <p className="text-secondary-color">
            Secure tracking of procurement workflows. Search through audit records of all RFQs, bids, approvals, and legal orders.
          </p>
        </div>
        <button className="btn btn-secondary" style={{ gap: '0.35rem' }} onClick={handleExportCSV}>
          <FileSpreadsheet size={16} /> Export Audit CSV
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Search and Filters */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flexGrow: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              className="input-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search audit trail by user name, action, or document reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              <Filter size={14} style={{ display: 'inline', marginRight: '4px' }} /> Action:
            </span>
            <select
              className="input-control"
              style={{ width: '220px', padding: '0.5rem 1rem' }}
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              {actionTypes.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Audit list panel */}
        <div className="card" style={{ padding: '0' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '8%', textAlign: 'center' }}>Icon</th>
                  <th style={{ width: '20%' }}>Timestamp</th>
                  <th style={{ width: '20%' }}>Operator Name</th>
                  <th style={{ width: '15%' }}>Action</th>
                  <th style={{ width: '37%' }}>Transaction Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                      {getEmojiForAction(log.action)}
                    </td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderBottom: 'none', height: '100%', padding: '1.2rem 1.25rem' }}>
                      <Calendar size={12} className="text-secondary-color" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{log.user}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.role}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${
                        log.action.includes('Created') ? 'sent' :
                        log.action.includes('Submitted') ? 'draft' :
                        log.action.includes('Approved') ? 'approved' :
                        log.action.includes('Rejected') ? 'rejected' :
                        log.action.includes('PO Generated') ? 'po' : 'invoiced'
                      }`} style={{ fontSize: '0.65rem' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                      {log.details}
                    </td>
                  </tr>
                ))}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                      No audit log records match the search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
