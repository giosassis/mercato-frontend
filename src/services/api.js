import axios from "axios";

const API_URL = "http://localhost:8000"; 

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
    });
    console.log(response)
    return response.data; 
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const getTotalSalesPerDay = async () => {
    try {
      const response = await axios.get(`${API_URL}/sales/total_per_day/`);
      return response.data;
    } catch (error) {
      console.error("There was an error while trying to get total sales:", error.response?.data || error.message);
      throw error;
    }
  };