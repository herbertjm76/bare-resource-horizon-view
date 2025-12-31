import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { logger } from "@/utils/logger";

export const useBulkInvites = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const sendBulkInvites = async (inviteIds: string[]) => {
    if (!inviteIds || inviteIds.length === 0) {
      toast({
        title: "No members selected",
        description: "Please select at least one pre-registered member to send invites to.",
        variant: "destructive",
      });
      return false;
    }

    setIsSending(true);

    try {
      logger.log("Sending bulk invites for:", inviteIds);

      const { data, error } = await supabase.functions.invoke("send-bulk-invites", {
        body: { inviteIds },
      });

      if (error) {
        logger.error("Error sending bulk invites:", error);
        throw error;
      }

      logger.log("Bulk invite results:", data);

      if (data?.results) {
        const { successful, failed, errors } = data.results;
        
        if (successful > 0 && failed === 0) {
          toast({
            title: "Invites sent successfully",
            description: `${successful} invite email(s) sent successfully.`,
          });
        } else if (successful > 0 && failed > 0) {
          toast({
            title: "Invites partially sent",
            description: `${successful} sent successfully, ${failed} failed. ${errors?.[0] || ''}`,
            variant: "destructive",
          });
        } else if (failed > 0) {
          logger.error("Failed invites:", errors);
          const errorMessage = errors?.[0] || `${failed} invite(s) could not be sent.`;
          const needsEmail = errorMessage.includes("no email address");
          
          toast({
            title: "Failed to send invites",
            description: needsEmail 
              ? "The selected member(s) need an email address. Click 'Edit', add their email, then click 'Done' to save before sending invites."
              : errorMessage,
            variant: "destructive",
          });
        }
      }

      return true;
    } catch (error: any) {
      logger.error("Failed to send bulk invites:", error);
      toast({
        title: "Failed to send invites",
        description: error.message || "An error occurred while sending invite emails.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendBulkInvites,
    isSending,
  };
};
