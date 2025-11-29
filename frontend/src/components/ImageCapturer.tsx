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

    const newFiles = files.slice(0, photoLimit - photos.length);
    setPhotos([...photos, ...newFiles]);
  };

  const handleRemove = (index: number) => {
    const newList = [...photos];
    newList.splice(index, 1);
    setPhotos(newList);
  };

  return (
    <div className="w-11/12 grid grid-cols-3 gap-4">
      {photos.map((file, idx) => (
        <div
          key={idx}
          className="relative w-full aspect-square rounded-xl overflow-hidden border shadow"
        >
          <img
            src={URL.createObjectURL(file)}
            alt={`Uploaded image ${idx + 1} of ${photoLimit}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => handleRemove(idx)}
            className="absolute top-1 right-1 bg-white rounded-full text-red-500 text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Remove image ${idx + 1}`}
          >
            ✕
          </button>
        </div>
      ))}

      {photos.length < photoLimit && (
        <label
          tabIndex={0}
          className="w-full aspect-square flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Add image (${photos.length + 1} of ${photoLimit})`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              const input =
                e.currentTarget.querySelector<HTMLInputElement>(
                  "input[type=file]"
                );
              input?.click();
            }
          }}
        >
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
