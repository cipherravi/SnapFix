// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";
// const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// import type { User } from "../../../types";

// interface UserInfoContextType {
//   fetchProfile: () => Promise<void>;
//   userData: User | null;
//   isLoading: boolean;
// }

// const UserInfoContext = createContext<UserInfoContextType | undefined>(
//   undefined
// );

// interface UserInfoProviderProps {
//   children: ReactNode;
// }

// const UserInfoProvider = ({ children }: UserInfoProviderProps) => {
//   const [userData, setUserData] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchProfile = async () => {
//     try {
//       const res = await fetch(`${VITE_API_BASE_URL}/api/v1/users/me`, {
//         method: "GET",
//         credentials: "include", // Send cookies
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) {
//         throw new Error(`Unexpected error: ${res.status}`);
//       }

//       const data = await res.json();
//       setUserData(data?.data);
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);
//   return (
//     <UserInfoContext.Provider
//       value={{
//         fetchProfile,
//         userData,
//         isLoading,
//       }}
//     >
//       {children}
//     </UserInfoContext.Provider>
//   );
// };

// export default UserInfoProvider;

// export const useUserInfo = () => {
//   const context = useContext(UserInfoContext);
//   if (!context) {
//     throw new Error("useUserInfo must be used within a UserInfoProvider");
//   }
//   return context;
// };

// // const [userCoords, setUserCoords] = useState<[number, number] | null>(null)

// // useEffect(() => {
// //   if (navigator.geolocation) {
// //     navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         setUserCoords([position.coords.latitude, position.coords.longitude]);
// //       },
// //       (error) => {
// //         console.error("Failed to fetch coordinates", error);
// //       },
// //       {
// //         enableHighAccuracy: true,
// //         timeout: 10000,
// //         maximumAge: 0,
// //       }
// //     );
// //   }
// // }, []);
