import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SplitLoginCard() {
  return (
    <div
      className={cn(
        "flex w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border bg-background shadow-lg",
        "md:mx-auto md:flex-row dark:border-gray-800"
      )}
    >
      {/* Left: Welcome Back only (animated) */}
      <div className="flex flex-col items-center justify-center bg-primary-600 p-8 text-white dark:bg-primary-700 md:w-1/2">
        <motion.h2
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          Welcome Back!
        </motion.h2>
      </div>

      {/* Right: Login form */}
      <div className="flex flex-col justify-center p-6 sm:p-8 md:w-1/2">
        <h3 className="mb-6 text-2xl font-semibold text-foreground">Sign In</h3>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              type="email"
              placeholder="you@example.com"
              className="mt-1"
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="signin-password">Password</Label>
            <Input
              id="signin-password"
              type="password"
              placeholder="********"
              className="mt-1"
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="mt-6 w-full">
            Login
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="#" className="font-medium text-primary-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
