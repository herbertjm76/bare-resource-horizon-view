
import React from 'react';
import { Check } from 'lucide-react';

// Color palette from the provided image
export const colorPalette = [
  // Row 1
  '#F5A3B3', '#F48F8F', '#F47E63', '#F4A363', '#F4C463',
  // Row 2
  '#A8E6A8', '#89CFF0', '#6B8FF9', '#9B87F5', '#FFE082',
  // Row 3
  '#89E6CF', '#7ECFD6', '#FFF3D4', '#D2C0A7', '#FFE566'
];

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-5 gap-2 p-2 ${className}`}>
      {colorPalette.map((color) => (
        <button
          key={color}
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
        >
          {selectedColor === color && (
            <Check className="h-4 w-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />
          )}
        </button>
      ))}
    </div>
  );
};
