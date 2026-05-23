import api from "@/lib/axios";

const BASE_URL = "/recurring-bills";

export const createRecurringBill = async (billData) => {
  try {
    const response = await api.post(`${BASE_URL}/create`, billData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating recurring bill:", error);
    throw error;
  }
};

export const getRecurringBills = async (params) => {
  try {
    const response = await api.get(`${BASE_URL}/all`, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recurring bills:", error);
    throw error;
  }
};

export const editBill = async ({ id, data }) => {
  try {
    const response = await api.put(`${BASE_URL}/edit/${id}`, data, {
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

export const deleteBill = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred during pot deletion."
    );
  }
};
