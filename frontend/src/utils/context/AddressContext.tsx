import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Address, State, District, City, Area } from "@types";
import useStateFetcher from "../Hooks/useStateFetcher";
import useDistrictFetcher from "../Hooks/useDistrictFetcher";
import useCityFetcher from "../Hooks/useCityFetcher";
import useAreaFetcher from "../Hooks/useAreaFetcher";
import useAddressFetcher from "../Hooks/useAddressFetcher";

interface AddressContextType {
  loadStates: () => Promise<void>;
  loadDistricts: (stateId: number) => Promise<void>;
  loadCities: (districtId: number) => Promise<void>;
  loadAreas: (cityId: number) => Promise<void>;
  loadAddresses: () => Promise<void>;

  states: State[];
  districts: District[];
  cities: City[];
  areas: Area[];
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}

interface AddressContextProviderProps {
  children: ReactNode;
}
const AddressContext = createContext<AddressContextType | undefined>(undefined);

const AddressProvider = ({ children }: AddressContextProviderProps) => {
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const fetchStates = useStateFetcher();
  const fetchDistricts = useDistrictFetcher();
  const fetchCities = useCityFetcher();
  const fetchAreas = useAreaFetcher();
  const { fetchAddresses } = useAddressFetcher();

  async function loadStates() {
    const fetchedStates = await fetchStates();
    setStates(fetchedStates);
  }
  async function loadDistricts(stateId: number) {
    const fetchedDistricts = await fetchDistricts(stateId);
    setDistricts(fetchedDistricts);
  }
  async function loadCities(districtId: number) {
    const fetchedCities = await fetchCities(districtId);
    setCities(fetchedCities);
  }
  async function loadAreas(cityId: number) {
    const fetchedAreas = await fetchAreas(cityId);
    setAreas(fetchedAreas);
  }
  async function loadAddresses() {
    const fetchedAddresses = await fetchAddresses();
    setAddresses(fetchedAddresses);
  }

  useEffect(() => {
    loadStates();
    loadAddresses();
  }, []);

  return (
    <AddressContext.Provider
      value={{
        loadStates,
        loadDistricts,
        loadCities,
        loadAreas,
        loadAddresses,
        states,
        districts,
        cities,
        areas,
        addresses,
        setAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export default AddressProvider;

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error(
      "useAddressContext must be used within an AddressContextProvider"
    );
  }
  return context;
};
