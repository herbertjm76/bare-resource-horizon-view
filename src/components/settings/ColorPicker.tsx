
import React from 'react';
import { Check } from 'lucide-react';

// Combined color palette from both images
export const colorPalette = [
  // Blues and Teals
  '#6B8FF9', '#89A7F8', '#A7C5F9', '#C5E3FA',
  '#A8E6E6', '#89C7C7', '#69A8A8', '#48D9D9',
  // Pinks and Purples
  '#F178B6', '#EE9EC6', '#EBBDD6', '#DBA4DB',
  '#B6A4DB', '#C9BCE8', '#A094C8', '#8E7BAD',
  // Additional Colors from second palette
  '#FFB5BA', '#FF8A80', '#FF7F63', '#FFB74D', '#FFE082',
  '#AED581', '#4FC3F7', '#7986CB', '#9575CD', '#F8BBD0'
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
