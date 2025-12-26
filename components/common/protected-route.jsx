"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Loading from "./loading";

/**
 * ProtectedRoute Component
 *
 * Higher-order component that protects routes requiring authentication.
 * Shows a full page loader (covering entire viewport) while checking authentication state.
 * Redirects to login if user is not authenticated.
 *
 * @param {ReactNode} children - Child components to render if authenticated
 * @param {string[]} allowedRoles - Optional array of allowed roles (e.g., ['student', 'teacher', 'admin'])
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 */
export default function ProtectedRoute({
  children,
  allowedRoles = null,
  requireAuth = true,
}) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // Check if authentication is required
    if (requireAuth && !user) {
      router.push("/login");
      return;
    }

    // Check role-based access if allowedRoles is specified
    if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(role)
    ) {
      // Redirect based on role
      if (role === "admin") {
        router.push("/dashboard");
      } else if (role === "teacher") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
      return;
    }
  }, [user, role, loading, allowedRoles, requireAuth, router]);

  // Show full page loader (covering entire viewport) while checking authentication
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in, show loader (will redirect)
  if (requireAuth && !user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-sm text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If role-based access is specified and user doesn't have required role, show loader (will redirect)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-sm text-gray-600">
            Access denied. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}
