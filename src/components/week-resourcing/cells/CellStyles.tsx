
import React, { useEffect } from 'react';

const mobileStyles = `
<style>
  .mobile-name-cell {
    min-width: 90px;
    max-width: 150px;
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
  
  @media (max-width: 768px) {
    .mobile-name-cell {
      min-width: 80px;
      max-width: 120px;
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
