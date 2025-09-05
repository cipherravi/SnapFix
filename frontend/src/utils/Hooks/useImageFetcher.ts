
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_SUPABASE_PUBLIC_BASE_URL = import.meta.env.VITE_SUPABASE_PUBLIC_BASE_URL;


const useImageFetcher = () => {

    const fetchPublicImage = async (fileName:string) =>{
      const res= await fetch(`${VITE_API_BASE_URL}/api/v1/assets/public/image/${fileName}`,{credentials:"include"});
      const data = await res.json();
      return data?.publicUrl
    }
    const fetchPrivateImage = async (fileName:string) =>{
      const res= await fetch(`${VITE_API_BASE_URL}/api/v1/assets/private/image/${fileName}`,{credentials:"include"})
      const data = await res.json();
      return data

    }



function getImageUrl(fileName?: string , folder?:string): string {
  if (!fileName) {
    return "/svg/profile.svg"; // fallback default
  }
  return `${VITE_SUPABASE_PUBLIC_BASE_URL}${folder}/${fileName}`;
}



  return {fetchPublicImage,fetchPrivateImage,getImageUrl};
}

export default useImageFetcher;