"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Store token in localStorage instead of cookies
      localStorage.setItem("token", token);
      window.location.href = "/my-zone";
    } else {
      // Or redirect back to login if no token
      router.push("/auth");
    }
  }, [router, searchParams]);

  // This component doesn't need to render anything itself,
  // as its only job is to perform a side-effect (redirecting).
  return null;
}