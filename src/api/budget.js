import api from "@/lib/axios";

const BASE_URL = "/budgets";

export const getAllBudgets = async () => {
  try {
    const response = await api.get(`${BASE_URL}/all`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }
};

export const getBudgetById = async (budgetId) => {
  try {
    const response = await api.get(`${BASE_URL}/${budgetId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching budget with ID ${budgetId}:`, error);
    throw error;
  }
};

export const editBudget = async (budgetId, budgetData) => {
  try {
    const response = await api.put(`${BASE_URL}/edit/${budgetId}`, budgetData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error editing budget with ID ${budgetId}:`, error);
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred during budget update."
    );
  }
};

export const deleteBudget = async (budgetId) => {
  try {
    const response = await api.delete(`${BASE_URL}/${budgetId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting budget with ID ${budgetId}:`, error);
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred during budget update."
    );
  }
};

export const getBudgetSummary = async () => {
  try {
    const response = await api.get(`${BASE_URL}/summary`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching budget summary:", error);
    throw error;
  }
};

export const getBudgetThemes = async () => {
  try {
    const response = await api.get(`${BASE_URL}/themes`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching budget themes:", error);
    throw error;
  }
};

export const getBudgetCategories = async () => {
  try {
    const response = await api.get(`${BASE_URL}/categories`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching budget categories:", error);
    throw error;
  }
};

export const createBudget = async (budgetData) => {
  try {
    const response = await api.post(`${BASE_URL}/create`, budgetData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred during budget creation."
    );
  }
};
