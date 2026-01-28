import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/providers/themeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Trophy,
  TrendingUp,
  BarChart3,
  Calendar,
  CheckCircle,
  Sparkles,
  Shield,
  Zap,
  Target,
  Clock,
  Award,
  Users,
  ArrowRight,
  Star,
  CalendarDays,
  ChartBar,
  Goal,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Preview() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: <CalendarDays className="h-10 w-10" />,
      title: "Daily Habit Tracking",
      description:
        "Track your habits every day with simple check-ins. Build consistency through daily accountability.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <ChartBar className="h-10 w-10" />,
      title: "Progress Visualization",
      description:
        "Beautiful heatmaps and charts show your consistency and growth over time.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Personal Analytics",
      description:
        "See your success rates, streaks, and patterns with detailed statistics.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Goal className="h-10 w-10" />,
      title: "Goal Setting",
      description:
        "Set custom goals and track your progress towards achieving them.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: "Achievement System",
      description: "Unlock badges and milestones as you build lasting habits.",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Privacy Focused",
      description:
        "Your habits are private. We never share your personal data.",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const stats = [
    {
      value: "30+",
      label: "Days Average Streak",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      value: "89%",
      label: "Success Rate",
      icon: <Target className="h-5 w-5" />,
    },
    {
      value: "24/7",
      label: "Accessibility",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      value: "95%",
      label: "User Satisfaction",
      icon: <Star className="h-5 w-5" />,
    },
  ];

  const handleGetStarted = () => {
    toast.success("Let's begin your habit journey!", {
      description: "Creating positive habits starts today.",
      duration: 3000,
    });
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast.info(`Switched to ${newTheme} theme`, {
      duration: 2000,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              HabitTracker
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button asChild variant="ghost">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="ml-2">
              <Link to="/register" onClick={handleGetStarted}>
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Button asChild variant="ghost" className="justify-start">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="justify-start">
                <Link
                  to="/register"
                  onClick={() => {
                    handleGetStarted();
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

        <div className="container mx-auto max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 py-2 px-4 text-sm font-semibold bg-primary/10 text-primary hover:bg-primary/20">
              <Sparkles className="h-4 w-4 mr-2" />
              BUILD BETTER HABITS, BUILD A BETTER YOU
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="block">Transform Your Life</span>
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                One Habit at a Time
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 px-4">
              HabitTracker helps you build positive routines, track your
              progress, and achieve your personal goals with intuitive tools and
              beautiful analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 h-auto rounded-full"
                asChild
              >
                <Link to="/register" onClick={handleGetStarted}>
                  Start Your Journey Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto rounded-full"
                asChild
              >
                <Link to="/login">
                  <div className="flex items-center">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    See How It Works
                  </div>
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex justify-center mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="block text-primary">Succeed</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Powerful features designed to help you build and maintain positive
              habits
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/20">
                  <CardContent className="p-6 sm:p-8">
                    <div
                      className={`mb-4 sm:mb-6 p-3 rounded-xl bg-gradient-to-br ${feature.color} w-fit`}
                    >
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Visualize Your
                <span className="block text-primary">Progress</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                See your habit journey unfold with beautiful, interactive
                visualizations that make tracking satisfying and motivating.
              </p>

              <div className="space-y-3 sm:space-y-4">
                {[
                  {
                    name: "Morning Exercise",
                    color: "bg-blue-500",
                    completion: 85,
                  },
                  {
                    name: "Read 20 Pages",
                    color: "bg-green-500",
                    completion: 92,
                  },
                  { name: "Meditate", color: "bg-purple-500", completion: 78 },
                  {
                    name: "Learn New Skill",
                    color: "bg-orange-500",
                    completion: 65,
                  },
                ].map((habit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full ${habit.color}`}
                      />
                      <span className="text-sm sm:text-base font-medium">
                        {habit.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${habit.color}`}
                          style={{ width: `${habit.completion}%` }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold">
                        {habit.completion}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Card className="border-2 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold">
                          Weekly Overview
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Your consistency heatmap
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Live Demo
                      </Badge>
                    </div>

                    {/* Heatmap Demo */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-6">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "aspect-square rounded",
                            i % 7 === 0
                              ? "bg-green-500/80"
                              : i % 5 === 0
                                ? "bg-green-400/60"
                                : i % 3 === 0
                                  ? "bg-green-300/40"
                                  : "bg-muted",
                          )}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        <span>4-week streak</span>
                      </div>
                      <div className="text-primary font-semibold">
                        +12% this month
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10" />

        <div className="container mx-auto max-w-4xl relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 sm:mb-6 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold bg-primary/10 text-primary">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              START YOUR JOURNEY TODAY
            </Badge>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Transform
              <span className="block text-primary">Your Habits?</span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-10 max-w-2xl mx-auto px-4">
              Join thousands who have already started their journey to a better
              life. It's free to start, and you'll see results in days.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-7 h-auto rounded-full shadow-lg hover:shadow-xl transition-shadow"
                asChild
              >
                <Link to="/register" onClick={handleGetStarted}>
                  <Sparkles className="mr-2 sm:mr-3 h-4 w-4 sm:h-6 sm:w-6" />
                  Start Free Today
                  <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-7 h-auto rounded-full"
                asChild
              >
                <Link to="/login">
                  <Users className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  Already have an account?
                </Link>
              </Button>
            </div>

            <div className="mt-8 sm:mt-10 text-xs sm:text-sm text-muted-foreground">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>No credit card required</span>
                </div>
                <Separator
                  orientation="vertical"
                  className="hidden sm:block h-4"
                />
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Setup in 2 minutes</span>
                </div>
                <Separator
                  orientation="vertical"
                  className="hidden sm:block h-4"
                />
                <div className="flex items-center gap-1 sm:gap-2">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 md:mb-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Target className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold">HabitTracker</div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Build better habits, daily
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-6 justify-center mb-6 md:mb-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs sm:text-sm"
                asChild
              >
                <Link to="/about">About</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs sm:text-sm"
                asChild
              >
                <Link to="/features">Features</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs sm:text-sm"
                asChild
              >
                <Link to="/contact">Contact</Link>
              </Button>
            </div>
          </div>

          <Separator className="my-6 sm:my-8" />

          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} HabitTracker. All rights reserved. Made
            with <span className="text-red-500">❤️</span> for building better
            habits.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper component for PlayCircle icon
const PlayCircle = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-5 w-5", className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
