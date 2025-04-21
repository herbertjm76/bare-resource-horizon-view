
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Mail } from "lucide-react";
import { toast } from "sonner";

interface InviteCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteUrl: string;
}

export const InviteCodeDialog: React.FC<InviteCodeDialogProps> = ({ open, onOpenChange, inviteUrl }) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const code = inviteUrl?.split("/")?.pop() || "invite-code-placeholder";

  // Copies the code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Invite code copied!");
  };

  // Mimic sending code to email (placeholder only!)
  const handleSendEmail = async () => {
    if (!email) return;
    setSending(true);
    setTimeout(() => {
      toast.success(`Invite code sent to ${email}!`);
      setSending(false);
      setEmail("");
      onOpenChange(false);
    }, 1100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="mb-2">Share Invite Code</DialogTitle>
          <div className="mt-2 flex items-center gap-2">
            <Input readOnly value={code} className="font-mono text-lg w-32 border border-muted" />
            <Button size="sm" variant="outline" type="button" onClick={handleCopy}>
              <Copy className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        <div className="my-2 text-sm text-muted-foreground">
          <div>Share or send this invite code to add new users to your company.</div>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendEmail();
          }}
          className="flex gap-2 items-center mt-3"
        >
          <Input
            type="email"
            placeholder="Recipient email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={sending}
            className="flex-1"
          />
          <Button size="sm" disabled={sending || !email} type="submit">
            <Mail className="w-5 h-5 mr-1" /> {sending ? "Sending..." : "Send"}
          </Button>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="w-full mt-2">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
