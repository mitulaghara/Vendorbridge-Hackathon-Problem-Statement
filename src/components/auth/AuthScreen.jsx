// src/components/auth/AuthScreen.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Full authentication screen component.
 * Renders login, signup, and forgot-password flows.
 */
export default function AuthScreen({
  authFlow,
  setAuthFlow,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  signupForm,
  setSignupForm,
  forgotEmail,
  setForgotEmail,
  authError,
  setAuthError,
  onLogin,
  onSignup,
  onForgot
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
      padding: '1.5rem'
    }}>
      <div className="card animate-fade" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Brand Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.6rem',
            fontWeight: 'bold',
            margin: '0 auto 0.75rem auto',
            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.5)'
          }}>VB</div>
          <h2 className="title-gradient" style={{ fontSize: '1.8rem', fontWeight: 800 }}>VendorBridge</h2>
          <p className="text-secondary-color" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Enterprise Procurement &amp; Vendor Management ERP
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} />
            <span>{authError}</span>
          </div>
        )}

        {/* ── LOGIN FORM ── */}
        {authFlow === 'login' && (
          <form onSubmit={onLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Secure Email Address</label>
              <input
                type="email"
                className="input-control"
                placeholder="e.g. officer@vendorbridge.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Access Password</label>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer' }}
                  onClick={() => setAuthFlow('forgot')}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                className="input-control"
                placeholder="••••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
              Authenticate Credentials
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { setAuthFlow('signup'); setAuthError(''); }}
              >
                Create Account
              </button>
            </div>

            {/* Sandbox Credentials Helper */}
            <div style={{
              background: 'var(--bg-dark)',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              marginTop: '0.5rem'
            }}>
              <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>🔑 Sandbox Credentials for Testing:</p>
              <p style={{ color: 'var(--text-muted)' }}>Officer: <code>officer@vendorbridge.com</code> / <code>officer123</code></p>
              <p style={{ color: 'var(--text-muted)' }}>Manager: <code>manager@vendorbridge.com</code> / <code>manager123</code></p>
              <p style={{ color: 'var(--text-muted)' }}>Vendor 1: <code>vendor1@vendorbridge.com</code> / <code>vendor123</code></p>
            </div>
          </form>
        )}

        {/* ── SIGNUP FORM ── */}
        {authFlow === 'signup' && (
          <form onSubmit={onSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Operator Name *</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Vikramaditya Sen"
                value={signupForm.name}
                onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Secure Email *</label>
                <input
                  type="email"
                  className="input-control"
                  placeholder="name@domain.com"
                  value={signupForm.email}
                  onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="input-control"
                  placeholder="••••••••"
                  value={signupForm.password}
                  onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Organization Role</label>
              <select
                className="input-control"
                value={signupForm.role}
                onChange={e => setSignupForm({ ...signupForm, role: e.target.value })}
              >
                <option value="Vendor">Vendor (Outside Supplier)</option>
                <option value="Procurement Officer">Procurement Officer</option>
                <option value="Manager / Approver">Manager / Approver</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            {signupForm.role === 'Vendor' && (
              <div className="animate-fade" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'var(--bg-dark)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <p style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--primary)' }}>Corporate Profile Details</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Company Name *"
                    value={signupForm.company}
                    onChange={e => setSignupForm({ ...signupForm, company: e.target.value })}
                    required
                  />
                  <select
                    className="input-control"
                    value={signupForm.category}
                    onChange={e => setSignupForm({ ...signupForm, category: e.target.value })}
                  >
                    <option value="IT & Hardware">IT &amp; Hardware</option>
                    <option value="Services">Services</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Construction">Construction</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="GSTIN (15 chars) *"
                    maxLength={15}
                    value={signupForm.gst}
                    onChange={e => setSignupForm({ ...signupForm, gst: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Phone Number *"
                    value={signupForm.phone}
                    onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })}
                    required
                  />
                </div>

                <input
                  type="text"
                  className="input-control"
                  placeholder="Corporate Address *"
                  value={signupForm.address}
                  onChange={e => setSignupForm({ ...signupForm, address: e.target.value })}
                  required
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}>
              Register Profile Account
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
              Already registered?{' '}
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { setAuthFlow('login'); setAuthError(''); }}
              >
                Log In
              </button>
            </div>
          </form>
        )}

        {/* ── FORGOT PASSWORD FORM ── */}
        {authFlow === 'forgot' && (
          <form onSubmit={onForgot} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', textAlign: 'center' }}>
              Enter your registered operator email. The system will dispatch a security token to reset your password.
            </p>

            <div className="form-group">
              <label className="form-label">Operator Email</label>
              <input
                type="email"
                className="input-control"
                placeholder="e.g. officer@vendorbridge.com"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
              Dispatch Reset Token
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1rem' }}>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setAuthFlow('login')}
              >
                Back to Log In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
