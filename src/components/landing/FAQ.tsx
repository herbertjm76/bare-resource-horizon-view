
import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "How is it different from Float?",
      answer: "BareResource is built specifically for design studios. While Float focuses on general project management, we focus on capacity planning with fee burn tracking and real-time utilization alerts that design teams actually need."
    },
    {
      question: "Does it replace our PM tool?",
      answer: "No, BareResource works alongside your existing PM tools. We focus purely on resource planning and capacity management. Keep using your favorite project management tool for tasks and workflows."
    },
    {
      question: "What happens after the trial?",
      answer: "After your 14-day trial, choose a plan that fits your team size. No setup fees, cancel anytime. Your data stays yours and you can export it if you ever decide to leave."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="cascadeUp" delay={0} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </AnimatedSection>

        <AnimatedSection animation="cascadeUp" delay={300}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-purple-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default FAQ;
