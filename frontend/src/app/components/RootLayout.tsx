import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { AuthModal } from "./AuthModal";
import { useEffect, useState } from "react";
import { Toaster } from "./ui/sonner";
import { User } from "../types/user";
import { useNavigate } from "react-router";

export function RootLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auth/me/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAuthModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/auth/logout/", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setAuthModalOpen(false);
      navigate("/");
    }
  };

  const handleSwitchAccount = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/auth/logout/", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setAuthModalOpen(true);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        user={user}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onSwitchAccount={handleSwitchAccount}
      />
      <main>
        <Outlet context={{ user, loadingUser }} />
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
