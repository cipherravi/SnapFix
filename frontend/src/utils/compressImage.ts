import imageCompression from "browser-image-compression";

const mainImage = async (file: File) => {
  const options = {
    fileType: "image/webp",
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
  };
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Thumbnail Image compression error:", error);
    return file;
  }
};

const thumbnailImage = async (file: File) => {
  const options = {
    fileType: "image/webp",
    maxSizeMB: 0.08,
    maxWidthOrHeight: 600,
    useWebWorker: true,
  };
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Main Image compression error:", error);
    return file;
  }
};

export default { thumbnailImage, mainImage };





