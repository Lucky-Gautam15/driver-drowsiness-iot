import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("drowsinessUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    if (!email || !password) {
      return {
        success: false,
        message: "Please enter your Driver ID / Email and Password",
      };
    }

    setLoading(true);
    try {
      const response = await authService.login(email.trim(), password);
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("drowsinessUser", JSON.stringify(response.data.user));
        setUser(response.data.user);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: "Unexpected server response" };
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to login. Please check connection.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (driverData) => {
    setLoading(true);
    try {
      const response = await authService.register(driverData);
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("drowsinessUser", JSON.stringify(response.data.user));
        setUser(response.data.user);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: "Registration failed" };
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Registration failed. Please check details.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("drowsinessUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}