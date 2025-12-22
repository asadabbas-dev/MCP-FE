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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lost & Found</h1>
          <p className="text-gray-600 mt-1">
            Report lost items or help others find their belongings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            startIcon={<Camera className="w-4 h-4" />}
            onClick={() => {
              setReportType("lost");
              setIsReportModalOpen(true);
            }}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-md ${
                      item.type === "lost"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.type.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md ${
                      item.status === "open"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
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
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Search className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedItem.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                          selectedItem.type === "lost"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedItem.type.toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
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
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Description
              </p>
              <p className="text-sm leading-relaxed text-gray-700">
                {selectedItem.description}
              </p>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Location
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {selectedItem.location}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Reported
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
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
