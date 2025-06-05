import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DoorOpen, CreditCard, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { TenantWithUserAndRoom } from "@shared/schema";

interface RoomInfoProps {
  tenant: TenantWithUserAndRoom;
}

export function RoomInfo({ tenant }: RoomInfoProps) {
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/payments/tenant", tenant.id],
  });

  const { data: complaints = [], isLoading: complaintsLoading } = useQuery({
    queryKey: ["/api/complaints/tenant", tenant.id],
  });

  // Get current month payment status
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const currentPayment = payments.find((p: any) => p.month === currentMonth);
  const openComplaints = complaints.filter((c: any) => c.status === "open" || c.status === "in_progress");

  const getPaymentStatus = () => {
    if (!currentPayment) {
      return { status: "Not Generated", color: "text-gray-600", bgColor: "bg-gray-100", icon: Clock };
    }
    
    switch (currentPayment.status) {
      case "paid":
        return { status: "PAID", color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle };
      case "pending":
        return { status: "PENDING", color: "text-yellow-600", bgColor: "bg-yellow-100", icon: Clock };
      case "overdue":
        return { status: "OVERDUE", color: "text-red-600", bgColor: "bg-red-100", icon: XCircle };
      default:
        return { status: "UNKNOWN", color: "text-gray-600", bgColor: "bg-gray-100", icon: Clock };
    }
  };

  const paymentStatus = getPaymentStatus();
  const StatusIcon = paymentStatus.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DoorOpen className="text-blue-600 h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Room Details</h3>
              <p className="text-gray-600">Your current room</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Room Number:</span>
              <span className="text-gray-900 font-medium">{tenant.room.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="text-gray-900 capitalize">{tenant.room.type} Occupancy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Rent:</span>
              <span className="text-gray-900 font-medium">₹{tenant.room.rent.toLocaleString()}</span>
            </div>
            {tenant.room.amenities && tenant.room.amenities.length > 0 && (
              <div className="pt-2">
                <span className="text-gray-600 text-xs">Amenities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tenant.room.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 ${paymentStatus.bgColor} rounded-lg flex items-center justify-center`}>
              <StatusIcon className={`${paymentStatus.color} h-6 w-6`} />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Payment Status</h3>
              <p className="text-gray-600">Current month</p>
            </div>
          </div>
          {paymentsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <div className="text-center">
              <div className={`text-2xl font-semibold ${paymentStatus.color} mb-2`}>
                {paymentStatus.status}
              </div>
              {currentPayment && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Amount: ₹{currentPayment.amount?.toLocaleString()}
                  </p>
                  {currentPayment.paidAt ? (
                    <p className="text-sm text-gray-600">
                      Paid: {new Date(currentPayment.paidAt).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Due: {new Date(currentPayment.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              openComplaints.length > 0 ? "bg-red-100" : "bg-green-100"
            }`}>
              <AlertTriangle className={`h-6 w-6 ${
                openComplaints.length > 0 ? "text-red-600" : "text-green-600"
              }`} />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Active Issues</h3>
              <p className="text-gray-600">Open complaints</p>
            </div>
          </div>
          {complaintsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <div className="text-center">
              <div className={`text-2xl font-semibold mb-2 ${
                openComplaints.length > 0 ? "text-red-600" : "text-green-600"
              }`}>
                {openComplaints.length}
              </div>
              <p className="text-sm text-blue-600 hover:underline cursor-pointer">
                {openComplaints.length > 0 ? "View Issues" : "All Clear!"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
