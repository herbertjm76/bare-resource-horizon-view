
// Animation utilities and configurations
export const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 }
};

export const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// CSS animation classes
export const animationClasses = {
  // Fade animations
  fadeIn: 'animate-[fadeIn_0.6s_ease-out_forwards]',
  fadeInUp: 'animate-[fadeInUp_0.6s_ease-out_forwards]',
  fadeInDown: 'animate-[fadeInDown_0.6s_ease-out_forwards]',
  fadeInLeft: 'animate-[fadeInLeft_0.6s_ease-out_forwards]',
  fadeInRight: 'animate-[fadeInRight_0.6s_ease-out_forwards]',
  
  // Scale animations
  scaleIn: 'animate-[scaleIn_0.5s_ease-out_forwards]',
  pulse: 'animate-[pulse_2s_ease-in-out_infinite]',
  
  // Hover effects
  hoverScale: 'transition-transform duration-300 hover:scale-105',
  hoverFloat: 'transition-transform duration-300 hover:-translate-y-1',
  hoverGlow: 'transition-shadow duration-300 hover:shadow-2xl hover:shadow-purple-500/25',
  
  // Delayed animations
  delay100: 'animation-delay-100',
  delay200: 'animation-delay-200',
  delay300: 'animation-delay-300',
  delay400: 'animation-delay-400',
  delay500: 'animation-delay-500'
};
