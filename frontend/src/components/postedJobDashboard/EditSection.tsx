import { useState } from "react";
import MapPicker from "../map/MapPicker";
import MapDisplay from "../map/MapDisplay";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface EditSectionProps {
  id: number;
  budget: number;
  description: string;
  title: string;
  latitude: string;
  longitude: string;
}

const EditSection = ({
  id,
  title,
  budget,
  description,
  latitude,
  longitude,
}: EditSectionProps) => {
  const token = useSelector((s: any) => s.auth.token);

  const [jobTitle, setJobTitle] = useState(title);
  const [jobBudget] = useState(budget.toString());
  const [jobDescription, setJobDescription] = useState(description);
  const [coords, setCoords] = useState<[number, number]>([
    +latitude,
    +longitude,
  ]);
  const [canEdit, setCanEdit] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function handleSubmit() {
    setUpdating(true);
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/jobs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: jobTitle,
          description: jobDescription,
          latitude: coords[0],
          longitude: coords[1],
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Job details updated successfully");
      } else {
        toast.error(data.message || "Failed to update job details");
      }
    } catch (error) {
      toast.error("Error updating job");
    } finally {
      setUpdating(false);
      setCanEdit(false);
    }
  }

  const handleCancel = () => {
    setJobTitle(title);
    setJobDescription(description);
    setCoords([+latitude, +longitude]);
    setCanEdit(false);
  };

  return (
    <div className="flex flex-col gap-6 px-4 pb-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Edit Job Details
      </h2>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-600 text-sm font-medium">Job Title</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          disabled={!canEdit}
          className={`w-full h-12 px-4 rounded-xl text-[17px] bg-gray-100 border border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
            !canEdit ? "opacity-60 cursor-not-allowed" : "bg-white shadow-sm"
          }`}
        />
      </div>

      {/* Budget (Locked) */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-600 text-sm font-medium">Budget (₹)</label>
        <input
          type="text"
          value={jobBudget}
          readOnly
          className="w-full h-12 px-4 rounded-xl bg-gray-100 border border-gray-300 text-[17px] opacity-60 cursor-not-allowed"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-600 text-sm font-medium">Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Explain the job in detail..."
          disabled={!canEdit}
          className={`w-full min-h-28 max-h-48 px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-[15px] resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 leading-relaxed ${
            !canEdit ? "opacity-60 cursor-not-allowed" : "bg-white shadow-sm"
          }`}
        />
      </div>

      {/* Map Picker */}
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">Job Location</p>
        <MapPicker
          onLocationSelect={(coords) => setCoords(coords)}
          location={coords}
          zoom={13}
          type="edit"
          editable={canEdit}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-10 mt-4">
        {/* Cancel */}
        {canEdit && (
          <button
            onClick={handleCancel}
            className="w-[45%] h-12 rounded-2xl text-lg font-medium bg-gray-600 text-white shadow-sm active:scale-[0.98] transition-all duration-100"
          >
            Cancel
          </button>
        )}

        {/* Edit / Submit */}
        <button
          disabled={updating}
          onClick={() => (canEdit ? handleSubmit() : setCanEdit(true))}
          className="w-[45%] h-12 rounded-2xl text-lg font-medium bg-blue-600 text-white shadow-sm active:scale-[0.98] transition-all duration-100 disabled:opacity-60"
        >
          {updating ? "Saving..." : canEdit ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default EditSection;
