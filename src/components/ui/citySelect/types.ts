
export interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  country: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export interface CitySelectDropdownProps {
  open: boolean;
  onClose: () => void;
  country: string;
  onCitySelect: (city: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export interface CitySelectButtonProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  country: string;
  className?: string;
  onClick: () => void;
}

export interface CitySelectListProps {
  cities: string[];
  onCitySelect: (city: string) => void;
  searchTerm: string;
}
