import api from "@/lib/axios";

const BASE_URL = "/lookups";

export const findAllLookupsByTypeAndValue = async (type, value) => {
  try {
    const response = await api.get(`${BASE_URL}/find-all-by-type-and-value`, {
      params: { lookupType: type, lookupValue: value },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching lookups:", error);
    throw error;
  }
};

export const findAllLookupsByType = async (type) => {
  try {
    const response = await api.get(`${BASE_URL}/find-all-by-type`, {
      params: { lookupType: type },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching lookups:", error);
    throw error;
  }
};
