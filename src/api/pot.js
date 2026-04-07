import api from "@/lib/axios";

const BASE_URL = "/pots";

export const getAllPots = async () => {
  try {
    const response = await api.get(`${BASE_URL}/all`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pots:", error);
    throw error;
  }
};

export const createPot = async (potData) => {
  try {
    const response = await api.post(`${BASE_URL}/create`, potData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred during pot creation."
    );
  }
};

export const editPot = async ({ potId, potData }) => {
  console.log("Editing pot with ID:", potId, "and data:", potData);
  try {
    const response = await api.put(`${BASE_URL}/edit/${potId}`, potData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred during pot update."
    );
  }
};

export const deletePot = async (potId) => {
  try {
    const response = await api.delete(`${BASE_URL}/${potId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred during pot deletion."
    );
  }
};

export const addMoneyToPot = async ({ potId, amount }) => {
  try {
    const response = await api.put(
      `${BASE_URL}/${potId}/add-money`,
      { amount },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred while adding money to the pot."
    );
  }
};

export const withdrawMoneyFromPot = async ({ potId, amount }) => {
  try {
    const response = await api.put(
      `${BASE_URL}/${potId}/withdraw-money`,
      { amount },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred while withdrawing money from the pot."
    );
  }
};
