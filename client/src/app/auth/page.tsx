"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { authService } from "@/services/authService"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useUser } from "@/contexts/userContext"
import { useRedirectIfAuthenticated } from "@/hooks/useAuthGuard"
import axios from "axios"; // <-- Make sure this import is present

export default function LoginPage() {
  useRedirectIfAuthenticated(); // Redirect if already authenticated
  const router = useRouter();
  const { setUser } = useUser();
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLogin) {
      try {
        const loginResponse = await authService.login({
          email,
          password,
        });

        if (loginResponse && loginResponse.user) {
          setUser(loginResponse.user);
          toast.success("Login successful!");
          router.push("/public-feed");
        } else {
          setError(loginResponse.message || "An unexpected error occurred.");
        }
      } catch (error: unknown) {
        console.error("Login error:", error);
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? String(error.response.data.message)
            : "Login failed. Please check your credentials.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      // Signup logic
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        setLoading(false);
        return;
      }

      try {
        toast.loading("Creating your account...");
        const signupResponse = await authService.signup({
          email,
          password,
        });

        if (signupResponse && signupResponse.user) {
          toast.dismiss();
          setUser(signupResponse.user);
          toast.success("Account created successfully!");
          router.push("/public-feed");
        } else {
          setError(signupResponse.message || "Signup failed. Please try again.");
        }
      } catch (err) {
        console.error("Signup error:", err);
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : "An error occurred during signup.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="dark flex min-h-screen items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Red gradient background */}
      <div className="dark absolute inset-0 z-0 bg-gradient-to-br from-red-900/40 via-transparent to-transparent opacity-75" />
      <div className="dark absolute inset-0 z-0 bg-gradient-to-tl from-red-900/30 via-transparent to-transparent opacity-55" />a

      <Card className="dark w-full max-w-md bg-card/40 border-zinc-800 text-foreground shadow-lg relative z-10">
        <CardHeader className="dark pb-4 border-b border-zinc-800 text-center">
          <CardTitle className="dark text-red-primary text-3xl font-bold">
            {isLogin ? "Welcome Back!" : "Join LinkSlam!"}
          </CardTitle>
          <CardDescription className="dark text-zinc-400">
            {isLogin ? "Sign in to your account" : "Create your account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent className="dark pt-6">
          <div className="dark flex items-center justify-center mb-6">
            {isLogin ? (
              <p className="dark text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => setIsLogin(false)}
                  className="dark p-0 h-auto text-red-400 hover:text-red-500 hover:cursor-pointer"
                >
                  Sign Up
                </Button>
              </p>
            ) : (
              <p className="dark text-sm text-zinc-400">
                Already have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => setIsLogin(true)}
                  className="dark p-0 h-auto text-red-400 hover:text-red-500 hover:cursor-pointer"
                >
                  Login
                </Button>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="dark space-y-4">
            {/* {!isLogin && (
              <div className="dark space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="dark relative">
                  <User className="dark absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="dark pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required={!isLogin}
                  />
                </div>
              </div>
            )} */}
            <div className="dark space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="dark relative">
                <Mail className="dark absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  name ="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dark pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>
            </div>
            <div className="dark space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="dark relative">
                <Lock className="dark absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dark pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>
            </div>
            {!isLogin && (
              <div className="dark space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="dark relative">
                  <Lock className="dark absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="dark pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {error && <p className="dark text-red-500 text-sm text-center">{error}</p>}

            <Button
              type="submit"
              className="dark w-full bg-red-500 text-red-500-foreground hover:bg-red-400 transition-colors hover:cursor-pointer "
              disabled={loading}
              
            >
              {loading ? (
                <span className="dark flex items-center justify-center">
                  <Loader2 className="dark mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Logging In..." : "Signing Up..."}
                </span>
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="dark relative my-6">
            <div className="dark absolute inset-0 flex items-center">
              <span className="dark w-full border-t border-zinc-800" />
            </div>
            <div className="dark relative flex justify-center text-xs uppercase">
              <span className="dark bg-[#121110] px-2 text-zinc-500">Or continue with</span>
            </div>
          </div>

          <Button
            // variant="outline"
            className="dark w-full bg-zinc-200 text-zinc-900 border-zinc-700 hover:bg-zinc-300 hover:cursor-pointer transition-colors"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Image src="/Google_logo.svg" alt="Google" width={16} height={16} />

            Continue with Google
          </Button>
          

          <p className="dark text-center text-sm text-zinc-500 mt-6">
            By {isLogin ? "logging in" : "signing up"}, you agree to our{" "}
            <Link href="#" className="dark text-red-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="dark text-red-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}