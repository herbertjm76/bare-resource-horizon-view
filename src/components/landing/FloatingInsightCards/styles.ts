
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
  @keyframes floatGently1 {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes floatGently2 {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  }
  @keyframes floatGently3 {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  @keyframes cardGlow1 {
    0% { box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
    50% { box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
    100% { box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
  }
  @keyframes cardGlow2 {
    0% { box-shadow: 0 3px 12px rgba(0,0,0,0.05); }
    50% { box-shadow: 0 5px 18px rgba(0,0,0,0.07); }
    100% { box-shadow: 0 3px 12px rgba(0,0,0,0.05); }
  }
  @keyframes cardGlow3 {
    0% { box-shadow: 0 5px 18px rgba(0,0,0,0.07); }
    50% { box-shadow: 0 7px 22px rgba(0,0,0,0.09); }
    100% { box-shadow: 0 5px 18px rgba(0,0,0,0.07); }
  }
  
  .insight-card {
    transition: transform 0.2s ease-out, z-index 0.2s ease-out !important;
  }
  
  .insight-card:nth-child(1) {
    animation: floatGently1 3.2s ease-in-out infinite, cardGlow1 3.8s ease-in-out infinite;
  }
  .insight-card:nth-child(2) {
    animation: floatGently2 2.8s ease-in-out infinite, cardGlow2 3.2s ease-in-out infinite;
  }
  .insight-card:nth-child(3) {
    animation: floatGently3 3.5s ease-in-out infinite, cardGlow3 4.1s ease-in-out infinite;
  }
  .insight-card:nth-child(4) {
    animation: floatGently1 2.9s ease-in-out infinite, cardGlow2 3.6s ease-in-out infinite;
  }
  .insight-card:nth-child(5) {
    animation: floatGently2 3.1s ease-in-out infinite, cardGlow1 3.4s ease-in-out infinite;
  }
  .insight-card:nth-child(6) {
    animation: floatGently3 2.7s ease-in-out infinite, cardGlow3 3.9s ease-in-out infinite;
  }
  
  .insight-card:hover {
    transform: scale(1.05) !important;
    z-index: 50 !important;
    animation-play-state: paused !important;
  }
`;
