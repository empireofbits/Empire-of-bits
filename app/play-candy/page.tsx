"use client";

import { Suspense } from "react";

import Games from "@/components/Games";

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-purple-800 to-purple-950 p-4 text-white flex items-center justify-center">
          <div className="text-2xl">Loading level...</div>
        </main>
      }
    >
      <Games />
    </Suspense>
  );
}
