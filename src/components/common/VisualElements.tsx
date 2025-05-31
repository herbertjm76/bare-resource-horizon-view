
import React from 'react';
import { Brain, Zap, Target, Users, TrendingUp, Shield, Sparkles, Star, ArrowRight, CheckCircle } from 'lucide-react';

// Floating icon backgrounds
export const FloatingIcons = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-8 h-8 text-purple-300/20 animate-[float_6s_ease-in-out_infinite]">
      <Brain className="w-full h-full" />
    </div>
    <div className="absolute top-40 right-20 w-6 h-6 text-blue-300/20 animate-[float_8s_ease-in-out_infinite] animation-delay-1000">
      <Zap className="w-full h-full" />
    </div>
    <div className="absolute bottom-32 left-16 w-10 h-10 text-green-300/20 animate-[float_7s_ease-in-out_infinite] animation-delay-2000">
      <Target className="w-full h-full" />
    </div>
    <div className="absolute top-60 left-1/3 w-7 h-7 text-orange-300/20 animate-[float_9s_ease-in-out_infinite] animation-delay-500">
      <Users className="w-full h-full" />
    </div>
    <div className="absolute bottom-20 right-1/4 w-9 h-9 text-pink-300/20 animate-[float_5s_ease-in-out_infinite] animation-delay-1500">
      <TrendingUp className="w-full h-full" />
    </div>
  </div>
);

// Visual separator with icons
export const IconSeparator = ({ icon: Icon, color = "purple" }: { icon: any, color?: string }) => (
  <div className="flex items-center justify-center py-8">
    <div className="flex items-center gap-4">
      <div className={`h-px bg-gradient-to-r from-transparent to-${color}-200 w-16`}></div>
      <div className={`w-12 h-12 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className={`h-px bg-gradient-to-l from-transparent to-${color}-200 w-16`}></div>
    </div>
  </div>
);

// Interactive visual cards
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
      ${hoverEffect ? 'transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105' : ''}
      ${className}
    `}
    style={style}
  >
    {children}
  </div>
);

// Gradient orbs background
export const GradientOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-[float_15s_ease-in-out_infinite]"></div>
    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-[float_20s_ease-in-out_infinite] animation-delay-2000"></div>
    <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl animate-[float_18s_ease-in-out_infinite] animation-delay-1000"></div>
  </div>
);

// Stats visualization
export const StatsVisualization = ({ stats }: { stats: Array<{ value: string, label: string, icon: any }> }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat, index) => (
      <div key={index} className="text-center group">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
          <stat.icon className="w-8 h-8 text-white" />
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
        <div className="text-sm text-gray-600">{stat.label}</div>
      </div>
    ))}
  </div>
);
