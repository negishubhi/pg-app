import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Upload, User } from "lucide-react";
import { ComplaintForm } from "./complaint-form";

interface QuickActionsProps {
  tenantId: number;
}

export function QuickActions({ tenantId }: QuickActionsProps) {
  const actions = [
    {
      icon: CreditCard,
      label: "Pay Rent",
      onClick: () => {
        // TODO: Implement payment functionality
        console.log("Pay rent clicked");
      },
    },
    {
      icon: Upload,
      label: "Upload Document",
      onClick: () => {
        // TODO: Implement document upload
        console.log("Upload document clicked");
      },
    },
    {
      icon: User,
      label: "Update Profile",
      onClick: () => {
        // TODO: Implement profile update
        console.log("Update profile clicked");
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 transition-colors duration-200"
                onClick={action.onClick}
              >
                <Icon className="h-6 w-6 text-blue-600" />
                <span className="text-sm text-gray-900 font-medium">{action.label}</span>
              </Button>
            );
          })}
          <ComplaintForm tenantId={tenantId} />
        </div>
      </CardContent>
    </Card>
  );
}
