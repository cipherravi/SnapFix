// hooks/useKycUpload.ts
import { useState } from "react";
import toast from "react-hot-toast";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useKycUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadKyc = async ({
    idPhotos,
    userPhoto,
    addressId,
    onSuccess,
  }: {
    idPhotos: File[];
    userPhoto: File[];
    addressId: number;
    onSuccess?: () => void;
  }) => {
    if (idPhotos.length !== 2 || userPhoto.length !== 1) {
      toast.error("Please upload all required photos.");
      return;
    }

    const formData = new FormData();
    formData.append("id_front", idPhotos[0]);
    formData.append("id_back", idPhotos[1]);
    formData.append("selfie", userPhoto[0]);
    formData.append("address_id", addressId.toString());

    try {
      setUploading(true);
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/kyc/submit`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "KYC submitted successfully!");
        onSuccess?.();
      } else {
        toast.error(data.message || "KYC submission failed.");
      }
    } catch (err) {
      toast.error("An error occurred during upload.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadKyc,
    uploading,
  };
};

export default useKycUpload;
