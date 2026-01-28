import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { logout } from "@/services/auth";
import {
  LogOut,
  Shield,
  Database,
  Globe,
  Bell,
  RefreshCw,
  Trash2,
} from "lucide-react";

export function SettingsSystem() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully", {
      description: "You have been signed out of your account",
    });
    navigate("/preview");
  };

  const handleClearCache = () => {
    // В реальном приложении здесь будет логика очистки кэша
    toast.info("Cache cleared", {
      description: "Temporary data has been removed",
    });
  };

  const handleResetSettings = () => {
    toast.warning("Settings reset", {
      description: "All system settings have been restored to default",
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      <div>
        <h3 className="text-lg font-medium">System Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account session and system preferences
        </p>
      </div>

      <Separator />

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Session & Security
          </CardTitle>
          <CardDescription>
            Manage your current session and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-muted-foreground">
                  Active on this device
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Sign out from all devices
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to log out?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You will be signed out of your account and redirected to the
                  login page. Your data will remain safe and you can log back in
                  anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Yes, Log Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Manage cached data and storage settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <p className="font-medium">Clear Cache</p>
                <p className="text-sm text-muted-foreground">
                  Remove temporary app data
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearCache}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear Now
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <p className="font-medium">Reset All Settings</p>
                <p className="text-sm text-muted-foreground">
                  Restore system settings to default
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset all settings?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will restore all system preferences to their default
                      values. Your habits and progress will not be affected.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetSettings}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Reset Settings
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Application Information
          </CardTitle>
          <CardDescription>
            Details about your current app version
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">App Version</p>
              <p className="font-medium">1.0.17</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">January 2024</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Framework</p>
              <p className="font-medium">React + TypeScript</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">UI Library</p>
              <p className="font-medium">shadcn/ui</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="text-sm text-muted-foreground">
            HabitTracker - Build better habits daily
          </div>
        </CardFooter>
      </Card>

      {/* Quick Logout Button */}
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out of Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out from HabitTracker?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to enter your credentials again to access your
                account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Stay Signed In</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
              >
                <LogOut className="h-4 w-4" />
                Yes, Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
