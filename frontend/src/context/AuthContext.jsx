import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("drowsinessUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    if (!email || !password) {
      return {
        success: false,
        message: "Please enter email and password",
      };
    }

    const userData = {
      name: "Admin User",
      email,
      role: "Fleet Administrator",
    };

    localStorage.setItem("drowsinessUser", JSON.stringify(userData));
    setUser(userData);

    return {
      success: true,
    };
  };

  const logout = () => {
    localStorage.removeItem("drowsinessUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}