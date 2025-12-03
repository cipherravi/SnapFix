import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MapPicker from "../../components/map/MapPicker";

import BackButton from "../../components/Buttons/BackButton";
import DropDownOptions from "../../components/modals/DropDownOptions";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import useStateFetcher from "../../utils/Hooks/useStateFetcher";
import useDistrictFetcher from "../../utils/Hooks/useDistrictFetcher";
import userCityFetcher from "../../utils/Hooks/useCityFetcher";
import useAreaFetcher from "../../utils/Hooks/useAreaFetcher";
import { useAddressContext } from "../../utils/context/AddressContext";

import { useSelector } from "react-redux";

import type { State, Area, City, District } from "../../../types";

const CreateAddress = () => {
  const token = useSelector((s: any) => s.auth.token);

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
          Authorization: `Bearer ${token}`,
        },
        // credentials: "include",
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

  return (
    <div className="w-full min-h-screen flex flex-col bg-white items-center px-4 sm:px-6 md:px-10 py-6">
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col gap-2">
        <BackButton navigateTo="/profile/addresses" />
        <h1 className="text-2xl sm:text-3xl poppins-bold">Create Address</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Fill in the details below and pick your location on the map.
        </p>
      </div>

      {/* Inputs and dropdowns */}
      <div className="w-full max-w-3xl flex flex-col gap-3 mt-4 z-50">
        <input
          className="bg-[#F4F4F4] rounded-lg text-lg h-12 w-full px-4 border focus:ring transition"
          type="text"
          name="building"
          placeholder="Building Name"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          required
          autoComplete="off"
          maxLength={30}
        />
        <input
          className="bg-[#F4F4F4] rounded-lg text-lg h-12 w-full px-4 border focus:ring transition"
          type="text"
          name="street"
          placeholder="Street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          maxLength={30}
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

      {/* Map */}
      <div className="w-full max-w-3xl mt-6 rounded-xl overflow-hidden shadow-md h-56 sm:h-64 md:h-72 z-10">
        <MapPicker
          onLocationSelect={(coords) => setCoords(coords)}
          location={
            selectedArea
              ? [Number(selectedArea.latitude), Number(selectedArea.longitude)]
              : [25.545229354169017, 84.65927124023439]
          }
          zoom={13}
          type="create"
          animateOnLoad={!!selectedArea}
        />
      </div>

      {/* Submit button */}
      <div className="w-full max-w-3xl flex justify-center mt-6">
        <button
          className="w-full sm:w-1/2 py-3 px-6 sm:px-10 bg-[#0385c2] rounded-2xl text-xl sm:text-2xl text-white inter-medium cursor-pointer transition-transform active:scale-95"
          onClick={handleSubmit}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateAddress;
