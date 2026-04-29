import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { AuthModal } from "./AuthModal";
import { useEffect, useState } from "react";
import { Toaster } from "./ui/sonner";
import { SavedItems, User } from "../types/user";
import { useNavigate } from "react-router";

const emptySavedItems: SavedItems = {
  jobIds: [],
  companyIds: [],
  certificationIds: [],
  certificationProgressIds: [],
  alumniIds: [],
  appliedJobIds: [],
  jobs: [],
  companies: [],
  certifications: [],
  certificationProgress: [],
  alumni: [],
  applications: [],
};

export function RootLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItems>(emptySavedItems);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const loadSavedItems = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/saved/", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load saved items");
      }

      const data = await response.json();
      setSavedItems(data);
    } catch {
      setSavedItems(emptySavedItems);
    }
  };

  const loadCurrentUser = async () => {
    fetch("http://127.0.0.1:8000/api/auth/me/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(async (data) => {
        setUser(data.user);
        if (data.user) {
          await loadSavedItems();
        } else {
          setSavedItems(emptySavedItems);
        }
      })
      .catch(() => {
        setUser(null);
        setSavedItems(emptySavedItems);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAuthModalOpen(false);
    loadSavedItems();
  };

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/auth/logout/", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setSavedItems(emptySavedItems);
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
      setSavedItems(emptySavedItems);
      setAuthModalOpen(true);
      navigate("/");
    }
  };

  const toggleSavedItem = async (itemType: "job" | "company" | "certification" | "alumni", itemId: string | number) => {
    const response = await fetch("http://127.0.0.1:8000/api/saved/toggle/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemType, itemId }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to update saved item");
    }

    setSavedItems(data.savedItems);
    return data.saved as boolean;
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navigation
        user={user}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onSwitchAccount={handleSwitchAccount}
      />
      <main>
        <Outlet
          context={{
            user,
            loadingUser,
            savedItems,
            toggleSavedItem,
            openAuthModal: () => setAuthModalOpen(true),
            refreshCurrentUser: loadCurrentUser,
            refreshSavedItems: loadSavedItems,
          }}
        />
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
