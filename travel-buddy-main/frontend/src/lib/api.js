import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (email) => api.post(`/auth/resend-otp?email=${email}`),
  getMe: () => api.get('/auth/me'),
};

// Buddy APIs
export const buddyAPI = {
  search: (params) => api.get('/buddies', { params }),
  getById: (id) => api.get(`/buddies/${id}`),
  getMyProfile: () => api.get('/buddy/profile'),
  updateProfile: (data) => api.put('/buddy/profile', data),
  updateAvailability: (data) => api.put('/buddy/availability', data),
  uploadDocument: (formData) => api.post('/buddy/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyDocuments: () => api.get('/buddy/documents'),
};

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings'),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

// Review APIs
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByBuddy: (buddyId) => api.get(`/reviews/buddy/${buddyId}`),
};

// Admin APIs
export const adminAPI = {
  getPendingBuddies: () => api.get('/admin/pending-buddies'),
  getBuddyDocuments: (buddyId) => api.get(`/admin/buddy/${buddyId}/documents`),
  verifyBuddy: (buddyId, status) => api.put(`/admin/buddy/${buddyId}/verify?status=${status}`),
  getAllBookings: () => api.get('/admin/bookings'),
  toggleReviewVisibility: (reviewId, isVisible) => api.put(`/admin/review/${reviewId}/visibility?is_visible=${isVisible}`),
  getStats: () => api.get('/admin/stats'),
};

// Flight APIs
export const flightAPI = {
  search: (params) => api.get('/flights', { params }),
  create: (data) => api.post('/flights', data),
};

export default api;
