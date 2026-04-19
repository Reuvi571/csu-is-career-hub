import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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

const defaultRegisterState = {
  name: "",
  email: "",
  password: "",
  role: "student",
  major: "Information Systems",
  graduationYear: "",
};

export function AuthModal({ open, onOpenChange, onLogin }: AuthModalProps) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerForm, setRegisterForm] = useState(defaultRegisterState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setRegisterForm(defaultRegisterState);
    setError("");
    setSubmitting(false);
  };

  const handleLogin = async (nextEmail?: string, nextPassword?: string) => {
    const emailToUse = (nextEmail ?? email).trim().toLowerCase();
    const passwordToUse = nextPassword ?? password;

    if (!emailToUse || !passwordToUse) {
      setError("Enter your email and password.");
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
        body: JSON.stringify({ email: emailToUse, password: passwordToUse }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to sign in");
      }

      onLogin(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async () => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...registerForm,
          graduationYear: registerForm.graduationYear ? Number(registerForm.graduationYear) : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to create account");
      }

      onLogin(data.user);
      toast.success(`Welcome to CSU IS Careers, ${data.user.name}!`);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          resetForm();
          setMode("signin");
        }
      }}
    >
      <DialogContent className="sm:max-w-lg rounded-none">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Sign in to CSU IS Careers" : "Create your account"}</DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Access saved jobs, profile settings, reviews, and alumni connections."
              : "Create a student or alumni account to save opportunities and build your career profile."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={setMode} className="py-2">
          <TabsList className="grid w-full grid-cols-2 rounded-none">
            <TabsTrigger value="signin" className="rounded-none">Sign In</TabsTrigger>
            <TabsTrigger value="register" className="rounded-none">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">CSU Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="name@csu.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="rounded-none"
              />
              {error && <p className="text-sm text-[#274c37]">{error}</p>}
            </div>
            <Button onClick={() => handleLogin()} className="w-full rounded-none" disabled={submitting}>
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

            <div className="relative pt-2">
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
                  className="w-full justify-start rounded-none"
                  onClick={() => handleLogin(account.email, "csu-demo-login")}
                  disabled={submitting}
                >
                  <span className={`mr-2 rounded px-2 py-0.5 text-xs ${account.badgeClass}`}>
                    {account.badge}
                  </span>
                  {account.label}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input
                  id="register-name"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">CSU Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-role">Account Type</Label>
                <select
                  id="register-role"
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="h-10 w-full rounded-none border border-input bg-input-background px-3 py-2 text-sm"
                >
                  <option value="student">Student</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-major">Major</Label>
                <Input
                  id="register-major"
                  value={registerForm.major}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, major: e.target.value }))}
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="register-grad-year">Graduation Year</Label>
                <Input
                  id="register-grad-year"
                  type="number"
                  value={registerForm.graduationYear}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, graduationYear: e.target.value }))}
                  className="rounded-none"
                />
                {error && <p className="text-sm text-[#274c37]">{error}</p>}
              </div>
            </div>
            <Button onClick={handleRegister} className="w-full rounded-none" disabled={submitting}>
              {submitting ? "Creating Account..." : "Create Account"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
