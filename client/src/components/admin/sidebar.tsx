import { Home, LayoutDashboard, DoorOpen, Users, CreditCard, AlertTriangle, Megaphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "rooms", label: "Rooms", icon: DoorOpen },
    { id: "tenants", label: "Tenants", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "complaints", label: "Complaints", icon: AlertTriangle },
    { id: "announcements", label: "Announcements", icon: Megaphone },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Home className="text-white h-5 w-5" />
          </div>
          <div className="ml-3">
            <h2 className="font-medium text-gray-900">PG Manager</h2>
            <p className="text-sm text-gray-600">Admin Panel</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                isActive
                  ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="text-white h-4 w-4" />
          </div>
          <span className="ml-2 text-sm font-medium text-gray-900">{user?.name}</span>
        </div>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-blue-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
