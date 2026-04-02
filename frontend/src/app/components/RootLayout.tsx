import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { AuthModal } from "./AuthModal";
import { useState } from "react";
import { User, getCurrentUser, setCurrentUser } from "../data/mockData";
import { Toaster } from "./ui/sonner";

export function RootLayout() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLogin = (loggedInUser: User) => {
    setCurrentUser(loggedInUser);
    setUser(loggedInUser);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        user={user} 
        onLoginClick={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      <main>
        <Outlet context={{ user }} />
      </main>
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        onLogin={handleLogin}
      />
      <Toaster />
    </div>
  );
}
