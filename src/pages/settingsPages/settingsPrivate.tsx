import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import {
  changePassword,
  deleteAccount,
  logout,
  updateProfile,
  getUserProfile,
} from "@/services/auth";
import type { UserProfileDto } from "@/types/user";

// Схемы валидации - УПРОЩЕННЫЕ для тестирования
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Minimum 6 characters"), // Изменено с 8 на 6 для соответствия бэкенду
    // Убраны regex для тестирования
    confirmPassword: z.string().min(1, "Confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Схема для изменения email и username
const profileUpdateSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;

export function SettingsPrivate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState({
    password: false,
    profile: false,
    delete: false,
  });
  const [currentProfile, setCurrentProfile] = useState<UserProfileDto | null>(
    null,
  );

  // Загружаем текущий профиль
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getUserProfile();
      setCurrentProfile(profile);

      // Заполняем форму текущими значениями
      profileForm.reset({
        email: profile.email,
        username: profile.username,
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile data");
    }
  };

  // Формы
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const profileForm = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      email: "",
      username: "",
    },
  });

  // Изменение пароля
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsLoading((prev) => ({ ...prev, password: true }));

    const loadingToast = toast.loading("Changing password...");

    try {
      // ВАЖНО: Отправляем ВСЕ три поля как требует бэкенд
      const requestData = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword, // Добавляем confirmPassword
      };

      const result = await changePassword(requestData);

      passwordForm.reset();

      toast.dismiss(loadingToast);
      toast.success("Password changed successfully", {
        description: result.message || "Password updated successfully",
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);

      console.error("Password change error details:", {
        error,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = "Failed to change password";

      if (error.response?.data?.errors) {
        // Обработка валидационных ошибок ASP.NET Core
        const validationErrors = error.response.data.errors;
        const errorMessages: string[] = [];

        for (const [field, messages] of Object.entries(validationErrors)) {
          if (Array.isArray(messages)) {
            errorMessages.push(...messages);
          }
        }

        errorMessage = errorMessages.join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error("Password Change Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, password: false }));
    }
  };

  // Обновление профиля (email и username)
  const onProfileSubmit = async (data: ProfileUpdateValues) => {
    setIsLoading((prev) => ({ ...prev, profile: true }));

    const loadingToast = toast.loading("Updating profile...");

    try {
      console.log("Updating profile with:", data);

      const updatedProfile = await updateProfile(data);

      setCurrentProfile(updatedProfile);

      toast.dismiss(loadingToast);
      toast.success("Profile updated successfully", {
        description: `Email: ${updatedProfile.email}, Username: ${updatedProfile.username}`,
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);

      console.error("Profile update error:", error.response?.data || error);

      let errorMessage = "Failed to update profile";

      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages: string[] = [];

        for (const [field, messages] of Object.entries(validationErrors)) {
          if (Array.isArray(messages)) {
            errorMessages.push(...messages);
          }
        }

        errorMessage = errorMessages.join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error("Profile Update Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  // Удаление аккаунта
  const onDeleteAccount = async () => {
    setIsLoading((prev) => ({ ...prev, delete: true }));

    const loadingToast = toast.loading("Deleting account...");

    try {
      const result = await deleteAccount();

      toast.dismiss(loadingToast);
      toast.success("Account deleted", {
        description: result.message || "Account successfully deleted",
      });

      // Выход и редирект
      setTimeout(() => {
        logout();
        navigate("/auth");
      }, 2000);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Deletion Failed", {
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete account",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account credentials and security settings
        </p>
      </div>

      <Separator />

      {/* Current Profile Info */}
      {currentProfile && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Current Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Username</p>
                <p className="font-semibold">{currentProfile.username}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Email</p>
                <p className="font-semibold">{currentProfile.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Update Profile (Email and Username) */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl">Update Profile</CardTitle>
          <CardDescription>
            Update your email address and username
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-5"
            >
              <FormField
                control={profileForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter new username"
                        {...field}
                        disabled={isLoading.profile}
                        className="max-w-md"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Minimum 3 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="newemail@example.com"
                        {...field}
                        disabled={isLoading.profile}
                        className="max-w-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading.profile}
                  className="min-w-32"
                >
                  {isLoading.profile ? (
                    <>
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => profileForm.reset()}
                  disabled={isLoading.profile}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl">Change Password</CardTitle>
          <CardDescription>
            Update your account password. Minimum 6 characters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-5"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter current password"
                        {...field}
                        disabled={isLoading.password}
                        className="max-w-md"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create new password (min 6 chars)"
                        {...field}
                        disabled={isLoading.password}
                        className="max-w-md"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Minimum 6 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Repeat new password"
                        {...field}
                        disabled={isLoading.password}
                        className="max-w-md"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading.password}
                  className="min-w-32"
                >
                  {isLoading.password ? (
                    <>
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                      Saving...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => passwordForm.reset()}
                  disabled={isLoading.password}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-2 border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-xl text-destructive">
            Delete Account
          </CardTitle>
          <CardDescription className="text-destructive/80">
            This action is irreversible. All your progress and data will be
            removed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
              <p className="text-sm font-medium text-destructive">
                ⚠️ Warning: Account Deletion
              </p>
              <ul className="mt-2 space-y-1 text-sm text-destructive/80">
                <li>• All your habits and progress history will be deleted</li>
                <li>• This action cannot be undone</li>
                <li>• All your personal data will be permanently removed</li>
              </ul>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="min-w-40">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive">
                    Are you sure you want to delete your account?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <p>This will result in:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Complete deletion of all your data</li>
                      <li>Loss of habit history and progress</li>
                      <li>Inability to restore your account</li>
                    </ul>
                    <p className="pt-2 font-medium">
                      This action is irreversible!
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLoading.delete}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteAccount}
                    disabled={isLoading.delete}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    {isLoading.delete ? (
                      <>
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete Account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground border-t pt-4">
          After deletion, you will be redirected to the login page
        </CardFooter>
      </Card>
    </div>
  );
}
