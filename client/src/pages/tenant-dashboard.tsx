import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Home } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { RoomInfo } from "@/components/tenant/room-info";
import { QuickActions } from "@/components/tenant/quick-actions";
import { AnnouncementsList } from "@/components/tenant/announcements-list";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function TenantDashboard() {
  const { user, signOut } = useAuth();

  const { data: tenant, isLoading } = useQuery({
    queryKey: ["/api/tenants/user", user?.id],
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">No Room Assigned</h2>
            <p className="text-gray-600 mb-4">
              You are not currently assigned to any room. Please contact the administrator.
            </p>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Home className="text-white h-5 w-5" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-medium text-gray-900">Tenant Portal</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative text-gray-600 hover:text-blue-600"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Button>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Room Info Cards */}
        <RoomInfo tenant={tenant} />

        {/* Quick Actions */}
        <QuickActions tenantId={tenant.id} />

        {/* Announcements */}
        <AnnouncementsList />
      </div>
    </div>
  );
}
