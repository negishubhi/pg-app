import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Phone, Home, Calendar } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { TenantWithUserAndRoom } from "@shared/schema";

export function Tenants() {
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["/api/tenants"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-gray-900">Tenant Management</h2>
          <p className="text-gray-600">Manage tenant information and room assignments</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Users className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant: TenantWithUserAndRoom) => (
          <Card key={tenant.id}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users className="text-white h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{tenant.user.name}</h3>
                  <p className="text-sm text-gray-600">Room {tenant.room.number}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone:
                  </span>
                  <span className="text-gray-900">{tenant.user.phone || "N/A"}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    Rent:
                  </span>
                  <span className="text-gray-900">₹{tenant.room.rent.toLocaleString()}/month</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Join Date:
                  </span>
                  <span className="text-gray-900">
                    {new Date(tenant.joinDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={tenant.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {tenant.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  View
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tenants.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first tenant.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
