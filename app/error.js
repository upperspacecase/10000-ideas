"use client";

import Link from "next/link";
// ButtonSupport commented out - can re-enable when Crisp is configured
// import ButtonSupport from "@/components/ButtonSupport";

// A simple error boundary to show a nice error page if something goes wrong
export default function Error({ error, reset }) {
  return (
    <>
      <div className="h-screen w-full flex flex-col justify-center items-center text-center gap-6 p-6 bg-background">
        <div className="p-6 bg-white rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold">Something went wrong</h1>

        <p className="text-muted-foreground max-w-md">
          {error?.message || "An unexpected error occurred"}
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            onClick={reset}
          >
            Try Again
          </button>

          <Link
            href="/"
            className="px-4 py-2 border-2 border-black/10 rounded-lg font-semibold hover:bg-black hover:text-white transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
}
