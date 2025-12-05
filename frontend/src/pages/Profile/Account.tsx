import { useEffect, useState } from "react";
import BackButton from "../../components/Buttons/BackButton";
import { useSelector, useDispatch } from "react-redux";
import { setUserProfilePicUrl } from "../../features/user/userSlice";
import toLocalISODate from "../../utils/toLocalISODate";
import toast from "react-hot-toast";
import UploadProfileImage from "../../components/modals/UploadProfileImage";
import compressImage from "../../utils/compressImage";
import { useFetchProfileImageQuery } from "../../services/api/assetApi";
import { RootState } from "../../app/store";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Account = () => {
  const token = useSelector((s: RootState) => s.auth.token);

  const userData = useSelector((s: RootState) => s.user.userData);
  const dispatch = useDispatch();
  const {
    data: profileImageUrlFromApi,
    isLoading: isImageLoading,
    isFetching: isImageFetching,
  } = useFetchProfileImageQuery(userData?.profilePicUrl!, {
    skip: !userData?.profilePicUrl,
  });

  const [profilePhoto, setProfilePhoto] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingProfilePic, setLoadingProfilePic] = useState(true);

  const [profilePicUrl, setProfilePicUrl] = useState<string>();

  // ⬇️ Automatically update profile picture when RTK query finishes
  useEffect(() => {
    const loadProfilePic = async () => {
      // Case 1: user has NO profile picture
      if (!userData?.profilePicUrl) {
        setProfilePicUrl("/svg/profile.svg");
        setLoadingProfilePic(false);
        return;
      }

      // Case 2: user HAS a profile picture → show shimmer until RTK Query resolves
      setLoadingProfilePic(isImageLoading || isImageFetching);

      if (!isImageLoading && !isImageFetching) {
        setProfilePicUrl(profileImageUrlFromApi || "/svg/profile.svg");
      }
    };

    loadProfilePic();
  }, [userData, isImageLoading, isImageFetching, profileImageUrlFromApi]);

  // Actual form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // BACKUP to restore original data if update fails
  const [backup, setBackup] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
  });

  // -----------------------------
  // LOAD USER DATA → SET BACKUP
  // -----------------------------
  useEffect(() => {
    if (!userData) return;

    const formattedDOB = userData.dateOfBirth
      ? toLocalISODate(userData.dateOfBirth)
      : "";

    setName(userData.name || "");
    setEmail(userData.email || "");
    setPhone(userData.phone || "");
    setGender(userData.gender || "");
    setDateOfBirth(formattedDOB);

    // store backup
    setBackup({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      gender: userData.gender || "",
      dateOfBirth: formattedDOB,
    });
  }, [userData]);

  useEffect(() => {
    if (profilePhoto.length === 0) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(profilePhoto[0]);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [profilePhoto]);

  // // FETCH PROFILE PIC
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (userData?.profilePicUrl) {
  //       const url = await fetchProfileImage(userData.profilePicUrl);
  //       setProfilePicUrl(url);
  //     }
  //   };
  //   fetchData();
  // }, [userData]);

  // -----------------------------
  // VALIDATOR
  // -----------------------------
  const validateFields = () => {
    if (name.trim().length < 3) return "Name must be at least 3 characters.";

    if (email && !email.includes("@")) return "Enter a valid email.";

    return null;
  };

  // -----------------------------
  // SUBMIT FORM
  // -----------------------------
  async function handleSubmit() {
    try {
      setUploading(true);

      // validation
      const validationError = validateFields();
      if (validationError) {
        toast.error(validationError);
        handleCancel(); // revert immediately
        return;
      }

      // prepare payload
      const payload: Record<string, any> = {};
      if (name !== backup.name) payload.name = name;
      if (email !== backup.email && email !== "") payload.email = email;
      if (!userData?.gender && gender !== backup.gender)
        payload.gender = gender;
      if (!userData?.dateOfBirth && dateOfBirth !== backup.dateOfBirth)
        payload.dateOfBirth = dateOfBirth;

      if (Object.keys(payload).length === 0) {
        toast("Nothing changed to update.");
        handleCancel();
        return;
      }

      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/users/me`, {
        method: "PATCH",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // ❌ rollback fields
        setName(backup.name);
        setEmail(backup.email);
        setPhone(backup.phone);
        setGender(backup.gender);
        setDateOfBirth(backup.dateOfBirth);

        // meaningful server error
        toast.error(data.message || "Update failed.");
        return;
      }

      // ✔ successful update
      toast.success(data.message || "Profile updated!");

      // refresh backup with latest values
      setBackup({
        name,
        email,
        phone,
        gender,
        dateOfBirth,
      });

      setCanEdit(false);
    } catch (err) {
      // rollback
      setName(backup.name);
      setEmail(backup.email);
      setPhone(backup.phone);
      setGender(backup.gender);
      setDateOfBirth(backup.dateOfBirth);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleProfileUpload() {
    try {
      setUploading(true);

      if (!profilePhoto[0]) {
        toast.error("Please select an image first.");
        return;
      }

      const compressed = await compressImage.mainImage(profilePhoto[0]);

      // Form
      const formData = new FormData();

      if (compressed) formData.append("profile", compressed, `profile.webp`);

      const response = await fetch(
        `${VITE_API_BASE_URL}/api/v1/assets/upload/profile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Profile uploaded successfully");

        // fetch url and set it in User slice
        // update local UI
        const fullUrl = data.url;

        const fileName = fullUrl.split("/").pop();

        setProfilePicUrl(fileName);
        dispatch(setUserProfilePicUrl(fileName));

        // clear temp preview
        setProfilePhoto([]);
        setPreviewUrl(null);
        setOpenPhotoModal(false);
      } else {
        toast.error(data.message || "Profile upload failed, try again");
      }
    } catch (error) {
      toast.error("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  // -----------------------------
  // CANCEL → RESTORE BACKUP
  // -----------------------------
  function handleCancel() {
    setName(backup.name);
    setEmail(backup.email);
    setPhone(backup.phone);
    setGender(backup.gender);
    setDateOfBirth(backup.dateOfBirth);
    setPreviewUrl(null);
    setProfilePhoto([]);

    setCanEdit(false);
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white px-4">
      {/* Centered Content Wrapper */}
      <div className="w-full max-w-3xl mx-auto flex flex-col pt-6 pb-20">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton navigateTo="/profile" />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl poppins-bold mb-6">Account</h1>
        {/* PROFILE + INFO CARD */}
        <div className="w-full flex flex-col items-center mt-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3 ">
            <div
              className="relative group w-28 h-28 cursor-pointer"
              onClick={() => setOpenPhotoModal(true)}
            >
              {loadingProfilePic ? (
                <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse border-4 border-white shadow-md shimmer" />
              ) : (
                <img
                  src={previewUrl || profilePicUrl}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
              )}

              {canEdit && (
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4"></div>
              )}
            </div>

            <h2 className="text-2xl inter-semibold mt-1">{name || "User"}</h2>
          </div>

          {/* MAIN ACCOUNT CARD */}
          <div
            className="
            w-full max-w-2xl mt-6
            bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.07)]
            border border-gray-100
            p-6 sm:p-8
            flex flex-col gap-6"
          >
            {/* FIELD COMPONENT */}
            {[
              { label: "Name", value: name, setter: setName, type: "text" },
              { label: "Email", value: email, setter: setEmail, type: "email" },
              {
                label: "Phone",
                value: phone,
                setter: setPhone,
                type: "tel",
                disabled: true,
              },
              {
                label: "Gender",
                value: gender,
                setter: setGender,
                type: "select",
              },
              {
                label: "Date of Birth",
                value: dateOfBirth,
                setter: setDateOfBirth,
                type: "date",
              },
            ].map((field, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <label className="text-gray-600 inter-medium">
                  {field.label}:
                </label>

                {/* VIEW MODE */}
                {!canEdit ? (
                  <p className="text-lg inter-regular ">
                    {field.value || "Not set"}
                  </p>
                ) : (
                  <>
                    {/* INPUT MODE */}
                    {field.type === "select" ? (
                      <select
                        className="border p-2 rounded-xl inter-regular"
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        className="border p-2 rounded-xl inter-regular"
                        value={field.value}
                        disabled={field.disabled}
                        onChange={(e) => field.setter(e.target.value)}
                      />
                    )}

                    {field.label === "Gender" || field.label === "Date of Birth"
                      ? canEdit && (
                          <span className="text-sm text-red-700">
                            ** Can only be set once **
                          </span>
                        )
                      : null}
                  </>
                )}
              </div>
            ))}

            {/* KYC */}
            {!canEdit && userData?.kyc !== null && (
              <div className="mt-2">
                <p className="text-gray-600 inter-medium">KYC:</p>
                <p className="text-lg inter-regular capitalize">
                  {userData?.kyc?.status}
                </p>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="w-full max-w-2xl flex justify-center gap-4 mt-10">
            {canEdit && (
              <button
                className="w-2/5 h-12 bg-[#5b5b5b] text-white rounded-3xl text-xl cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

            <button
              className={`
        w-2/5 h-12 bg-[#0385C2] text-white rounded-3xl text-xl cursor-pointer
        ${uploading ? "opacity-60" : ""}
      `}
              disabled={uploading}
              onClick={(e) => {
                e.preventDefault();
                if (canEdit) handleSubmit();
                setCanEdit((prev) => !prev);
              }}
            >
              {canEdit ? "Submit" : "Edit"}
            </button>
          </div>
        </div>
      </div>
      {openPhotoModal && (
        <UploadProfileImage
          handleProfileUpload={handleProfileUpload}
          previewUrl={previewUrl}
          profilePhoto={profilePhoto}
          profilePicUrl={profilePicUrl}
          setOpenPhotoModal={setOpenPhotoModal}
          setPreviewUrl={setPreviewUrl}
          setProfilePhoto={setProfilePhoto}
          uploading={uploading}
        />
      )}
    </div>
  );
};

export default Account;
