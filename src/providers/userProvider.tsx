import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  isLoggedIn: boolean;
  email: string | null;
  token: string | null;
  loginCouponUser: (email: string, token:string ) => void;
  logoutCouponUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken ] = useState<string | null>(null);

  const loginCouponUser = (email: string, token: string) => {
    console.log("login", email,token)
    setIsLoggedIn(true);
    setEmail(email);
    setToken(token);
  };

  const logoutCouponUser = () => {
    setIsLoggedIn(false);
    setEmail(null);
    setToken(null)
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, email,token , loginCouponUser, logoutCouponUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};