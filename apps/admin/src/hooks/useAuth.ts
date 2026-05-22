import axios from "axios";
import { backendUrl } from "../config/exports";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${backendUrl}/auth/verify`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setToken(true);
        }
      } catch (error) {
        setToken(false);
      }
    };

    verifyToken();
  }, []);

  return { token };
};
