"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type User = { email: string; password?: string; name: string; surname: string };

type UserContextType = {
  user: User | null;
  admin: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  updateUser: (userData: User) => void;
  updateAdmin: (data: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      } catch (e) {
        console.error("localStorage read failed:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("admin");
        if (stored) setAdmin(JSON.parse(stored));
      } catch (e) {
        console.error("localStorage read failed:", e);
      }
    }
  }, []);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (userData: User) => {
    delete userData.password;
    setUser(userData);
    if (typeof window !== "undefined") {
      try {
        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          localStorage.removeItem("user");
        }
      } catch (e) {
        console.error("localStorage write failed:", e);
      }
    }
  };

  const updateAdmin = (data: boolean) => {
    setAdmin(data);
    if (typeof window !== "undefined") {
      try {
        if (data) {
          localStorage.setItem("admin", JSON.stringify(data));
        } else {
          localStorage.removeItem("admin");
        }
      } catch (e) {
        console.error("localStorage write failed:", e);
      }
    }
  };

  return (
    <UserContext.Provider
      value={{ admin, user, setUser, clearUser, updateUser, updateAdmin }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
