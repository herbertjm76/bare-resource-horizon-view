import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Loader2 } from 'lucide-react';

interface DetectionReviewStepProps {
  detectionType: 'people' | 'projects';
  detected: any[];
  confidence: number;
  location: string;
  onConfirm: (finalList: any[]) => void;
  onCancel: () => void;
  onRefine: (message: string, currentList: any[]) => Promise<{ detected: any[], message: string }>;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const DetectionReviewStep: React.FC<DetectionReviewStepProps> = ({
  detectionType,
  detected,
  confidence,
  location,
  onConfirm,
  onCancel,
  onRefine
}) => {
  const [items, setItems] = useState(detected);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isRefining) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsRefining(true);

    try {
      const result = await onRefine(userMessage, items);
      setItems(result.detected);
      setChatMessages(prev => [...prev, { role: 'assistant', content: result.message }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xl">✓</span>
              <strong>AI Detection Complete</strong>
              <Badge variant={confidence > 0.8 ? "default" : "secondary"} className="ml-auto">
                {Math.round(confidence * 100)}% confidence
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </AlertDescription>
      </Alert>

      <div>
        <h3 className="text-sm font-medium mb-3">
          Detected {detectionType === 'people' ? 'People' : 'Projects'} ({items.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 group">
              <div className="flex-1">
                {detectionType === 'people' ? (
                  <span className="text-sm font-medium">
                    {typeof item === 'string' 
                      ? item 
                      : `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Unknown Name'}
                  </span>
                ) : (
                  <div>
                    <span className="text-sm font-medium">{item.code}</span>
                    {item.name && <span className="text-sm text-muted-foreground ml-2">- {item.name}</span>}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(idx)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {items.length === 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            All items removed. Please go back and try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Refine with AI (optional)</h3>
        <div className="border rounded-lg bg-secondary/20">
          <ScrollArea className="h-48 p-3">
            {chatMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Ask AI to add, remove, or modify items in the list
              </p>
            ) : (
              <div className="space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </ScrollArea>
          <div className="border-t p-2 flex gap-2">
            <Input
              placeholder="e.g., Remove names starting with 'Dr.', Add project PRJ-123"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isRefining}
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isRefining}
            >
              {isRefining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Back
        </Button>
        <Button onClick={() => onConfirm(items)} className="flex-1" disabled={items.length === 0}>
          Confirm & Import ({items.length})
        </Button>
      </div>
    </div>
  );
};
