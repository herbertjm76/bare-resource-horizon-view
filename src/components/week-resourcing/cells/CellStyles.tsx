
import React, { useEffect } from 'react';

const mobileStyles = `
<style>
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
      styleElement.innerHTML = mobileStyles;
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
