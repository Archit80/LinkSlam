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
import { authService } from "@/services/authService" // Adjust the import based on your auth service location
import { useRouter } from "next/navigation"
import { toast } from "sonner"


export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  // const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const API_BASE_URL = process.env.NEXT_API_BASE_URL || "http://localhost:8000"
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1500))

    if (isLogin) {
      // Login logic
       try {
        const response = await authService.login({
            email,
            password
        })
        // console.log("Login response:", response)
        if (response.status === 200) {
          // console.log("Login successful!")
          router.replace("/public-feed") 
        } else {
          setError(response.data || "Login failed. Please try again.")
        }
       } catch (error: unknown) {
        console.error("Login error:", error)
        const errorMessage = 
          error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response &&
          error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
            ? String(error.response.data.message)
            : "Login failed. Please try again.";
        setError(errorMessage)
       }
       
    } else {
      // Signup logic
      if (password !== confirmPassword) {
        setError("Passwords do not match.")
      } else if (password.length < 8) {
        setError("Password must be at least 8 characters long.")
      } else {
        try{
            toast.loading("Creating your account...");
            const response = await authService.signup({
                email,
                password,
            })
            // console.log(response);
            if (response.status === 201) {
                toast.dismiss();
                // console.log("Signup successful!");
                toast.success("Account created successfully!");
                router.replace("/auth/onboarding") ;
            } else {
                setError(response.data.message || "Signup failed. Please try again.")
            }
        } catch(err){
            console.error("Signup error:", err)
            setError("An error occurred during signup. Please try again.")
        }
        // Redirect or set user session
      }
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    // console.log("Initiating Google login...")
    // // Simulate Google OAuth flow
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    // setError("Google login not yet implemented.")
    // setLoading(false)
    try {
    //   const response = await authService.googleLogin();
    //   console.log("Google login response:", response)
      window.location.href = `${API_BASE_URL}/auth/google` // Redirect to your backend Google auth endpoint;
    //   if (response.status === 200) {
    //     console.log("Google login successful!")
    //     router.replace("/public-feed") 
    //   } else {
    //     setError(response.data || "Google login failed. Please try again.")
    //   }
    } catch (error: unknown) {
      console.error("Google login error:", error)
      const errorMessage = 
        error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
          ? String(error.response.data.message)
          : "Google login failed. Please try again.";
      setError(errorMessage)
    }

  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Red gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-900/40 via-transparent to-transparent opacity-75" />
      <div className="absolute inset-0 z-0 bg-gradient-to-tl from-red-900/30 via-transparent to-transparent opacity-55" />

      <Card className="w-full max-w-md bg-card/40 border-zinc-800 text-foreground shadow-lg relative z-10">
        <CardHeader className="pb-4 border-b border-zinc-800 text-center">
          <CardTitle className="text-red-primary text-3xl font-bold">
            {isLogin ? "Welcome Back!" : "Join LinkSlam!"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {isLogin ? "Sign in to your account" : "Create your account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-6">
            {isLogin ? (
              <p className="text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => setIsLogin(false)}
                  className="p-0 h-auto text-red-400 hover:text-red-500 hover:cursor-pointer"
                >
                  Sign Up
                </Button>
              </p>
            ) : (
              <p className="text-sm text-zinc-400">
                Already have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => setIsLogin(true)}
                  className="p-0 h-auto text-red-400 hover:text-red-500 hover:cursor-pointer"
                >
                  Login
                </Button>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required={!isLogin}
                  />
                </div>
              </div>
            )} */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  name ="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-red-500 text-red-500-foreground hover:bg-red-400 transition-colors hover:cursor-pointer "
              disabled={loading}
              
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Logging In..." : "Signing Up..."}
                </span>
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#121110] px-2 text-zinc-500">Or continue with</span>
            </div>
          </div>

          <Button
            // variant="outline"
            className="w-full bg-zinc-200 text-zinc-900 border-zinc-700 hover:bg-zinc-300 hover:cursor-pointer transition-colors"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Image src="/Google_logo.svg" alt="Google" width={16} height={16} />

            Continue with Google
          </Button>
          

          <p className="text-center text-sm text-zinc-500 mt-6">
            By {isLogin ? "logging in" : "signing up"}, you agree to our{" "}
            <Link href="#" className="text-red-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-red-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
