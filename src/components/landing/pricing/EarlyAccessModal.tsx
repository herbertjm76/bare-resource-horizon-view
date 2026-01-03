import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

export const EarlyAccessModal = ({ isOpen, onClose, planName }: EarlyAccessModalProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call - replace with actual implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('You\'re on the list! We\'ll be in touch soon.');
  };

  const handleClose = () => {
    setEmail('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Reserve Your Spot
          </DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">You're on the list!</h3>
            <p className="text-muted-foreground mb-4">
              We'll notify you when {planName} early access opens. Your founding member pricing is reserved.
            </p>
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Founding Member Benefits:</strong>
              </p>
              <ul className="text-sm text-amber-700 mt-2 space-y-1">
                <li>• Lock in {planName} pricing forever</li>
                <li>• Priority access when we launch</li>
                <li>• Direct input on features we build</li>
                <li>• Exclusive founding member badge</li>
              </ul>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Work email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Reserving...' : 'Reserve My Spot'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              No credit card required. We'll only email you about early access.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
