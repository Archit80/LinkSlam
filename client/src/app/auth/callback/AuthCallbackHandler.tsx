"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Set the cookie and redirect
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=None; Secure`;
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