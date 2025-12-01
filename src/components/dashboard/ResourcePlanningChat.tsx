
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Lightbulb, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { useAppSettings } from '@/hooks/useAppSettings';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface ResourcePlanningChatProps {
  teamSize: number;
  activeProjects: number;
  utilizationRate: number;
}

export const ResourcePlanningChat: React.FC<ResourcePlanningChatProps> = ({
  teamSize,
  activeProjects,
  utilizationRate
}) => {
  const { workWeekHours } = useAppSettings();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi! I'm your Resource Planning Assistant. I can see you have ${teamSize} team members working on ${activeProjects} projects with ${utilizationRate}% utilization. How can I help optimize your resource planning?`,
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "Should we hire more people?",
        "Are we taking on too many projects?",
        "How can we improve team efficiency?",
        "What's our capacity for new projects?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickSuggestions = [
    "Should we hire more people?",
    "Are we overutilizing our team?",
    "What's our capacity for Q2?",
    "Recommend project prioritization"
  ];

  const generateAIResponse = (userMessage: string) => {
    // Intelligent responses based on current metrics and user question
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hire') || lowerMessage.includes('hiring')) {
      if (utilizationRate > 85) {
        return {
          content: `Based on your ${utilizationRate}% utilization rate, yes! You should consider hiring. Your team is operating above optimal capacity (70-80%). I recommend hiring 1-2 ${teamSize < 10 ? 'senior' : 'mid-level'} resources to bring utilization down to 75-80%.`,
          suggestions: ["What roles should we hire for?", "How much will this cost?", "Timeline for hiring?"]
        };
      } else if (utilizationRate < 60) {
        return {
          content: `With ${utilizationRate}% utilization, hiring isn't urgent. Focus on winning more projects first. Your team has capacity for ${Math.round((80 - utilizationRate) * teamSize * workWeekHours / 100)} more hours per week.`,
          suggestions: ["How to find more projects?", "Should we reduce team size?", "Business development strategy?"]
        };
      } else {
        return {
          content: `Your ${utilizationRate}% utilization is healthy. Monitor for 2-3 weeks. If you consistently hit 85%+, then hire. Look for pipeline projects that might push you over 90%.`,
          suggestions: ["What's our project pipeline?", "Hiring timeline planning", "Budget for new hires"]
        };
      }
    }
    
    if (lowerMessage.includes('overwork') || lowerMessage.includes('burnout') || lowerMessage.includes('overutiliz')) {
      if (utilizationRate > 90) {
        return {
          content: `🚨 Yes, ${utilizationRate}% utilization is concerning. Immediate actions: 1) Defer non-critical projects 2) Hire temporary contractors 3) Extend deadlines where possible. Sustained 90%+ leads to burnout and quality issues.`,
          suggestions: ["Which projects can we defer?", "Find contractors quickly", "Talk to clients about timelines"]
        };
      } else {
        return {
          content: `At ${utilizationRate}%, you're in a good range. Watch for individual team members who might be overloaded even if the average looks healthy. Consider workload distribution.`,
          suggestions: ["Check individual workloads", "Rebalance team assignments", "Spot check with team members"]
        };
      }
    }
    
    if (lowerMessage.includes('capacity') || lowerMessage.includes('new project')) {
      const availableHours = teamSize * workWeekHours * (1 - utilizationRate / 100);
      return {
        content: `You have ~${Math.round(availableHours)} hours/week available capacity. This equals about ${Math.floor(availableHours / 20)} part-time projects or ${Math.floor(availableHours / workWeekHours)} full-time projects, depending on project size.`,
        suggestions: ["What size projects fit?", "Pipeline analysis", "Resource allocation strategy"]
      };
    }
    
    if (lowerMessage.includes('efficiency') || lowerMessage.includes('productivity')) {
      return {
        content: `To improve efficiency: 1) Reduce project switching (max 2-3 projects per person) 2) Block time for deep work 3) Automate repetitive tasks 4) Improve project specifications to reduce revisions.`,
        suggestions: ["Time blocking strategies", "Automation opportunities", "Project scope clarity"]
      };
    }
    
    // Default responses
    const responses = [
      `With ${activeProjects} active projects and ${teamSize} team members, your project-to-person ratio is ${(activeProjects/teamSize).toFixed(1)}. Ideal is 2-3 projects per person for focus.`,
      `Your ${utilizationRate}% utilization suggests ${utilizationRate > 85 ? 'you need more resources' : utilizationRate < 60 ? 'you could take on more work' : 'you have good balance'}. Let me know what specific area you'd like to optimize!`,
      `I can help with capacity planning, hiring decisions, project prioritization, and workload balancing. What's your biggest resource challenge right now?`
    ];
    
    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      suggestions: ["Analyze team workload", "Project pipeline planning", "Hiring recommendations", "Efficiency improvements"]
    };
  };

  const handleSend = (messageText?: string) => {
    const messageToSend = messageText || input;
    if (!messageToSend.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Show disabled message
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '⚡ AI chat features are temporarily disabled to improve dashboard performance. This feature will be re-enabled soon with performance optimizations.',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Resource Planning Assistant
          <StandardizedBadge variant="info" size="sm" className="ml-auto">AI Powered</StandardizedBadge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl ${
                message.isUser 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                <div className="flex items-start gap-2 mb-2">
                  {!message.isUser && <Bot className="h-4 w-4 mt-0.5 text-blue-600" />}
                  {message.isUser && <User className="h-4 w-4 mt-0.5 text-blue-100" />}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-1 text-xs opacity-75">
                      <Lightbulb className="h-3 w-3" />
                      Suggested follow-ups:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="outline"
                          className="text-xs py-1 px-2 h-auto bg-white/50 hover:bg-white/80"
                          onClick={() => handleSend(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Quick suggestions */}
        <div className="mb-4">
          <div className="text-xs text-gray-600 mb-2">Quick questions:</div>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, idx) => (
              <Button
                key={idx}
                size="sm"
                variant="outline"
                className="text-xs py-1 px-3 h-auto"
                onClick={() => handleSend(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Input */}
        <div className="flex items-center gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about hiring, capacity, workload..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={() => handleSend()}
            size="icon"
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
