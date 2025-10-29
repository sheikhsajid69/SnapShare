import { Home, Search, PlusSquare, User, Instagram } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const Sidebar = () => {
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
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-instagram flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold">Instagram</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-muted font-medium"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-base">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
