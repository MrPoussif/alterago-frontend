import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

export default function useCategories() {
  const [filters, setFilters] = useState([]);
  const [filtersError, setFiltersError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_MY_HTTP}/events/categories`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        setFilters(data);
      } catch (err) {
        console.error("Erreur useCategories :", err);
        setFiltersError("Impossible de récupérer les catégories");
      }
    })();
  }, []);

  return { filters, filtersError };
}
