"use client";

import { createContext, useContext, useState, useEffect } from "react";

/**
 * Authentication Context
 * 
 * Global context for managing user authentication and role state.
 * Provides user data, role information, and auth methods throughout the app.
 * 
 * Features:
 * - User data management
 * - Role-based access (Student/Teacher)
 * - Login/logout functionality
 * - Persistent storage in localStorage
 * - Role helpers (isStudent, isTeacher)
 */

const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * 
 * Wraps the application to provide authentication context.
 * Initializes user data from localStorage on mount.
 * 
 * @param {ReactNode} children - Child components
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("userRole");

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setRole(userData.role || storedRole || "student");
      } catch (error) {
        console.error("Error parsing user data:", error);
        setRole(storedRole || "student");
      }
    } else if (storedRole) {
      setRole(storedRole);
    }

    setLoading(false);
  }, []);

  /**
   * Login function
   * Stores user data and role in state and localStorage
   * @param {object} userData - User object with role property
   */
  const login = (userData) => {
    const userRole = userData.role || "student";
    setUser(userData);
    setRole(userRole);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userRole", userRole);
  };

  /**
   * Logout function
   * Clears user data and role from state and localStorage
   */
  const logout = () => {
    setUser(null);
    setRole("student");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
  };

  /**
   * Update user role
   * Updates role in state and localStorage
   * @param {string} newRole - New role value ("student" | "teacher")
   */
  const updateRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem("userRole", newRole);
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    role,
    loading,
    login,
    logout,
    updateRole,
    isStudent: role === "student",
    isTeacher: role === "teacher",
    isAdmin: role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context.
 * Must be used within AuthProvider.
 * 
 * @returns {object} Auth context with:
 *   - user: Current user object
 *   - role: Current user role ("student" | "teacher")
 *   - loading: Loading state
 *   - login: Login function
 *   - logout: Logout function
 *   - updateRole: Update role function
 *   - isStudent: Boolean helper
 *   - isTeacher: Boolean helper
 * 
 * @throws {Error} If used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

