// src/components/layout/TopBar.jsx
import React from 'react';
import { Bell, Lock, LogOut } from 'lucide-react';

/**
 * Top navigation bar — adapts between desktop and mobile layouts.
 * On mobile: shows brand + notifications + avatar only.
 * On desktop: additionally shows the role switcher.
 */
export default function TopBar({
  currentUser,
  users,
  notifications,
  showNotifications,
  onRoleChange,
  onToggleNotifications,
  onMarkAllRead,
  onLogout
}) {
  const hasUnread = notifications.some(n => !n.read);

  return (
    <header className="no-print" style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      gap: '0.75rem'
    }}>

      {/* ── Left: Brand (mobile) + Role Switcher (desktop) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>

        {/* Brand logo — visible on mobile only */}
        <div className="mobile-only" style={{ alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
            width: '30px', height: '30px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0
          }}>VB</div>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            VendorBridge
          </span>
        </div>

        {/* Role switcher — visible on desktop only */}
        <div className="topbar-role-switcher desktop-only" style={{ alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontSize: '0.82rem', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap'
          }}>
            <Lock size={13} /> Sandbox Role:
          </span>
          <select
            className="input-control"
            style={{
              width: '270px', padding: '0.4rem 0.9rem',
              background: 'var(--bg-card)', fontSize: '0.82rem', cursor: 'pointer'
            }}
            value={currentUser.email}
            onChange={onRoleChange}
          >
            {users.map(u => (
              <option key={u.email} value={u.email}>
                {u.name} ({u.role}{u.company ? ` — ${u.company}` : ''})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Right: Notifications + Profile + Logout ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            style={{ position: 'relative', padding: '0.5rem' }}
            onClick={onToggleNotifications}
          >
            <Bell size={18} />
            {hasUnread && (
              <span style={{
                position: 'absolute', top: '4px', right: '4px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: 'var(--danger)', boxShadow: '0 0 0 2px var(--bg-card)'
              }} />
            )}
          </button>

          {showNotifications && (
            <div className="card animate-fade" style={{
              position: 'absolute', right: 0, top: '44px',
              width: '300px', background: 'var(--bg-card)',
              zIndex: 1000, padding: '1rem',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
              boxShadow: 'var(--shadow-xl)'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'
              }}>
                <strong style={{ fontSize: '0.85rem' }}>System Alerts</strong>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.72rem', cursor: 'pointer' }}
                  onClick={onMarkAllRead}
                >
                  Clear All
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.75rem 0' }}>
                    No notifications.
                  </div>
                ) : notifications.map(n => (
                  <div key={n.id} style={{
                    fontSize: '0.78rem',
                    color: n.read ? 'var(--text-muted)' : 'var(--text-primary)',
                    padding: '0.2rem 0', lineHeight: 1.4
                  }}>
                    • {n.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.35rem', lineHeight: 1 }}>{currentUser.avatar}</span>
          <div className="topbar-profile-name desktop-only" style={{ flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{currentUser.name}</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{currentUser.role}</span>
          </div>
        </div>

        {/* Divider — desktop only */}
        <div className="desktop-only" style={{ height: '22px', borderLeft: '1px solid var(--border-color)' }} />

        {/* Logout button */}
        <button
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.7rem', fontSize: '0.78rem', gap: '0.25rem' }}
          onClick={onLogout}
        >
          <LogOut size={13} />
          <span className="desktop-only" style={{ display: 'inline' }}>Exit</span>
        </button>
      </div>
    </header>
  );
}
