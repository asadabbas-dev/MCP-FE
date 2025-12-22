"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";
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
  const { isTeacher, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Student profile fields
  const studentProfile = {
    name: "John Doe",
    email: "john.doe@university.edu",
    phone: "+92 300 1234567",
    rollNumber: "CS-2021-001",
    address: "Lahore, Pakistan",
    dateOfBirth: "2000-01-15",
    currentSemester: "Fall 2024",
    program: "BS Computer Science",
    enrollmentDate: "2021-09-01",
    profileImage: null,
  };

  // Teacher profile fields
  const teacherProfile = {
    name: "Dr. John Smith",
    email: "john.smith@university.edu",
    phone: "+92 300 1234567",
    employeeId: "EMP-2020-001",
    address: "Lahore, Pakistan",
    dateOfBirth: "1980-05-20",
    department: "Computer Science",
    designation: "Associate Professor",
    joiningDate: "2020-09-01",
    profileImage: null,
  };

  const [profile, setProfile] = useState(
    isTeacher ? teacherProfile : studentProfile
  );

  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [imagePreview, setImagePreview] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { success, error } = useToast();

  const handleEdit = () => {
    setEditedProfile(profile);
    setImagePreview(profile.profileImage);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({
      ...editedProfile,
      profileImage: imagePreview || profile.profileImage,
    });
    setIsEditing(false);
    success("Profile updated successfully!");
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
      // TODO: Replace with actual API call
      // await api.post('/auth/change-password', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsPasswordModalOpen(false);
      success("Password changed successfully!");
    } catch (err) {
      error("Failed to change password. Please check your current password.");
    } finally {
      setPasswordLoading(false);
    }
  };

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
                    value={editedProfile.dateOfBirth}
                    onChange={(e) =>
                      handleChange("dateOfBirth", e.target.value)
                    }
                    className="bg-white"
                  />
                ) : (
                  <p className="text-base font-semibold text-gray-900">
                    {new Date(profile.dateOfBirth).toLocaleDateString()}
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
                  {isEditing ? (
                    <Input
                      value={editedProfile.department}
                      onChange={(e) =>
                        handleChange("department", e.target.value)
                      }
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-base font-semibold text-gray-900">
                      {profile.department}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Designation
                    </p>
                  </div>
                  {isEditing ? (
                    <Input
                      value={editedProfile.designation}
                      onChange={(e) =>
                        handleChange("designation", e.target.value)
                      }
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-base font-semibold text-gray-900">
                      {profile.designation}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Joining Date
                    </p>
                  </div>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedProfile.joiningDate}
                      onChange={(e) =>
                        handleChange("joiningDate", e.target.value)
                      }
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(profile.joiningDate).toLocaleDateString()}
                    </p>
                  )}
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
                  {isEditing ? (
                    <Input
                      value={editedProfile.currentSemester}
                      onChange={(e) =>
                        handleChange("currentSemester", e.target.value)
                      }
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-base font-semibold text-gray-900">
                      {profile.currentSemester}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Program
                    </p>
                  </div>
                  {isEditing ? (
                    <Input
                      value={editedProfile.program}
                      onChange={(e) => handleChange("program", e.target.value)}
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-base font-semibold text-gray-900">
                      {profile.program}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Enrollment Date
                    </p>
                  </div>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedProfile.enrollmentDate}
                      onChange={(e) =>
                        handleChange("enrollmentDate", e.target.value)
                      }
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(profile.enrollmentDate).toLocaleDateString()}
                    </p>
                  )}
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
