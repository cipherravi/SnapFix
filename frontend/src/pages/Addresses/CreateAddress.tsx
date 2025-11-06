import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MapPicker from "@/components/map/MapPicker";

import BackButton from "../../components/Buttons/BackButton";
import DropDownOptions from "@/components/modals/DropDownOptions";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import useStateFetcher from "@/utils/Hooks/useStateFetcher";
import useDistrictFetcher from "@/utils/Hooks/useDistrictFetcher";
import userCityFetcher from "@/utils/Hooks/useCityFetcher";
import useAreaFetcher from "@/utils/Hooks/useAreaFetcher";
import { useAddressContext } from "@/utils/context/AddressContext";

import type { State, Area, City, District } from "@types";

const CreateAddress = () => {
  const navigate = useNavigate();
  const { loadAddresses } = useAddressContext();

  const [building, setBuilding] = useState("");
  const [street, setStreet] = useState("");

  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const [coords, setCoords] = useState<[number, number] | null>(null);

  const fetchStates = useStateFetcher();
  const fetchDistricts = useDistrictFetcher();
  const fetchCities = userCityFetcher();
  const fetchAreas = useAreaFetcher();

  // Fetch states on mount
  useEffect(() => {
    (async () => {
      const fetchedStates = await fetchStates();
      setStates(fetchedStates);
    })();
  }, []);

  // Fetch districts when state is selected
  useEffect(() => {
    if (!selectedState) return;
    (async () => {
      const fetchedDistricts = await fetchDistricts(selectedState.id);
      setDistricts(fetchedDistricts);
      setSelectedDistrict(null); // Reset lower levels
      setCities([]);
      setSelectedCity(null);
      setAreas([]);
      setSelectedArea(null);
    })();
  }, [selectedState]);

  // Fetch cities when district is selected
  useEffect(() => {
    if (!selectedDistrict) return;
    (async () => {
      const fetchedCities = await fetchCities(selectedDistrict.id);
      setCities(fetchedCities);
      setSelectedCity(null);
      setAreas([]);
      setSelectedArea(null);
    })();
  }, [selectedDistrict]);

  // Fetch areas when city is selected
  useEffect(() => {
    if (!selectedCity) return;
    (async () => {
      const fetchedAreas = await fetchAreas(selectedCity.id);
      setAreas(fetchedAreas);
      setSelectedArea(null);
    })();
  }, [selectedCity]);

  const validateInput = (value: any) => {
    // Not only numbers or whitespace, and min 3 non-whitespace characters
    const cleaned = value.trim();
    return cleaned.length >= 3 && /\D/.test(cleaned); // Must contain at least one non-digit
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (![building, street].every(validateInput)) {
        toast.error("Please fill in all fields correctly.");
        return;
      }
      if (!selectedArea || !selectedCity) {
        toast.error("Please select options given below");
        return;
      }
      if (!coords) {
        toast.error("Please pick your location on map");
        return;
      }

      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/addresses`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          building,
          street,
          areaId: selectedArea?.id,
          cityId: selectedCity?.id,
          latitude: coords[0],
          longitude: coords[1],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Address Created Successfully!");
        setBuilding("");
        setStreet("");
        loadAddresses();
        navigate("/profile/addresses");
      } else {
        toast.error(data.message || "Address creation Failed!");
      }
    } catch (err) {
      toast.error("An error occurred while Address creation.");
    }
  };

  const inputProps = {
    className:
      "bg-[#F4F4F4] rounded-lg text-lg h-12 w-full pl-4 pr-4 border focus:ring",
    maxLength: 30,
  };

  return (
    <div className="w-full min-h-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="shrink-0 pt-4 px-4 flex flex-col gap-4">
        <BackButton navigateTo="/profile/addresses" />
        <h1 className="text-3xl poppins-bold">Create Address</h1>

        <div className="w-full py-4 flex flex-col gap-3 z-10000">
          <input
            {...inputProps}
            type="text"
            name="building"
            placeholder="Building Name"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            required
            autoComplete="off"
          />
          <input
            {...inputProps}
            type="text"
            name="street"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <DropDownOptions
            selected={selectedState}
            setSelected={setSelectedState}
            options={states}
            variant="name"
            placeholder="Select State"
          />
          <DropDownOptions
            selected={selectedDistrict}
            setSelected={setSelectedDistrict}
            options={districts}
            variant="name"
            placeholder="Select District"
          />
          <DropDownOptions
            selected={selectedCity}
            setSelected={setSelectedCity}
            options={cities}
            variant="name"
            placeholder="Select City"
          />
          <DropDownOptions
            selected={selectedArea}
            setSelected={setSelectedArea}
            options={areas}
            variant="name"
            placeholder="Select Area"
          />
        </div>
        {selectedArea ? (
          <MapPicker
            onLocationSelect={(coords) => setCoords(coords)}
            location={[
              Number(selectedArea?.latitude),
              Number(selectedArea?.longitude),
            ]}
            zoom={13}
            type="create"
            animateOnLoad={true}
          />
        ) : (
          <MapPicker
            onLocationSelect={(coords) => setCoords(coords)}
            location={[25.545229354169017, 84.65927124023439]}
          />
        )}

        <div className="w-full flex justify-center ">
          <button
            className="py-2 px-5 bg-[#0385c2] rounded-2xl text-2xl text-white inter-medium cursor-pointer mb-5"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAddress;
