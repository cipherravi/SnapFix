import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DropDownOptions from "../components/modals/DropDownOptions";
import { sanitizeBudgetInput } from "../utils/inputSanitizers";
import useCategoryFetcher from "../utils/Hooks/useCategoryFetcher";
import userCityFetcher from "../utils/Hooks/userCityFetcher";
import useAddressFetcher from "../utils/Hooks/useAddressFetcher";
import MapPicker from "../components/map/MapPicker";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface option {
  name: string;
  id: number;
  building: string;
  street: string;
  area: string;
  city: string;
  district: string;
  state: string;
}

const Create = () => {
  const [selectedCategory, setSelectedCategory] = useState<null | option>(null);
  const [selectedCity, setSelectedCity] = useState<null | option>(null);
  const [selectedAddress, setSelectedAddress] = useState<null | option>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobBudget, setJobBudget] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [jobPhotos, setJobPhotos] = useState<File[]>([]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Limit to 3 photos
    const newFiles = files.slice(0, 3 - jobPhotos.length);
    setJobPhotos((prev) => [...prev, ...newFiles]);
  };

  const [categoryOptions, setCategoryOptions] = useState([]);

  const fetchCategories = useCategoryFetcher();

  const [cityOptions, setCityOptions] = useState([]);

  const fetchCities = userCityFetcher();

  const [addressOptions, setAddressOptions] = useState([]);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const fetchAddresses = useAddressFetcher();

  useEffect(() => {
    const loadOptions = async () => {
      const fetchedCategories = await fetchCategories();
      setCategoryOptions(() => fetchedCategories);

      const fetchedCities = await fetchCities();
      setCityOptions(() => fetchedCities);

      const fetchedAddresses = await fetchAddresses();
      if (fetchedAddresses.length < 1) {
        setShowAddressModal(true);
      } else {
        setAddressOptions(() => fetchedAddresses);
      }
    };
    loadOptions();
  }, []);

  const handleSubmit = async () => {
    if (!coords) {
      toast.error("Please pick your location on the map.");
      return;
    }
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/jobs`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title: jobTitle,
          description: jobDescription,
          budget: jobBudget,
          cityId: selectedCity?.id,
          categoryId: selectedCategory?.id,
          addressId: selectedAddress?.id,
          lat: coords[0],
          lng: coords[1],
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {}
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
      <div className="flex flex-col gap-5 items-center">
        <DropDownOptions
          selected={selectedCategory}
          setSelected={setSelectedCategory}
          options={categoryOptions}
          variant="name"
          placeholder="Select Category"
        />

        <DropDownOptions
          selected={selectedCity}
          setSelected={setSelectedCity}
          options={cityOptions}
          variant="name"
          placeholder="Select City"
        />
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job Title"
          className="bg-[#F4F4F4] rounded-lg h-12 w-11/12  text-xl border shadow px-4 "
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
          className="bg-[#F4F4F4] rounded-lg h-12 w-11/12  text-xl border shadow px-4 "
        />

        {showAddressModal ? (
          <div className="w-11/12 border bg-[#FFF0F0] rounded-lg p-4 shadow text-center">
            <p className="text-sm text-red-600 mb-2">
              🚫 No address found. Please add one before continuing.
            </p>
            <button
              onClick={() => {
                // Do something: open another modal, route to address page, etc.
                alert("Redirect to Add Address screen...");
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
            options={addressOptions}
            variant="address"
            placeholder="Select Address"
          />
        )}

        <textarea
          placeholder="Tell us more about your work"
          className="bg-[#F4F4F4] rounded-lg min-h-24 max-h-48 w-11/12 text-md border shadow px-4 py-2 resize-none focus:outline-none select-text"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>

        {/* Image add */}
        <div className="w-11/12 grid grid-cols-3 gap-4">
          {/* Show image */}
          {jobPhotos.map((file, idx) => (
            <div
              key={idx}
              className="relative w-full aspect-square rounded-xl overflow-hidden border shadow"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Upload ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Remove Image */}
              <button
                onClick={() => {
                  const newList = [...jobPhotos];
                  newList.splice(idx, 1);
                  setJobPhotos(newList);
                }}
                className="absolute top-1 right-1 bg-white rounded-full text-red-500 text-xs px-1"
              >
                ✕
              </button>
            </div>
          ))}
          {/* Add image */}
          {jobPhotos.length < 3 && (
            <label className="w-full aspect-square flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 cursor-pointer hover:border-blue-400">
              +
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          )}
        </div>
        <MapPicker onLocationSelect={(coords) => setCoords(coords)} />

        <button
          className="w-1/2 h-12 bg-[#0385C2] text-white rounded-3xl text-2xl inter-medium"
          onClick={handleSubmit}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default Create;
