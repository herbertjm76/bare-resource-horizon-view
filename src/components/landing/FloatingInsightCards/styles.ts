
import { InsightStyles } from "./types";

export const insightStyles: Record<string, InsightStyles> = {
  blue: {
    bg: "bg-white",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-blue-600",
    shadow: "shadow-md shadow-blue-100/30"
  },
  purple: {
    bg: "bg-white",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-purple-600",
    shadow: "shadow-md shadow-purple-100/30"
  },
  emerald: {
    bg: "bg-white",
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-emerald-600",
    shadow: "shadow-md shadow-emerald-100/30"
  },
  orange: {
    bg: "bg-white",
    iconBg: "bg-orange-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-orange-600",
    shadow: "shadow-md shadow-orange-100/30"
  },
  red: {
    bg: "bg-white",
    iconBg: "bg-red-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-red-600",
    shadow: "shadow-md shadow-red-100/30"
  },
  teal: {
    bg: "bg-white",
    iconBg: "bg-teal-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-teal-600",
    shadow: "shadow-md shadow-teal-100/30"
  }
};

export const globalStyles = `
  @keyframes floatGently {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  }
  @keyframes cardGlow {
    0% { box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
    50% { box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
    100% { box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
  }
  .insight-card {
    animation: floatGently 3s ease-in-out infinite, cardGlow 3.5s ease-in-out infinite;
  }
  .insight-card:hover {
    transform: scale(1.05) !important;
    z-index: 50 !important;
    transition: transform 0.2s ease-out;
  }
`;
