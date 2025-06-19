
import React from "react";
import { cn } from "@/lib/utils";
import { CitySelectButtonProps } from "./types";

export const CitySelectButton: React.FC<CitySelectButtonProps> = ({
  value,
  placeholder,
  disabled,
  country,
  className,
  onClick
}) => {
  return (
    <>
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          !country && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={onClick}
        disabled={disabled || !country}
        aria-haspopup="listbox"
        aria-expanded={false}
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
    </>
  );
};
