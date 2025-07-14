import { useMutation, useQuery } from '@tanstack/react-query';
import API from './axios';
import { API_ENDPOINTS } from './api';
import { setToken, removeToken } from '../auth/useToken';


// ================== 🔐 AUTH ==================

// Login
export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (credentials) => {
      const res = await API.post(API_ENDPOINTS.LOGIN, credentials);
      setToken(res.data.access, res.data.role); // Save token & role
      return res.data;
    },
  });

// Logout
export const useLogoutMutation = () =>
  useMutation({
    mutationFn: async () => {
      await API.post(API_ENDPOINTS.LOGOUT);
      removeToken(); // Clear token
    },
  });

// Student Signup
export const useStudentSignupMutation = () =>
  useMutation({
    mutationFn: async (studentData) => {
      const res = await API.post(API_ENDPOINTS.STUDENT_SIGNUP, studentData);
      return res.data;
    },
  });


// ================== 👑 ADMIN ==================

// Create User
export const useAdminCreateUser = () =>
  useMutation({
    mutationFn: async (userData) => {
      const res = await API.post(API_ENDPOINTS.ADMIN_CREATE_USER, userData);
      return res.data;
    },
  });

// Upload Face
export const useAdminRecordFace = () =>
  useMutation({
    mutationFn: async (formData) => {
      const res = await API.post(API_ENDPOINTS.ADMIN_RECORD_FACE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
  });

// Upload Video
export const useAdminVideoUpload = () =>
  useMutation({
    mutationFn: async (formData) => {
      const res = await API.post(API_ENDPOINTS.ADMIN_UPLOAD_VIDEO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
  });

// Get Users
export const useAdminUsers = () =>
  useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await API.get(API_ENDPOINTS.ADMIN_USERS);
      return res.data;
    },
  });

// Get Detections
export const useAdminDetections = () =>
  useQuery({
    queryKey: ['admin-detections'],
    queryFn: async () => {
      const res = await API.get(API_ENDPOINTS.ADMIN_DETECTIONS);
      return res.data;
    },
  });


  // Get User Profile
export const useUserProfile = () =>
  useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await API.get(API_ENDPOINTS.USER_PROFILE);
      return res.data;
    },
  });

// Get Public Face Files (for image gallery or preview)
export const usePublicFaces = () =>
  useQuery({
    queryKey: ['public-faces'],
    queryFn: async () => {
      const res = await API.get(API_ENDPOINTS.PUBLIC_FACES);
      return res.data;
    },
  });

// Admin: Get single user by ID
export const useAdminUserDetail = (userId) =>
  useQuery({
    queryKey: ['admin-user-detail', userId],
    queryFn: async () => {
      const res = await API.get(API_ENDPOINTS.ADMIN_USER_DETAIL(userId));
      return res.data;
    },
    enabled: !!userId,
  });


// ================== 🙋 GENERAL USER ==================

// Upload Video
export const useGeneralVideoUpload = () =>
  useMutation({
    mutationFn: async (formData) => {
      const res = await API.post(API_ENDPOINTS.GENERAL_UPLOAD_VIDEO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
  });

// Get Detections
export const useGeneralDetections = () =>
  useQuery({
    queryKey: ['general-detections'],
    queryFn: async () => {
      const res = await API.get(API_ENDPOINTS.GENERAL_GET_DETECTIONS);
      return res.data;
    },
  });


// ================== 🎓 STUDENT ==================

// Upload / Update Face
export const useUploadFace = () =>
  useMutation({
    mutationFn: async (formData) => {
      const res = await API.post(API_ENDPOINTS.STUDENT_UPLOAD_FACE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
  });

// Get Detections
export const useStudentDetections = () =>
  useQuery({
    queryKey: ['student-detections'],
    queryFn: async () => {
      const res = await API.get(API_ENDPOINTS.STUDENT_GET_DETECTIONS);
      return res.data;
    },
  });
