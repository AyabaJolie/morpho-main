import axios from 'axios';
import { ErrorResponse, AnalysisResult, Measurements } from '../types';

const API_URL = 'http://localhost:3001';

export const register = async (email: string, password: string) => {
  try {
    await axios.post(`${API_URL}/register`, { email, password });
    return { success: true };
  } catch (err) {
    const error = err as axios.AxiosError<ErrorResponse>;
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post<{ token: string }>(`${API_URL}/login`, { email, password });
    return res.data;
  } catch (err) {
    const error = err as axios.AxiosError<ErrorResponse>;
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const analyzeMeasurements = async (measurements: Measurements) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post<AnalysisResult>(
      `${API_URL}/analyze`,
      measurements,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    const error = err as axios.AxiosError<ErrorResponse>;
    throw new Error(error.response?.data?.error || 'Analysis failed');
  }
}; 