
import React, { useEffect } from 'react';

const mobileStyles = `
<style>
  .mobile-name-cell {
    min-width: 90px;
    max-width: 150px;
    position: sticky;
    left: 0;
    z-index: 15;
    background: white !important;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  }
  
  .mobile-count-cell,
  .mobile-leave-cell,
  .mobile-office-cell,
  .mobile-project-cell {
    min-width: 24px;
    max-width: 32px;
    padding: 2px 1px;
  }
  
  .mobile-capacity-cell {
    min-width: 60px;
    max-width: 80px;
  }
  
  /* Ensure sticky name cell stays on top during hover states */
  .mobile-name-cell:hover {
    background: #f8fafc !important;
    z-index: 16;
  }
  
  /* Make sure table row hover doesn't override name cell background */
  tr:hover .mobile-name-cell {
    background: #f8fafc !important;
  }
  
  @media (max-width: 768px) {
    .mobile-name-cell {
      min-width: 80px;
      max-width: 120px;
      position: sticky;
      left: 0;
      z-index: 15;
      background: white !important;
      box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
    }
    
    .mobile-count-cell,
    .mobile-leave-cell,
    .mobile-office-cell,
    .mobile-project-cell {
      min-width: 20px;
      max-width: 28px;
      padding: 1px;
    }
    
    .mobile-capacity-cell {
      min-width: 50px;
      max-width: 70px;
    }
  }
  
  @media (max-width: 480px) {
    .mobile-name-cell {
      min-width: 70px;
      max-width: 100px;
      position: sticky;
      left: 0;
      z-index: 15;
      background: white !important;
      box-shadow: 1px 0 2px rgba(0, 0, 0, 0.1);
    }
    
    .mobile-count-cell,
    .mobile-leave-cell,
    .mobile-office-cell,
    .mobile-project-cell {
      min-width: 18px;
      max-width: 24px;
      padding: 1px;
    }
    
    .mobile-capacity-cell {
      min-width: 45px;
      max-width: 60px;
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
