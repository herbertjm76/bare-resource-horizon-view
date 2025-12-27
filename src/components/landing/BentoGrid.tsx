
import React from "react";

type BentoGridItem = {
  children: React.ReactNode;
  className?: string;
};

export const BentoGridItem: React.FC<BentoGridItem> = ({ children, className }) => (
  <div className={`rounded-2xl bg-card shadow-lg p-4 ${className || ""}`}>{children}</div>
);

export const BentoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="
      grid
      gap-6
      grid-cols-1
      md:grid-cols-6
      grid-rows-[repeat(5,minmax(100px,1fr))]
      md:grid-rows-[repeat(3,minmax(120px,1fr))]
      auto-rows-fr
      w-full
      px-2
      "
    style={{ minHeight: "80vh" }}
  >
    {children}
  </div>
);
