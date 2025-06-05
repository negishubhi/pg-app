import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/ui/stats-card";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpen, Users, CreditCard, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function Overview() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: complaints, isLoading: complaintsLoading } = useQuery({
    queryKey: ["/api/complaints"],
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const recentPayments = payments?.slice(0, 3) || [];
  const recentComplaints = complaints?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Rooms"
          value={stats?.totalRooms || 0}
          icon={DoorOpen}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Active Tenants"
          value={stats?.activeTenants || 0}
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`₹${stats?.monthlyRevenue?.toLocaleString() || 0}`}
          icon={CreditCard}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
        <StatsCard
          title="Pending Issues"
          value={stats?.pendingComplaints || 0}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : recentPayments.length > 0 ? (
              <div className="space-y-3">
                {recentPayments.map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600 h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">
                          {payment.tenant?.user?.name} - Room {payment.tenant?.room?.number}
                        </p>
                        <p className="text-sm text-gray-600">
                          {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Payment due'}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-600">₹{payment.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No recent payments</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            {complaintsLoading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : recentComplaints.length > 0 ? (
              <div className="space-y-3">
                {recentComplaints.map((complaint: any) => (
                  <div key={complaint.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        complaint.priority === 'high' ? 'bg-red-100' : 
                        complaint.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <AlertTriangle className={`h-5 w-5 ${
                          complaint.priority === 'high' ? 'text-red-600' : 
                          complaint.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{complaint.title}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      complaint.priority === 'high' ? 'bg-red-100 text-red-600' : 
                      complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {complaint.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No recent complaints</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
