import { useState, useEffect } from "react";

type UserLocation = {
  coords: [number, number] | null;
  loading: boolean;
  error: string | null;
};

const useFetchUserLocation = (): UserLocation => {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords([position.coords.latitude, position.coords.longitude]);
        setLoading(false);
      },
      (err) => {
        let message = "";
        switch (err.code) {
          case 1:
            message = "Permission denied. Please enable location access.";
            break;
          case 2:
            message = "Position unavailable. Could not fetch location.";
            break;
          case 3:
            message = "Location request timed out.";
            break;
          default:
            message = "An unknown error occurred.";
        }
        setError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { coords, loading, error };
};

export default useFetchUserLocation;

// async (err) => {
//         console.warn("Geolocation error:", err);

//         // Fallback: use IP API
//         try {
//           const res = await fetch("https://ipapi.co/json/");
//           const data = await res.json();
//           if (data && data.latitude && data.longitude) {
//             setCoords([data.latitude, data.longitude]);
//             setError("Used IP-based location fallback");
//           } else {
//             setError("Could not determine location");
//           }
//         } catch (apiErr) {
//           setError("Geolocation & fallback both failed");
//         } finally {
//           setLoading(false);
//         }
//       },
