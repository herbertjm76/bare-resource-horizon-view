
import React, { useState, useEffect, useRef } from "react";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  country: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

// Major cities by country - you can expand this list as needed
const CITIES_BY_COUNTRY: Record<string, string[]> = {
  "United States": [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
    "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
    "San Francisco", "Seattle", "Denver", "Washington", "Boston", "Las Vegas",
    "Portland", "Miami", "Atlanta", "Minneapolis"
  ],
  "United Kingdom": [
    "London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Bristol",
    "Sheffield", "Leeds", "Edinburgh", "Leicester", "Coventry", "Bradford",
    "Cardiff", "Belfast", "Nottingham", "Hull", "Newcastle", "Stoke-on-Trent"
  ],
  "Canada": [
    "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa",
    "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria",
    "Halifax", "Oshawa", "Windsor", "Saskatoon", "Regina", "Sherbrooke"
  ],
  "Australia": [
    "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast",
    "Newcastle", "Canberra", "Sunshine Coast", "Wollongong", "Geelong",
    "Hobart", "Townsville", "Cairns", "Darwin", "Toowoomba"
  ],
  "Germany": [
    "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart",
    "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden",
    "Hanover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld"
  ],
  "France": [
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg",
    "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Saint-Étienne",
    "Le Havre", "Toulon", "Grenoble", "Dijon", "Angers"
  ],
  "Netherlands": [
    "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg",
    "Groningen", "Almere", "Breda", "Nijmegen", "Enschede", "Haarlem",
    "Arnhem", "Zaanstad", "Amersfoort", "Apeldoorn"
  ],
  "Singapore": ["Singapore"],
  "India": [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
    "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur",
    "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad"
  ],
  "China": [
    "Shanghai", "Beijing", "Shenzhen", "Guangzhou", "Chengdu", "Tianjin",
    "Nanjing", "Wuhan", "Xi'an", "Hangzhou", "Qingdao", "Zhengzhou",
    "Jinan", "Harbin", "Kunming", "Dalian", "Taiyuan", "Changchun"
  ],
  "Japan": [
    "Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka",
    "Kobe", "Kawasaki", "Kyoto", "Saitama", "Hiroshima", "Sendai",
    "Kitakyushu", "Chiba", "Sakai", "Niigata", "Hamamatsu", "Kumamoto"
  ],
  "Brazil": [
    "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza",
    "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Goiânia",
    "Belém", "Porto Alegre", "Guarulhos", "Campinas", "São Luís", "São Gonçalo"
  ]
};

export const CitySelect: React.FC<CitySelectProps> = ({
  value,
  onChange,
  country,
  disabled,
  placeholder,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get suggested cities for the selected country
  const suggestedCities = country ? CITIES_BY_COUNTRY[country] || [] : [];

  // Filter cities based on search term
  let displayedCities: string[];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    displayedCities = suggestedCities.filter(city =>
      city.toLowerCase().includes(term)
    );
  } else {
    displayedCities = suggestedCities;
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleCitySelect = (city: string) => {
    onChange(city);
    setOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm && !displayedCities.includes(searchTerm)) {
      // Allow custom city entry
      onChange(searchTerm);
      setOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          !country && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={() => !disabled && country && setOpen(!open)}
        disabled={disabled || !country}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || (placeholder || "Select city")}
        </span>
        <svg className="h-4 w-4 ml-2 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      
      {!country && (
        <div className="text-xs text-muted-foreground mt-1">
          Please select a country first
        </div>
      )}

      {open && country && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-muted rounded-md shadow-xl">
          <Command>
            <CommandInput 
              placeholder="Search or enter city name..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
              onKeyDown={handleKeyDown}
            />
            <CommandList className="max-h-64 overflow-auto">
              {displayedCities.length > 0 ? (
                displayedCities.map((city) => (
                  <CommandItem
                    key={city}
                    value={city}
                    className="cursor-pointer"
                    onSelect={() => handleCitySelect(city)}
                  >
                    <span>{city}</span>
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>
                  {searchTerm ? (
                    <div className="p-2">
                      <div className="text-sm text-muted-foreground mb-2">
                        No cities found. Press Enter to add "{searchTerm}"
                      </div>
                      <button
                        className="text-sm text-primary hover:underline"
                        onClick={() => handleCitySelect(searchTerm)}
                      >
                        Add "{searchTerm}"
                      </button>
                    </div>
                  ) : (
                    "No cities available"
                  )}
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default CitySelect;
