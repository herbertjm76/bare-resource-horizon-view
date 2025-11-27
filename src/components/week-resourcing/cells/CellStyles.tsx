
import React, { useEffect } from 'react';

const responsiveStyles = `
<style>
  /* Tablet optimizations - 768px to 1024px */
  @media (min-width: 768px) and (max-width: 1024px) {
    .mobile-resource-table tbody tr {
      height: 32px !important;
    }
    
    .mobile-resource-table th,
    .mobile-resource-table td {
      font-size: 11px !important;
      padding: 2px 4px !important;
    }
    
    /* Hide project codes in headers on tablet */
    .mobile-resource-table th[data-project-code] small,
    .mobile-resource-table td[data-project-code] small {
      display: none !important;
    }
    
    /* Compact badges on tablet */
    .mobile-resource-table [class*="badge"],
    .mobile-resource-table [class*="Badge"] {
      padding: 2px 6px !important;
      font-size: 10px !important;
      height: 18px !important;
    }
  }
  
  /* Simple sticky positioning for mobile */
  @media (max-width: 768px) {
    .mobile-resource-table th:first-child,
    .mobile-resource-table td:first-child {
      position: sticky !important;
      left: 0 !important;
      z-index: 10 !important;
      background: white !important;
      box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1) !important;
    }
    
    .mobile-resource-table thead th:first-child {
      background: #6465F0 !important;
      z-index: 11 !important;
    }
    
    /* Prevent text overflow in sticky column */
    .mobile-resource-table th:first-child,
    .mobile-resource-table td:first-child {
      min-width: 100px !important;
      max-width: 120px !important;
    }
    
    /* Compact other cells on mobile */
    .mobile-resource-table th:not(:first-child),
    .mobile-resource-table td:not(:first-child) {
      min-width: 32px !important;
      padding: 4px 2px !important;
      font-size: 12px !important;
    }
  }
  
  @media (max-width: 480px) {
    .mobile-resource-table th:first-child,
    .mobile-resource-table td:first-child {
      min-width: 90px !important;
      max-width: 110px !important;
    }
    
    .mobile-resource-table th:not(:first-child),
    .mobile-resource-table td:not(:first-child) {
      min-width: 28px !important;
      padding: 2px 1px !important;
      font-size: 11px !important;
    }
  }
</style>
`;

export const CellStyles: React.FC = () => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = responsiveStyles;
      document.head.appendChild(styleElement);

      return () => {
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }
      };
    }
  }, []);

  return null;
};
