
import React from 'react';
import { Users, Brain } from 'lucide-react';
import { PricingCard } from './PricingCard';

export const PricingPlans = () => {
  const plans = [
    {
      name: "Starter",
      price: "$59",
      period: "per month",
      description: "Perfect for small teams ditching spreadsheets",
      features: [
        "Up to 10 team members",
        "Visual resource planning",
        "Project timeline tracking", 
        "Basic reporting",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false,
      note: "Billed annually ($590/year)",
      color: "from-gray-600 to-gray-700",
      icon: <Users className="w-5 h-5" />,
      badge: "Essential"
    },
    {
      name: "Studio",
      price: "$99",
      period: "per month",
      description: "Adds AI insights and dashboard analytics",
      features: [
        "Everything in Starter",
        "Up to 25 team members",
        "🧠 AI hiring recommendations",
        "🧠 AI pipeline warnings",
        "🧠 AI burnout prevention",
        "Advanced dashboard analytics",
        "Priority support"
      ],
      cta: "Start Free Trial", 
      popular: true,
      note: "Billed annually ($990/year)",
      color: "from-purple-600 to-blue-600",
      icon: <Brain className="w-5 h-5" />,
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
