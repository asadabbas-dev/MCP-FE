"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { ToastProvider } from "@/contexts/toast-context";
import ProtectedRoute from "@/components/common/protected-route";

/**
 * Dashboard Layout
 * 
 * Main layout for all dashboard pages.
 * Wraps with ProtectedRoute to ensure user is authenticated.
 * Shows full page loader while checking authentication.
 */
export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <ToastProvider>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 lg:ml-64 w-full">
            <Header />
            <main className="pt-20 sm:pt-16 lg:pt-20 px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-gray-50 min-h-screen">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </ProtectedRoute>
  );
}
