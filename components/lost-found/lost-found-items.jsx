"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import ReportItemForm from "@/components/lost-found/report-item-form";
import { Search, MapPin, Clock, Camera } from "lucide-react";
import EmptyState from "@/components/common/empty-state";
import { useToast } from "@/contexts/toast-context";

export default function LostFoundItems() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [reportType, setReportType] = useState("lost");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleReportSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append('type', reportType);
      // formData.append('title', data.title);
      // formData.append('description', data.description);
      // formData.append('location', data.location);
      // formData.append('contactInfo', data.contactInfo);
      // if (data.photo && data.photo[0]) {
      //   formData.append('photo', data.photo[0]);
      // }
      // await api.post('/lost-found', formData);

      console.log("Report data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal on success
      setIsReportModalOpen(false);
      success(
        `Item reported ${
          reportType === "lost" ? "lost" : "found"
        } successfully!`
      );
    } catch (err) {
      console.error("Report error:", err);
      error("Failed to report item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      id: 1,
      type: "lost",
      title: "Lost: Black Backpack",
      description:
        "Lost my black backpack with laptop and books near the library. Please contact if found.",
      location: "Near Library Building",
      time: "2 days ago",
      status: "open",
    },
    {
      id: 2,
      type: "found",
      title: "Found: Blue Water Bottle",
      description:
        "Found a blue water bottle in the cafeteria. Contact to claim.",
      location: "Cafeteria",
      time: "5 hours ago",
      status: "open",
    },
    {
      id: 3,
      type: "lost",
      title: "Lost: Student ID Card",
      description:
        "Lost my student ID card. Name: Ahmed Ali, Roll No: CS-2021-001",
      location: "Parking Area",
      time: "1 week ago",
      status: "resolved",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
            Lost & Found
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Report lost items or help others find their belongings
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            startIcon={<Camera className="w-4 h-4" />}
            onClick={() => {
              setReportType("lost");
              setIsReportModalOpen(true);
            }}
            size="md"
            className="flex-1 sm:flex-none whitespace-nowrap"
          >
            Report Lost
          </Button>
          <Button
            variant="outline"
            startIcon={<Search className="w-4 h-4" />}
            onClick={() => {
              setReportType("found");
              setIsReportModalOpen(true);
            }}
            size="md"
            className="flex-1 sm:flex-none whitespace-nowrap"
          >
            Report Found
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title={`Report ${reportType === "lost" ? "Lost" : "Found"} Item`}
        size="lg"
      >
        <ReportItemForm
          type={reportType}
          onSubmit={handleReportSubmit}
          onCancel={() => setIsReportModalOpen(false)}
          loading={loading}
        />
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <EmptyState
                icon={Search}
                title="No items found"
                description="There are no lost or found items reported yet."
                action={() => {
                  setReportType("lost");
                  setIsReportModalOpen(true);
                }}
                actionLabel="Report Lost Item"
              />
            </Card>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <div className="mb-3 sm:mb-4">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span
                    className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                      item.type === "lost"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.type.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                      item.status === "open"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 break-words">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-gray-600 mb-3">
                  <div className="flex items-center break-words">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                    {item.time}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsViewDetailsModalOpen(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false);
          setSelectedItem(null);
        }}
        title="Item Details"
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="pb-3 sm:pb-4 border-b border-gray-200">
              <div className="flex items-start mb-3">
                <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                      {selectedItem.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
                          selectedItem.type === "lost"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedItem.type.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
                          selectedItem.status === "open"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                Description
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-700 break-words">
                {selectedItem.description}
              </p>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Location
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                  {selectedItem.location}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Reported
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {selectedItem.time}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
