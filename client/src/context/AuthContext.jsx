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

   // Register user
   const register = async (userData) => {
      try {
         dispatch(registerStart());
         const data = await authService.register(userData);
         dispatch(registerSuccess(data.user));
         navigate("/");
         return data;
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Registration failed";
         dispatch(registerFailure(message));
         throw new Error(message);
      }
   };

   // Login user
   const loginUser = async (userData) => {
      try {
         console.log("userData", userData);
         dispatch(loginStart());
         const data = await authService.login(userData);
         dispatch(loginSuccess(data.user));
         navigate("/");
         return data;
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Login failed";
         dispatch(loginFailure(message));
         throw new Error(message);
      }
   };

   // Complete login after OTP verification
   const completeLogin = async (data) => {
      try {
         console.log("Completing login with data:", data);

         if (!data || !data.user || !data.token) {
            console.error("Invalid login data received:", data);
            throw new Error("Invalid login data received");
         }

         // Save to localStorage first
         localStorage.setItem("user", JSON.stringify(data.user));
         localStorage.setItem("token", data.token);

         // Then update Redux state
         dispatch(loginSuccess(data.user));

         console.log("Login completed successfully");
         return data;
      } catch (error) {
         console.error("Error completing login:", error);
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
      user,
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
