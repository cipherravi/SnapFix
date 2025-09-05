import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DropDownOptions from "../components/modals/DropDownOptions";
import { sanitizeBudgetInput } from "../utils/inputSanitizers";
import useCategoryFetcher from "../utils/Hooks/useCategoryFetcher";
import userCityFetcher from "../utils/Hooks/userCityFetcher";
import useAddressFetcher from "../utils/Hooks/useAddressFetcher";
import MapPicker from "../components/map/MapPicker";
import sortByName from "../utils/sortByName";
import { useNavigate } from "react-router-dom";
import ImageCapturer from "../components/ImageCapturer";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BaseOption {
  id: number;
  name: string;
}

interface AddressOption extends BaseOption {
  building: string;
  street: string;
  area: string;
  city: string;
  district: string;
  state: string;
}
const Create = () => {
  const navigate = useNavigate();

  const [categoryOptions, setCategoryOptions] = useState<BaseOption[]>([]);
  const [cityOptions, setCityOptions] = useState<BaseOption[]>([]);
  const [addressOptions, setAddressOptions] = useState<AddressOption[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<BaseOption | null>(
    null
  );
  const [selectedCity, setSelectedCity] = useState<BaseOption | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressOption | null>(
    null
  );

  const [jobTitle, setJobTitle] = useState("");
  const [jobBudget, setJobBudget] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [jobPhotos, setJobPhotos] = useState<File[]>([]);

  const fetchCategories = useCategoryFetcher();

  const fetchCities = userCityFetcher();

  const [showAddressModal, setShowAddressModal] = useState(false);

  const { fetchAddresses } = useAddressFetcher();

  useEffect(() => {
    const loadOptions = async () => {
      const fetchedCategories = await fetchCategories();
      // Sort categories by name (case-insensitive)
      setCategoryOptions(sortByName(fetchedCategories));

      const fetchedCities = await fetchCities();

      setCityOptions(sortByName(fetchedCities));

      const fetchedAddresses = await fetchAddresses();
      if (fetchedAddresses.length < 1) {
        setShowAddressModal(true);
      } else {
        setAddressOptions(sortByName(fetchedAddresses));
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
      const formData = new FormData();
      // Append images
      if (jobPhotos[0]) formData.append("main", jobPhotos[0]);
      if (jobPhotos[1]) formData.append("secondary", jobPhotos[1]);
      if (jobPhotos[2]) formData.append("third", jobPhotos[2]);

      // Append job details
      formData.append("title", jobTitle);
      formData.append("description", jobDescription);
      formData.append("budget", jobBudget);
      if (selectedCity?.id) formData.append("cityId", String(selectedCity.id));
      if (selectedCategory?.id)
        formData.append("categoryId", String(selectedCategory.id));
      if (selectedAddress?.id)
        formData.append("addressId", String(selectedAddress.id));
      if (coords?.[0]) formData.append("lat", String(coords[0]));
      if (coords?.[1]) formData.append("lng", String(coords[1]));

      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/jobs`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        navigate("/explore");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong!");
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

        <ImageCapturer
          photos={jobPhotos}
          setPhotos={setJobPhotos}
          photoLimit={3}
        />
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

//  formData.append("title", jobTitle);
//     formData.append("description", jobDescription);
//     formData.append("budget", jobBudget);
//     formData.append("cityId", String(selectedCity?.id));
//     formData.append("cityId", String(selectedCity?.id));
