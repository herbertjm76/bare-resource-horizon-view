
import React from 'react';
import { Users, Building } from 'lucide-react';
import { PricingCard } from './PricingCard';

export const PricingPlans = () => {
  const plans = [
    {
      name: "Starter",
      price: "S$59",
      period: "per month",
      description: "Up to 10 people",
      features: [
        "Rolling Availability Calendar",
        "Live Burn Meter", 
        "Morning Heads-Up",
        "Basic reporting",
        "Email support"
      ],
      cta: "Start 14-Day Trial",
      popular: false,
      note: "No setup fees • Cancel anytime",
      color: "from-gray-600 to-gray-700",
      icon: <Users className="w-5 h-5" />,
      badge: "Essential"
    },
    {
      name: "Studio",
      price: "S$99",
      period: "per month",
      description: "Up to 25 people",
      features: [
        "Everything in Starter",
        "Predictive alerts (AI-powered)",
        "Advanced capacity planning",
        "Team utilization dashboard",
        "Priority support"
      ],
      cta: "Start 14-Day Trial", 
      popular: true,
      note: "No setup fees • Cancel anytime",
      color: "from-purple-600 to-blue-600",
      icon: <Building className="w-5 h-5" />,
      badge: "Most Popular"
    }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
      {plans.map((plan, index) => (
        <PricingCard key={index} plan={plan} index={index} />
      ))}
    </div>
  );
};
