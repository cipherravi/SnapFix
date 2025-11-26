import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DropDownOptions from "../components/modals/DropDownOptions";
import { sanitizeBudgetInput } from "../utils/inputSanitizers";
import useCategoryFetcher from "../utils/Hooks/useCategoryFetcher";
import useAddressFetcher from "../utils/Hooks/useAddressFetcher";
import { useNavigate } from "react-router-dom";
import ImageCapturer from "../components/ImageCapturer";
import type { Address } from "../../types";
import { useAddressContext } from "../utils/context/AddressContext";
import compressImage from "../utils/compressImage";
import sortByName from "../utils/sortByName";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BaseOption {
  id: number;
  name: string;
}

const Create = () => {
  const navigate = useNavigate();
  const { addresses } = useAddressContext();
  const [categoryOptions, setCategoryOptions] = useState<BaseOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BaseOption | null>(
    null
  );
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobBudget, setJobBudget] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [jobPhotos, setJobPhotos] = useState<File[]>([]);
  const [creating, setCreating] = useState(false);
  const fetchCategories = useCategoryFetcher();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const { fetchAddresses } = useAddressFetcher();

  useEffect(() => {
    if (selectedAddress) {
      setCoords([
        Number(selectedAddress.latitude),
        Number(selectedAddress.longitude),
      ]);
    }
  }, [selectedAddress]);

  useEffect(() => {
    const loadOptions = async () => {
      const fetchedCategories = await fetchCategories();
      setCategoryOptions(sortByName(fetchedCategories));
      const fetchedAddresses = await fetchAddresses();
      if (!fetchedAddresses || fetchedAddresses.length === 0) {
        setShowAddressModal(true);
      }
    };
    loadOptions();
  }, []);

  const handleSubmit = async () => {
    if (!jobTitle) return toast.error("Title is required field");
    if (!jobBudget) return toast.error("Budget is required field");
    if (!selectedAddress) return toast.error("Select address");

    try {
      const formData = new FormData();
      const main = jobPhotos[0]
        ? await compressImage.mainImage(jobPhotos[0])
        : null;
      const thumbnail = jobPhotos[0]
        ? await compressImage.thumbnailImage(jobPhotos[0])
        : null;
      const secondary = jobPhotos[1]
        ? await compressImage.mainImage(jobPhotos[1])
        : null;
      const third = jobPhotos[2]
        ? await compressImage.mainImage(jobPhotos[2])
        : null;

      if (main) formData.append("main", main, "main.webp");
      if (thumbnail) formData.append("thumbnail", thumbnail, "thumbnail.webp");
      if (secondary) formData.append("secondary", secondary, "secondary.webp");
      if (third) formData.append("third", third, "third.webp");

      formData.append("title", jobTitle);
      formData.append("description", jobDescription);
      formData.append("budget", jobBudget);
      if (selectedCategory?.id)
        formData.append("categoryId", String(selectedCategory.id));
      if (selectedAddress?.id)
        formData.append("addressId", String(selectedAddress.id));
      if (coords?.[0]) formData.append("latitude", String(coords[0]));
      if (coords?.[1]) formData.append("longitude", String(coords[1]));

      setCreating(true);
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/jobs`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) navigate(`/payments/${data?.data?.id}`);
      else toast.error(data?.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pt-4 flex flex-col gap-8 pb-20 px-4 sm:px-6 md:px-10">
      {/* Heading aligned with form */}
      <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl poppins-semibold text-left">
          Create Job
        </h1>
        <p className="inter-extralight text-sm md:text-base text-left">
          Get your work done by creating a job and leave rest on us
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto">
        <DropDownOptions
          selected={selectedCategory}
          setSelected={setSelectedCategory}
          options={categoryOptions}
          variant="name"
          placeholder="Select Category"
        />

        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job Title"
          className="bg-[#F4F4F4] rounded-lg h-12 w-full text-xl border shadow px-4"
        />

        <input
          type="tel"
          value={jobBudget}
          onChange={(e) => {
            const sanitized = sanitizeBudgetInput(e.target.value);
            if (e.target.value === "" || sanitized === e.target.value)
              setJobBudget(e.target.value);
          }}
          onPaste={(e) => {
            const paste = e.clipboardData.getData("text");
            if (sanitizeBudgetInput(paste) === "") e.preventDefault();
          }}
          placeholder="Budget"
          className="bg-[#F4F4F4] rounded-lg h-12 w-full text-xl border shadow px-4"
        />

        {showAddressModal ? (
          <div className="w-full border bg-[#FFF0F0] rounded-lg p-4 shadow text-center">
            <p className="text-sm text-red-600 mb-2">
              🚫 No address found. Please add one before continuing.
            </p>
            <button
              onClick={() => navigate("/profile/addresses/create")}
              className="px-4 py-2 rounded bg-blue-500 text-white text-sm"
            >
              Add Address
            </button>
          </div>
        ) : (
          <DropDownOptions
            selected={selectedAddress}
            setSelected={setSelectedAddress}
            options={addresses}
            variant="address"
            placeholder="Select Address"
          />
        )}

        <textarea
          placeholder="Tell us more about your work"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="bg-[#F4F4F4] rounded-lg min-h-24 max-h-48 w-full text-md border shadow px-4 py-2 resize-none focus:outline-none"
        />

        <ImageCapturer
          photos={jobPhotos}
          setPhotos={setJobPhotos}
          photoLimit={3}
        />

        <button
          onClick={handleSubmit}
          disabled={creating}
          className="w-full sm:w-1/2 h-12 bg-[#0385C2] text-white rounded-3xl text-xl sm:text-2xl inter-medium mx-auto"
        >
          {creating ? "Processing" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Create;
