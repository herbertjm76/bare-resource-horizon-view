
import React from 'react';
import { Brain, Zap, Target, Users, TrendingUp, Shield, Sparkles, Star, ArrowRight, CheckCircle } from 'lucide-react';

// Floating icon backgrounds with enhanced animations
export const FloatingIcons = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-8 h-8 text-theme-primary/20 animate-[float_6s_ease-in-out_infinite] hover:text-theme-primary/40 transition-colors duration-300">
      <Brain className="w-full h-full" />
    </div>
    <div className="absolute top-40 right-20 w-6 h-6 text-blue-300/20 animate-[float_8s_ease-in-out_infinite] animation-delay-1000 hover:text-blue-300/40 transition-colors duration-300">
      <Zap className="w-full h-full" />
    </div>
    <div className="absolute bottom-32 left-16 w-10 h-10 text-green-300/20 animate-[float_7s_ease-in-out_infinite] animation-delay-2000 hover:text-green-300/40 transition-colors duration-300">
      <Target className="w-full h-full" />
    </div>
    <div className="absolute top-60 left-1/3 w-7 h-7 text-orange-300/20 animate-[float_9s_ease-in-out_infinite] animation-delay-500 hover:text-orange-300/40 transition-colors duration-300">
      <Users className="w-full h-full" />
    </div>
    <div className="absolute bottom-20 right-1/4 w-9 h-9 text-pink-300/20 animate-[float_5s_ease-in-out_infinite] animation-delay-1500 hover:text-pink-300/40 transition-colors duration-300">
      <TrendingUp className="w-full h-full" />
    </div>
  </div>
);

// Visual separator with enhanced icons
export const IconSeparator = ({ icon: Icon, color = "purple" }: { icon: any, color?: string }) => (
  <div className="flex items-center justify-center py-8">
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className={`h-px bg-gradient-to-r from-transparent to-${color}-200 w-16 transition-all duration-500 group-hover:to-${color}-400`}></div>
      <div className={`w-12 h-12 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite] group-hover:animate-none transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:shadow-xl`}>
        <Icon className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div className={`h-px bg-gradient-to-l from-transparent to-${color}-200 w-16 transition-all duration-500 group-hover:to-${color}-400`}></div>
    </div>
  </div>
);

// Interactive visual cards with enhanced micro-animations
export const VisualCard = ({ 
  children, 
  className = "",
  hoverEffect = true,
  style
}: { 
  children: React.ReactNode, 
  className?: string,
  hoverEffect?: boolean,
  style?: React.CSSProperties
}) => (
  <div 
    className={`
      relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 
      ${hoverEffect ? 'transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 hover:border-theme-primary/20 cursor-pointer group' : ''}
      ${className}
    `}
    style={{
      ...style,
      transformStyle: 'preserve-3d'
    }}
  >
    {hoverEffect && (
      <>
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-theme-primary/10 to-theme-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {/* Corner accent that appears on hover */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-theme-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"></div>
      </>
    )}
    {children}
  </div>
);

// Enhanced gradient orbs background
export const GradientOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-theme-primary/20 to-theme-primary/10 rounded-full blur-3xl animate-[float_15s_ease-in-out_infinite] hover:scale-110 transition-transform duration-700"></div>
    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-[float_20s_ease-in-out_infinite] animation-delay-2000 hover:scale-110 transition-transform duration-700"></div>
    <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl animate-[float_18s_ease-in-out_infinite] animation-delay-1000 hover:scale-110 transition-transform duration-700"></div>
  </div>
);

// Enhanced stats visualization with micro-animations
export const StatsVisualization = ({ stats }: { stats: Array<{ value: string, label: string, icon: any }> }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat, index) => (
      <div key={index} className="text-center group cursor-pointer">
        <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-700 group-hover:scale-125 group-hover:rotate-12 group-hover:shadow-xl group-hover:shadow-theme-primary/25">
          <stat.icon className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1 transition-all duration-300 group-hover:text-theme-primary group-hover:scale-110">{stat.value}</div>
        <div className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">{stat.label}</div>
      </div>
    ))}
  </div>
);
