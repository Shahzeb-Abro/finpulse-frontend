import api from "@/lib/axios";

const BASE_URL = "/transactions";

export const getTransactionCategories = async () => {
  try {
    const response = await api.get(`${BASE_URL}/get-transaction-categories`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction categories:", error);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post(`${BASE_URL}/create`, transactionData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

export const getTransactions = async (params) => {
  try {
    const response = await api.get(`${BASE_URL}/all`, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const editTransaction = async (data) => {
  try {
    const response = await api.put(`${BASE_URL}/${data.id}`, data?.data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error editing transaction:", error);
    throw error;
  }
};

export const deleteTransaction = async (transactionId) => {
  try {
    const response = await api.delete(`${BASE_URL}/${transactionId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};
