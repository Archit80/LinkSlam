"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Store token in localStorage and redirect immediately
      localStorage.setItem("token", token);
      // Redirect to landing page which will handle the proper routing
      router.replace("/");
    } else {
      // Or redirect back to login if no token
      router.replace("/auth");
    }
  }, [router, searchParams]);

  // This component doesn't need to render anything itself,
  // as its only job is to perform a side-effect (redirecting).
  return null;
}