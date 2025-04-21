
import React from "react";
import { MapPin } from "lucide-react";

interface AddressSuggestionListProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const AddressSuggestionList: React.FC<AddressSuggestionListProps> = ({
  suggestions,
  onSuggestionClick,
}) => (
  <ul className="absolute left-0 right-0 top-full z-50 bg-background shadow-lg border mt-1 rounded-md max-h-48 overflow-auto">
    {suggestions.map((addr, idx) => (
      <li
        key={addr + idx}
        className="cursor-pointer hover:bg-accent px-3 py-2 text-sm flex items-center"
        onClick={() => onSuggestionClick(addr)}
      >
        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
        <span>{addr}</span>
      </li>
    ))}
  </ul>
);

export default AddressSuggestionList;
