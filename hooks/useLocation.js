import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function useLocation() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        if (location) setCurrentPosition(location.coords);
      } else {
        setLocationError("Permission de localisation refusée");
      }
    })();
  }, []);

  return { currentPosition, locationError };
}
