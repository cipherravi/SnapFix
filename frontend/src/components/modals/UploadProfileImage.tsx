import ImageCapturer from "../ImageCapturer";

interface UploadProfileImageProps {
  setOpenPhotoModal: React.Dispatch<React.SetStateAction<boolean>>;
  previewUrl: string | null;
  profilePicUrl: string | undefined;
  profilePhoto: File[];
  setProfilePhoto: React.Dispatch<React.SetStateAction<File[]>>;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  handleProfileUpload: () => void;
  uploading: boolean;
}

const UploadProfileImage: React.FC<UploadProfileImageProps> = ({
  setOpenPhotoModal,
  previewUrl,
  profilePicUrl,
  profilePhoto,
  setProfilePhoto,
  setPreviewUrl,
  handleProfileUpload,
  uploading,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative">
        {/* CLOSE BUTTON */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
          onClick={() => setOpenPhotoModal(false)}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Update Profile Photo
        </h2>

        {/* PREVIEW */}
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
            <img
              src={previewUrl || profilePicUrl}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* IMAGE SELECT BUTTON */}
        <div className="flex justify-center">
          <ImageCapturer
            photos={profilePhoto}
            setPhotos={setProfilePhoto}
            photoLimit={1}
            mode="button"
            icon="camera"
          />
        </div>

        {/* REMOVE PHOTO */}
        {previewUrl && (
          <button
            className="mt-4 text-red-600 font-medium mx-auto block"
            onClick={() => {
              setProfilePhoto([]);
              setPreviewUrl(null);
            }}
          >
            Remove Photo
          </button>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 h-11 rounded-xl bg-gray-300 text-black"
            onClick={() => setOpenPhotoModal(false)}
          >
            Cancel
          </button>

          <button
            className="flex-1 h-11 rounded-xl bg-blue-600 text-white disabled:bg-blue-300"
            disabled={uploading}
            onClick={async () => {
              await handleProfileUpload();
              setOpenPhotoModal(false);
            }}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadProfileImage;
