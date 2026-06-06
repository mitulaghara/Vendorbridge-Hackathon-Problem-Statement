// src/components/layout/Sidebar.jsx
import React from 'react';
import { NAV_ITEMS } from '../../constants/navigation';

const sidebarBtnStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  width: '100%',
  padding: '0.75rem 1rem',
  background: isActive ? 'var(--primary)' : 'transparent',
  color: isActive ? 'white' : 'var(--text-secondary)',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  fontSize: '0.875rem',
  textAlign: 'left',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  borderLeft: isActive ? '4px solid white' : '4px solid transparent'
});

/**
 * Sidebar navigation component.
 * Renders role-filtered nav items and the brand logo.
 */
export default function Sidebar({ currentUser, activeScreen, onNavigate, onResetDB }) {
  const visibleItems = NAV_ITEMS.filter(item =>
    item.roles.includes('all') || item.roles.includes(currentUser.role)
  );

  return (
    <aside className="no-print" style={{
      width: '260px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}>VB</div>
        <div>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800 }}>VendorBridge</h2>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Procurement ERP
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{
        padding: '1.25rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        flexGrow: 1,
        overflowY: 'auto'
      }}>
        {visibleItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.screen}
              style={sidebarBtnStyle(activeScreen === item.screen)}
              onClick={() => onNavigate(item.screen)}
            >
              <Icon size={18} /> {item.label}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(0,0,0,0.1)'
      }}>
        <button
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px dashed var(--border-color)',
            color: 'var(--text-muted)',
            padding: '0.5rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
          onClick={onResetDB}
        >
          Reset Database Sandbox
        </button>
      </div>
    </aside>
  );
}
