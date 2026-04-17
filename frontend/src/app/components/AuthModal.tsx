import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User } from "../types/user";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (user: User) => void;
}

const demoAccounts = [
  { email: "admin@csu.edu", label: "Admin User", badge: "ADMIN", badgeClass: "bg-[#274c37] text-white" },
  { email: "sarah.j@csu.edu", label: "Sarah Johnson (Class of 2026)", badge: "STUDENT", badgeClass: "border border-[#2d694f] text-[#2d694f]" },
  { email: "michael.c@csu.edu", label: "Michael Chen (Class of 2024)", badge: "ALUMNI", badgeClass: "bg-[#7ebc45] text-[#2d694f]" },
];

export function AuthModal({ open, onOpenChange, onLogin }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (nextEmail?: string) => {
    const emailToUse = (nextEmail ?? email).trim().toLowerCase();
    if (!emailToUse) {
      setError("Enter a CSU email address.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailToUse }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to sign in");
      }

      onLogin(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to CSU IS Careers</DialogTitle>
          <DialogDescription>
            Enter your seeded CSU email address to access the platform
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">CSU Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@csu.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            {error && <p className="text-sm text-[#274c37]">{error}</p>}
          </div>
          <Button onClick={() => handleLogin()} className="w-full" disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-none"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Continue as Guest
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Demo Accounts</span>
            </div>
          </div>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleLogin(account.email)}
                disabled={submitting}
              >
                <span className={`mr-2 rounded px-2 py-0.5 text-xs ${account.badgeClass}`}>
                  {account.badge}
                </span>
                {account.label}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
