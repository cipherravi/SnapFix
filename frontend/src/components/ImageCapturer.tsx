type ImageCapturerProps = {
  photos: File[];
  setPhotos: (photos: File[]) => void;
  photoLimit: number;
  mode?: "grid" | "button";
  icon?: "plus" | "camera";
};

const ImageCapturer = ({
  photos,
  setPhotos,
  photoLimit,
  mode = "grid",
  icon = "plus",
}: ImageCapturerProps) => {
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // If replacing previous profile picture, clean up the old URL
    if (photoLimit === 1 && photos[0]) {
      URL.revokeObjectURL(URL.createObjectURL(photos[0]));
    }

    // Always keep only the newest file when limit = 1
    if (photoLimit === 1) {
      setPhotos([files[0]]);
    } else {
      const newFiles = files.slice(0, photoLimit - photos.length);
      setPhotos([...photos, ...newFiles]);
    }
  };

  const handleRemove = (index: number) => {
    const newList = [...photos];
    newList.splice(index, 1);
    setPhotos(newList);
  };

  // ------------------------------------
  // MODE 1: BUTTON (Profile Picture)
  // ------------------------------------
  // BUTTON MODE
  if (mode === "button") {
    return (
      <label
        className="
        w-10 h-10 rounded-full bg-blue-600 text-white
        flex items-center justify-center cursor-pointer
        shadow-md hover:bg-blue-700 text-xl
      "
      >
        {icon === "camera" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            className="w-6 h-6"
            viewBox="0 0 24 24"
          >
            <path d="M12 8.5a4 4 0 110 8 4 4 0 010-8zm6.5-3.5h-2l-.8-1.5A2.5 2.5 0 0013.6 2H10.4a2.5 2.5 0 00-2.1 1.5L7.5 5H5.5A3.5 3.5 0 002 8.5v8A3.5 3.5 0 005.5 20h13a3.5 3.5 0 003.5-3.5v-8A3.5 3.5 0 0018.5 5z" />
          </svg>
        ) : (
          "+"
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </label>
    );
  }

  // ------------------------------------
  // MODE 2: GRID (Multiple photos)
  // ------------------------------------

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
