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
