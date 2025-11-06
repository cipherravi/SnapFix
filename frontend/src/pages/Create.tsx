import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DropDownOptions from "../components/modals/DropDownOptions";
import { sanitizeBudgetInput } from "../utils/inputSanitizers";
import useCategoryFetcher from "../utils/Hooks/useCategoryFetcher";
import useAddressFetcher from "../utils/Hooks/useAddressFetcher";
import MapPicker from "../components/map/MapPicker";
import sortByName from "../utils/sortByName";
import { useNavigate } from "react-router-dom";
import ImageCapturer from "../components/ImageCapturer";
import type { Address } from "@types";
import { useAddressContext } from "@/utils/context/AddressContext";
import compressImage from "@/utils/compressImage";

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

  useEffect(() => {
    if (selectedAddress) {
      setCoords([
        Number(selectedAddress.latitude),
        Number(selectedAddress.longitude),
      ]);
    }
  }, [selectedAddress]);

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
    const loadOptions = async () => {
      const fetchedCategories = await fetchCategories();
      // Sort categories by name (case-insensitive)
      setCategoryOptions(sortByName(fetchedCategories));

      const fetchedAddresses = await fetchAddresses();

      if (
        fetchedAddresses.length < 1 ||
        Object.keys(fetchedAddresses).length === 0
      ) {
        setShowAddressModal(true);
      }
    };
    loadOptions();
  }, []);

  const handleSubmit = async () => {
    if (!jobTitle) {
      toast.error("Title is required field");
      return;
    }

    if (!jobBudget) {
      toast.error("Budget is required field");
      return;
    }
    if (!selectedAddress) {
      toast.error("Select address");
      return;
    }

    try {
      const formData = new FormData();

      // Compress images before appending
      let main = jobPhotos[0]
        ? await compressImage.mainImage(jobPhotos[0])
        : null;
      if (main) {
        console.log(
          `Compressed main image size: ${(main.size / 1024).toFixed(2)} KB`
        );
      }

      let thumbnail = jobPhotos[0]
        ? await compressImage.thumbnailImage(jobPhotos[0])
        : null;
      if (thumbnail) {
        console.log(
          `Compressed thumbnail image size: ${(thumbnail.size / 1024).toFixed(
            2
          )} KB`
        );
      }

      let secondary = jobPhotos[1]
        ? await compressImage.mainImage(jobPhotos[1])
        : null;
      let third = jobPhotos[2]
        ? await compressImage.mainImage(jobPhotos[2])
        : null;

      // Append images
      if (main) formData.append("main", main, "main.webp");
      if (thumbnail) formData.append("thumbnail", thumbnail, "thumbnail.webp");
      if (secondary) formData.append("secondary", secondary, "secondary.webp");
      if (third) formData.append("third", third, "third.webp");

      // Append job details
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
      if (response.ok) {
        // toast.success(data.message);
        navigate(`/payments/${data?.data?.id}`);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong!");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full min-h-full bg-white pt-4  flex flex-col gap-10 pb-20">
      <div className="flex flex-col gap-2 mx-4 ">
        {/* Heading */}
        <h1 className="text-2xl  poppins-semibold ">Create Job</h1>
        <p className="inter-extralight text-xs">
          Get your work done by creating a job and leave rest on us
        </p>
      </div>

      {/* Dynamic contents .... */}
      <div className="flex flex-col gap-5 items-center px-4">
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
          className="bg-[#F4F4F4] rounded-lg h-12 w-full  text-xl border shadow px-4 "
        />
        <input
          type="tel"
          value={jobBudget}
          onChange={(e) => {
            const inputValue = e.target.value;
            const sanitized = sanitizeBudgetInput(inputValue);

            // Allow user to clear or backspace
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
          className="bg-[#F4F4F4] rounded-lg h-12 w-full text-xl border shadow px-4 "
        />

        {showAddressModal ? (
          <div className="w-full border bg-[#FFF0F0] rounded-lg p-4 shadow text-center">
            <p className="text-sm text-red-600 mb-2">
              🚫 No address found. Please add one before continuing.
            </p>
            <button
              onClick={() => {
                navigate("/profile/addresses/create");
              }}
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
          className="bg-[#F4F4F4] rounded-lg min-h-24 max-h-48 w-full text-md border shadow px-4 py-2 resize-none focus:outline-none select-text"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>

        <ImageCapturer
          photos={jobPhotos}
          setPhotos={setJobPhotos}
          photoLimit={3}
        />
        {/* {selectedAddress && (
          <MapPicker
            onLocationSelect={(coords) => setCoords(coords)}
            zoom={13}
            location={[
              Number(selectedAddress?.latitude),
              Number(selectedAddress?.longitude),
            ]}
            animateOnLoad={false} // currently false
            type="create"
          />
        )} */}

        <button
          className="w-1/2 h-12 bg-[#0385C2] text-white rounded-3xl text-2xl inter-medium"
          onClick={handleSubmit}
          disabled={creating}
        >
          {creating ? "Processing" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Create;
