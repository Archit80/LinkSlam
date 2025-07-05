"use client";

import { Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
import AuthCallbackHandler from "./AuthCallbackHandler";

// This is a client-side component that handles the token from the URL.
export default function AuthCallbackPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

  return (
    <div className="dark flex h-screen w-full items-center justify-center bg-background text-foreground">
      {/* The Suspense boundary tells Next.js how to handle the dynamic component */}
      <Suspense>
        <AuthCallbackHandler />
      </Suspense>
      <p>Finalizing your authentication, please wait...</p>
    </div>
  );
}