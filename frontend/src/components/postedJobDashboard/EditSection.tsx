import { useEffect, useState } from "react";
import { sanitizeBudgetInput } from "../../utils/inputSanitizers";
import DropDownOptions from "../modals/DropDownOptions";
import useAddressFetcher from "../../utils/Hooks/useAddressFetcher";
import userCityFetcher from "../../utils/Hooks/userCityFetcher";
import useCategoryFetcher from "../../utils/Hooks/useCategoryFetcher";
import MapPicker from "../map/MapPicker";
import MapDisplay from "../map/MapDisplay";

interface Option {
  name: string;
  id: number;
  building: string;
  street: string;
  area: string;
  city: string;
  district: string;
  state: string;
}

interface EditSectionProps {
  budget: number;
  description: string;
  title: string;
  addressId: number;
  categoryId: number;
  cityId: number;
  lat: string;
  lng: string;
}

const EditSection = ({
  title,
  budget,
  addressId,
  categoryId,
  cityId,
  description,
  lat,
  lng,
}: EditSectionProps) => {
  const [initialCategory, setInitialCategory] = useState<Option | null>(null);
  const [initialCity, setInitialCity] = useState<Option | null>(null);
  const [initialAddress, setInitialAddress] = useState<Option | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [selectedCity, setSelectedCity] = useState<Option | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Option | null>(null);

  const [jobTitle, setJobTitle] = useState(title);
  const [jobBudget, setJobBudget] = useState(budget.toString());
  const [jobDescription, setJobDescription] = useState(description);
  const [coords, setCoords] = useState<[number, number] | null>([+lat, +lng]);
  const [canEdit, setCanEdit] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [addressOptions, setAddressOptions] = useState<Option[]>([]);

  const fetchCategories = useCategoryFetcher();
  const fetchCities = userCityFetcher();
  const { fetchAddresses } = useAddressFetcher();

  useEffect(() => {
    const loadOptions = async () => {
      const fetchedCategories = await fetchCategories();
      setCategoryOptions(fetchedCategories);
      const _initialCategory =
        fetchedCategories.find((c: any) => c.id === categoryId) || null;
      setSelectedCategory(_initialCategory);
      setInitialCategory(_initialCategory); // Save for reset

      const fetchedCities = await fetchCities();
      setCityOptions(fetchedCities);
      const _initialCity =
        fetchedCities.find((c: any) => c.id === cityId) || null;
      setSelectedCity(_initialCity);
      setInitialCity(_initialCity); // Save for reset

      const fetchedAddresses = await fetchAddresses();
      setAddressOptions(fetchedAddresses);
      const _initialAddress =
        fetchedAddresses.find((a: any) => a.id === addressId) || null;
      setSelectedAddress(_initialAddress);
      setInitialAddress(_initialAddress); // Save for reset
    };

    loadOptions();
  }, []);

  async function handleSubmit() {
    try {
    } catch (error) {}
  }

  const handleCancel = () => {
    setJobTitle(title);
    setJobBudget(budget.toString());
    setJobDescription(description);
    setCoords([+lat, +lng]);

    setSelectedCategory(initialCategory);
    setSelectedCity(initialCity);
    setSelectedAddress(initialAddress);

    setCanEdit(false);
  };

  return (
    <div className="flex flex-col gap-4 items-center py-4">
      <DropDownOptions
        selected={selectedCategory}
        setSelected={setSelectedCategory}
        options={categoryOptions}
        variant="name"
        placeholder="Select Category"
        disabled={!canEdit}
      />

      <DropDownOptions
        selected={selectedCity}
        setSelected={setSelectedCity}
        options={cityOptions}
        variant="name"
        placeholder="Select City"
        disabled={!canEdit}
      />

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

      <DropDownOptions
        selected={selectedAddress}
        setSelected={setSelectedAddress}
        options={addressOptions}
        variant="address"
        placeholder="Select Address"
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

      {canEdit ? (
        <MapPicker
          onLocationSelect={(coords) => setCoords(coords)}
          location={[Number(lat), Number(lng)]}
        />
      ) : (
        <MapDisplay location={[Number(lat), Number(lng)]} />
      )}

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
              // Handle submit logic here
              handleSubmit();
              setCanEdit(false);
              console.log({
                title: jobTitle,
                budget: jobBudget,
                description: jobDescription,
                category: selectedCategory,
                city: selectedCity,
                address: selectedAddress,
                coords,
              });
            } else {
              setCanEdit(true);
            }
          }}
        >
          {canEdit ? "Submit" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default EditSection;
