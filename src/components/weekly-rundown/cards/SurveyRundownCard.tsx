import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Plus, X, Star, Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

interface SurveyRundownCardProps {
  cardType: {
    id: string;
    label: string;
    icon?: string;
    survey_type?: 'multiple_choice' | 'poll' | 'rating';
  };
  weekStartDate: string;
}

export const SurveyRundownCard: React.FC<SurveyRundownCardProps> = ({
  cardType,
  weekStartDate
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const surveyType = cardType.survey_type || 'poll';

  // Fetch options
  const { data: options = [] } = useQuery({
    queryKey: ['survey-options', cardType.id, weekStartDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_survey_options')
        .select('*')
        .eq('card_type_id', cardType.id)
        .eq('week_start_date', weekStartDate)
        .order('order_index');
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  // Fetch responses
  const { data: responses = [] } = useQuery({
    queryKey: ['survey-responses', cardType.id, weekStartDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_survey_responses')
        .select('*')
        .eq('card_type_id', cardType.id)
        .eq('week_start_date', weekStartDate);
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  // Fetch current user's response
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });

  const currentUserResponse = responses.find(r => r.member_id === session?.user?.id);

  const addOption = useMutation({
    mutationFn: async () => {
      if (!company?.id) throw new Error('No company');
      const { error } = await supabase
        .from('weekly_survey_options')
        .insert({
          card_type_id: cardType.id,
          week_start_date: weekStartDate,
          label: newOption,
          order_index: options.length,
          company_id: company.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Option added');
      setNewOption('');
      queryClient.invalidateQueries({ queryKey: ['survey-options', cardType.id, weekStartDate] });
    }
  });

  const removeOption = useMutation({
    mutationFn: async (optionId: string) => {
      const { error } = await supabase
        .from('weekly_survey_options')
        .delete()
        .eq('id', optionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey-options', cardType.id, weekStartDate] });
    }
  });

  const submitResponse = useMutation({
    mutationFn: async () => {
      if (!company?.id || !session?.user?.id) throw new Error('Not authenticated');
      
      // Delete existing response first
      await supabase
        .from('weekly_survey_responses')
        .delete()
        .eq('card_type_id', cardType.id)
        .eq('week_start_date', weekStartDate)
        .eq('member_id', session.user.id);

      const { error } = await supabase
        .from('weekly_survey_responses')
        .insert({
          card_type_id: cardType.id,
          week_start_date: weekStartDate,
          option_id: surveyType === 'rating' ? 'rating' : selectedOption,
          rating_value: surveyType === 'rating' ? selectedRating : null,
          member_id: session.user.id,
          member_type: 'active',
          company_id: company.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Response submitted');
      queryClient.invalidateQueries({ queryKey: ['survey-responses', cardType.id, weekStartDate] });
    }
  });

  // Calculate results for poll
  const getOptionResults = () => {
    const total = responses.length;
    return options.map(opt => {
      const count = responses.filter(r => r.option_id === opt.id).length;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      return { ...opt, count, percentage };
    });
  };

  // Calculate average rating
  const getAverageRating = () => {
    const ratings = responses.filter(r => r.rating_value != null).map(r => r.rating_value!);
    if (ratings.length === 0) return 0;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  const optionResults = getOptionResults();

  return (
    <Card className="h-full flex flex-col min-h-[120px] max-h-[25vh] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
      <span className="absolute -right-2 -bottom-2 text-[80px] text-muted-foreground/5 pointer-events-none leading-none">
        {cardType.icon || '📊'}
      </span>
      
      <CardHeader className="flex-shrink-0 pb-1 h-[40px] flex items-start pt-3">
        <CardTitle className="flex items-center justify-between w-full text-xs font-semibold text-foreground uppercase tracking-wide">
          <span>{cardType.label}</span>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {responses.length} votes
            </Badge>
            <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => e.stopPropagation()}>
                  <Settings className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Setup {cardType.label}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  {surveyType !== 'rating' && (
                    <>
                      <div className="flex gap-2">
                        <Input
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          placeholder="Add option..."
                        />
                        <Button onClick={() => addOption.mutate()} disabled={!newOption.trim()}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {options.map(opt => (
                          <div key={opt.id} className="flex items-center justify-between p-2 border rounded">
                            <span>{opt.label}</span>
                            <Button variant="ghost" size="icon" onClick={() => removeOption.mutate(opt.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {surveyType === 'rating' && (
                    <p className="text-sm text-muted-foreground">
                      Rating scale (1-5 stars) is automatically configured.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-grey relative z-10">
        {surveyType === 'rating' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setSelectedRating(star);
                    setTimeout(() => submitResponse.mutate(), 100);
                  }}
                  className="p-0.5"
                >
                  <Star 
                    className={`h-5 w-5 transition-colors ${
                      star <= (currentUserResponse?.rating_value || selectedRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm font-semibold">
              Avg: {getAverageRating()} ⭐
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {optionResults.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center">
                Click ⚙️ to add options
              </p>
            ) : (
              optionResults.map(opt => (
                <div key={opt.id} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedOption(opt.id);
                        setTimeout(() => submitResponse.mutate(), 100);
                      }}
                      className={`text-xs text-left hover:underline ${
                        currentUserResponse?.option_id === opt.id ? 'font-semibold text-primary' : ''
                      }`}
                    >
                      {opt.label}
                    </button>
                    <span className="text-[10px] text-muted-foreground">{opt.percentage}%</span>
                  </div>
                  <Progress value={opt.percentage} className="h-1.5" />
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
