"use client";

import { useState, useEffect } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Loading from "@/components/common/loading";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Edit2,
  Save,
  X,
  Camera,
  Upload,
  Lock,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import Modal from "@/components/common/modal";
import ChangePasswordForm from "@/components/profile/change-password-form";

/**
 * Profile View Component
 *
 * Displays and allows editing of user profile information.
 * Shows different fields based on user role.
 *
 * Student Fields:
 * - Personal info (name, email, phone, address, DOB)
 * - Academic info (roll number, current semester, program, enrollment date)
 *
 * Teacher Fields:
 * - Personal info (name, email, phone, address, DOB)
 * - Professional info (employee ID, department, designation, joining date)
 *
 * Features:
 * - Profile image upload with preview
 * - Edit mode toggle
 * - Change password functionality
 * - Role-based field display
 */

export default function ProfileView() {
  const { isTeacher, user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { success, error: showError } = useToast();

  /**
   * Fetch user profile from API
   */
  useEffect(() => {
    fetchProfile();
  }, [authUser]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const userData = await api.get("/users/profile");

      // Transform API data to profile format
      const profileData = {
        id: userData.id,
        name: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        dateOfBirth: userData.dateOfBirth || "",
        profileImage: userData.profileImage || null,
        ...(isTeacher && userData.teacher
          ? {
              employeeId: userData.teacher.employeeId || "",
              department: userData.teacher.department || "",
              designation: userData.teacher.designation || "",
              joiningDate: userData.teacher.joiningDate || "",
            }
          : userData.student
          ? {
              rollNumber: userData.student.rollNumber || "",
              currentSemester: userData.student.currentSemester || "",
              program: userData.student.program || "",
              enrollmentDate: userData.student.enrollmentDate || "",
            }
          : {}),
      };

      setProfile(profileData);
      setEditedProfile({ ...profileData });
    } catch (err) {
      console.error("Error fetching profile:", err);
      showError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setImagePreview(profile.profileImage);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Only allow updating personal information, not professional/academic info
      // Professional info (department, designation, joining date, employee ID) can only be changed by admin
      // Academic info (current semester, program, enrollment date, roll number) can only be changed by admin
      const updateData = {
        fullName: editedProfile.name,
        email: editedProfile.email,
        phone: editedProfile.phone || "",
        address: editedProfile.address || "",
        dateOfBirth: editedProfile.dateOfBirth || null,
      };

      const updatedUser = await api.patch("/users/profile", updateData);

      // Update profile state
      const updatedProfile = {
        ...editedProfile,
        name: updatedUser.fullName || editedProfile.name,
        email: updatedUser.email || editedProfile.email,
        phone: updatedUser.phone || editedProfile.phone,
        address: updatedUser.address || editedProfile.address,
        dateOfBirth: updatedUser.dateOfBirth || editedProfile.dateOfBirth,
        profileImage: imagePreview || profile.profileImage,
      };

      setProfile(updatedProfile);
      setIsEditing(false);
      success("Profile updated successfully!");

      // Refresh profile data
      fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      showError(err.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditedProfile((prev) => ({ ...prev, profileImage: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setEditedProfile((prev) => ({ ...prev, profileImage: null }));
  };

  const handleChangePassword = async (data) => {
    setPasswordLoading(true);
    try {
      await api.patch("/users/profile", {
        password: data.newPassword,
      });

      setIsPasswordModalOpen(false);
      success("Password changed successfully!");
    } catch (err) {
      showError(
        err.message ||
          "Failed to change password. Please check your current password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Loading size="md" />
          <p className="text-gray-600 mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            View and manage your profile information
          </p>
        </div>
        {!isEditing ? (
          <Button
            startIcon={<Edit2 className="w-4 h-4" />}
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              startIcon={<X className="w-4 h-4" />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              startIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Picture & Basic Info */}
        <Card>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center border-4 border-gray-200">
                {(isEditing ? imagePreview : profile.profileImage) ? (
                  <img
                    src={isEditing ? imagePreview : profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-indigo-600" />
                )}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <label className="cursor-pointer">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors border-2 border-white">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="mb-4">
                {isEditing ? (
                  <Input
                    value={editedProfile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Full Name"
                    className="text-xl font-bold w-full max-w-[300px]"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {profile.name}
                  </h2>
                )}
                <p className="text-sm text-gray-600 my-2">
                  {isTeacher ? profile.employeeId : profile.rollNumber}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {isTeacher ? (
                    <>
                      <Briefcase className="w-4 h-4" />
                      <span>{profile.department}</span>
                      <span className="text-gray-400">•</span>
                      <span>{profile.designation}</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>{profile.program}</span>
                    </>
                  )}
                </div>
              </div>
              {isEditing && imagePreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  startIcon={<X className="w-4 h-4" />}
                >
                  Remove Image
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card>
          <div className="space-y-6">
            {/* Header Section */}
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your personal details and contact information
                  </p>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </p>
                </div>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-white"
                  />
                ) : (
                  <p className="text-base font-semibold text-gray-900">
                    {profile.email}
                  </p>
                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Phone
                  </p>
                </div>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="bg-white"
                  />
                ) : (
                  <p className="text-base font-semibold text-gray-900">
                    {profile.phone}
                  </p>
                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date of Birth
                  </p>
                </div>
                {isEditing ? (
                  <Input
                    type="date"
                    value={
                      editedProfile.dateOfBirth
                        ? typeof editedProfile.dateOfBirth === "string"
                          ? editedProfile.dateOfBirth.split("T")[0]
                          : new Date(editedProfile.dateOfBirth)
                              .toISOString()
                              .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleChange("dateOfBirth", e.target.value)
                    }
                    className="bg-white"
                  />
                ) : (
                  <p className="text-base font-semibold text-gray-900">
                    {profile.dateOfBirth
                      ? new Date(profile.dateOfBirth).toLocaleDateString()
                      : "Not set"}
                  </p>
                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Address
                  </p>
                </div>
                {isEditing ? (
                  <Input
                    value={editedProfile.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="bg-white"
                  />
                ) : (
                  <p className="text-base font-semibold text-gray-900">
                    {profile.address}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Academic/Professional Information */}
        <Card>
          <div className="space-y-6">
            {/* Header Section */}
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  {isTeacher ? (
                    <Briefcase className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {isTeacher
                      ? "Professional Information"
                      : "Academic Information"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isTeacher
                      ? "Your professional details and employment information"
                      : "Your academic details and enrollment information"}
                  </p>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            {isTeacher ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Department
                    </p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.department || "Not set"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Contact admin to update
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Designation
                    </p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.designation || "Not set"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Contact admin to update
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Joining Date
                    </p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.joiningDate
                      ? new Date(profile.joiningDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Contact admin to update
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Current Semester
                    </p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.currentSemester || "Not set"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Contact admin to update
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Program
                    </p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.program || "Not set"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Contact admin to update
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Enrollment Date
                    </p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.enrollmentDate
                      ? new Date(profile.enrollmentDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Contact admin to update
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Security Section */}
        <Card>
          <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Lock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Security
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage your password and security settings
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Password</p>
                <p className="text-xs text-gray-500 mt-1">
                  Last changed 3 months ago
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                startIcon={<Lock className="w-4 h-4" />}
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <ChangePasswordForm
          onSubmit={handleChangePassword}
          onCancel={() => setIsPasswordModalOpen(false)}
          loading={passwordLoading}
        />
      </Modal>
    </div>
  );
}
