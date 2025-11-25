import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const useBulkInvites = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const sendBulkInvites = async (inviteIds: string[]) => {
    if (!inviteIds || inviteIds.length === 0) {
      toast({
        title: "No invites selected",
        description: "Please select at least one pre-registered member to send invites to.",
        variant: "destructive",
      });
      return false;
    }

    setIsSending(true);

    try {
      console.log("Sending bulk invites for:", inviteIds);

      const { data, error } = await supabase.functions.invoke("send-bulk-invites", {
        body: { inviteIds },
      });

      if (error) {
        console.error("Error sending bulk invites:", error);
        throw error;
      }

      console.log("Bulk invite results:", data);

      if (data?.results) {
        const { successful, failed, errors } = data.results;
        
        if (successful > 0) {
          toast({
            title: "Invites sent successfully",
            description: `${successful} invite email(s) sent. ${failed > 0 ? `${failed} failed.` : ''}`,
          });
        }

        if (failed > 0 && errors?.length > 0) {
          console.error("Failed invites:", errors);
          toast({
            title: "Some invites failed",
            description: `${failed} invite(s) could not be sent. Check console for details.`,
            variant: "destructive",
          });
        }
      }

      return true;
    } catch (error: any) {
      console.error("Failed to send bulk invites:", error);
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
