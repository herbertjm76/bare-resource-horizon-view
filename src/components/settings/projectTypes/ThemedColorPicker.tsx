import React from 'react';
import { Check } from 'lucide-react';

// Themed color palette with shades
const themedColors = [
  'hsl(var(--primary))',
  'hsl(221, 83%, 53%)',
  'hsl(221, 83%, 63%)',
  'hsl(221, 83%, 73%)',
  'hsl(262, 83%, 58%)',
  'hsl(262, 83%, 68%)',
  'hsl(280, 65%, 60%)',
  'hsl(280, 65%, 70%)',
  'hsl(340, 82%, 52%)',
  'hsl(340, 82%, 62%)',
  'hsl(0, 72%, 51%)',
  'hsl(0, 72%, 61%)',
  'hsl(25, 95%, 53%)',
  'hsl(25, 95%, 63%)',
  'hsl(45, 93%, 47%)',
  'hsl(45, 93%, 57%)',
  'hsl(142, 71%, 45%)',
  'hsl(142, 71%, 55%)',
  'hsl(173, 58%, 39%)',
  'hsl(173, 58%, 49%)',
  'hsl(199, 89%, 48%)',
  'hsl(199, 89%, 58%)',
  'hsl(217, 91%, 60%)',
  'hsl(217, 91%, 70%)',
];

interface ThemedColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export const ThemedColorPicker: React.FC<ThemedColorPickerProps> = ({
  selectedColor,
  onColorChange,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-6 gap-2 p-2 ${className}`}>
      {themedColors.map((color) => (
        <button
          key={color}
          type="button"
          className="w-10 h-10 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform hover:scale-110 border border-border"
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
        >
          {selectedColor === color && (
            <Check className="h-4 w-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
          )}
        </button>
      ))}
    </div>
  );
};