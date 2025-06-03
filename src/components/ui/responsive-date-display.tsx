
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ResponsiveDateDisplay: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userLocale, setUserLocale] = useState<string>('en-US');
  const [userTimezone, setUserTimezone] = useState<string>('UTC');

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Detect user's locale and timezone
  useEffect(() => {
    try {
      // Get user's locale from browser
      const detectedLocale = navigator.language || 'en-US';
      setUserLocale(detectedLocale);

      // Get user's timezone
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(detectedTimezone);
    } catch (error) {
      console.warn('Could not detect user locale/timezone:', error);
      // Fallback to defaults
      setUserLocale('en-US');
      setUserTimezone('UTC');
    }
  }, []);

  // Format date in long format based on user's locale
  const formatLongDate = (date: Date, locale: string): string => {
    try {
      return date.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: userTimezone
      });
    } catch (error) {
      // Fallback to English if locale is not supported
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: userTimezone
      });
    }
  };

  // Format shorter date for mobile
  const formatShortDate = (date: Date, locale: string): string => {
    try {
      return date.toLocaleDateString(locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: userTimezone
      });
    } catch (error) {
      // Fallback to English if locale is not supported
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: userTimezone
      });
    }
  };

  const longDate = formatLongDate(currentDate, userLocale);
  const shortDate = formatShortDate(currentDate, userLocale);

  return (
    <div className="flex items-center gap-2 text-gray-600 min-w-0">
      <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
      <div className="min-w-0">
        {/* Desktop: Full long date */}
        <span className="hidden lg:inline text-sm font-medium truncate">
          {longDate}
        </span>
        
        {/* Tablet: Medium date without year */}
        <span className="hidden md:inline lg:hidden text-sm font-medium truncate">
          {currentDate.toLocaleDateString(userLocale, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            timeZone: userTimezone
          })}
        </span>
        
        {/* Mobile: Short date */}
        <span className="md:hidden text-sm font-medium truncate">
          {shortDate}
        </span>
      </div>
    </div>
  );
};
