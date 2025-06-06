import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure, logout, registerStart, registerSuccess, registerFailure } from "../redux/slices/authSlice";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   // Normalize user data to ensure consistent ID format
   const normalizeUser = (userData) => {
      if (!userData) return null;
      return {
         ...userData,
         _id: userData._id || userData.id, // Ensure we always have _id
         id: userData._id || userData.id, // Ensure we always have id
      };
   };

   // Register user
   const register = async (userData) => {
      try {
         dispatch(registerStart());
         const data = await authService.register(userData);
         const normalizedUser = normalizeUser(data.user);
         dispatch(registerSuccess(normalizedUser));
         navigate("/");
         return { ...data, user: normalizedUser };
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Registration failed";
         dispatch(registerFailure(message));
         throw new Error(message);
      }
   };

   // Login user
   const loginUser = async (userData) => {
      try {
         dispatch(loginStart());
         const data = await authService.login(userData);
         const normalizedUser = normalizeUser(data.user);
         dispatch(loginSuccess(normalizedUser));
         navigate("/");
         return { ...data, user: normalizedUser };
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Login failed";
         dispatch(loginFailure(message));
         throw new Error(message);
      }
   };

   // Complete login after OTP verification
   const completeLogin = async (data) => {
      try {
         if (!data || !data.user || !data.token) {
            throw new Error("Invalid login data received");
         }

         const normalizedUser = normalizeUser(data.user);

         // Save to localStorage first
         localStorage.setItem("user", JSON.stringify(normalizedUser));
         localStorage.setItem("token", data.token);

         // Then update Redux state
         dispatch(loginSuccess(normalizedUser));

         return { ...data, user: normalizedUser };
      } catch (error) {
         const message = error.response?.data?.error || error.message || "Login failed";
         dispatch(loginFailure(message));
         throw new Error(message);
      }
   };

   // Logout user
   const logoutUser = () => {
      authService.logout();
      dispatch(logout());
      navigate("/login");
   };

   const value = {
      user: normalizeUser(user), // Ensure we always return normalized user data
      isAuthenticated,
      isLoading,
      error,
      register,
      login: loginUser,
      completeLogin,
      logout: logoutUser,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
   return useContext(AuthContext);
};
