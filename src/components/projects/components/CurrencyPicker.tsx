import React from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const currencies = [
  // Major currencies from Americas
  { symbol: "$", code: "USD", name: "US Dollar" },
  { symbol: "C$", code: "CAD", name: "Canadian Dollar" },
  { symbol: "R$", code: "BRL", name: "Brazilian Real" },
  // European currencies
  { symbol: "€", code: "EUR", name: "Euro" },
  { symbol: "£", code: "GBP", name: "British Pound" },
  { symbol: "CHF", code: "CHF", name: "Swiss Franc" },
  // Asian currencies
  { symbol: "¥", code: "JPY", name: "Japanese Yen" },
  { symbol: "₹", code: "INR", name: "Indian Rupee" },
  { symbol: "元", code: "CNY", name: "Chinese Yuan" },
  { symbol: "₩", code: "KRW", name: "South Korean Won" },
  // Other major currencies
  { symbol: "A$", code: "AUD", name: "Australian Dollar" },
  { symbol: "NZ$", code: "NZD", name: "New Zealand Dollar" },
  { symbol: "S$", code: "SGD", name: "Singapore Dollar" },
  // Additional currencies
  { symbol: "₱", code: "PHP", name: "Philippine Peso" },
  { symbol: "฿", code: "THB", name: "Thai Baht" },
  { symbol: "₫", code: "VND", name: "Vietnamese Dong" },
];

interface CurrencyPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const CurrencyPicker = ({ value, onValueChange }: CurrencyPickerProps) => {
  const selectedCurrency = currencies.find(c => c.code === value) || currencies[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <span>{selectedCurrency.symbol} ({selectedCurrency.code})</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.code}
                  value={currency.code}
                  onSelect={() => onValueChange(currency.code)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === currency.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {currency.symbol} ({currency.code}) - {currency.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
