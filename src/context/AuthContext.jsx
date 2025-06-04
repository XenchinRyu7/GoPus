import React, { createContext, useContext, useState } from "react";
import * as authApi from "@/api/auth";
import { setToken, getToken, clearAuth, setUserData, getUserData } from "@/utils/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUserData());
  const [token, setTokenState] = useState(getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  

  const handleLogin = async (email, password) => {
    const data = await authApi.login(email, password);
    if (data.token) {
      setToken(data.token);
      setTokenState(data.token);
      setUserData(data.data);
      setUser(data.data);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const handleRegister = async (email, fullname, phone, password) => {
    return await authApi.register(email, fullname, phone, password);
  };

  const handleLogout = () => {
    clearAuth();
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user, token, isAuthenticated, login: handleLogin, register: handleRegister, logout: handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
