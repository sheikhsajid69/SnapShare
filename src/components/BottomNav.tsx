import { Home, Search, PlusSquare, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Search, path: "/search", label: "Search" },
    { icon: PlusSquare, path: "/create", label: "Create" },
    { icon: User, path: `/profile/${user?.id}`, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex-1 flex items-center justify-center h-full"
              aria-label={item.label}
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;