import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // URL base do backend Django

// Função para buscar produtos
export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/products/?search=${query}`);
    return response.data; // Retorna a lista de produtos
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.response?.data || error.message);
    throw error;
  }
};

// Função para login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
    });
    return response.data; // Retorna os dados do usuário
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// Função para obter vendas totais por dia
export const getTotalSalesPerDay = async () => {
  try {
    const response = await axios.get(`${API_URL}/sales/total_per_day/`);
    return response.data; // Retorna as vendas totais por dia
  } catch (error) {
    console.error("Erro ao buscar vendas totais:", error.response?.data || error.message);
    throw error;
  }
};

// Função para criar uma venda
export const createSale = async (saleData) => {
  try {
    const response = await axios.post(`${API_URL}/sales/`, saleData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar venda:", error.response?.data || error.message);
    throw error;
  }
};

// Função para processar pagamento
export const processPayment = async (saleId, paymentMethod, amount) => {
  try {
    const response = await axios.post(`${API_URL}/sales/${saleId}/payments/`, {
      payment_method: paymentMethod,
      amount,
    });
    return response.data; // Retorna os dados do pagamento processado
  } catch (error) {
    console.error("Erro ao processar pagamento:", error.response?.data || error.message);
    throw error;
  }
};