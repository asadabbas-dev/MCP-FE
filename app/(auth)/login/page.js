"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Mail, Lock } from "lucide-react";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Alert from "@/components/common/alert";
import Loading from "@/components/common/loading";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Mock login for demo emails (bypass backend)
    const mockEmails = {
      "student@example.com": {
        id: "mock-student-id",
        email: "student@example.com",
        fullName: "John Doe",
        role: "student",
        rollNumber: "STU-2024-001",
        currentSemester: 3,
        program: "BS Computer Science",
      },
      "admin@example.com": {
        id: "mock-admin-id",
        email: "admin@example.com",
        fullName: "Admin User",
        role: "admin",
      },
      "teacher@example.com": {
        id: "mock-teacher-id",
        email: "teacher@example.com",
        fullName: "Dr. Jane Smith",
        role: "teacher",
        employeeId: "EMP-2024-001",
        department: "Computer Science",
        designation: "Associate Professor",
      },
      "teacher@example": {
        id: "mock-teacher-id",
        email: "teacher@example",
        fullName: "Dr. Jane Smith",
        role: "teacher",
        employeeId: "EMP-2024-001",
        department: "Computer Science",
        designation: "Associate Professor",
      },
    };

    // Check if it's a mock email
    if (mockEmails[formData.email]) {
      const mockUser = mockEmails[formData.email];

      // Store mock token
      localStorage.setItem("token", "mock-token-" + mockUser.id);

      // Store user data and role
      login(mockUser);
      setLoading(false);

      // Redirect to dashboard
      router.push("/dashboard");
      return;
    }

    // Regular backend login for other emails
    const response = await api
      .post("/auth/login", {
        email: formData.email,
        password: formData.password,
      })
      .catch((err) => {
        setError(err.message || "Login failed. Please check your credentials.");
        setLoading(false);
        return null;
      });

    if (!response) return;

    // Store token
    localStorage.setItem("token", response.accessToken);

    // Prepare user data for context
    const userData = {
      id: response.user.id,
      email: response.user.email,
      fullName: response.user.fullName,
      role: response.user.role,
      profileImage: response.user.profileImage,
      // Include role-specific data
      ...(response.user.rollNumber && { rollNumber: response.user.rollNumber }),
      ...(response.user.employeeId && { employeeId: response.user.employeeId }),
      ...(response.user.currentSemester && {
        currentSemester: response.user.currentSemester,
      }),
      ...(response.user.department && { department: response.user.department }),
    };

    // Store user data and role
    login(userData);
    setLoading(false);

    // Redirect to dashboard using router (no page reload)
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">My Class Portal</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <Alert type="error" message={error} onClose={() => setError("")} />
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:outline-none"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && (
                <span className="mr-2">
                  <Loading size="sm" />
                </span>
              )}
              Sign in
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
