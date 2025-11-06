import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import BackButton from "../../components/Buttons/BackButton";
import MapPicker from "@/components/map/MapPicker";
import { useAddressContext } from "@/utils/context/AddressContext";
import type { Address } from "@types";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addresses, loadAddresses } = useAddressContext();

  const [address, setAddress] = useState<Address | null>(null);
  const [building, setBuilding] = useState("");
  const [street, setStreet] = useState("");
  const [coords, setCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!id) return;

    const selectedAddress = addresses.find(
      (address) => address.id === Number(id)
    );

    if (!selectedAddress) return;

    setAddress(selectedAddress);
    setBuilding(selectedAddress.building);
    setStreet(selectedAddress.street);
    setCoords([
      parseFloat(selectedAddress.latitude),
      parseFloat(selectedAddress.longitude),
    ]);
  }, [id, addresses]);

  const validateInput = (value: string) => {
    const cleaned = value.trim();
    return cleaned.length >= 3 && /\D/.test(cleaned); // At least 3 non-whitespace, non-digit chars
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (![building, street].every(validateInput)) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    if (!coords) {
      toast.error("Please pick your location on map");
      return;
    }

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/addresses`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id,
          building,
          street,
          latitude: coords[0],
          longitude: coords[1],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Address Updated Successfully!");
        loadAddresses();
        navigate("/profile/addresses");
      } else {
        toast.error(data.message || "Address update Failed!");
      }
    } catch (err) {
      toast.error("An error occurred while updating the address.");
    }
  };

  const inputProps = {
    className:
      "bg-[#F4F4F4] rounded-lg text-xl h-14 w-full pl-4 pr-4 border focus:ring",
    maxLength: 30,
  };

  const readOnlyStyle =
    "bg-[#F4F4F4] rounded-lg text-xl h-12 w-full pl-4 pr-4 border opacity-50";

  // Show loading while data isn't ready
  // Build better shimmer
  if (!address || !coords) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xl">
        Loading address...
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      <div className="shrink-0 pt-4 px-4 flex flex-col gap-4">
        <BackButton navigateTo="/profile/addresses" />
        <h1 className="text-3xl poppins-bold">Edit Address</h1>

        {/* Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full py-4 flex flex-col gap-3"
        >
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

          {/* Read-only Address Hierarchy */}
          <input
            className={readOnlyStyle}
            type="text"
            name="area"
            placeholder="Area"
            value={address?.area?.name || ""}
            readOnly
            disabled
          />
          <input
            className={readOnlyStyle}
            type="text"
            name="city"
            placeholder="City"
            value={address?.area?.city?.name || ""}
            readOnly
            disabled
          />
          <input
            className={readOnlyStyle}
            type="text"
            name="district"
            placeholder="District"
            value={address?.area?.city?.district?.name || ""}
            readOnly
            disabled
          />
          <input
            className={readOnlyStyle}
            type="text"
            name="state"
            placeholder="State"
            value={address?.area?.city?.district?.state?.name || ""}
            readOnly
            disabled
          />

          <MapPicker
            onLocationSelect={(coords) => setCoords(coords)}
            location={coords}
            zoom={15}
            type="edit"
            animateOnLoad={true}
          />

          <div className="w-full flex justify-center mt-5">
            <button
              type="submit"
              className="py-2 px-5 bg-[#0385c2] rounded-2xl text-2xl text-white inter-medium cursor-pointer absolute bottom-10"
            >
              Confirm Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddress;
