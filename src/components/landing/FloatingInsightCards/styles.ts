
import { InsightStyles } from "./types";

export const insightStyles: Record<string, InsightStyles> = {
  blue: {
    bg: "bg-white",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    textColor: "text-slate-700",
    numberColor: "text-blue-600",
    shadow: "shadow-lg shadow-blue-100/40"
  },
  purple: {
    bg: "bg-white",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
    textColor: "text-slate-700",
    numberColor: "text-purple-600",
    shadow: "shadow-lg shadow-purple-100/40"
  },
  emerald: {
    bg: "bg-white",
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    textColor: "text-slate-700",
    numberColor: "text-emerald-600",
    shadow: "shadow-lg shadow-emerald-100/40"
  },
  orange: {
    bg: "bg-white",
    iconBg: "bg-orange-500",
    iconColor: "text-white",
    textColor: "text-slate-700",
    numberColor: "text-orange-600",
    shadow: "shadow-lg shadow-orange-100/40"
  },
  red: {
    bg: "bg-white",
    iconBg: "bg-red-500",
    iconColor: "text-white",
    textColor: "text-slate-700",
    numberColor: "text-red-600",
    shadow: "shadow-lg shadow-red-100/40"
  },
  teal: {
    bg: "bg-white",
    iconBg: "bg-teal-500",
    iconColor: "text-white",
    textColor: "text-slate-700",
    numberColor: "text-teal-600",
    shadow: "shadow-lg shadow-teal-100/40"
  }
};

export const globalStyles = `
  @keyframes floatGently {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes cardGlow {
    0% { box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
    50% { box-shadow: 0 12px 30px rgba(0,0,0,0.12); }
    100% { box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
  }
  .insight-card {
    animation: floatGently 3.5s ease-in-out infinite, cardGlow 4s ease-in-out infinite;
  }
  .insight-card:hover {
    transform: scale(1.05) !important;
    z-index: 50 !important;
    transition: transform 0.3s ease-out;
  }
`;
