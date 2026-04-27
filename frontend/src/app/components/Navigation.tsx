import { Link, useLocation } from "react-router";
import { useTheme } from "next-themes";
import { User } from "../types/user";
import { Button } from "./ui/button";
import { Briefcase, Building2, Star, DollarSign, Shield, LogOut, Users, Award, House, Settings, ArrowRightLeft, Moon, Bookmark, FileText, CheckSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Switch } from "./ui/switch";

interface NavigationProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onSwitchAccount: () => void;
}

export function Navigation({ user, onLoginClick, onLogout, onSwitchAccount }: NavigationProps) {
  const location = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/", label: "Home", icon: House },
    { path: "/jobs", label: "Jobs", icon: Briefcase },
    { path: "/certifications", label: "Certifications", icon: Award },
    { path: "/companies", label: "Companies", icon: Building2 },
    { path: "/reviews", label: "Reviews", icon: Star },
    { path: "/salaries", label: "Salaries", icon: DollarSign },
    { path: "/alumni", label: "Alumni", icon: Users },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#2d694f]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section - Left */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <div className="flex items-center rounded-sm bg-white px-3 py-2 shadow-sm">
              <img
                src="/assets/csu-logo-email-signature.png"
                alt="Cleveland State University"
                className="h-7 w-auto sm:h-8"
              />
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6 flex-1 ml-12">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 text-sm font-semibold transition-colors ${
                    isActive(item.path)
                      ? "text-[#7ebc45]"
                      : "text-white hover:text-[#7ebc45]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Section - More Nav + User */}
          <div className="flex items-center space-x-8 ml-auto">
            {/* Additional Nav Items */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.slice(3).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 text-sm font-semibold transition-colors ${
                      isActive(item.path)
                        ? "text-[#7ebc45]"
                        : "text-white hover:text-[#7ebc45]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Section */}
            {user ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-none p-0 hover:bg-[#274c37]">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#7ebc45] font-semibold text-[#2d694f]">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[340px] max-w-none rounded-none border-l border-[#d5d8db] bg-background p-0 text-foreground dark:border-[#3b443f]">
                  <SheetHeader className="border-b border-[#d5d8db] bg-[#2d694f] p-6 text-left">
                    <div className="flex items-center gap-4 pr-8">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-[#7ebc45] text-lg font-semibold text-[#2d694f]">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <SheetTitle className="truncate text-white">{user.name}</SheetTitle>
                        <SheetDescription className="mt-1 text-white/80">
                          {user.email}
                          <br />
                          {user.role}
                          {user.graduationYear && ` • Class of ${user.graduationYear}`}
                        </SheetDescription>
                      </div>
                    </div>
                  </SheetHeader>

                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <Link to="/saved-jobs">
                      <Button variant="outline" className="w-full justify-start rounded-none border-[#2d694f] text-[#2d694f] hover:bg-background hover:text-[#274c37] dark:border-[#7ebc45] dark:text-[#dce9dc] dark:hover:bg-[#232826] dark:hover:text-white">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Saved Jobs
                      </Button>
                    </Link>

                    <Link to="/saved-certifications">
                      <Button variant="outline" className="w-full justify-start rounded-none border-[#2d694f] text-[#2d694f] hover:bg-background hover:text-[#274c37] dark:border-[#7ebc45] dark:text-[#dce9dc] dark:hover:bg-[#232826] dark:hover:text-white">
                        <Award className="mr-2 h-4 w-4" />
                        Saved Certifications
                      </Button>
                    </Link>

                    <Link to="/learning-plan">
                      <Button variant="outline" className="w-full justify-start rounded-none border-[#2d694f] text-[#2d694f] hover:bg-background hover:text-[#274c37] dark:border-[#7ebc45] dark:text-[#dce9dc] dark:hover:bg-[#232826] dark:hover:text-white">
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Learning Plan
                      </Button>
                    </Link>

                    <Link to="/applications">
                      <Button variant="outline" className="w-full justify-start rounded-none border-[#2d694f] text-[#2d694f] hover:bg-background hover:text-[#274c37] dark:border-[#7ebc45] dark:text-[#dce9dc] dark:hover:bg-[#232826] dark:hover:text-white">
                        <Briefcase className="mr-2 h-4 w-4" />
                        My Applications
                      </Button>
                    </Link>

                    <Link to="/documents">
                      <Button variant="outline" className="w-full justify-start rounded-none border-[#2d694f] text-[#2d694f] hover:bg-background hover:text-[#274c37] dark:border-[#7ebc45] dark:text-[#dce9dc] dark:hover:bg-[#232826] dark:hover:text-white">
                        <FileText className="mr-2 h-4 w-4" />
                        Documents
                      </Button>
                    </Link>

                    {user.role === "admin" && (
                      <Link to="/admin">
                        <Button variant="outline" className="w-full justify-start rounded-none border-[#2d694f] text-[#2d694f] hover:bg-background hover:text-[#274c37] dark:border-[#7ebc45] dark:text-[#dce9dc] dark:hover:bg-[#232826] dark:hover:text-white">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}

                    <div className="rounded-none border border-[#d5d8db] bg-card p-4 dark:border-[#3b443f]">
                      <div className="mb-4 flex items-center gap-3">
                        <Settings className="h-5 w-5 text-[#2d694f] dark:text-[#7ebc45]" />
                        <div>
                          <p className="text-sm font-semibold text-[#2d694f] dark:text-[#dce9dc]">Account Settings</p>
                          <p className="text-xs text-[#5f6368] dark:text-[#aeb8b0]">Update your profile, saved items, and display preferences.</p>
                        </div>
                      </div>

                      <Link to="/settings">
                        <Button variant="outline" className="mb-4 w-full justify-start rounded-none border-[#2d694f] text-[#2d694f] hover:bg-background hover:text-[#274c37] dark:border-[#7ebc45] dark:text-[#dce9dc] dark:hover:bg-[#232826] dark:hover:text-white">
                          <Settings className="mr-2 h-4 w-4" />
                          Open Settings
                        </Button>
                      </Link>

                      <div className="flex items-center justify-between gap-4 border-t border-[#d5d8db] pt-4 dark:border-[#3b443f]">
                        <div className="flex items-start gap-3">
                          <Moon className="mt-0.5 h-4 w-4 text-[#2d694f] dark:text-[#7ebc45]" />
                          <div>
                            <p className="text-sm font-semibold text-[#2d694f] dark:text-[#dce9dc]">Dark Mode</p>
                            <p className="text-xs text-[#5f6368] dark:text-[#aeb8b0]">Apply a darker CSU-style theme across the site.</p>
                          </div>
                        </div>
                        <Switch
                          checked={isDarkMode}
                          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                          aria-label="Toggle dark mode"
                        />
                      </div>
                    </div>

                    {user.role === "admin" && (
                      <Button
                        variant="outline"
                        onClick={onSwitchAccount}
                        className="w-full justify-start rounded-none border-[#2d694f] text-[#2d694f] hover:bg-background hover:text-[#274c37] dark:border-[#7ebc45] dark:text-[#dce9dc] dark:hover:bg-[#232826] dark:hover:text-white"
                      >
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Switch Account
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={onLogout}
                      className="w-full justify-start rounded-none border-[#274c37] text-[#274c37] hover:bg-background dark:border-[#7ebc45] dark:text-[#dce9dc] dark:hover:bg-[#232826] dark:hover:text-white"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button 
                onClick={onLoginClick} 
                className="h-10 bg-[#7ebc45] px-4 py-2 font-semibold text-[#2d694f] hover:bg-[#274c37] hover:text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
