import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Separator } from "@/components/ui/separator";
import { registerAndLogin } from "@/services/auth";

// Схема валидации
const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers and underscores allowed",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// Компонент для показа требований к паролю
const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "Uppercase letter (A-Z)", regex: /[A-Z]/ },
    { label: "Lowercase letter (a-z)", regex: /[a-z]/ },
    { label: "Number (0-9)", regex: /[0-9]/ },
    { label: "Special character (!@#$%^&*)", regex: /[^A-Za-z0-9]/ },
  ];

  return (
    <div className="space-y-2 mt-2">
      <p className="text-sm font-medium">Password must contain:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => {
          const isValid = req.regex.test(password);
          return (
            <li key={index} className="flex items-center gap-2 text-sm">
              {isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-300" />
              )}
              <span className={isValid ? "text-green-600" : "text-gray-500"}>
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Инициализация формы
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Валидация при вводе
  });

  // Получаем значения для отслеживания
  const password = form.watch("password");

  // Обработка регистрации
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    const loadingToast = toast.loading("Creating your account...");

    try {
      // Регистрируем и авторизуем
      const authResponse = await registerAndLogin({
        email: data.email,
        username: data.username,
        password: data.password,
        // confirmPassword не отправляется на бэкенд
      });

      toast.dismiss(loadingToast);

      // Показываем успешное уведомление
      toast.success("Account created successfully!", {
        description: `Welcome, ${authResponse.user.username}!`,
        duration: 3000,
      });

      // Редирект на главную страницу
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (error: any) {
      toast.dismiss(loadingToast);

      console.error("Registration error:", error.response?.data || error);

      let errorMessage = "Registration failed";
      let errorDetails = "";

      if (error.response?.data?.errors) {
        // Обработка валидационных ошибок ASP.NET Core
        const validationErrors = error.response.data.errors;
        const errorMessages: string[] = [];

        for (const [field, messages] of Object.entries(validationErrors)) {
          if (Array.isArray(messages)) {
            errorMessages.push(...messages);
          }
        }

        errorMessage = "Validation failed";
        errorDetails = errorMessages.join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        errorDetails = error.response.data.details || "";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        description: errorDetails,
        duration: 5000,
      });

      // Устанавливаем ошибку в соответствующее поле формы
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;

        if (validationErrors.Email) {
          form.setError("email", {
            type: "server",
            message: validationErrors.Email[0],
          });
        }
        if (validationErrors.Username) {
          form.setError("username", {
            type: "server",
            message: validationErrors.Username[0],
          });
        }
        if (validationErrors.Password) {
          form.setError("password", {
            type: "server",
            message: validationErrors.Password[0],
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Register to start tracking your habits
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      We'll never share your email with anyone else
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter username"
                        {...field}
                        disabled={isLoading}
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      3-20 characters, letters, numbers and underscores only
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          {...field}
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    {password && <PasswordRequirements password={password} />}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Repeat your password"
                          {...field}
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <Separator className="my-2" />

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>

          {/* Terms & Privacy Notice */}
          <p className="text-xs text-center text-muted-foreground px-4">
            By registering, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
