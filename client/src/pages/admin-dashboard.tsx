import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/admin/sidebar";
import { Overview } from "@/components/admin/overview";
import { Rooms } from "@/components/admin/rooms";
import { Tenants } from "@/components/admin/tenants";
import { Payments } from "@/components/admin/payments";
import { Complaints } from "@/components/admin/complaints";
import { Announcements } from "@/components/admin/announcements";
import { useAuth } from "@/contexts/auth-context";

export default function AdminDashboard() {
  const [currentSection, setCurrentSection] = useState("overview");
  const { user } = useAuth();

  const sectionTitles = {
    overview: "Dashboard Overview",
    rooms: "Room Management", 
    tenants: "Tenant Management",
    payments: "Payment Management",
    complaints: "Complaint Management",
    announcements: "Announcements",
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "overview":
        return <Overview />;
      case "rooms":
        return <Rooms />;
      case "tenants":
        return <Tenants />;
      case "payments":
        return <Payments />;
      case "complaints":
        return <Complaints />;
      case "announcements":
        return <Announcements />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-gray-900">
                {sectionTitles[currentSection as keyof typeof sectionTitles]}
              </h1>
              <p className="text-gray-600 mt-1">Manage your PG properties efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="relative text-gray-600 hover:text-blue-600"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {renderCurrentSection()}
        </div>
      </div>
    </div>
  );
}
