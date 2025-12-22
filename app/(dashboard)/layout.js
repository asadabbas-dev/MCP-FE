"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { ToastProvider } from "@/contexts/toast-context";

export default function DashboardLayout({ children }) {
  return (
    <ToastProvider>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <Header />
          <main className="pt-16 lg:pt-24 p-4 lg:p-6 bg-gray-50 min-h-screen">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
