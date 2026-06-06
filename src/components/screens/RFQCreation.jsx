// src/components/RFQCreation.jsx
import React, { useState } from 'react';
import { Plus, Trash2, Calendar, FilePlus, CheckCircle } from 'lucide-react';

export default function RFQCreation({ currentUser, vendors, onCreateRFQ }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IT & Hardware');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  
  // Line items state
  const [items, setItems] = useState([
    { id: 1, name: '', description: '', quantity: 1, targetPrice: '' }
  ]);

  // Vendor assignment state
  const [assignedVendors, setAssignedVendors] = useState([]);
  const [attachmentName, setAttachmentName] = useState('');
  const [errors, setErrors] = useState({});

  const categories = ['IT & Hardware', 'Services', 'Logistics', 'Office Supplies', 'Construction'];

  // Filter vendors based on active category to suggest matching vendors
  const categoryVendors = vendors.filter(v => v.category === category && v.status === 'Active');

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: '', description: '', quantity: 1, targetPrice: '' }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItems(updated);
  };

  const handleVendorToggle = (vendorId) => {
    if (assignedVendors.includes(vendorId)) {
      setAssignedVendors(assignedVendors.filter(id => id !== vendorId));
    } else {
      setAssignedVendors([...assignedVendors, vendorId]);
    }
  };

  const handleSelectAllVendors = () => {
    if (assignedVendors.length === categoryVendors.length) {
      setAssignedVendors([]);
    } else {
      setAssignedVendors(categoryVendors.map(v => v.id));
    }
  };

  const validate = () => {
    const errs = {};
    if (!title) errs.title = 'RFQ Title is required';
    if (!description) errs.description = 'General description is required';
    if (!deadline) {
      errs.deadline = 'Deadline date is required';
    } else if (new Date(deadline) < new Date()) {
      errs.deadline = 'Deadline must be a future date';
    }
    
    // Validate items
    const itemErrors = [];
    items.forEach((item, index) => {
      if (!item.name) {
        errs[`item_${index}_name`] = 'Item name is required';
      }
      if (!item.quantity || item.quantity <= 0) {
        errs[`item_${index}_quantity`] = 'Must be greater than 0';
      }
      if (!item.targetPrice || item.targetPrice <= 0) {
        errs[`item_${index}_price`] = 'Must be greater than 0';
      }
    });

    if (assignedVendors.length === 0) {
      errs.vendors = 'Select at least one vendor to receive this RFQ';
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to top or show alert
      return;
    }

    const rfqId = `RFQ-2026-000${Math.floor(Math.random() * 900) + 100}`;
    const attachments = attachmentName ? [{ name: attachmentName, size: '2.4 MB' }] : [];

    onCreateRFQ({
      id: rfqId,
      title,
      category,
      createdDate: new Date().toISOString().split('T')[0],
      deadline,
      description,
      items: items.map((it, idx) => ({ ...it, id: idx + 1 })),
      assignedVendors,
      status: 'Sent to Vendors',
      creator: currentUser.name,
      attachments
    });

    // Reset Form State
    setTitle('');
    setDescription('');
    setDeadline('');
    setItems([{ id: 1, name: '', description: '', quantity: 1, targetPrice: '' }]);
    setAssignedVendors([]);
    setAttachmentName('');
    setErrors({});
  };

  return (
    <div className="animate-fade">
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Create Request for Quotation (RFQ)
        </h1>
        <p className="text-secondary-color">
          Initiate new procurement request, specify materials/services required, set a response timeline, and invite registered vendors.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Side: General Info & Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Overview */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              RFQ Details
            </h3>

            <div className="form-group">
              <label className="form-label">RFQ Project Title *</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Purchase of High-Performance Laptops for Developers"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({...errors, title: ''});
                }}
              />
              {errors.title && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.title}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Procurement Category</label>
                <select
                  className="input-control"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setAssignedVendors([]); // Reset selections on category switch
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Submission Deadline *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    className="input-control"
                    value={deadline}
                    onChange={(e) => {
                      setDeadline(e.target.value);
                      if (errors.deadline) setErrors({...errors, deadline: ''});
                    }}
                  />
                </div>
                {errors.deadline && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.deadline}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Scope / Description *</label>
              <textarea
                className="input-control"
                style={{ minHeight: '100px', resize: 'vertical' }}
                placeholder="Describe project deliverables, quality expectations, terms, and conditions..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({...errors, description: ''});
                }}
              />
              {errors.description && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.description}</p>}
            </div>
          </div>

          {/* Section 2: Items Table */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Products / Services Requirement Table</h3>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                onClick={handleAddItem}
              >
                <Plus size={14} /> Add Line Item
              </button>
            </div>

            <div className="table-container" style={{ border: 'none' }}>
              <table className="custom-table" style={{ border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Item / Service Name *</th>
                    <th style={{ width: '20%' }}>Quantity *</th>
                    <th style={{ width: '25%' }}>Est. Unit Target Price (₹) *</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="text"
                          className="input-control"
                          placeholder="e.g. Lenovo ThinkPad T14"
                          style={{ padding: '0.5rem' }}
                          value={item.name}
                          onChange={(e) => {
                            handleItemChange(item.id, 'name', e.target.value);
                            if (errors[`item_${index}_name`]) setErrors({...errors, [`item_${index}_name`]: ''});
                          }}
                        />
                        {errors[`item_${index}_name`] && <p style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{errors[`item_${index}_name`]}</p>}
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="input-control"
                          style={{ padding: '0.5rem' }}
                          value={item.quantity}
                          onChange={(e) => {
                            handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0);
                            if (errors[`item_${index}_quantity`]) setErrors({...errors, [`item_${index}_quantity`]: ''});
                          }}
                        />
                        {errors[`item_${index}_quantity`] && <p style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{errors[`item_${index}_quantity`]}</p>}
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="input-control"
                          placeholder="e.g. 95000"
                          style={{ padding: '0.5rem' }}
                          value={item.targetPrice}
                          onChange={(e) => {
                            handleItemChange(item.id, 'targetPrice', parseFloat(e.target.value) || 0);
                            if (errors[`item_${index}_price`]) setErrors({...errors, [`item_${index}_price`]: ''});
                          }}
                        />
                        {errors[`item_${index}_price`] && <p style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{errors[`item_${index}_price`]}</p>}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ color: 'var(--danger)' }}
                          disabled={items.length === 1}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Attachments & Vendor Assignments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* File Attachments */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Reference Files
            </h3>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Upload Technical Specification (Simulated)</label>
              <div style={{
                border: '2px dashed var(--border-color)',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-dark)',
                transition: 'border-color 0.2s',
              }}
              onClick={() => {
                const name = prompt("Enter simulated filename to attach (e.g. specs_v2.pdf):");
                if (name) setAttachmentName(name);
              }}>
                <FilePlus size={32} className="text-secondary-color" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {attachmentName ? `Attached: ${attachmentName}` : "Click to attach mock PDF spec sheets"}
                </span>
              </div>
            </div>
          </div>

          {/* Vendor Assignment */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Invite Vendors</h3>
              {categoryVendors.length > 0 && (
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={handleSelectAllVendors}
                >
                  {assignedVendors.length === categoryVendors.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Showing verified active vendors in category: <strong>{category}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {categoryVendors.map(v => (
                <label key={v.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--bg-dark)',
                  border: `1px solid ${assignedVendors.includes(v.id) ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}>
                  <input
                    type="checkbox"
                    checked={assignedVendors.includes(v.id)}
                    onChange={() => handleVendorToggle(v.id)}
                    style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: 600 }}>{v.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating: {v.rating} ★ | Orders: {v.ordersCompleted}</div>
                  </div>
                </label>
              ))}

              {categoryVendors.length === 0 && (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No active vendors found in "{category}" category. Add a vendor first!
                </div>
              )}
            </div>
            
            {errors.vendors && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.vendors}</p>}

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ marginTop: '1rem', width: '100%', gap: '0.5rem' }}
              disabled={categoryVendors.length === 0}
            >
              <CheckCircle size={16} /> Broadcast RFQ
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
