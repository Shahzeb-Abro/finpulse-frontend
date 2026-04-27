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

export const forgotPassword = async (data) => {
  try {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred while requesting password reset."
    );
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred while resetting the password."
    );
  }
};

export const getMe = async () => {
  try {
    const response = await api.get("/auth/me", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred while fetching user data."
    );
  }
};

export const resendVerificationEmail = async () => {
  try {
    const response = await api.post("/auth/resend-verification", null, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "An error occurred while resending verification email."
    );
  }
};
