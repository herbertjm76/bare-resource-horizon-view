import { InsightStyles } from "./types";

export const insightStyles: Record<string, InsightStyles> = {
  blue: {
    bg: "bg-white/95",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-blue-600",
    shadow: "shadow-xl shadow-blue-100/40"
  },
  purple: {
    bg: "bg-white/95",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-purple-600",
    shadow: "shadow-xl shadow-purple-100/40"
  },
  green: {
    bg: "bg-white/95",
    iconBg: "bg-green-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-green-600",
    shadow: "shadow-xl shadow-green-100/40"
  },
  emerald: {
    bg: "bg-white/95",
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-emerald-600",
    shadow: "shadow-xl shadow-emerald-100/40"
  },
  yellow: {
    bg: "bg-white/95",
    iconBg: "bg-yellow-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-yellow-600",
    shadow: "shadow-xl shadow-yellow-100/40"
  },
  orange: {
    bg: "bg-white/95",
    iconBg: "bg-orange-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-orange-600",
    shadow: "shadow-xl shadow-orange-100/40"
  },
  red: {
    bg: "bg-white/95",
    iconBg: "bg-red-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-red-600",
    shadow: "shadow-xl shadow-red-100/40"
  },
  teal: {
    bg: "bg-white/95",
    iconBg: "bg-teal-500",
    iconColor: "text-white",
    textColor: "text-slate-600",
    numberColor: "text-teal-600",
    shadow: "shadow-xl shadow-teal-100/40"
  }
};

export const globalStyles = `
  @keyframes floatGently1 {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes floatGently2 {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes floatGently3 {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-7px); }
  }
  @keyframes cardGlow1 {
    0% { box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08); }
    50% { box-shadow: 0 12px 40px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.12); }
    100% { box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08); }
  }
  @keyframes cardGlow2 {
    0% { box-shadow: 0 6px 28px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06); }
    50% { box-shadow: 0 10px 36px rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.10); }
    100% { box-shadow: 0 6px 28px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06); }
  }
  @keyframes cardGlow3 {
    0% { box-shadow: 0 10px 36px rgba(0,0,0,0.14), 0 3px 10px rgba(0,0,0,0.08); }
    50% { box-shadow: 0 14px 44px rgba(0,0,0,0.18), 0 5px 14px rgba(0,0,0,0.12); }
    100% { box-shadow: 0 10px 36px rgba(0,0,0,0.14), 0 3px 10px rgba(0,0,0,0.08); }
  }
  
  .insight-card {
    transition: transform 0.3s ease-out, z-index 0.3s ease-out, box-shadow 0.3s ease-out !important;
  }
  
  .insight-card:nth-child(1) {
    animation: floatGently1 3.8s ease-in-out infinite, cardGlow1 4.2s ease-in-out infinite;
  }
  .insight-card:nth-child(2) {
    animation: floatGently2 3.2s ease-in-out infinite, cardGlow2 3.6s ease-in-out infinite;
  }
  .insight-card:nth-child(3) {
    animation: floatGently3 4.0s ease-in-out infinite, cardGlow3 4.5s ease-in-out infinite;
  }
  .insight-card:nth-child(4) {
    animation: floatGently1 3.4s ease-in-out infinite, cardGlow2 4.0s ease-in-out infinite;
  }
  .insight-card:nth-child(5) {
    animation: floatGently2 3.6s ease-in-out infinite, cardGlow1 3.8s ease-in-out infinite;
  }
  .insight-card:nth-child(6) {
    animation: floatGently3 3.0s ease-in-out infinite, cardGlow3 4.3s ease-in-out infinite;
  }
  
  .insight-card:hover {
    transform: scale(1.1) !important;
    z-index: 50 !important;
    animation-play-state: paused !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15) !important;
  }
`;
