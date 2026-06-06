// src/components/VendorManagement.jsx
import React, { useState } from 'react';
import { Search, Plus, Filter, Mail, Phone, MapPin, Award, Star, X } from 'lucide-react';

export default function VendorManagement({ currentUser, vendors, onAddVendor, onUpdateVendorStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);

  // New Vendor Form State
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    category: 'IT & Hardware',
    gst: '',
    phone: '',
    address: '',
    rating: 5.0,
    status: 'Active'
  });

  const [formErrors, setFormErrors] = useState({});

  const categories = ['All', 'IT & Hardware', 'Services', 'Logistics', 'Office Supplies', 'Construction'];
  const statuses = ['All', 'Active', 'Pending Verification', 'Suspended'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVendor({ ...newVendor, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newVendor.name) errors.name = 'Company Name is required';
    if (!newVendor.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newVendor.email)) {
      errors.email = 'Email is invalid';
    }
    if (!newVendor.gst) {
      errors.gst = 'GST details are required';
    } else if (newVendor.gst.length !== 15) {
      errors.gst = 'GST Number must be 15 characters';
    }
    if (!newVendor.phone) errors.phone = 'Phone number is required';
    if (!newVendor.address) errors.address = 'Address is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onAddVendor({
      ...newVendor,
      id: `v-${Date.now()}`,
      ordersCompleted: 0,
      successRate: 100,
      onTimeDelivery: 100
    });

    // Reset Form
    setNewVendor({
      name: '',
      email: '',
      category: 'IT & Hardware',
      gst: '',
      phone: '',
      address: '',
      rating: 5.0,
      status: 'Active'
    });
    setFormErrors({});
    setShowModal(false);
  };

  // Filter vendors
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.gst.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || v.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} size={14} fill="currentColor" />);
      } else if (i - rating < 1) {
        stars.push(<Star key={i} size={14} fill="none" stroke="currentColor" style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<Star key={i} size={14} fill="none" stroke="currentColor" style={{ opacity: 0.2 }} />);
      }
    }
    return <span className="rating-stars">{stars}</span>;
  };

  return (
    <div className="animate-fade">
      {/* Title & Register Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            Vendor Directory
          </h1>
          <p className="text-secondary-color">
            Manage organization vendor list, review GST numbers, verified roles, and performance benchmarks.
          </p>
        </div>
        {/* Only Officer, Admin can register vendor */}
        {(currentUser.role === 'Admin' || currentUser.role === 'Procurement Officer') && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Register New Vendor
          </button>
        )}
      </div>

      {/* Filter and Search Bar Section */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ flexGrow: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              className="input-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search vendor by name, email, or GST ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              <Filter size={14} style={{ display: 'inline', marginRight: '4px' }} /> Status:
            </span>
            <select
              className="input-control"
              style={{ width: '180px', padding: '0.5rem 1rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
          {categories.map(cat => (
            <button
              key={cat}
              style={{
                background: categoryFilter === cat ? 'var(--primary)' : 'transparent',
                color: categoryFilter === cat ? 'white' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredVendors.map(vendor => (
          <div key={vendor.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  background: 'var(--primary-light)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  {vendor.category}
                </span>
                <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>{vendor.name}</h3>
              </div>
              <span className={`badge badge-${
                vendor.status === 'Active' ? 'approved' :
                vendor.status === 'Pending Verification' ? 'pending' : 'rejected'
              }`}>
                {vendor.status}
              </span>
            </div>

            {/* Performance Stats */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-dark)',
              padding: '0.75rem',
              borderRadius: '8px',
              justifyContent: 'space-around',
              textAlign: 'center'
            }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{vendor.rating}</span>
                  <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-color)' }}></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Orders</p>
                <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginTop: '0.15rem' }}>{vendor.ordersCompleted}</p>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-color)' }}></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Success</p>
                <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--success)', marginTop: '0.15rem' }}>{vendor.successRate}%</p>
              </div>
            </div>

            {/* Contact details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={12} /> <span>{vendor.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={12} /> <span>{vendor.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={12} style={{ marginTop: '0.15rem' }} /> <span>{vendor.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                <Award size={12} /> <span>GST: <strong>{vendor.gst}</strong></span>
              </div>
            </div>

            {/* Action Buttons (Admin/Officer role only) */}
            {(currentUser.role === 'Admin' || currentUser.role === 'Procurement Officer') && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                {vendor.status === 'Pending Verification' && (
                  <button 
                    className="btn btn-success" 
                    style={{ flexGrow: 1, padding: '0.4rem' }}
                    onClick={() => onUpdateVendorStatus(vendor.id, 'Active')}
                  >
                    Verify & Active
                  </button>
                )}
                {vendor.status === 'Active' && (
                  <button 
                    className="btn btn-danger" 
                    style={{ flexGrow: 1, padding: '0.4rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}
                    onClick={() => onUpdateVendorStatus(vendor.id, 'Suspended')}
                  >
                    Suspend Vendor
                  </button>
                )}
                {vendor.status === 'Suspended' && (
                  <button 
                    className="btn btn-success" 
                    style={{ flexGrow: 1, padding: '0.4rem' }}
                    onClick={() => onUpdateVendorStatus(vendor.id, 'Active')}
                  >
                    Reactivate
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredVendors.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No vendors match the search or filters.
          </div>
        )}
      </div>

      {/* Registration Modal Overlay */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Register New Vendor Profile</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="input-control"
                    placeholder="e.g. Paramount Tech Solutions"
                    value={newVendor.name}
                    onChange={handleInputChange}
                  />
                  {formErrors.name && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.name}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Vendor Category *</label>
                  <select
                    name="category"
                    className="input-control"
                    value={newVendor.category}
                    onChange={handleInputChange}
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Email *</label>
                  <input
                    type="email"
                    name="email"
                    className="input-control"
                    placeholder="vendor@company.com"
                    value={newVendor.email}
                    onChange={handleInputChange}
                  />
                  {formErrors.email && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.email}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">GST Identification Number (GSTIN) *</label>
                  <input
                    type="text"
                    name="gst"
                    className="input-control"
                    placeholder="15-character GST number (e.g. 27AAAAA1111A1Z1)"
                    maxLength={15}
                    value={newVendor.gst}
                    onChange={handleInputChange}
                  />
                  {formErrors.gst && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.gst}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    className="input-control"
                    placeholder="+91 99999 88888"
                    value={newVendor.phone}
                    onChange={handleInputChange}
                  />
                  {formErrors.phone && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.phone}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Corporate Address *</label>
                  <textarea
                    name="address"
                    className="input-control"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                    placeholder="Enter complete office address details..."
                    value={newVendor.address}
                    onChange={handleInputChange}
                  />
                  {formErrors.address && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.address}</p>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
