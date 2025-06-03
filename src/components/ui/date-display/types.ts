
export type DateFormat = 'short' | 'long' | 'numeric' | 'relative' | 'time';

export interface DateFormatOption {
  key: DateFormat;
  label: string;
  example: string;
}

export interface DateDisplayProps {
  className?: string;
  showIcon?: boolean;
  showTimezone?: boolean;
  allowFormatSelection?: boolean;
  defaultFormat?: DateFormat;
}
