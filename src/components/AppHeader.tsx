
import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppHeaderProps {
  onMenuToggle?: () => void;
  sidebarCollapsed?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  onMenuToggle, 
  sidebarCollapsed = false 
}) => {
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 right-0 left-0 z-40 h-16 bg-white border-b border-gray-200">
      <div className="h-full flex items-center justify-between px-4">
        {/* Left side - Menu button for mobile */}
        <div className="flex items-center">
          {isMobile && onMenuToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {/* Desktop: Show company name or breadcrumb */}
          {!isMobile && (
            <div className="text-sm font-medium text-gray-900">
              Dashboard
            </div>
          )}
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
