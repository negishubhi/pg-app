import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface WelcomeBannerProps {
  title: string;
  subtitle: string;
  userName: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function WelcomeBanner({ 
  title, 
  subtitle, 
  userName, 
  primaryAction, 
  secondaryAction 
}: WelcomeBannerProps) {
  return (
    <Card className="gradient-bg border-0 text-white shadow-lg overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardContent className="p-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <h2 className="text-2xl font-bold">{title}</h2>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg">Welcome back, <span className="font-semibold">{userName}</span>!</p>
              <p className="text-blue-100 max-w-md">{subtitle}</p>
            </div>
            
            {(primaryAction || secondaryAction) && (
              <div className="flex items-center space-x-4 pt-2">
                {primaryAction && (
                  <Button 
                    onClick={primaryAction.onClick}
                    className="bg-white text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    {primaryAction.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {secondaryAction && (
                  <Button 
                    onClick={secondaryAction.onClick}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="hidden md:flex items-center justify-center w-32 h-32 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="text-4xl">🏠</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}