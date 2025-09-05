import { useEffect, useState } from "react";
import BackButton from "../../components/Buttons/BackButton";
import { useUserInfo } from "../../utils/context/UserInfoContext";
import useImageFetcher from "../../utils/Hooks/useImageFetcher";
import toLocalISODate from "../../utils/toLocalISODate";
import toast from "react-hot-toast";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Account = () => {
  const { userData, fetchProfile } = useUserInfo();
  const { fetchPublicImage } = useImageFetcher();

  const [canEdit, setCanEdit] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("/svg/profile.svg");
  const [uploading, setUploading] = useState(false);

  // Editable fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setGender(userData.gender || "");

      userData?.dateOfBirth !== null &&
        setDateOfBirth(toLocalISODate(userData.dateOfBirth) || "");
    }
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      if (userData?.profilePicUrl) {
        const url = await fetchPublicImage(userData?.profilePicUrl);

        setProfilePicUrl(url);
      }
    };
    fetchData();
  }, [userData]);

  async function handleSubmit() {
    try {
      setUploading(false);

      if (name.trim().length < 8) {
        toast.error("Valid Name is required");
        handleCancel();
        return;
      }
      const payload: Record<string, any> = {};

      // Only include fields if they differ from original data
      if (name !== userData?.name) payload.name = name;
      if (email !== userData?.email && email !== "") payload.email = email;

      // if (phone !== userData?.phone) payload.phone = phone;

      // Only send gender if not already set
      if (!userData?.gender && gender) payload.gender = gender;

      // Only send DOB if not already set
      if (!userData?.dateOfBirth && dateOfBirth)
        payload.dateOfBirth = dateOfBirth;

      if (Object.keys(payload).length === 0) {
        toast("Nothing changed to update.");
        handleCancel();
        return;
      }

      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/users/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Profile Updated successfully!");
        fetchProfile();
      } else {
        toast.error(data.message || "Profile update failed.");
        handleCancel();
      }
    } catch (err) {
      toast.error("An error occurred during upload.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  function handleCancel() {
    if (userData) {
      setName(userData?.name || "");
      setEmail(userData?.email || "");
      setPhone(userData?.phone || "");
      setGender(userData?.gender || "");

      userData?.dateOfBirth !== null &&
        setDateOfBirth(toLocalISODate(userData.dateOfBirth) || "");
    }
    setCanEdit(false);
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="shrink-0 pt-4 px-4 flex flex-col gap-4 ">
        <BackButton navigateTo="/profile" />
        <h1 className="text-3xl poppins-bold">Account</h1>

        {/* Dynamic */}
        <div className="shrink w-full py-10  flex flex-col justify-start items-center gap-6">
          <img
            src={profilePicUrl}
            alt="User Profile Pic"
            className="w-28 h-28 object-cover rounded-full bg-gray-200"
          />

          <div className="flex flex-col items-start gap-2">
            <div
              className={`text-lg w-full max-w-md ${!canEdit && "text-center"}`}
            >
              {canEdit ? (
                <>
                  <strong>Name: </strong>

                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="email"
                  />
                </>
              ) : (
                <span className="text-2xl inter-semibold">
                  {name || "not set"}
                </span>
              )}
            </div>
            {/* Email */}
            <div className="text-lg w-full max-w-md">
              <strong>Email: </strong>
              {canEdit ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              ) : (
                <span>{email || "not set"}</span>
              )}
            </div>
            {/* Phone */}
            <div className="text-lg w-full max-w-md">
              <strong>Phone: </strong>
              {canEdit ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={true}
                  type="tel"
                />
              ) : (
                <span>{phone || "not set"}</span>
              )}
            </div>
            {/* Gender */}
            <div className="text-lg w-full max-w-md">
              <strong>Gender: </strong>
              {canEdit ? (
                <select
                  className="border px-2 py-1 rounded w-full"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              ) : (
                <span className="capitalize">{gender || "not set"}</span>
              )}
            </div>
            {/* DOB */}
            <div className="text-lg w-full max-w-md">
              <strong>DOB: </strong>
              {canEdit ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  type="date"
                />
              ) : (
                <span>{dateOfBirth ? dateOfBirth : "not set"}</span>
              )}
              {canEdit && (
                <span className="inter-regular text-sm text-red-800 ">
                  ** DOB and Gender can only be set once **
                </span>
              )}
            </div>
            {!canEdit && (
              <p className="text-lg">
                <strong>City: </strong>
                {userData?.city?.name} {userData?.city?.state}
              </p>
            )}

            {!canEdit && userData?.Kyc !== null && (
              <p className="text-lg">
                <strong>KYC: </strong>
                {userData?.Kyc?.status}
              </p>
            )}
          </div>
          <div className="w-full flex justify-around absolute bottom-20">
            {canEdit && (
              <button
                className="w-2/5 h-12 bg-[#5b5b5b] text-white rounded-3xl text-2xl inter-medium"
                onClick={() => handleCancel()}
              >
                Cancel
              </button>
            )}

            <button
              className={`w-2/5 h-12 bg-[#0385C2] text-white rounded-3xl text-2xl inter-medium ${
                uploading ?? "bg-gray-400"
              }`}
              disabled={uploading}
              onClick={(e) => {
                e.preventDefault();
                if (canEdit) {
                  handleSubmit();

                  setCanEdit(false);
                } else {
                  setCanEdit(true);
                }
              }}
            >
              {canEdit ? "Submit" : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
