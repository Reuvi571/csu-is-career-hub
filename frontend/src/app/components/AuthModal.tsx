import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, mockUsers } from "../data/mockData";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (user: User) => void;
}

export function AuthModal({ open, onOpenChange, onLogin }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      onLogin(user);
      toast.success(`Welcome back, ${user.name}!`);
      setEmail("");
    } else {
      setError("Email not found. Please use a registered CSU email address.");
    }
  };

  const quickLogin = (user: User) => {
    onLogin(user);
    toast.success(`Logged in as ${user.name}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to CSU IS Careers</DialogTitle>
          <DialogDescription>
            Enter your CSU email address to access the platform
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
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <Button onClick={handleLogin} className="w-full">
            Sign In
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Demo Accounts
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => quickLogin(mockUsers[0])}
            >
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mr-2">
                ADMIN
              </span>
              Admin User
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => quickLogin(mockUsers[1])}
            >
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mr-2">
                STUDENT
              </span>
              Sarah Johnson (Class of 2026)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => quickLogin(mockUsers[2])}
            >
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded mr-2">
                ALUMNI
              </span>
              Michael Chen (Class of 2024)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
