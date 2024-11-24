// RootLayout.js
"use client";

import React from "react";
import "../../app/globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">

      {/* Main Content Area */}
      <div className="app_msn flex flex-col w-full">
        <main className="app_msn flex-1 p-4 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
