import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import BackButton from "../../components/Buttons/BackButton";
import DropDownOptions from "../../components/modals/DropDownOptions";
import ImageCapturer from "../../components/ImageCapturer";

import { useAddressContext } from "@/utils/context/AddressContext";
import useKycUpload from "../../utils/Hooks/useKycUpload";
import { useUserInfo } from "../../utils/context/UserInfoContext";
import type { Address } from "@types";

const Kyc = () => {
  const navigate = useNavigate();
  const { userData, isLoading, fetchProfile } = useUserInfo();
  const { addresses } = useAddressContext();
  const { uploadKyc, uploading } = useKycUpload();

  const [idPhotos, setIdPhotos] = useState<File[]>([]);
  const [userPhoto, setUserPhoto] = useState<File[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Handle KYC form submission
  const handleUpload = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address.");
      return;
    }

    uploadKyc({
      idPhotos,
      userPhoto,
      addressId: selectedAddress.id,
      onSuccess: () => {
        navigate("/profile");
        fetchProfile();
      },
    });
  };

  // Conditional UI Rendering
  const renderKycForm = () => (
    <>
      <div className="mt-10 ml-10">
        {/* ID Proof Section */}
        <h1 className="text-xl inter-semibold my-5">
          Provide ID Proof
          <strong className="inter-light text-sm pl-3">(front & back)</strong>
        </h1>
        <ImageCapturer
          photos={idPhotos}
          setPhotos={setIdPhotos}
          photoLimit={2}
        />

        {/* Selfie Section */}
        <h1 className="text-xl inter-semibold my-5">Provide Current Photo</h1>
        <ImageCapturer
          photos={userPhoto}
          setPhotos={setUserPhoto}
          photoLimit={1}
        />
      </div>

      {/* Address Selection or Modal */}
      <div className="mt-10 w-full flex justify-center">
        {addresses.length < 1 ? (
          <div className="w-11/12 border bg-[#FFF0F0] rounded-lg p-4 shadow text-center">
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
      </div>

      {/* Submit Button */}
      <div className="w-full flex justify-center py-10">
        <button
          className="py-2 px-7 rounded-3xl bg-[#0385C2] text-2xl text-white inter-medium"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </div>
    </>
  );

  const renderStatusMessage = () => {
    const status = userData?.kyc?.status;

    switch (status) {
      case "pending":
        return (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="bg-[#e8e8e8] w-full flex flex-col justify-center items-center py-10 rounded-2xl">
              <img src="/svg/timer.svg" alt="Timer pic" className="w-36 " />
              <p className="inter-medium bg-[#e8e8e8] text-center  p-5 rounded-2xl text-md">
                Your KYC application is pending. Please allow some time for
                processing.
              </p>
            </div>
          </div>
        );
      case "verified":
        return (
          <div className="w-full h-full flex justify-center items-center">
            <div className="bg-[#e8e8e8] w-full flex flex-col justify-center items-center py-10 rounded-2xl">
              <img
                src="/images/verified.png"
                alt="Verified pic"
                className="w-36 "
              />
              <p className="inter-medium bg-[#e8e8e8] p-5 text-center  rounded-2xl text-md">
                Your KYC is verified and up to date.
              </p>
            </div>
          </div>
        );
      case "rejected":
        return (
          <div className="w-full h-full flex justify-center items-center">
            <div className="bg-[#e8e8e8] w-full flex flex-col justify-center items-center py-10 rounded-2xl">
              <img
                src="/images/rejected.png"
                alt="Timer pic"
                className="w-36 "
              />
              <p className="inter-medium bg-[#e8e8e8] p-5 text-center rounded-2xl text-md">
                Your KYC was rejected. Contact our support team for more
                information.
              </p>
              <button className="p-2 px-4 rounded-2xl bg-[#444] text-white">
                Contact
              </button>
            </div>
          </div>
        );
      default:
        return renderKycForm();
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="shrink-0 pt-4 px-4 flex flex-col gap-4">
        <BackButton navigateTo="/profile" />
        <h1 className="text-3xl poppins-bold">KYC</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 w-full h-full shrink">
        {isLoading ? <p>Loading...</p> : renderStatusMessage()}
      </div>
    </div>
  );
};

export default Kyc;
