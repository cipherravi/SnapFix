type ImageCapturerProps = {
  photos: File[];
  setPhotos: (photos: File[]) => void;
  photoLimit: number;
};

const ImageCapturer = ({
  photos,
  setPhotos,
  photoLimit,
}: ImageCapturerProps) => {
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Limit to 3 photos
    const newFiles = files.slice(0, photoLimit - photos.length);
    const updatedPhotos = [...photos, ...newFiles];
    setPhotos(updatedPhotos);
  };

  return (
    <div className="w-11/12 grid grid-cols-3 gap-4">
      {/* Show image */}
      {photos.map((file, idx) => (
        <div
          key={idx}
          className="relative w-full aspect-square rounded-xl overflow-hidden border shadow"
        >
          <img
            src={URL.createObjectURL(file)}
            alt={`Upload ${idx + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Remove Image */}
          <button
            onClick={() => {
              const newList = [...photos];
              newList.splice(idx, 1);
              setPhotos(newList);
            }}
            className="absolute top-1 right-1 bg-white rounded-full text-red-500 text-xs px-1"
          >
            ✕
          </button>
        </div>
      ))}
      {/* Add image */}
      {photos.length < photoLimit && (
        <label className="w-full aspect-square flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 cursor-pointer hover:border-blue-400">
          +
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </label>
      )}
    </div>
  );
};

export default ImageCapturer;
