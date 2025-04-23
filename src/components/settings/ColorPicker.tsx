
import React from 'react';
import { Check } from 'lucide-react';
import { projectAreaColors } from './utils/colorUtils';

// Export for direct access if needed
export const colorPalette = projectAreaColors;

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
