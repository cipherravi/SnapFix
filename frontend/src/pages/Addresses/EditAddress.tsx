import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import BackButton from "../../components/Buttons/BackButton";
import MapPicker from "../../components/map/MapPicker";
import { useAddressContext } from "../..//utils/context/AddressContext";
import type { Address } from "../../../types";
import EditAddressShimmer from "../../components/shimmer/EditAddressShimmer";

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

  return coords === null || address === null ? (
    <EditAddressShimmer />
  ) : (
    <div className="w-full min-h-screen flex flex-col bg-white items-center px-4 sm:px-6 md:px-10 py-6">
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col gap-2">
        <BackButton navigateTo="/profile/addresses" />
        <h1 className="text-2xl sm:text-3xl poppins-bold">Edit Address</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Update your address details below. Map shows the current location.
        </p>
      </div>

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl flex flex-col gap-3 mt-6"
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

        {/* Map */}
        <div className="w-full mt-4 rounded-xl overflow-hidden shadow-md h-52 sm:h-64 md:h-72">
          <MapPicker
            onLocationSelect={(coords) => setCoords(coords)}
            location={coords}
            zoom={15}
            type="edit"
            animateOnLoad={true}
          />
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-center mt-6">
          <button
            type="submit"
            className="py-3 px-6 sm:px-10 bg-[#0385c2] rounded-2xl text-xl sm:text-2xl text-white inter-medium cursor-pointer transition-transform active:scale-95"
          >
            Confirm Edit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAddress;
