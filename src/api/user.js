import api from "@/lib/axios";

const BASE_URL = "/users";

export const getPreferences = async () => {
  try {
    const response = await api.get(`${BASE_URL}/preferences`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    throw error;
  }
};

export const updatePreferences = async (preferencesData) => {
  try {
    const response = await api.put(`${BASE_URL}/preferences`, preferencesData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
};
