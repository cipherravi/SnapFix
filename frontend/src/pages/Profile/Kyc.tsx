import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import BackButton from "../../components/Buttons/BackButton";
import DropDownOptions from "../../components/modals/DropDownOptions";
import ImageCapturer from "../../components/ImageCapturer";

import { useAddressContext } from "../../utils/context/AddressContext";
import useKycUpload from "../../utils/Hooks/useKycUpload";

import { useSelector } from "react-redux";
import type { Address } from "../../../types";

const Kyc = () => {
  const navigate = useNavigate();
  const userData = useSelector((store: any) => store.user.userData);

  const { addresses } = useAddressContext();
  const { uploadKyc, uploading } = useKycUpload();

  const [idPhotos, setIdPhotos] = useState<File[]>([]);
  const [userPhoto, setUserPhoto] = useState<File[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleUpload = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address.");
      return;
    }

    uploadKyc({
      idPhotos,
      userPhoto,
      addressId: selectedAddress.id,
      onSuccess: () => navigate("/profile"),
    });
  };

  /* ---------------------------------------------------------------------- */
  /*                    STATUS CARDS (WOW UI UPGRADED)                      */
  /* ---------------------------------------------------------------------- */

  const StatusCard = ({ img, message, button }: any) => (
    <div className="w-full flex justify-center">
      <div
        className="
        w-full max-w-3xl bg-white/70 backdrop-blur-xl border border-gray-200
        p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        flex flex-col items-center text-center
      "
      >
        <img src={img} className="w-28 md:w-36 mb-4" />
        <p className="inter-medium text-gray-700 text-lg">{message}</p>
        {button}
      </div>
    </div>
  );

  const renderStatusMessage = () => {
    const status = userData?.kyc?.status;

    switch (status) {
      case "pending":
        return (
          <StatusCard
            img="/svg/timer.svg"
            message="Your KYC application is pending. Please allow some time for processing."
          />
        );

      case "verified":
        return (
          <StatusCard
            img="/images/verified.png"
            message="Your KYC is verified and up to date."
          />
        );

      case "rejected":
        return (
          <StatusCard
            img="/images/rejected.png"
            message="Your KYC was rejected. Contact our support team for more information."
            button={
              <button className="mt-4 px-6 py-2 bg-[#444] text-white rounded-2xl inter-medium">
                Contact Support
              </button>
            }
          />
        );

      default:
        return renderKycForm();
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                          WOW UI FORM                                   */
  /* ---------------------------------------------------------------------- */

  const renderKycForm = () => (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-10 mt-2">
      {/* Card Container */}
      <div
        className="
        bg-white/80 backdrop-blur-xl border border-gray-200 
        rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        p-6 sm:p-10 flex flex-col gap-10
      "
      >
        {/* ID Proof */}
        <div>
          <h1 className="text-xl inter-semibold mb-3 flex items-center gap-2">
            <img src="/svg/id-card.svg" className="w-6 opacity-70" />
            Provide ID Proof
            <span className="inter-light text-sm">(front & back)</span>
          </h1>

          <ImageCapturer
            photos={idPhotos}
            setPhotos={setIdPhotos}
            photoLimit={2}
          />
        </div>

        {/* Selfie */}
        <div>
          <h1 className="text-xl inter-semibold mb-3 flex items-center gap-2">
            <img src="/svg/camera.svg" className="w-6 opacity-70" />
            Provide Current Photo
          </h1>

          <ImageCapturer
            photos={userPhoto}
            setPhotos={setUserPhoto}
            photoLimit={1}
          />
        </div>

        {/* Address */}
        <div>
          <h1 className="text-xl inter-semibold mb-3 flex items-center gap-2">
            <img src="/svg/location.svg" className="w-6 opacity-70" />
            Select Address
          </h1>

          {addresses.length < 1 ? (
            <div className="w-full border bg-red-50 rounded-xl p-4 shadow text-center">
              <p className="text-sm text-red-600 mb-3">
                🚫 No address found. Please add one before continuing.
              </p>
              <button
                onClick={() => navigate("/profile/addresses/create")}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm"
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
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="
            px-10 py-3 rounded-3xl text-xl text-white inter-medium 
            bg-[#0385C2] hover:bg-[#0F7EBA] transition-all
            disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer
          "
        >
          {uploading ? "Uploading..." : "Submit KYC"}
        </button>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------------- */
  /*                        MAIN LAYOUT — WOW UI                            */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="pt-4 px-4 sm:px-6 md:px-8 w-full max-w-3xl mx-auto flex flex-col gap-3">
        <BackButton navigateTo="/profile" />
        <h1 className="text-3xl poppins-bold">KYC Verification</h1>
        <p className="text-gray-600 inter-regular text-sm">
          Complete your verification to unlock all features
        </p>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 md:px-8 py-6 w-full flex-1 overflow-y-auto">
        {renderStatusMessage()}
      </div>
    </div>
  );
};

export default Kyc;
