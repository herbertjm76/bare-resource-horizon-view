
import React, { useMemo } from 'react';
import { DateDisplayProps } from './types';
import { createFormatOptions } from './constants';
import { useFormatSelection } from './hooks/useFormatSelection';
import { useDateDisplay } from './hooks/useDateDisplay';
import { DateContent } from './components/DateContent';
import { FormatDropdown } from './components/FormatDropdown';

export const DateDisplay: React.FC<DateDisplayProps> = ({
  className,
  showIcon = true,
  showTimezone = false,
  allowFormatSelection = true,
  defaultFormat = 'short'
}) => {
  const { selectedFormat, setSelectedFormat } = useFormatSelection(defaultFormat);
  const { timezone, formattedDate } = useDateDisplay(selectedFormat);

  // Format options with examples
  const formatOptions = useMemo(() => createFormatOptions(), []);

  const dateContent = (
    <DateContent
      formattedDate={formattedDate}
      timezone={timezone}
      selectedFormat={selectedFormat}
      showIcon={showIcon}
      showTimezone={showTimezone}
      className={className}
    />
  );

  if (!allowFormatSelection) {
    return dateContent;
  }

  return (
    <FormatDropdown
      selectedFormat={selectedFormat}
      setSelectedFormat={setSelectedFormat}
      formatOptions={formatOptions}
      timezone={timezone}
    >
      {dateContent}
    </FormatDropdown>
  );
};
