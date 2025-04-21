
import React from "react";
import { Input } from "@/components/ui/input";

interface OwnerInfoFieldsProps {
  ownerName: string;
  setOwnerName: (v: string) => void;
  ownerEmail: string;
  setOwnerEmail: (v: string) => void;
  ownerPassword: string;
  setOwnerPassword: (v: string) => void;
}

const OwnerInfoFields: React.FC<OwnerInfoFieldsProps> = ({
  ownerName,
  setOwnerName,
  ownerEmail,
  setOwnerEmail,
  ownerPassword,
  setOwnerPassword,
}) => (
  <div className="space-y-2">
    <h3 className="text-lg font-bold text-white mb-2">Owner Information</h3>
    <div className="grid grid-cols-1 gap-4 bg-white/10 rounded-xl px-6 py-4 glass">
      <div>
        <label htmlFor="ownerName" className="block text-white font-medium mb-1">Full Name</label>
        <Input
          type="text"
          id="ownerName"
          value={ownerName}
          onChange={e => setOwnerName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
          required
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="ownerEmail2" className="block text-white font-medium mb-1">Email</label>
        <Input
          type="email"
          id="ownerEmail2"
          value={ownerEmail}
          onChange={e => setOwnerEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="ownerPassword2" className="block text-white font-medium mb-1">Password</label>
        <Input
          type="password"
          id="ownerPassword2"
          value={ownerPassword}
          onChange={e => setOwnerPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
          required
          autoComplete="new-password"
        />
      </div>
    </div>
  </div>
);

export default OwnerInfoFields;
