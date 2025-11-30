const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_SUPABASE_PUBLIC_BASE_URL = import.meta.env
  .VITE_SUPABASE_PUBLIC_BASE_URL;

import { useSelector } from "react-redux";

const useImageFetcher = () => {
  const token = useSelector((s: any) => s.auth.token);

  const fetchPublicImage = async (fileName: string) => {
    const res = await fetch(
      `${VITE_API_BASE_URL}/api/v1/assets/public/image/${fileName}`,
      {
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data?.publicUrl;
  };
  const fetchProfileImage = async (fileName: string) => {
    const res = await fetch(
      `${VITE_API_BASE_URL}/api/v1/assets/public/profiles/${fileName}`,
      {
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data?.publicUrl;
  };
  const fetchPrivateImage = async (fileName: string) => {
    const res = await fetch(
      `${VITE_API_BASE_URL}/api/v1/assets/private/image/${fileName}`,
      {
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data;
  };

  function getImageUrl(fileName?: string, folder?: string): string {
    if (!fileName) {
      return ""; // fallback default
    }
    return `${VITE_SUPABASE_PUBLIC_BASE_URL}${folder}/${fileName}`;
  }

  return {
    fetchPublicImage,
    fetchPrivateImage,
    getImageUrl,
    fetchProfileImage,
  };
};

export default useImageFetcher;
