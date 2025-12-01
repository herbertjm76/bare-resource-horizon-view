
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogPortal } from "@/components/ui/dialog";
import { HerbieChat } from './HerbieChat';
import { Bot } from 'lucide-react';
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const HerbieFloatingButton: React.FC = () => {
  const [isHerbieOpen, setIsHerbieOpen] = useState(false);

  return (
    <Dialog open={isHerbieOpen} onOpenChange={setIsHerbieOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 group"
          style={{
            background: 'linear-gradient(45deg, #6F4BF6 0%, #5669F7 55%, #E64FC4 100%)'
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <Bot className="h-6 w-6 text-white mb-0.5" />
            <span className="text-xs text-white font-medium">Herbie</span>
          </div>
          <div className="absolute -top-2 -right-2 bg-green-500 h-4 w-4 rounded-full animate-pulse" />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogPrimitive.Content
          className="fixed bottom-8 right-8 z-50 w-80 h-96 bg-background border rounded-lg shadow-lg p-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4 text-theme-primary" />
              Herbie
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden px-4 pb-4 h-[calc(100%-60px)]">
            <HerbieChat />
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
