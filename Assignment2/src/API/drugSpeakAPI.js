// import axios from 'axios';

// // Configure base URL (replace with your actual backend URL)
// const BASE_URL = 'http://localhost:3000';

// // Helper function for error handling
// const handleRequest = async (request) => {
//   try {
//     const response = await request;
//     return response.data;
//   } catch (error) {
//     console.error('API Error:', error.response?.data || error.message);
//     throw error.response?.data || { message: 'Request failed' };
//   }
// };

// // Authentication
// export const signUp = async (userData) => {
//   return handleRequest(
//     axios.post(`${BASE_URL}/auth/signup`, userData)
//   );
// };

// export const signIn = async (email, password) => {
//   return handleRequest(
//     axios.post(`${BASE_URL}/auth/login`, { email, password })
//   );
// };

// export const updateUserProfile = async (userId, updates) => {
//   return handleRequest(
//     axios.patch(`${BASE_URL}/users/${userId}`, updates)
//   );
// };

// // Drugs and Learning Lists
// export const fetchDrugCategories = async () => {
//   return handleRequest(
//     axios.get(`${BASE_URL}/drugs/categories`)
//   );
// };

// export const fetchDrugsByCategory = async (categoryId) => {
//   return handleRequest(
//     axios.get(`${BASE_URL}/drugs?category=${categoryId}`)
//   );
// };

// export const addToLearningList = async (userId, drugId) => {
//   return handleRequest(
//     axios.post(`${BASE_URL}/learning/add`, { userId, drugId })
//   );
// };

// export const moveToFinished = async (userId, drugId) => {
//   return handleRequest(
//     axios.post(`${BASE_URL}/learning/finish`, { userId, drugId })
//   );
// };

// // Community Rankings
// export const getRankings = async () => {
//   return handleRequest(
//     axios.get(`${BASE_URL}/community/rankings`)
//   );
// };

// // Audio and Evaluation (Simulated)
// export const submitRecording = async (userId, drugId, audioUri) => {
//   // Simulate API delay for evaluation
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         score: Math.floor(Math.random() * 101), // Random score 0-100
//         timestamp: new Date().toISOString(),
//       });
//     }, 1500);
//   });
// };

import axios from 'axios';
import { store } from '../redux/store';


// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

/**
 * Wrapper for API requests with standardized error handling
 */
const request = async (method, endpoint, data = null, customHeaders = {}) => {
  try {
    const response = await api({
      method,
      url: endpoint,
      data,
      headers: {...customHeaders}
    });
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || {
      message: error.message || 'Network error occurred',
      status: 500,
    };
    
    console.error(`API Error [${method} ${endpoint}]:`, errorData);
    throw {
      message: errorData.message || 'Request failed',
      status: error.response?.status || 500,
      data: errorData.errors,
    };
  }
};

// ================= Authentication =================
export const authAPI = {
  signUp: (userData) => request('POST', '/auth/register', {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    gender: userData.gender || 'unspecified'
  }),
  
  signIn: (credentials) => request('POST', '/auth/login', {
    email: credentials.email,
    password: credentials.password
  }),
  
  updateUserProfile: (userId, updates) => request('PATCH', `/users/${userId}`, updates),
  
  verifyToken: () => request('GET', '/auth/verify')
};

// ================= Drug Resources =================
export const drugAPI = {
  getCategories: () => request('GET', '/drugs/categories'),
  getDrugsByCategory: (categoryId) => request('GET', `/drugs/category/${categoryId}`),
  getDrugDetails: (drugId) => request('GET', `/drugs/${drugId}`),
  searchDrugs: (query) => request('GET', `/drugs/search?q=${query}`)
};

// ================= Learning System =================
export const learningAPI = {
  addToLearningList: (drugId) => request('POST', '/learning', { drugId }),
  getLearningLists: () => request('GET', '/learning'),
  markAsLearned: (learningId) => request('PATCH', `/learning/${learningId}/complete`),
  removeFromList: (learningId) => request('DELETE', `/learning/${learningId}`),
  getProgress: () => request('GET', '/learning/progress')
};

// ================= Community & Rankings =================
export const communityAPI = {
  getLeaderboard: () => request('GET', '/community/leaderboard'),
  getUserRank: (userId) => request('GET', `/community/rank/${userId}`),
  getRecentActivity: () => request('GET', '/community/activity')
};

// ================= Audio & Evaluation =================
export const evaluationAPI = {
  submitRecording: async (drugId, audioUri) => {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/m4a', // Adjust based on your recording format
      name: `recording_${Date.now()}.m4a`
    });
    formData.append('drugId', drugId);

    return request('POST', '/evaluation', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  
  getPronunciationTips: (drugId) => request('GET', `/evaluation/tips/${drugId}`),
  getEvaluationHistory: () => request('GET', '/evaluation/history')
};

// ================= User Management =================
export const userAPI = {
  getUserProfile: (userId) => request('GET', `/users/${userId}`),
  updateAvatar: (userId, imageUri) => {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `avatar_${userId}.jpg`
    });
    
    return request('PATCH', `/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  }
};