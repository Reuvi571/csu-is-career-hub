import { Link, useLocation } from "react-router";
import { User } from "../data/mockData";
import { Button } from "./ui/button";
import { Briefcase, Building2, Star, DollarSign, Shield, LogOut, Users, Award, House } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface NavigationProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export function Navigation({ user, onLoginClick, onLogout }: NavigationProps) {
  const location = useLocation();

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
    <nav className="sticky top-0 z-50 bg-[#00795f]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section - Left */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex flex-col justify-start leading-tight">
              <div className="text-sm font-bold text-white tracking-tight">
                <span>CSU</span>
                <span className="ml-1 font-black text-[#8dc63f]">IS</span>
              </div>
              <div className="text-xs font-semibold text-white/85">Careers</div>
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
                      ? "text-[#b5d334]"
                      : "text-white hover:text-[#b5d334]"
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
                        ? "text-[#b5d334]"
                        : "text-white hover:text-[#b5d334]"
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
              <div className="flex items-center space-x-4">
                {user.role === "admin" && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-[#00684f] hover:text-[#b5d334]">
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-none hover:bg-[#00684f]">
                      <Avatar>
                        <AvatarFallback className="bg-[#8dc63f] font-semibold text-[#00795f]">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-600 capitalize">
                          {user.role}
                          {user.graduationYear && ` • Class of ${user.graduationYear}`}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button 
                onClick={onLoginClick} 
                className="h-10 bg-[#8dc63f] px-4 py-2 font-semibold text-[#00795f] hover:bg-[#79b52c]"
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
