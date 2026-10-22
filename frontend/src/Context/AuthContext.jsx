import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // --- User State (Lazy Initialization) ---
  const [user, setUser] = useState(() => {
    const userToken = localStorage.getItem("userToken");
    const userExpiry = localStorage.getItem("userTokenExpiry");
    const currentUser = localStorage.getItem("currentUser");
    if (userToken && userExpiry && Date.now() < Number(userExpiry)) {
      return currentUser ? JSON.parse(currentUser) : null;
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const userToken = localStorage.getItem("userToken");
    const userExpiry = localStorage.getItem("userTokenExpiry");
    return Boolean(userToken && userExpiry && Date.now() < Number(userExpiry));
  });

  // --- Admin State (Lazy Initialization) ---
  const [admin, setAdmin] = useState(() => {
    const adminToken = localStorage.getItem("adminToken");
    const adminExpiry = localStorage.getItem("adminTokenExpiry");
    const currentAdmin = localStorage.getItem("currentAdmin");
    if (adminToken && adminExpiry && Date.now() < Number(adminExpiry)) {
      return currentAdmin ? JSON.parse(currentAdmin) : null;
    }
    return null;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const adminToken = localStorage.getItem("adminToken");
    const adminExpiry = localStorage.getItem("adminTokenExpiry");
    return Boolean(adminToken && adminExpiry && Date.now() < Number(adminExpiry));
  });

  // Optional: You can keep a simplified useEffect just to handle clean-up if tokens expire while the app is open
  useEffect(() => {
    const userExpiry = localStorage.getItem("userTokenExpiry");
    if (userExpiry && Date.now() >= Number(userExpiry)) {
      logoutUser();
    }

    const adminExpiry = localStorage.getItem("adminTokenExpiry");
    if (adminExpiry && Date.now() >= Number(adminExpiry)) {
      logoutAdmin();
    }
  }, []);

  // --- USER HANDLERS ---
  const loginUser = (userData, token, expiryMinutes = 100) => {
    const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
    localStorage.setItem("userToken", token);
    localStorage.setItem("userTokenExpiry", expiryTime);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logoutUser = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userTokenExpiry");
    localStorage.removeItem("currentUser");
    setUser(null);
    setIsLoggedIn(false);
  };

  // --- ADMIN HANDLERS ---
  const loginAdmin = (adminData, token, expiryMinutes = 100) => {
    const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminTokenExpiry", expiryTime);
    localStorage.setItem("currentAdmin", JSON.stringify(adminData));
    setAdmin(adminData);
    setIsAdminLoggedIn(true);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminTokenExpiry");
    localStorage.removeItem("currentAdmin");
    setAdmin(null);
    setIsAdminLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loginUser,
        logoutUser,
        setIsLoggedIn,

        admin,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        setIsAdminLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};