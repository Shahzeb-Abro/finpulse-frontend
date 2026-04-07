import api from "@/lib/axios";

export const register = async (data) => {
  try {
    const response = await api.post("/auth/register", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred during registration."
    );
  }
};

export const login = async (data) => {
  try {
    const response = await api.post("/auth/login", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || error.message || "An error occurred during login."
    );
  }
};
