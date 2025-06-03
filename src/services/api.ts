import axios from 'axios';
import { Item, Transaction } from '../types/types';

const API_URL = 'http://localhost:8080/api';

export const fetchItems = async (): Promise<Item[]> => {
  const response = await axios.get(`${API_URL}/items`);
  return response.data;
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const response = await axios.post(`${API_URL}/transactions`, transaction);
  return response.data;
};

// Add more API calls as needed