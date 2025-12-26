"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Loading from "./loading";

/**
 * AdminRoute Component
 *
 * Higher-order component specifically for admin-only routes.
 * Shows a full page loader (covering entire viewport) while checking authentication and role.
 * Redirects to dashboard if user is not an admin.
 *
 * @param {ReactNode} children - Child components to render if user is admin
 */
export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // Check if user is authenticated
    if (!user) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    if (role !== "admin") {
      router.push("/dashboard");
      return;
    }
  }, [user, role, loading, router]);

  // Show full page loader (covering entire viewport) while checking authentication
  if (loading || !user || role !== "admin") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-sm text-gray-600">
            {loading
              ? "Loading..."
              : !user
              ? "Redirecting to login..."
              : "Access denied. Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  // Render children if user is admin
  return <>{children}</>;
}
