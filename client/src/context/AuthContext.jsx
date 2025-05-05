import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
} from '../redux/slices/authSlice';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Register user
  const register = async (userData) => {
    try {
      dispatch(registerStart());
      const data = await authService.register(userData);
      dispatch(registerSuccess(data.user));
      navigate('/');
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Registration failed';
      dispatch(registerFailure(message));
      throw new Error(message);
    }
  };

  // Login user
  const loginUser = async (userData) => {
    try {
      dispatch(loginStart());
      const data = await authService.login(userData);
      dispatch(loginSuccess(data.user));
      navigate('/');
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Login failed';
      dispatch(loginFailure(message));
      throw new Error(message);
    }
  };

  // Logout user
  const logoutUser = () => {
    authService.logout();
    dispatch(logout());
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login: loginUser,
    logout: logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
