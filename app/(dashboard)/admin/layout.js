"use client";

import AdminRoute from "@/components/common/admin-route";

/**
 * Admin Layout
 *
 * Wraps all admin routes with AdminRoute component.
 * Ensures only authenticated admin users can access admin pages.
 * Shows full page loader while checking authentication and role.
 */
export default function AdminLayout({ children }) {
  return <AdminRoute>{children}</AdminRoute>;
}
