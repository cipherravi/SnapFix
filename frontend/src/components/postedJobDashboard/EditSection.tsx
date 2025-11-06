import { useState } from "react";
import { sanitizeBudgetInput } from "../../utils/inputSanitizers";

import MapPicker from "../map/MapPicker";
import toast from "react-hot-toast";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface EditSectionProps {
  id: number;
  budget: number;
  description: string;
  title: string;
  addressId?: number;
  categoryId: number;
  cityId: number;
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
  const [jobTitle, setJobTitle] = useState(title);
  const [jobBudget, setJobBudget] = useState(budget.toString());
  const [jobDescription, setJobDescription] = useState(description);
  const [coords, setCoords] = useState<[number, number]>([
    +latitude,
    +longitude,
  ]);
  const [updating, setUpdating] = useState(false);

  const [canEdit, setCanEdit] = useState(false);

  async function handleSubmit() {
    setUpdating(true);
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/jobs/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: jobTitle,
          budget: jobBudget,
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
      toast.error("Something went wrong while updating job details");
    } finally {
      setUpdating(false);
      setCanEdit(false);
    }
  }

  const handleCancel = () => {
    setJobTitle(title);
    setJobBudget(budget.toString());
    setJobDescription(description);
    setCoords([+latitude, +longitude]);

    setCanEdit(false);
  };

  return (
    <div className="flex flex-col gap-4 items-center py-4">
      <input
        type="text"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Job Title"
        className={`bg-[#F4F4F4] rounded-lg h-12 w-11/12 text-xl border shadow px-4 ${
          !canEdit ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!canEdit}
      />
      <input
        type="tel"
        value={jobBudget}
        onChange={(e) => {
          const inputValue = e.target.value;
          const sanitized = sanitizeBudgetInput(inputValue);
          if (inputValue === "" || sanitized === inputValue) {
            setJobBudget(inputValue);
          }
        }}
        onPaste={(e) => {
          const paste = e.clipboardData.getData("text");
          if (sanitizeBudgetInput(paste) === "") {
            e.preventDefault();
          }
        }}
        placeholder="Budget"
        className={`bg-[#F4F4F4] rounded-lg h-12 w-11/12 text-xl border shadow px-4 ${
          !canEdit ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!canEdit}
      />
      <textarea
        placeholder="Tell us more about your work"
        className={`bg-[#F4F4F4] rounded-lg min-h-24 max-h-48 w-11/12 text-md border shadow px-4 py-2 resize-none focus:outline-none ${
          !canEdit ? "opacity-50 cursor-not-allowed" : ""
        }`}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        disabled={!canEdit}
      />
      <MapPicker
        onLocationSelect={(coords) => setCoords(coords)}
        location={coords}
        zoom={13}
        type="edit"
        editable={canEdit}
      />

      <div className="w-full flex justify-around ">
        {canEdit && (
          <button
            className="w-2/5 h-12 bg-[#5b5b5b] text-white rounded-3xl text-2xl inter-medium"
            onClick={() => handleCancel()}
          >
            Cancel
          </button>
        )}

        <button
          className="w-2/5 h-12 bg-[#0385C2] text-white rounded-3xl text-2xl inter-medium"
          onClick={() => {
            if (canEdit) {
              handleSubmit();
              console.log({
                title: jobTitle,
                budget: jobBudget,
                description: jobDescription,
                coords,
              });
            } else {
              setCanEdit(true);
            }
          }}
          disabled={updating}
        >
          {canEdit ? "Submit" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default EditSection;
