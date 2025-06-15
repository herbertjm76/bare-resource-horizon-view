
import { InsightStyles } from "./types";

export const insightStyles: Record<string, InsightStyles> = {
  blue: {
    bg: "bg-white",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    textColor: "text-gray-700",
    numberColor: "text-blue-600",
    shadow: "shadow-lg shadow-blue-200/30"
  },
  purple: {
    bg: "bg-white",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    textColor: "text-gray-700",
    numberColor: "text-purple-600",
    shadow: "shadow-lg shadow-purple-200/30"
  },
  green: {
    bg: "bg-white",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    textColor: "text-gray-700",
    numberColor: "text-green-600",
    shadow: "shadow-lg shadow-green-200/30"
  },
  orange: {
    bg: "bg-white",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    textColor: "text-gray-700",
    numberColor: "text-orange-600",
    shadow: "shadow-lg shadow-orange-200/30"
  },
  pink: {
    bg: "bg-white",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    textColor: "text-gray-700",
    numberColor: "text-pink-600",
    shadow: "shadow-lg shadow-pink-200/30"
  },
  red: {
    bg: "bg-white",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    textColor: "text-gray-700",
    numberColor: "text-red-600",
    shadow: "shadow-lg shadow-red-200/30"
  }
};

export const globalStyles = `
  @keyframes floatGently {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes shimmer {
    0% { box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
    50% { box-shadow: 0 12px 35px rgba(0,0,0,0.15); }
    100% { box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
  }
  .insight-card {
    animation: floatGently 4s ease-in-out infinite, shimmer 5s ease-in-out infinite;
  }
  .insight-card:hover {
    transform: scale(1.15) !important;
    z-index: 50 !important;
  }
`;
