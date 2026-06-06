// src/components/layout/TopBar.jsx
import React from 'react';
import { Bell, Lock, LogOut } from 'lucide-react';

/**
 * Top navigation bar component.
 * Handles role switcher, notifications panel, profile display, and logout.
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
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 900
    }}>
      {/* Left: Sandbox Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <Lock size={14} /> Sandbox Role Switcher:
        </span>
        <select
          className="input-control"
          style={{
            width: '280px',
            padding: '0.4rem 1rem',
            background: 'var(--bg-card)',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
          value={currentUser.email}
          onChange={onRoleChange}
        >
          {users.map(u => (
            <option key={u.email} value={u.email}>
              {u.name} ({u.role}{u.company ? ` - ${u.company}` : ''})
            </option>
          ))}
        </select>
      </div>

      {/* Right: Notifications + Profile + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>

        {/* Notification Hub */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            style={{ position: 'relative' }}
            onClick={onToggleNotifications}
          >
            <Bell size={18} />
            {hasUnread && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--danger)',
                boxShadow: '0 0 0 2px var(--bg-card)'
              }} />
            )}
          </button>

          {showNotifications && (
            <div className="card animate-fade" style={{
              position: 'absolute',
              right: 0,
              top: '40px',
              width: '320px',
              background: 'var(--bg-card)',
              zIndex: 1000,
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-xl)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.5rem'
              }}>
                <strong style={{ fontSize: '0.85rem' }}>System Alerts Center</strong>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                  onClick={onMarkAllRead}
                >
                  Clear All
                </button>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {notifications.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    padding: '1rem 0'
                  }}>
                    No system notifications.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      style={{
                        fontSize: '0.8rem',
                        color: n.read ? 'var(--text-muted)' : 'var(--text-primary)',
                        padding: '0.25rem 0'
                      }}
                    >
                      • {n.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>{currentUser.avatar}</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentUser.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser.role}</span>
          </div>
        </div>

        <div style={{ height: '24px', borderLeft: '1px solid var(--border-color)' }} />

        {/* Logout */}
        <button
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }}
          onClick={onLogout}
        >
          <LogOut size={14} /> Exit System
        </button>
      </div>
    </header>
  );
}
