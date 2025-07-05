"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// This is a client-side component that handles the token from the URL.
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Get the token from the URL query parameters.
    const token = searchParams.get("token");

    if (token) {
      // 2. Set the token as a cookie on the browser.
      // This works because it's being set from the same domain.
      // We set a max-age of 7 days to match the token's expiration.
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;

      // 3. Redirect the user to their dashboard.
      // You can use window.location.href for a full page reload to ensure all states are updated.
      window.location.href = "/my-zone";
    } else {
      // 4. If for some reason there's no token, send them back to the login page.
      router.push("/auth");
    }
  }, [router, searchParams]);

  // You can render a simple loading state while the redirect happens.
  return (
    <div className="dark flex h-screen w-full items-center justify-center bg-background text-foreground">
      <p>Finalizing your authentication, please wait...</p>
    </div>
  );
}