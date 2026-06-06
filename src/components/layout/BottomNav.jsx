// src/components/layout/BottomNav.jsx
import React from 'react';
import { NAV_ITEMS } from '../../constants/navigation';

/**
 * Mobile-only bottom navigation bar — mimics native app tab bar.
 * Hidden on desktop via CSS (.bottom-nav class).
 */
export default function BottomNav({ currentUser, activeScreen, onNavigate }) {
  const visibleItems = NAV_ITEMS.filter(item =>
    item.roles.includes('all') || item.roles.includes(currentUser.role)
  );

  return (
    <nav className="bottom-nav no-print">
      <div className="bottom-nav-inner">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = activeScreen === item.screen;
          // Shorten long labels for mobile
          const shortLabel = item.label
            .replace('System Audit Logs', 'Audit')
            .replace('Vendor Directory', 'Vendors')
            .replace('Spend Analytics', 'Analytics')
            .replace('Review Approvals', 'Approvals')
            .replace('Compare Bids', 'Compare')
            .replace('Submit Bids', 'Bids')
            .replace('PO & Invoices', 'PO/Invoice')
            .replace('Create RFQ', 'RFQ');

          return (
            <button
              key={item.screen}
              className={`bottom-nav-btn ${isActive ? 'bottom-nav-btn--active' : ''}`}
              onClick={() => onNavigate(item.screen)}
            >
              {isActive && <span className="bottom-nav-pill" />}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className="bottom-nav-icon"
              />
              <span className="bottom-nav-label">{shortLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
