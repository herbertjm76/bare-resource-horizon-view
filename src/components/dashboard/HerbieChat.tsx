
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const HerbieChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm Herbie, your resource planning assistant. How can I help optimize your team's workload today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate Herbie response based on user input
    setTimeout(() => {
      let response = "I'm analyzing your resource needs. Let me help you optimize your team's allocation.";
      
      if (input.toLowerCase().includes('overload') || input.toLowerCase().includes('overwork')) {
        response = "I've detected several team members are over-allocated. Would you like me to suggest a rebalancing strategy?";
      } else if (input.toLowerCase().includes('hire') || input.toLowerCase().includes('hiring')) {
        response = "Based on current utilization trends, adding 1-2 new team members could bring your overall utilization to optimal levels (70-80%).";
      } else if (input.toLowerCase().includes('project') || input.toLowerCase().includes('deadline')) {
        response = "I can help you analyze project capacity. Which specific project timeline are you concerned about?";
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-2xl
                ${message.isUser 
                  ? 'bg-brand-primary text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'}`
              }
            >
              <p className="text-sm">{message.content}</p>
              <div className={`text-xs mt-1 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 p-4 border-t">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Herbie about resource planning..."
          className="flex-1 p-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="rounded-full h-10 w-10 bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
